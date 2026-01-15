"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getShipmentById,
  assignDriver,
  updateStatus,
  cancelByCustomer,
  cancelByDriver,
  approveAssignment,
  rejectAssignment,
  updateCurrentShipment,
} from "@/provider/features/shipments/shipments.slice";
import useRole from "@/common/hooks/use-role.hook";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import {
  formatShipmentStatus,
  STATUS_COLORS,
} from "@/common/utils/status.util";
import useSocket from "@/common/hooks/use-socket.hook";

// Dynamically import enhanced map component (SSR disabled for Leaflet)
const EnhancedDriversMap = dynamic(
  () => import("../drivers/enhanced-drivers-map.component"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
        <Loader loading={true} />
      </div>
    ),
  }
);

const STATUS_OPTIONS = ["ASSIGNED", "APPROVED", "IN_TRANSIT", "DELIVERED"];

export default function ShipmentDetails({ shipmentId }) {
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

  // Get current user role
  const { role: userRole, isAdmin } = useRole();

  const socket = useSocket();

  useEffect(() => {
    setIsInitialLoad(true);
    dispatch(getShipmentById(shipmentId)).then(() => {
      setIsInitialLoad(false);
    });
    dispatch(getAllDrivers());
  }, [dispatch, shipmentId]);

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

        // Skip API refresh if driverId is null (rejection/cancellation)
        // This prevents "You can only view shipments assigned to you" error
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }

        // Only refresh from API if driverId is not null
        // For rejections/cancellations (driverId null), the socket payload is sufficient
        if (payload.driverId !== null && payload.driverId !== undefined) {
          refreshTimeoutRef.current = setTimeout(() => {
            dispatch(getShipmentById(shipmentId));
          }, 300);
        }
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
  const driverOptions = useMemo(() => {
    return drivers.list.map((driver) => {
      const driverName = driver.name || driver.id.substring(0, 8);
      const driverEmail = driver.user?.email || "";
      // Show name and email to help distinguish drivers
      const label = driverEmail ? `${driverName} (${driverEmail})` : driverName;

      return {
        label,
        value: driver.id,
      };
    });
  }, [drivers.list]);

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

  // Check if shipment can be cancelled (before IN_TRANSIT)
  // Only customers and drivers can cancel (admin cannot cancel)
  const canCancel =
    shipment &&
    shipment.status !== "IN_TRANSIT" &&
    shipment.status !== "DELIVERED" &&
    shipment.status !== "CANCEL_BY_CUSTOMER" &&
    shipment.status !== "CANCEL_BY_DRIVER" &&
    (userRole === "customer" || (userRole === "driver" && shipment.driverId));

  // Only show full-page loader on initial load
  // For subsequent updates, show the component with current data (from socket or Redux)
  if (isInitialLoad && (shipments.isLoading || !shipment)) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader loading={true} size={60} />
      </div>
    );
  }

  // If no shipment after initial load, show error state
  if (!shipment) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Shipment not found</p>
          <CustomButton
            text="Back to Shipments"
            onClick={() => router.push("/shipments")}
            variant="outline"
            size="sm"
            className="mt-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">
            Shipment Details
          </h1>
          {shipments.isLoading && !isInitialLoad && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>
        <CustomButton
          text="Back"
          onClick={() => router.push("/shipments")}
          variant="outline"
          size="sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Information
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Status:</span>{" "}
              <span
                className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                  STATUS_COLORS[shipment.status] || STATUS_COLORS.CREATED
                }`}
              >
                {formatShipmentStatus(shipment.status)}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Customer:</span>{" "}
              <span className="text-gray-900">{shipment.customerName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Phone:</span>{" "}
              <span className="text-gray-900">{shipment.customerPhone}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Pickup Address:</span>{" "}
              <span className="text-gray-900">{shipment.pickupAddress}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Delivery Address:
              </span>{" "}
              <span className="text-gray-900">{shipment.deliveryAddress}</span>
            </div>
            {assignedDriver && (
              <>
                <div>
                  <span className="font-medium text-gray-600">Driver:</span>{" "}
                  <span className="text-gray-900">
                    {assignedDriver.name || "N/A"}
                  </span>
                </div>
                {assignedDriver.phone && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Driver Phone:
                    </span>{" "}
                    <span className="text-gray-900">
                      {assignedDriver.phone}
                    </span>
                  </div>
                )}
                {assignedDriver.licenseNumber && (
                  <div>
                    <span className="font-medium text-gray-600">
                      License Number:
                    </span>{" "}
                    <span className="text-gray-900">
                      {assignedDriver.licenseNumber}
                    </span>
                  </div>
                )}
              </>
            )}
            {shipment.createdAt && (
              <div>
                <span className="font-medium text-gray-600">Created:</span>{" "}
                <span className="text-gray-900">
                  {new Date(shipment.createdAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Assign Driver - Show if no driver assigned and not delivered */}
          {/* Allow reassignment for cancelled shipments (driverId is null after cancellation) */}
          {/* Only show to admin */}
          {isAdmin &&
            shipment.status !== "DELIVERED" &&
            (shipment.status === "CREATED" ||
              shipment.status === "CANCEL_BY_DRIVER" ||
              shipment.status === "CANCEL_BY_CUSTOMER" ||
              !shipment.driverId) && (
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  {shipment.status === "CANCEL_BY_DRIVER" ||
                  shipment.status === "CANCEL_BY_CUSTOMER"
                    ? "Reassign Driver"
                    : "Assign Driver"}
                </h3>
                {(shipment.status === "CANCEL_BY_DRIVER" ||
                  shipment.status === "CANCEL_BY_CUSTOMER") && (
                  <p className="mb-3 text-xs text-gray-600">
                    This shipment was cancelled. You can reassign a driver to
                    restart the delivery process.
                  </p>
                )}
                <div className="space-y-3">
                  <SimpleSelect
                    placeholder="Select a driver"
                    options={driverOptions}
                    value={selectedDriverId}
                    onChange={(value) => setSelectedDriverId(value || "")}
                    size="sm"
                  />
                  <CustomButton
                    text={
                      shipment.status === "CANCEL_BY_DRIVER" ||
                      shipment.status === "CANCEL_BY_CUSTOMER"
                        ? "Reassign Driver"
                        : "Assign Driver"
                    }
                    onClick={handleAssignDriver}
                    variant="primary"
                    size="sm"
                    loading={assignDriverState.isLoading}
                    disabled={!selectedDriverId || assignDriverState.isLoading}
                  />
                </div>
              </div>
            )}

          {/* Approval Section - Show to driver when shipment is ASSIGNED with pendingApproval */}
          {/* Show if pendingApproval is true OR undefined (for backward compatibility) */}
          {userRole === "driver" &&
            shipment?.status === "ASSIGNED" &&
            shipment?.driverId &&
            (shipment?.pendingApproval === true ||
              shipment?.pendingApproval === undefined) && (
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-indigo-900">
                  Shipment Assignment Approval
                </h3>
                <p className="mb-4 text-sm text-indigo-700">
                  You have been assigned to this shipment. Please review and
                  approve or reject the assignment within 5 minutes.
                </p>
                <div className="flex gap-3">
                  <CustomButton
                    text="Approve"
                    onClick={async () => {
                      await dispatch(
                        approveAssignment({
                          shipmentId: shipment.id,
                          successCallBack: () => {
                            dispatch(getShipmentById(shipmentId));
                          },
                        })
                      );
                    }}
                    variant="primary"
                    size="sm"
                    loading={approveAssignmentState.isLoading}
                    disabled={approveAssignmentState.isLoading}
                  />
                  <CustomButton
                    text="Reject"
                    onClick={async () => {
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
                    }}
                    variant="outline"
                    size="sm"
                    loading={rejectAssignmentState.isLoading}
                    disabled={rejectAssignmentState.isLoading}
                  />
                </div>
              </div>
            )}

          {/* Note: Driver reassignment is not allowed once assigned (unless cancelled) */}
          {shipment.driverId &&
            shipment.status === "ASSIGNED" &&
            !shipment.pendingApproval &&
            userRole === "ops_admin" && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Driver has been assigned. Reassignment
                  is only allowed if the shipment is cancelled.
                </p>
              </div>
            )}

          {/* Update Status - Only for drivers or admin, and only if not cancelled/delivered */}
          {(isAdmin || userRole === "driver") &&
            shipment.status !== "DELIVERED" &&
            shipment.status !== "CANCEL_BY_CUSTOMER" &&
            shipment.status !== "CANCEL_BY_DRIVER" &&
            shipment.driverId && (
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Update Status
                </h3>
                <div className="space-y-3">
                  <SimpleSelect
                    placeholder="Select new status"
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={(value) => setSelectedStatus(value || "")}
                    size="sm"
                  />
                  <CustomButton
                    text="Update Status"
                    onClick={handleUpdateStatus}
                    variant="primary"
                    size="sm"
                    loading={updateStatusState.isLoading}
                    disabled={!selectedStatus || updateStatusState.isLoading}
                  />
                </div>
              </div>
            )}

          {isAdmin && shipment.status !== "DELIVERED" && !shipment.driverId && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                Update Status
              </h3>
              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  Please assign a driver first before updating the shipment
                  status.
                </p>
              </div>
            </div>
          )}

          {/* Cancellation Buttons */}
          {canCancel && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-red-700">
                Cancel Shipment
              </h3>
              <p className="mb-4 text-xs text-red-600">
                You can cancel this shipment before it goes in transit.
              </p>
              <div className="space-y-2">
                {userRole === "customer" && (
                  <CustomButton
                    text="Cancel Shipment"
                    onClick={handleCancelByCustomer}
                    variant="danger"
                    size="sm"
                    loading={cancelByCustomerState.isLoading}
                    disabled={cancelByCustomerState.isLoading}
                  />
                )}
                {userRole === "driver" && shipment.driverId && (
                  <CustomButton
                    text="Cancel Shipment"
                    onClick={handleCancelByDriver}
                    variant="danger"
                    size="sm"
                    loading={cancelByDriverState.isLoading}
                    disabled={cancelByDriverState.isLoading}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Driver Location Map */}
      {assignedDriver && (
        <div className="mt-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Driver Location
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Real-time location of the assigned driver with route visualization
            </p>
          </div>
          <EnhancedDriversMap
            selectedDriverId={assignedDriver.id}
            showOnlyDriverId={assignedDriver.id}
          />
        </div>
      )}

      {/* Cancel Shipment Confirmation Modal */}
      <Modal
        show={showCancelModal}
        onClose={handleCloseCancelModal}
        title="Cancel Shipment"
        variant="danger"
        size="md"
        closeOnBackdropClick={true}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to cancel this shipment? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <CustomButton
              text="No, Keep It"
              onClick={handleCloseCancelModal}
              variant="outline"
              size="sm"
            />
            <CustomButton
              text="Yes, Cancel Shipment"
              onClick={handleConfirmCancel}
              variant="danger"
              size="sm"
              loading={
                cancelType === "customer"
                  ? cancelByCustomerState.isLoading
                  : cancelByDriverState.isLoading
              }
              disabled={
                cancelType === "customer"
                  ? cancelByCustomerState.isLoading
                  : cancelByDriverState.isLoading
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
