"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getShipmentById,
  assignDriver,
  updateStatus,
  cancelByCustomer,
  cancelByDriver,
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

const STATUS_OPTIONS = ["ASSIGNED", "IN_TRANSIT", "DELIVERED"];

export default function ShipmentDetails({ shipmentId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    shipments,
    assignDriver: assignDriverState,
    updateStatus: updateStatusState,
    cancelByCustomer: cancelByCustomerState,
    cancelByDriver: cancelByDriverState,
  } = useSelector((state) => state.shipments);
  const drivers = useSelector((state) => state.drivers);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelType, setCancelType] = useState(null); // 'customer' or 'driver'

  // Get current user role
  const { role: userRole, isAdmin } = useRole();

  // Initialize Socket.IO for real-time location updates
  const socket = useSocket();

  useEffect(() => {
    dispatch(getShipmentById(shipmentId));
    dispatch(getAllDrivers());
  }, [dispatch, shipmentId]);

  // Listen for shipment status updates via socket
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (payload) => {
      if (payload && payload.shipmentId === shipmentId) {
        // Refresh shipment data when status changes
        dispatch(getShipmentById(shipmentId));
      }
    };

    socket.on("shipment-status-update", handleStatusUpdate);

    return () => {
      socket.off("shipment-status-update", handleStatusUpdate);
    };
  }, [socket, shipmentId, dispatch]);

  const shipment = shipments.current;

  // Get driver information from shipment or drivers list
  const assignedDriver = useMemo(() => {
    if (!shipment?.driverId) return null;

    // First try to get from shipment.driver (if backend includes it)
    if (shipment.driver) {
      return shipment.driver;
    }

    // Otherwise, find from drivers list
    return (
      drivers.list.find((driver) => driver.id === shipment.driverId) || null
    );
  }, [shipment, drivers.list]);

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

  if (shipments.isLoading || !shipment) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader loading={true} size={60} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Shipment Details
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            ID: {shipment.id.substring(0, 8)}...
          </p>
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

          {/* Note: Driver reassignment is not allowed once assigned (unless cancelled) */}
          {shipment.driverId &&
            shipment.status === "ASSIGNED" &&
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

          {shipment.status !== "DELIVERED" && !shipment.driverId && (
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
