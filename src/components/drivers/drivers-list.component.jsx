"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import Loader from "@/common/components/loader/loader.component";
import useSocket from "@/common/hooks/use-socket.hook";

export default function DriversList() {
  const dispatch = useDispatch();
  const drivers = useSelector((state) => state.drivers);

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
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Drivers</h1>
      </div>

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
    </div>
  );
}
