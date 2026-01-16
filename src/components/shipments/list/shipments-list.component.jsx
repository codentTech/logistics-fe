"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import AddressPicker from "@/common/components/address-picker/address-picker.component";
import Modal from "@/common/components/modal/modal.component";
import {
  formatShipmentStatus,
  STATUS_COLORS,
} from "@/common/utils/status.util";
import { Search } from "lucide-react";
import { useShipmentsListHook } from "./use-shipments-list.hook";

export default function ShipmentsList() {
  const {
    shipments,
    searchTerm,
    setSearchTerm,
    isCreateModalOpen,
    isAdmin,
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    handleCreateNew,
    handleCloseModal,
    onSubmit,
    filteredShipments,
    handleViewDetails,
    isLoading,
  } = useShipmentsListHook();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Shipments</h1>
        {isAdmin && (
          <CustomButton
            text="Create Shipment"
            onClick={handleCreateNew}
            variant="primary"
            size="sm"
          />
        )}
      </div>

      <div className="mb-4 max-w-md">
        <CustomInput
          type="text"
          name="search"
          placeholder="Search shipments..."
          value={searchTerm}
          startIcon={<Search className="w-4 h-4" />}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="sm"
        />
      </div>

      {shipments.isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <Loader loading={true} variant="table" />
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">
            {searchTerm
              ? "No shipments found matching your search"
              : "No shipments yet"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-indigo-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Pickup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {shipment.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {shipment.pickupAddress?.substring(0, 40)}
                    {shipment.pickupAddress?.length > 40 ? "..." : ""}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {shipment.deliveryAddress?.substring(0, 40)}
                    {shipment.deliveryAddress?.length > 40 ? "..." : ""}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[shipment.status] || STATUS_COLORS.CREATED
                      }`}
                    >
                      {formatShipmentStatus(shipment.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <CustomButton
                      text="View"
                      onClick={() => handleViewDetails(shipment.id)}
                      variant="outline"
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Shipment Modal */}
      <Modal
        show={isCreateModalOpen}
        onClose={handleCloseModal}
        title="Create Shipment"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Customer Name"
                  name="customerName"
                  register={register}
                  errors={errors}
                  placeholder="Enter customer name"
                  isRequired={true}
                />

                <CustomInput
                  label="Customer Phone"
                  name="customerPhone"
                  register={register}
                  errors={errors}
                  placeholder="+1234567890"
                  isRequired={true}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Address Information
              </h3>
              <div className="space-y-4">
                <AddressPicker
                  label="Pickup Address"
                  name="pickupAddress"
                  value={watch("pickupAddress")}
                  onChange={(value) => setValue("pickupAddress", value)}
                  error={errors.pickupAddress?.message}
                  placeholder="Search or click on map to select pickup location"
                  required={true}
                />

                <AddressPicker
                  label="Delivery Address"
                  name="deliveryAddress"
                  value={watch("deliveryAddress")}
                  onChange={(value) => setValue("deliveryAddress", value)}
                  error={errors.deliveryAddress?.message}
                  placeholder="Search or click on map to select delivery location"
                  required={true}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 mt-6 pt-4">
            <CustomButton
              type="button"
              text="Cancel"
              variant="outline"
              onClick={handleCloseModal}
              disabled={isLoading}
            />
            <CustomButton
              type="submit"
              text="Create Shipment"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
