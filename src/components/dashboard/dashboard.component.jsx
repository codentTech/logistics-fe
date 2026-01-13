"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getSummary } from "@/provider/features/dashboard/dashboard.slice";
import { createShipment, getAllShipments } from "@/provider/features/shipments/shipments.slice";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import Loader from "@/common/components/loader/loader.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import useSocket from "@/common/hooks/use-socket.hook";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import dynamic from "next/dynamic";

// Dynamically import map component (SSR disabled for Leaflet)
const DriversMap = dynamic(() => import("../drivers/drivers-map.component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-white">
      <Loader loading={true} />
    </div>
  ),
});

const validationSchema = Yup.object().shape({
  pickupAddress: Yup.string().required("Pickup address is required"),
  deliveryAddress: Yup.string().required("Delivery address is required"),
  customerName: Yup.string().required("Customer name is required"),
  customerPhone: Yup.string().required("Customer phone is required"),
});

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { summary } = useSelector((state) => state.dashboard);
  const { create } = useSelector((state) => state.shipments);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Initialize Socket.IO for real-time location updates
  useSocket();

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
    dispatch(getSummary());
    dispatch(getAllDrivers()); // Load drivers once on mount
    // Refresh summary every 30 seconds (but not drivers - they update via Socket.IO)
    const interval = setInterval(() => {
      dispatch(getSummary());
    }, 30000);
    return () => clearInterval(interval);
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
          dispatch(getSummary()); // Refresh dashboard
          dispatch(getAllShipments()); // Refresh shipments list
        },
      })
    );

    if (createShipment.fulfilled.match(result)) {
      // Success handled by callback
    }
  };

  // Only show loader on initial load (when there's no data yet)
  // Don't show loader on subsequent refreshes to avoid blocking UI
  if (summary.isLoading && !summary.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader loading={true} size={60} />
      </div>
    );
  }

  const data = summary.data || {
    totalShipments: 0,
    activeShipments: 0,
    deliveredToday: 0,
    driversOnline: 0,
  };

  const cards = [
    {
      title: "Total Shipments",
      value: data.totalShipments || 0,
      link: "/shipments",
    },
    {
      title: "Active Shipments",
      value: data.activeShipments || 0,
      link: "/shipments",
    },
    {
      title: "Delivered Today",
      value: data.deliveredToday || 0,
      link: "/shipments",
    },
    {
      title: "Drivers Online",
      value: data.driversOnline || 0,
      link: "/drivers",
    },
  ];

  const quickActions = [
    {
      title: "Create Shipment",
      description: "Create a new shipment",
      link: "/shipments/create",
      icon: AddBoxIcon,
    },
    {
      title: "View Shipments",
      description: "Manage all shipments",
      link: "/shipments",
      icon: ListAltIcon,
    },
    {
      title: "View Drivers",
      description: "Manage drivers",
      link: "/drivers",
      icon: DirectionsCarIcon,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <CustomButton
          text="Create Shipment"
          onClick={handleCreateNew}
          variant="primary"
          size="sm"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => router.push(card.link)}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              {card.title}
            </p>
            <p className="text-3xl font-bold text-indigo-600">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            const handleClick = action.link === "/shipments/create" 
              ? handleCreateNew 
              : () => router.push(action.link);
            return (
              <div
                key={index}
                onClick={handleClick}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 text-indigo-600">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Locations Map */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Driver Locations</h2>
            <p className="mt-1 text-sm text-gray-500">
              Real-time location tracking of all active drivers
            </p>
          </div>
          <CustomButton
            text="View All Drivers"
            onClick={() => router.push("/drivers")}
            variant="outline"
            size="sm"
          />
        </div>
        <DriversMap />
      </div>

      {summary.isError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {summary.message || "Failed to load dashboard data"}
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

          {create.isError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {create.message || "Failed to create shipment"}
            </div>
          )}

          <div className="flex gap-4 pt-4">
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

