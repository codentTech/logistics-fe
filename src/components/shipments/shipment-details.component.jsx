"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getShipmentById, assignDriver, updateStatus } from "@/provider/features/shipments/shipments.slice";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { formatShipmentStatus, STATUS_COLORS } from "@/common/utils/status.util";
import useSocket from "@/common/hooks/use-socket.hook";

// Dynamically import map component (SSR disabled for Leaflet)
const DriverLocationMap = dynamic(() => import("./driver-location-map.component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
      <Loader loading={true} />
    </div>
  ),
});

const STATUS_OPTIONS = ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

export default function ShipmentDetails({ shipmentId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { shipments, assignDriver: assignDriverState, updateStatus: updateStatusState } = useSelector((state) => state.shipments);
  const drivers = useSelector((state) => state.drivers);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Initialize Socket.IO for real-time location updates
  useSocket();

  useEffect(() => {
    dispatch(getShipmentById(shipmentId));
    dispatch(getAllDrivers());
  }, [dispatch, shipmentId]);

  const shipment = shipments.current;

  // Get driver information from shipment or drivers list
  const assignedDriver = useMemo(() => {
    if (!shipment?.driverId) return null;
    
    // First try to get from shipment.driver (if backend includes it)
    if (shipment.driver) {
      return shipment.driver;
    }
    
    // Otherwise, find from drivers list
    return drivers.list.find((driver) => driver.id === shipment.driverId) || null;
  }, [shipment, drivers.list]);

  // Prepare driver options for SimpleSelect
  const driverOptions = useMemo(() => {
    return drivers.list.map((driver) => ({
      label: driver.name || driver.id.substring(0, 8),
      value: driver.id,
    }));
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
        return status === "PICKED_UP";
      }
      if (shipment.status === "PICKED_UP") {
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
          <h1 className="text-xl font-semibold text-gray-900">Shipment Details</h1>
          <p className="mt-1 text-sm text-gray-500">ID: {shipment.id.substring(0, 8)}...</p>
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
              <span className="font-medium text-gray-600">Delivery Address:</span>{" "}
              <span className="text-gray-900">{shipment.deliveryAddress}</span>
            </div>
            {assignedDriver && (
              <>
                <div>
                  <span className="font-medium text-gray-600">Driver:</span>{" "}
                  <span className="text-gray-900">{assignedDriver.name || "N/A"}</span>
                </div>
                {assignedDriver.phone && (
                  <div>
                    <span className="font-medium text-gray-600">Driver Phone:</span>{" "}
                    <span className="text-gray-900">{assignedDriver.phone}</span>
                  </div>
                )}
                {assignedDriver.licenseNumber && (
                  <div>
                    <span className="font-medium text-gray-600">License Number:</span>{" "}
                    <span className="text-gray-900">{assignedDriver.licenseNumber}</span>
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
          {shipment.status !== "DELIVERED" && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                {shipment.driverId ? "Reassign Driver" : "Assign Driver"}
              </h3>
              <div className="space-y-3">
                <SimpleSelect
                  placeholder="Select a driver"
                  options={driverOptions}
                  value={selectedDriverId}
                  onChange={(value) => setSelectedDriverId(value || "")}
                  size="sm"
                />
                <CustomButton
                  text={shipment.driverId ? "Reassign Driver" : "Assign Driver"}
                  onClick={handleAssignDriver}
                  variant="primary"
                  size="sm"
                  loading={assignDriverState.isLoading}
                  disabled={!selectedDriverId || assignDriverState.isLoading}
                />
                {assignDriverState.isError && (
                  <p className="text-xs text-red-600">{assignDriverState.message}</p>
                )}
              </div>
            </div>
          )}

          {shipment.status !== "DELIVERED" && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Update Status</h3>
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
                {updateStatusState.isError && (
                  <p className="text-xs text-red-600">{updateStatusState.message}</p>
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
              Real-time location of the assigned driver
            </p>
          </div>
          <DriverLocationMap
            driverId={assignedDriver.id}
            driverName={assignedDriver.name}
            driverPhone={assignedDriver.phone}
            driverLicense={assignedDriver.licenseNumber}
            isActive={assignedDriver.isActive}
            pickupAddress={shipment.pickupAddress}
            deliveryAddress={shipment.deliveryAddress}
          />
        </div>
      )}
    </div>
  );
}

