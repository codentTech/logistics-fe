"use client";

import { useRouter } from "next/navigation";
import Loader from "@/common/components/loader/loader.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import AddressPicker from "@/common/components/address-picker/address-picker.component";
import Modal from "@/common/components/modal/modal.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import dynamic from "next/dynamic";
import { useDashboardHook } from "./use-dashboard.hook";

// Dynamically import enhanced map component (SSR disabled for Leaflet)
const DriversMap = dynamic(() => import("../drivers/enhanced-map/enhanced-drivers-map.component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-white">
      <Loader loading={true} />
    </div>
  ),
});

export default function Dashboard() {
  const {
    router,
    summary,
    create,
    drivers,
    isCreateModalOpen,
    selectedDriverId,
    setSelectedDriverId,
    isAdmin,
    driverOptions,
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    cards,
    quickActions,
    handleCreateNew,
    handleCloseModal,
    onSubmit,
  } = useDashboardHook();

  // Only show skeleton loader on initial load (when there's no data yet)
  // Don't show loader on subsequent refreshes to avoid blocking UI
  // IMPORTANT: This early return must be AFTER all hooks
  if (summary.isLoading && !summary.data) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200"></div>
          {isAdmin && (
            <div className="h-9 w-36 animate-pulse rounded bg-gray-200"></div>
          )}
        </div>

        {/* Skeleton for dashboard cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 bg-white p-5"
            >
              <div className="mb-1 h-3 w-24 rounded bg-gray-200"></div>
              <div className="h-8 w-16 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Skeleton for quick actions */}
        <div className="mb-6">
          <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-gray-200 bg-white p-6"
              >
                <div className="mb-3 h-8 w-8 rounded bg-gray-200"></div>
                <div className="mb-1 h-5 w-32 rounded bg-gray-200"></div>
                <div className="h-4 w-48 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton for driver map (admin only) */}
        {isAdmin && (
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="mb-1 h-6 w-40 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="h-9 w-36 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="h-96 animate-pulse rounded-lg border border-gray-200 bg-gray-100"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        {isAdmin && (
          <CustomButton
            text="Create Shipment"
            onClick={handleCreateNew}
            variant="primary"
            size="sm"
          />
        )}
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
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            const handleClick =
              action.link === "/shipments/create"
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
                <h3 className="mb-1 text-base font-semibold text-gray-900">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Locations Map - Admin only */}
      {isAdmin && (
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Driver Locations
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Real-time location tracking of all active drivers
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Driver Selection Dropdown - Shows ALL drivers */}
              {drivers.list.length > 0 ? (
                <div className="min-w-[300px] relative z-[1000]">
                  <SimpleSelect
                    placeholder="All Drivers"
                    options={driverOptions}
                    value={selectedDriverId}
                    onChange={(value) => {
                      setSelectedDriverId(value || null);
                    }}
                    isSearchable={false}
                    clearable={true}
                    size="sm"
                  />
                </div>
              ) : null}
              <CustomButton
                text="View All Drivers"
                onClick={() => router.push("/drivers")}
                variant="outline"
                size="sm"
              />
            </div>
          </div>

          <DriversMap 
            selectedDriverId={selectedDriverId} 
            showOnlyDriverId={selectedDriverId}
          />
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
