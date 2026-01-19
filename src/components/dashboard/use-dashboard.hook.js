import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getSummary } from "@/provider/features/dashboard/dashboard.slice";
import {
  createShipment,
  getAllShipments,
} from "@/provider/features/shipments/shipments.slice";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import { refreshConfig } from "@/common/config/refresh.config";
import useSocket from "@/common/hooks/use-socket.hook";
import useRole from "@/common/hooks/use-role.hook";
import ROLES from "@/common/constants/role.constant";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const validationSchema = Yup.object().shape({
  pickupAddress: Yup.string().required("Pickup address is required"),
  deliveryAddress: Yup.string().required("Delivery address is required"),
  customerName: Yup.string().required("Customer name is required"),
  customerPhone: Yup.string().required("Customer phone is required"),
});

export function useDashboardHook() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { summary } = useSelector((state) => state.dashboard);
  const { create } = useSelector((state) => state.shipments);
  const drivers = useSelector((state) => ({
    list: state.drivers?.list || [],
    locations: state.drivers?.locations || {},
  }));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const { isAdmin, isDriver, isCustomer } = useRole();

  // Memoize online drivers and options to prevent dropdown from resetting
  const { onlineDrivers, driverOptions } = useMemo(() => {
    // Filter online drivers (for map display) - drivers with location data
    const onlineDrivers = drivers.list.filter((driver) => {
      const location = drivers.locations[driver.id] || driver.location;
      return (
        location &&
        location.latitude &&
        location.longitude &&
        location.latitude !== 0 &&
        location.longitude !== 0 &&
        !isNaN(location.latitude) &&
        !isNaN(location.longitude)
      );
    });

    // Dropdown should show ALL drivers (not just online)
    // Use isOnline from API response (based on Socket.IO room membership)
    const driverOptions = [
      { value: null, label: "All Drivers" },
      ...drivers.list.map((driver) => {
        const driverName =
          driver.name?.trim() ||
          driver.user?.name?.trim() ||
          `Driver ${driver.id?.slice(0, 8) || "Unknown"}`;
        // Use isOnline from driver object (from API, based on Socket.IO room membership)
        // If isOnline is not provided, fallback to location check for backward compatibility
        const isOnline = 
          typeof driver.isOnline === 'boolean' 
            ? driver.isOnline 
            : onlineDrivers.some((online) => online.id === driver.id);
        
        return {
          value: driver.id,
          label: `${driverName}${isOnline ? " (Online)" : " (Offline)"}`,
        };
      }),
    ];

    return { onlineDrivers, driverOptions };
  }, [drivers.list, drivers.locations]);

  // Initialize Socket.IO for real-time location updates
  const socket = useSocket();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(getSummary());
    dispatch(getAllDrivers());
    dispatch(getAllShipments());
    
    const interval = setInterval(() => {
      dispatch(getSummary());
      // Refresh drivers list to update isOnline status based on Socket.IO rooms
      dispatch(getAllDrivers());
    }, refreshConfig.dashboardSummaryInterval);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  // Listen to driver location updates and shipment status updates
  useEffect(() => {
    if (!socket) return;

    let refreshTimeout = null;
    const REFRESH_DELAY = refreshConfig.dashboardSummaryThrottle;

    const handleDriverLocationUpdate = () => {
      // Throttle summary refresh to avoid too many API calls
      // Refresh summary when a driver location is updated
      // This ensures driversOnline count updates in real-time
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      refreshTimeout = setTimeout(() => {
        dispatch(getSummary());
      }, REFRESH_DELAY);
    };

    const handleShipmentStatusUpdate = (payload) => {
      // Refresh shipments list when status changes to APPROVED or IN_TRANSIT
      // This ensures route data is available for the map
      if (
        payload &&
        (payload.newStatus === "APPROVED" || payload.newStatus === "IN_TRANSIT")
      ) {
        dispatch(getAllShipments());
      }
    };

    socket.on("driver-location-update", handleDriverLocationUpdate);
    socket.on("shipment-status-update", handleShipmentStatusUpdate);

    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      socket.off("driver-location-update", handleDriverLocationUpdate);
      socket.off("shipment-status-update", handleShipmentStatusUpdate);
    };
  }, [socket, dispatch]);

  // Get data (use default values if loading)
  const data = summary.data || {
    totalShipments: 0,
    activeShipments: 0,
    deliveredToday: 0,
    driversOnline: 0,
  };


  const cards = useMemo(() => {
    if (!isAdmin && !isDriver && !isCustomer) return [];
    const userRole = isAdmin
      ? ROLES.OPS_ADMIN
      : isDriver
        ? ROLES.DRIVER
        : ROLES.CUSTOMER;

    // Role-based dashboard cards
    const allCards = [
      {
        title: "Total Shipments",
        value: data.totalShipments || 0,
        link: "/shipments",
        roles: [ROLES.OPS_ADMIN, ROLES.DRIVER, ROLES.CUSTOMER],
      },
      {
        title: "Active Shipments",
        value: data.activeShipments || 0,
        link: "/shipments",
        roles: [ROLES.OPS_ADMIN, ROLES.DRIVER, ROLES.CUSTOMER],
      },
      {
        title: "Delivered Today",
        value: data.deliveredToday || 0,
        link: "/shipments",
        roles: [ROLES.OPS_ADMIN, ROLES.DRIVER, ROLES.CUSTOMER],
      },
      {
        title: "Drivers Online",
        value: data.driversOnline || 0,
        link: "/drivers",
        roles: [ROLES.OPS_ADMIN], // Admin only
      },
    ];

    return allCards.filter((card) => card.roles.includes(userRole));
  }, [
    isAdmin,
    isDriver,
    isCustomer,
    data.totalShipments,
    data.activeShipments,
    data.deliveredToday,
    data.driversOnline,
  ]);

  const quickActions = useMemo(() => {
    if (!isAdmin && !isDriver && !isCustomer) return [];
    const userRole = isAdmin
      ? ROLES.OPS_ADMIN
      : isDriver
        ? ROLES.DRIVER
        : ROLES.CUSTOMER;

    // Role-based quick actions
    const allQuickActions = [
      {
        title: "Create Shipment",
        description: "Create a new shipment",
        link: "/shipments/create",
        icon: AddBoxIcon,
        roles: [ROLES.OPS_ADMIN], // Admin only
      },
      {
        title: "View Shipments",
        description: "Manage all shipments",
        link: "/shipments",
        icon: ListAltIcon,
        roles: [ROLES.OPS_ADMIN, ROLES.DRIVER, ROLES.CUSTOMER], // All roles
      },
      {
        title: "View Drivers",
        description: "Manage drivers",
        link: "/drivers",
        icon: DirectionsCarIcon,
        roles: [ROLES.OPS_ADMIN], // Admin only
      },
    ];

    return allQuickActions.filter((action) => action.roles.includes(userRole));
  }, [isAdmin, isDriver, isCustomer]);

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    const result = await dispatch(
      createShipment({
        payload: data,
        successCallBack: () => {
          handleCloseModal();
          dispatch(getSummary()); // Refresh dashboard
          dispatch(getAllShipments()); // Refresh shipments list
        },
      })
    );

    if (createShipment.fulfilled.match(result)) {
      // Success handled by callback
    }
  };

  return {
    router,
    summary,
    create,
    drivers,
    isCreateModalOpen,
    selectedDriverId,
    setSelectedDriverId,
    isAdmin,
    isDriver,
    isCustomer,
    driverOptions,
    register,
    handleSubmit,
    errors,
    reset,
    watch,
    setValue,
    cards,
    quickActions,
    handleCreateNew,
    handleCloseModal,
    onSubmit,
  };
}
