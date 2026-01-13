"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import Loader from "@/common/components/loader/loader.component";
import useSocket from "@/common/hooks/use-socket.hook";
import { List, Map as MapIcon } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";

// Dynamically import map component (SSR disabled for Leaflet)
const DriversMap = dynamic(() => import("./drivers-map.component"), {
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

      {viewMode === "map" ? (
        <DriversMap />
      ) : (
        <>
          {drivers.list.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <p className="text-gray-500">No drivers found</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      License
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {drivers.list.map((driver) => {
                    const location =
                      drivers.locations[driver.id] || driver.location;
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
                              driver.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {driver.isActive ? "ACTIVE" : "INACTIVE"}
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

          {drivers.isError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {drivers.message || "Failed to load drivers"}
            </div>
          )}
        </>
      )}
    </div>
  );
}
