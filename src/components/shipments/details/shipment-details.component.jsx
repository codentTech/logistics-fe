"use client";

import dynamic from "next/dynamic";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import {
  formatShipmentStatus,
  STATUS_COLORS,
} from "@/common/utils/status.util";
import { MapPin, AlertTriangle, Clock } from "lucide-react";
import { useShipmentDetailsHook } from "./use-shipment-details.hook";

// Dynamically import enhanced map component (SSR disabled for Leaflet)
const EnhancedDriversMap = dynamic(
  () => import("../../drivers/enhanced-map/enhanced-drivers-map.component"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
        <Loader loading={true} />
      </div>
    ),
  }
);

export default function ShipmentDetails({ shipmentId }) {
  const {
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
  } = useShipmentDetailsHook(shipmentId);

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
                  {driverOptions.length === 0 ? (
                    <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3">
                      <p className="text-sm text-yellow-800">
                        No available drivers. All drivers are currently assigned
                        to active shipments.
                      </p>
                    </div>
                  ) : (
                    <SimpleSelect
                      placeholder="Select a driver"
                      options={driverOptions}
                      value={selectedDriverId}
                      onChange={(value) => setSelectedDriverId(value || "")}
                      size="sm"
                    />
                  )}
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
                    disabled={
                      !selectedDriverId ||
                      assignDriverState.isLoading ||
                      driverOptions.length === 0
                    }
                  />
                </div>
              </div>
            )}

          {/* Approval Section - Show to driver when shipment is ASSIGNED with pendingApproval */}
          {userRole === "driver" &&
            shipment?.status === "ASSIGNED" &&
            shipment?.driverId &&
            (shipment?.pendingApproval === true ||
              shipment?.pendingApproval === undefined) && (
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-indigo-900">
                  Shipment Assignment Approval
                </h3>
                <div className="mb-4">
                  <p className="mb-2 text-sm text-indigo-700">
                    You have been assigned to this shipment. Please review and
                    approve or reject the assignment.
                  </p>
                  {timeRemaining !== null && (
                    <div
                      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 ${
                        timeRemaining <= 60000
                          ? "bg-red-100 border border-red-300"
                          : timeRemaining <= 120000
                            ? "bg-yellow-100 border border-yellow-300"
                            : "bg-indigo-100 border border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            timeRemaining <= 60000
                              ? "text-red-800"
                              : timeRemaining <= 120000
                                ? "text-yellow-800"
                                : "text-indigo-800"
                          }`}
                        >
                          Time remaining:
                        </span>
                        <span
                          className={`text-lg font-bold font-mono ${
                            timeRemaining <= 60000
                              ? "text-red-900"
                              : timeRemaining <= 120000
                                ? "text-yellow-900"
                                : "text-indigo-900"
                          }`}
                        >
                          {timeRemaining > 0 ? (
                            <>
                              {Math.floor(timeRemaining / 60000)}:
                              {String(
                                Math.floor((timeRemaining % 60000) / 1000)
                              ).padStart(2, "0")}
                            </>
                          ) : (
                            "00:00"
                          )}
                        </span>
                      </div>
                      {timeRemaining <= 60000 && timeRemaining > 0 && (
                        <div className="flex items-center gap-1 text-xs font-medium text-red-800">
                          <AlertTriangle className="h-3 w-3 animate-pulse" />
                          <span className="animate-pulse">
                            Time running out!
                          </span>
                        </div>
                      )}
                      {timeRemaining === 0 && (
                        <div className="flex items-center gap-1 text-xs font-medium text-red-800">
                          <Clock className="h-3 w-3" />
                          <span>Time expired</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {approveAssignmentState.isError &&
                  approveAssignmentState.message && (
                    <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-800">
                        {approveAssignmentState.message}
                      </p>
                    </div>
                  )}
                <div className="flex justify-end gap-3">
                  <CustomButton
                    text="Approve"
                    onClick={handleApproveAssignment}
                    variant="primary"
                    size="sm"
                    loading={approveAssignmentState.isLoading}
                    disabled={approveAssignmentState.isLoading}
                  />
                  <CustomButton
                    text="Reject"
                    onClick={handleRejectAssignment}
                    variant="outline"
                    size="sm"
                    loading={rejectAssignmentState.isLoading}
                    disabled={rejectAssignmentState.isLoading}
                  />
                </div>
              </div>
            )}

          {/* Driver Coordinates Display - Show when status is IN_TRANSIT */}
          {shipment?.status === "IN_TRANSIT" &&
            assignedDriver &&
            drivers.locations[assignedDriver.id] && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Driver Current Location
                  </h4>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">Latitude:</span>
                      <span className="ml-2 font-mono text-gray-900">
                        {drivers.locations[assignedDriver.id].latitude.toFixed(
                          6
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Longitude:</span>
                      <span className="ml-2 font-mono text-gray-900">
                        {drivers.locations[assignedDriver.id].longitude.toFixed(
                          6
                        )}
                      </span>
                    </div>
                    {drivers.locations[assignedDriver.id].timestamp && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(
                            drivers.locations[assignedDriver.id].timestamp
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
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

      {/* Driver Location Map - Show only when status is IN_TRANSIT */}
      {assignedDriver &&
        shipment?.status === "IN_TRANSIT" &&
        shipment?.status !== "CANCEL_BY_DRIVER" &&
        shipment?.status !== "CANCEL_BY_CUSTOMER" && (
          <div className="mt-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Driver Location & Route
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Real-time location of the assigned driver with route
                visualization (Pickup → Delivery)
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
