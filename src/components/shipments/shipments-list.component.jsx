"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  getAllShipments,
  createShipment,
} from "@/provider/features/shipments/shipments.slice";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import {
  formatShipmentStatus,
  STATUS_COLORS,
} from "@/common/utils/status.util";
import { Search } from "lucide-react";

const validationSchema = Yup.object().shape({
  pickupAddress: Yup.string().required("Pickup address is required"),
  deliveryAddress: Yup.string().required("Delivery address is required"),
  customerName: Yup.string().required("Customer name is required"),
  customerPhone: Yup.string().required("Customer phone is required"),
});

export default function ShipmentsList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { shipments, create } = useSelector((state) => state.shipments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(getAllShipments());
  }, [dispatch]);

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
          dispatch(getAllShipments()); // Refresh the list
        },
      })
    );

    if (createShipment.fulfilled.match(result)) {
      // Success handled by callback
    }
  };

  const filteredShipments = shipments.list.filter((shipment) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      shipment.customerName?.toLowerCase().includes(search) ||
      shipment.pickupAddress?.toLowerCase().includes(search) ||
      shipment.deliveryAddress?.toLowerCase().includes(search) ||
      shipment.id?.toLowerCase().includes(search)
    );
  });

  const handleViewDetails = (shipmentId) => {
    router.push(`/shipments/${shipmentId}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Shipments</h1>
        <CustomButton
          text="Create Shipment"
          onClick={handleCreateNew}
          variant="primary"
          size="sm"
        />
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
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white">
          <Loader loading={true} size={60} />
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
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pickup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
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

      {shipments.isError && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {shipments.message || "Failed to load shipments"}
        </div>
      )}

      {/* Create Shipment Modal */}
      <Modal
        show={isCreateModalOpen}
        onClose={handleCloseModal}
        title="Create Shipment"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          <CustomInput
            label="Pickup Address"
            name="pickupAddress"
            register={register}
            errors={errors}
            placeholder="Enter pickup address"
            isRequired={true}
          />

          <CustomInput
            label="Delivery Address"
            name="deliveryAddress"
            register={register}
            errors={errors}
            placeholder="Enter delivery address"
            isRequired={true}
          />

          <div className="flex justify-end border-t gap-4 pt-4">
            <CustomButton
              type="button"
              text="Cancel"
              variant="outline"
              onClick={handleCloseModal}
              disabled={create.isLoading}
            />
            <CustomButton
              type="submit"
              text="Create Shipment"
              variant="primary"
              loading={create.isLoading}
              disabled={create.isLoading}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
