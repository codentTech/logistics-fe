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
import useRole from "@/common/hooks/use-role.hook";
import useSocket from "@/common/hooks/use-socket.hook";

const validationSchema = Yup.object().shape({
  pickupAddress: Yup.string().required("Pickup address is required"),
  deliveryAddress: Yup.string().required("Delivery address is required"),
  customerName: Yup.string().required("Customer name is required"),
  customerPhone: Yup.string().required("Customer phone is required"),
});

export function useShipmentsListHook() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { shipments, create } = useSelector((state) => state.shipments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isAdmin } = useRole();
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
    dispatch(getAllShipments());
  }, [dispatch]);

  // Listen for shipment updates via socket for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (payload) => {
      // Refresh shipments list when shipment status changes
      if (payload && payload.shipmentId) {
        dispatch(getAllShipments());
      }
    };

    socket.on("shipment-status-update", handleStatusUpdate);

    return () => {
      socket.off("shipment-status-update", handleStatusUpdate);
    };
  }, [socket, dispatch]);

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
    // Filter out cancelled shipments - drivers should not see cancelled shipments
    // Even if status is CREATED after cancellation, if it was cancelled, exclude it
    if (
      shipment.status === "CANCEL_BY_DRIVER" ||
      shipment.status === "CANCEL_BY_CUSTOMER"
    ) {
      return false;
    }

    // Apply search filter
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

  return {
    shipments,
    searchTerm,
    setSearchTerm,
    isCreateModalOpen,
    isAdmin,
    register,
    handleSubmit,
    errors,
    reset,
    watch,
    setValue,
    handleCreateNew,
    handleCloseModal,
    onSubmit,
    filteredShipments,
    handleViewDetails,
    isLoading: create.isLoading,
  };
}
