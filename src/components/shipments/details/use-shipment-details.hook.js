import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getShipmentById,
  getAllShipments,
  assignDriver,
  updateStatus,
  cancelByCustomer,
  cancelByDriver,
  approveAssignment,
  rejectAssignment,
  updateCurrentShipment,
} from "@/provider/features/shipments/shipments.slice";
import useRole from "@/common/hooks/use-role.hook";
import {
  getAllDrivers,
  updateDriverLocation,
} from "@/provider/features/drivers/drivers.slice";
import useSocket from "@/common/hooks/use-socket.hook";
import driversService from "@/provider/features/drivers/drivers.service";
import { formatShipmentStatus } from "@/common/utils/status.util";

const STATUS_OPTIONS = ["ASSIGNED", "APPROVED", "IN_TRANSIT", "DELIVERED"];

export function useShipmentDetailsHook(shipmentId) {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    shipments,
    assignDriver: assignDriverState,
    updateStatus: updateStatusState,
    cancelByCustomer: cancelByCustomerState,
    cancelByDriver: cancelByDriverState,
    approveAssignment: approveAssignmentState,
    rejectAssignment: rejectAssignmentState,
  } = useSelector((state) => state.shipments);
  const drivers = useSelector((state) => state.drivers);

  // Subscribe directly to current shipment to ensure re-renders on updates
  const currentShipment = useSelector(
    (state) => state.shipments.shipments.current
  );
  const shipmentUpdateTime = useSelector(
    (state) => state.shipments.shipments.updatedAt
  );

  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelType, setCancelType] = useState(null); // 'customer' or 'driver'
  const refreshTimeoutRef = useRef(null); // For debouncing API calls
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Countdown timer state for approval deadline
  const [timeRemaining, setTimeRemaining] = useState(null);
  const countdownInitializedRef = useRef(null);
  const countdownStartTimeRef = useRef(null); // Store the initial rounded time

  // Get current user role
  const { role: userRole, isAdmin } = useRole();

  const socket = useSocket();

  // Get user info for location sharing
  const user = useSelector((state) => {
    const authUser = state.auth?.login?.data;
    if (authUser) {
      const userId = authUser.user?.id || authUser.id;
      const token = authUser.token || authUser.user?.token;
      if (userId && token) {
        return { id: userId, token };
      }
    }
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser.id && storedUser.token) {
          return { id: storedUser.id, token: storedUser.token };
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  // Find driver ID from user ID
  const driverId = useMemo(() => {
    if (user?.id && drivers.list.length > 0) {
      const driver = drivers.list.find(
        (d) => d.userId === user.id || d.user?.id === user.id
      );
      return driver?.id || null;
    }
    return null;
  }, [user?.id, drivers.list]);

  useEffect(() => {
    setIsInitialLoad(true);
    dispatch(getShipmentById(shipmentId)).then(() => {
      setIsInitialLoad(false);
    });
    dispatch(getAllDrivers());
    // Load all shipments for route data (required by map component to fetch routes)
    dispatch(getAllShipments());
  }, [dispatch, shipmentId]);

  // Fetch driver location from API on mount if shipment is IN_TRANSIT
  // This ensures location is available even after page reload
  useEffect(() => {
    const shipment = currentShipment || shipments.current;
    if (!shipment || shipment.status !== "IN_TRANSIT" || !shipment.driverId) {
      return;
    }

    // Check if location is already in Redux
    const driverId = shipment.driverId;
    if (drivers.locations[driverId]) {
      return; // Location already available
    }

    // Fetch driver location from API
    const fetchDriverLocation = async () => {
      try {
        const response = await driversService.getDriverById(driverId);
        if (response.success && response.data?.location) {
          const location = response.data.location;
          // Update Redux with location from API
          dispatch(
            updateDriverLocation({
              driverId,
              location: {
                latitude: location.latitude,
                longitude: location.longitude,
                timestamp: location.timestamp || new Date().toISOString(),
              },
            })
          );
          console.log(
            `[ShipmentDetails] ✅ Fetched driver location from API for driver ${driverId}`
          );
        }
      } catch (error) {
        console.warn(
          `[ShipmentDetails] ⚠️ Failed to fetch driver location from API:`,
          error
        );
        // Don't show error to user - Socket.IO will update it eventually
      }
    };

    fetchDriverLocation();
  }, [currentShipment, shipments.current, drivers.locations, dispatch]);

  // Refresh shipments when status changes to APPROVED or IN_TRANSIT (for route data)
  useEffect(() => {
    if (!socket) return;

    const handleShipmentStatusUpdate = (payload) => {
      // Refresh shipments list when status changes to APPROVED or IN_TRANSIT
      // This ensures route data is available for the map
      if (
        payload &&
        payload.shipmentId === shipmentId &&
        (payload.newStatus === "APPROVED" || payload.newStatus === "IN_TRANSIT")
      ) {
        console.log(
          `[ShipmentDetails] 🔄 Status changed to ${payload.newStatus}, refreshing shipments for route data`
        );
        dispatch(getAllShipments());
      }
    };

    socket.on("shipment-status-update", handleShipmentStatusUpdate);

    return () => {
      socket.off("shipment-status-update", handleShipmentStatusUpdate);
    };
  }, [socket, shipmentId, dispatch]);

  // Listen for shipment status updates via socket for real-time updates
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleStatusUpdate = (payload) => {
      if (payload && payload.shipmentId === shipmentId) {
        const updateData = {
          id: payload.shipmentId,
          status: payload.newStatus,
        };

        if ("driverId" in payload) {
          updateData.driverId = payload.driverId;
          if (payload.driverId === null || payload.driverId === undefined) {
            updateData.assignedAt = null;
            updateData.driver = null;
          }
        }
        if ("pendingApproval" in payload) {
          updateData.pendingApproval =
            payload.pendingApproval !== null &&
            payload.pendingApproval !== undefined
              ? payload.pendingApproval
              : false;
        }

        dispatch(updateCurrentShipment(updateData));

        // Clear any existing timeout
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }

        // Always refresh from API after a short delay to ensure consistency
        // This is especially important for rejections where driverId becomes null
        refreshTimeoutRef.current = setTimeout(() => {
          dispatch(getShipmentById(shipmentId));
        }, 300);
      }
    };

    // Set up listener when socket connects
    const setupListener = () => {
      socket.off("shipment-status-update", handleStatusUpdate);
      socket.on("shipment-status-update", handleStatusUpdate);
    };

    if (socket.connected) {
      setupListener();
    } else {
      socket.on("connect", setupListener);
    }

    return () => {
      socket.off("shipment-status-update", handleStatusUpdate);
      socket.off("connect", setupListener);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [socket, shipmentId, dispatch]);

  // Listen for location updates for the assigned driver to refresh map and coordinates display
  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = (payload) => {
      if (!payload || !payload.driverId || !payload.location) return;

      // If this is the assigned driver for the shipment and status is IN_TRANSIT, refresh drivers list
      // The Redux state is already updated by useSocket hook, but we can force a refresh
      const shipment = currentShipment || shipments.current;
      if (
        shipment?.driverId === payload.driverId &&
        shipment?.status === "IN_TRANSIT"
      ) {
        // Refresh drivers list to ensure location is in state for coordinates display
        dispatch(getAllDrivers());
      }
    };

    socket.on("driver-location-update", handleLocationUpdate);

    return () => {
      socket.off("driver-location-update", handleLocationUpdate);
    };
  }, [socket, currentShipment, shipments.current, dispatch]);

  // Countdown timer for approval deadline (5 minutes from assignment)
  useEffect(() => {
    const shipment = currentShipment || shipments.current;

    // Only show countdown if shipment is ASSIGNED and pending approval
    if (
      !shipment ||
      shipment.status !== "ASSIGNED" ||
      !shipment.assignedAt ||
      (shipment.pendingApproval !== true &&
        shipment.pendingApproval !== undefined)
    ) {
      setTimeRemaining(null);
      countdownInitializedRef.current = null;
      countdownStartTimeRef.current = null;
      return;
    }

    const currentShipmentId = shipment.id;

    const updateCountdown = () => {
      const assignedTime = new Date(shipment.assignedAt).getTime();
      const now = new Date().getTime();
      const deadline = assignedTime + 5 * 60 * 1000; // 5 minutes in milliseconds
      let remaining = deadline - now;

      // Initialize countdown start time on first calculation for this shipment
      if (countdownInitializedRef.current !== currentShipmentId) {
        // Calculate how much time has passed since assignment
        const timeSinceAssignment = now - assignedTime;

        // If we're still in the first minute (0 to 60 seconds since assignment)
        // Round up to ensure countdown starts from 4:59 or 5:00, not 4:48, 4:53, etc.
        if (timeSinceAssignment >= 0 && timeSinceAssignment < 60 * 1000) {
          const secondsPassed = Math.floor(timeSinceAssignment / 1000);

          if (secondsPassed === 0) {
            // Perfect timing - exactly 5 minutes remaining
            countdownStartTimeRef.current = now + 5 * 60 * 1000; // Deadline is 5 minutes from now
          } else {
            // Any seconds have passed (1-59 seconds), round up to show 4:59
            // Set start time to 4:59 from now
            countdownStartTimeRef.current = now + (4 * 60 + 59) * 1000;
          }
        } else {
          // More than 60 seconds have passed, use actual remaining time
          countdownStartTimeRef.current = deadline;
        }

        countdownInitializedRef.current = currentShipmentId; // Mark as initialized for this shipment
      }

      // Calculate remaining time from the stored start time (consistent countdown)
      if (countdownStartTimeRef.current) {
        remaining = countdownStartTimeRef.current - now;
      }

      if (remaining <= 0) {
        setTimeRemaining(0);
        return;
      }

      setTimeRemaining(remaining);
    };

    // Update immediately (no delay)
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentShipment, shipments.current]);

  // Use the specific selector to ensure re-renders on updates
  const shipment = currentShipment || shipments.current;

  // Get driver information from shipment or drivers list
  const assignedDriver = useMemo(() => {
    // Explicitly check for null/undefined to ensure driver is removed when rejected
    if (
      !shipment?.driverId ||
      shipment.driverId === null ||
      shipment.driverId === undefined
    ) {
      return null;
    }

    // First try to get from shipment.driver (if backend includes it)
    if (shipment.driver) {
      return shipment.driver;
    }

    return (
      drivers.list.find((driver) => driver.id === shipment.driverId) || null
    );
  }, [shipment?.driverId, shipment?.driver, drivers.list]);

  // Prepare driver options for SimpleSelect
  // Filter out drivers who are already assigned to active shipments where pendingApproval is false
  const driverOptions = useMemo(() => {
    const shipmentsList = shipments.list || [];
    
    // Get driver IDs that are already assigned to active shipments (approved/assigned)
    const assignedDriverIds = new Set();
    shipmentsList.forEach((s) => {
      // Exclude the current shipment
      if (s.id === shipmentId) return;
      
      // Check if driver is assigned and pendingApproval is false (approved and active)
      if (
        s.driverId &&
        s.pendingApproval === false &&
        s.status !== "DELIVERED" &&
        s.status !== "CANCEL_BY_DRIVER" &&
        s.status !== "CANCEL_BY_CUSTOMER"
      ) {
        assignedDriverIds.add(s.driverId);
      }
      // Also exclude drivers waiting for approval on another shipment
      if (
        s.driverId &&
        s.pendingApproval === true &&
        s.status === "ASSIGNED" &&
        s.id !== shipmentId
      ) {
        assignedDriverIds.add(s.driverId);
      }
    });

    return drivers.list
      .filter((driver) => {
        // Filter out already assigned drivers
        return !assignedDriverIds.has(driver.id);
      })
      .map((driver) => {
        const driverName = driver.name || driver.id.substring(0, 8);
        const driverEmail = driver.user?.email || "";
        // Show name and email to help distinguish drivers
        const label = driverEmail ? `${driverName} (${driverEmail})` : driverName;

        return {
          label,
          value: driver.id,
        };
      });
  }, [drivers.list, shipments.list, shipmentId]);

  // Prepare status options for SimpleSelect based on current status
  const statusOptions = useMemo(() => {
    if (!shipment) return [];

    const validStatuses = STATUS_OPTIONS.filter((status) => {
      // Filter out statuses that are not valid transitions
      if (shipment.status === "CREATED") {
        return status === "ASSIGNED";
      }
      if (shipment.status === "ASSIGNED") {
        return false; // Driver must approve first
      }
      if (shipment.status === "APPROVED") {
        return status === "IN_TRANSIT";
      }
      if (shipment.status === "IN_TRANSIT") {
        return status === "DELIVERED";
      }
      return false;
    });

    return validStatuses.map((status) => ({
      label: formatShipmentStatus(status),
      value: status,
    }));
  }, [shipment]);

  const handleAssignDriver = async () => {
    if (!selectedDriverId) return;
    await dispatch(
      assignDriver({
        shipmentId,
        driverId: selectedDriverId,
        successCallBack: () => {
          setSelectedDriverId("");
          dispatch(getShipmentById(shipmentId));
        },
      })
    );
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;
    await dispatch(
      updateStatus({
        shipmentId,
        status: selectedStatus,
        successCallBack: () => {
          setSelectedStatus("");
          dispatch(getShipmentById(shipmentId));
        },
      })
    );
  };

  const handleCancelByCustomer = () => {
    setCancelType("customer");
    setShowCancelModal(true);
  };

  const handleCancelByDriver = () => {
    setCancelType("driver");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setShowCancelModal(false);

    if (cancelType === "customer") {
      await dispatch(
        cancelByCustomer({
          shipmentId,
          successCallBack: () => {
            dispatch(getShipmentById(shipmentId));
          },
        })
      );
    } else if (cancelType === "driver") {
      await dispatch(
        cancelByDriver({
          shipmentId,
          successCallBack: () => {
            dispatch(getShipmentById(shipmentId));
          },
        })
      );
    }

    setCancelType(null);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelType(null);
  };

  const handleApproveAssignment = async () => {
    await dispatch(
      approveAssignment({
        shipmentId: shipment.id,
        successCallBack: () => {
          dispatch(getShipmentById(shipmentId));
        },
      })
    );
  };

  const handleRejectAssignment = async () => {
    await dispatch(
      rejectAssignment({
        shipmentId: shipment.id,
        successCallBack: () => {
          if (userRole === "driver") {
            router.push("/shipments");
          } else {
            dispatch(getShipmentById(shipmentId));
          }
        },
      })
    );
  };

  // Check if shipment can be cancelled
  // Only customers and drivers can cancel (admin cannot cancel)
  // Cancel button should only show when:
  // 1. Shipment status is APPROVED (driver has approved the assignment)
  // 2. pendingApproval is false, undefined, or null (approval process is complete)
  // 3. Shipment is not already cancelled or delivered
  const canCancel =
    shipment &&
    shipment.status === "APPROVED" &&
    shipment.pendingApproval !== true && // Not pending approval (false, undefined, or null are all OK)
    shipment.status !== "DELIVERED" &&
    shipment.status !== "CANCEL_BY_CUSTOMER" &&
    shipment.status !== "CANCEL_BY_DRIVER" &&
    (userRole === "customer" || (userRole === "driver" && shipment.driverId));

  return {
    router,
    shipments,
    shipment,
    assignedDriver,
    drivers,
    selectedDriverId,
    setSelectedDriverId,
    selectedStatus,
    setSelectedStatus,
    showCancelModal,
    cancelType,
    isInitialLoad,
    timeRemaining,
    userRole,
    isAdmin,
    driverOptions,
    statusOptions,
    handleAssignDriver,
    handleUpdateStatus,
    handleCancelByCustomer,
    handleCancelByDriver,
    handleConfirmCancel,
    handleCloseCancelModal,
    handleApproveAssignment,
    handleRejectAssignment,
    canCancel,
    assignDriverState,
    updateStatusState,
    cancelByCustomerState,
    cancelByDriverState,
    approveAssignmentState,
    rejectAssignmentState,
  };
}
