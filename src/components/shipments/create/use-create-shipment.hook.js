import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createShipment } from "@/provider/features/shipments/shipments.slice";

const validationSchema = Yup.object().shape({
  pickupAddress: Yup.string().required("Pickup address is required"),
  deliveryAddress: Yup.string().required("Delivery address is required"),
  customerName: Yup.string().required("Customer name is required"),
  customerPhone: Yup.string().required("Customer phone is required"),
});

export function useCreateShipmentHook() {
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

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading: create.isLoading,
    router,
  };
}
