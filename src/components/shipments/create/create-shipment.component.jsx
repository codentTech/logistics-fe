"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { useCreateShipmentHook } from "./use-create-shipment.hook";

export default function CreateShipment() {
  const { register, handleSubmit, errors, onSubmit, isLoading, router } =
    useCreateShipmentHook();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Create Shipment</h1>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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

          <div className="flex gap-4 pt-4">
            <CustomButton
              type="submit"
              text="Create Shipment"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
            />
            <CustomButton
              type="button"
              text="Cancel"
              variant="outline"
              onClick={() => router.push("/shipments")}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
