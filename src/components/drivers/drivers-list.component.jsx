"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import Loader from "@/common/components/loader/loader.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import useSocket from "@/common/hooks/use-socket.hook";
import { List, Map as MapIcon } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";

// Dynamically import enhanced map component (SSR disabled for Leaflet)
const DriversMap = dynamic(() => import("./enhanced-drivers-map.component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-white">
      <Loader loading={true} />
    </div>
  ),
});

export default function DriversList() {
  const dispatch = useDispatch();
  const drivers = useSelector((state) => state.drivers);
  const [viewMode, setViewMode] = useState("list");
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  // Memoize online drivers and options to prevent dropdown from resetting
  const { onlineDrivers, driverOptions } = useMemo(() => {
    const onlineDrivers = drivers.list.filter((driver) => {
      const location = drivers.locations?.[driver.id] || driver.location;
      return (
        location &&
        location.latitude &&
        location.longitude &&
        location.latitude !== 0 &&
        location.longitude !== 0 &&
        !isNaN(location.latitude) &&
        !isNaN(location.longitude)
      );
    });

    const driverOptions = [
      { value: null, label: "All Drivers" },
      ...onlineDrivers.map((driver) => {
        const driverName =
          driver.name?.trim() ||
          driver.user?.name?.trim() ||
          `Driver ${driver.id?.slice(0, 8) || "Unknown"}`;
        return {
          value: driver.id,
          label: driverName,
        };
      }),
    ];

    return { onlineDrivers, driverOptions };
  }, [drivers.list, drivers.locations]);

  // No need to memoize selectedOption - SimpleSelect expects the primitive value

  // Initialize Socket.IO for real-time location updates
  useSocket();

  useEffect(() => {
    dispatch(getAllDrivers());
  }, [dispatch]);

  if (drivers.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader loading={true} size={60} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Drivers</h1>
        <div className="flex items-center gap-3">
          {viewMode === "map" && onlineDrivers.length > 0 ? (
            <div className="min-w-[300px]">
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
          <div className="flex gap-2">
            <CustomButton
              text="List"
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "primary" : "outline"}
              size="sm"
              startIcon={<List className="h-4 w-4" />}
            />
            <CustomButton
              text="Map"
              onClick={() => setViewMode("map")}
              variant={viewMode === "map" ? "primary" : "outline"}
              size="sm"
              startIcon={<MapIcon className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      {viewMode === "map" ? (
        <>
          <DriversMap selectedDriverId={selectedDriverId} />
        </>
      ) : (
        <>
          {drivers.list.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <p className="text-gray-500">No drivers found</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="w-full">
                <thead className="bg-indigo-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      License
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {drivers.list.map((driver) => {
                    const location =
                      drivers.locations[driver.id] || driver.location;
                    // Consider driver as active if they have location data (moving/online)
                    // This includes simulated movement from route simulation
                    const isDriverActive =
                      driver.isActive || (location && location.timestamp);

                    return (
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {driver.name || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {driver.phone || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {driver.licenseNumber || "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              isDriverActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {isDriverActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {location ? (
                            <span className="font-mono text-xs">
                              {location.latitude.toFixed(4)},{" "}
                              {location.longitude.toFixed(4)}
                            </span>
                          ) : (
                            <span className="text-gray-400">No location</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
