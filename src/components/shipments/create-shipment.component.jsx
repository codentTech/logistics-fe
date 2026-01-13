"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createShipment } from "@/provider/features/shipments/shipments.slice";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";

const validationSchema = Yup.object().shape({
  pickupAddress: Yup.string().required("Pickup address is required"),
  deliveryAddress: Yup.string().required("Delivery address is required"),
  customerName: Yup.string().required("Customer name is required"),
  customerPhone: Yup.string().required("Customer phone is required"),
});

export default function CreateShipment() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { create } = useSelector((state) => state.shipments);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const result = await dispatch(
      createShipment({
        payload: data,
        successCallBack: () => {
          router.push("/shipments");
        },
      })
    );

    if (createShipment.fulfilled.match(result)) {
      // Success handled by callback
    }
  };

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
            loading={create.isLoading}
            disabled={create.isLoading}
          />
          <CustomButton
            type="button"
            text="Cancel"
            variant="outline"
            onClick={() => router.push("/shipments")}
            disabled={create.isLoading}
          />
        </div>

        {create.isError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {create.message || "Failed to create shipment"}
          </div>
        )}
        </form>
      </div>
    </div>
  );
}

