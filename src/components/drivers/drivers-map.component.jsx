"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import useSocket from "@/common/hooks/use-socket.hook";

// Component to update map view when selectedDriverId changes
function MapViewUpdater({ selectedDriverId, driversWithLocations, drivers }) {
  const map = useMap();

  useEffect(() => {
    // Wait for map to be ready
    if (!map || !map.getContainer()) {
      return;
    }

    if (selectedDriverId) {
      const selectedDriver = driversWithLocations.find(
        (driver) => driver.id === selectedDriverId
      );
      if (selectedDriver) {
        const location = drivers.locations[selectedDriver.id] || selectedDriver.location;
        if (location && location.latitude && location.longitude && !isNaN(location.latitude) && !isNaN(location.longitude)) {
          try {
            map.setView([location.latitude, location.longitude], 15, {
              animate: true,
              duration: 0.5,
            });
          } catch (error) {
            // Map might not be fully initialized yet
          }
        }
      }
    }
  }, [selectedDriverId, driversWithLocations, drivers.locations, map]);

  return null;
}

// Custom marker component that updates position when it changes
function UpdatingMarker({ position, icon, children, driverId }) {
  const markerRef = useRef(null);
  const prevPositionRef = useRef(position);

  useEffect(() => {
    if (markerRef.current && position && Array.isArray(position) && position.length === 2) {
      const [lat, lng] = position;
      const prevPos = prevPositionRef.current;
      
      if (!prevPos || !Array.isArray(prevPos) || prevPos[0] !== lat || prevPos[1] !== lng) {
        try {
          markerRef.current.setLatLng([lat, lng]);
          prevPositionRef.current = position;
        } catch (error) {
          console.error(`Error updating marker position for driver ${driverId}:`, error);
        }
      }
    }
  }, [position, driverId]);

  useEffect(() => {
    if (markerRef.current && position && Array.isArray(position) && position.length === 2) {
      prevPositionRef.current = position;
    }
  }, []);

  return (
    <Marker ref={markerRef} position={position} icon={icon}>
      {children}
    </Marker>
  );
}

import L from "leaflet";
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

const createDriverIcon = (isActive) => {
  return new Icon({
    iconUrl: isActive
      ? "data:image/svg+xml;base64," +
        btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="#10B981" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      `)
      : "data:image/svg+xml;base64," +
        btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="#6B7280" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function DriversMap({ selectedDriverId = null }) {
  const [isMounted, setIsMounted] = useState(false);
  const drivers = useSelector((state) => ({
    list: state.drivers?.list || [],
    locations: state.drivers?.locations || {},
    isLoading: state.drivers?.isLoading || false,
  }));
  
  useSocket();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const driversWithLocations = useMemo(() => {
    return drivers.list.filter((driver) => {
      const location = drivers.locations[driver.id] || driver.location;
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
  }, [drivers.list, drivers.locations]);

  const mapCenter = useMemo(() => {
    // If a specific driver is selected, center on that driver
    if (selectedDriverId) {
      const selectedDriver = driversWithLocations.find(
        (driver) => driver.id === selectedDriverId
      );
      if (selectedDriver) {
        const location = drivers.locations[selectedDriver.id] || selectedDriver.location;
        if (location && location.latitude && location.longitude) {
          return [location.latitude, location.longitude];
        }
      }
    }

    // Otherwise, center on average of all drivers
    if (driversWithLocations.length === 0) {
      return [40.7128, -74.006];
    }

    const avgLat =
      driversWithLocations.reduce(
        (sum, driver) => {
          const location = drivers.locations[driver.id] || driver.location;
          return sum + location.latitude;
        },
        0
      ) / driversWithLocations.length;

    const avgLng =
      driversWithLocations.reduce(
        (sum, driver) => {
          const location = drivers.locations[driver.id] || driver.location;
          return sum + location.longitude;
        },
        0
      ) / driversWithLocations.length;

    return [avgLat, avgLng];
  }, [selectedDriverId, driversWithLocations, drivers.locations]);

  // Ensure we're in the browser and component is mounted
  if (typeof window === "undefined" || !isMounted) {
    return (
      <div className="relative h-96 w-full overflow-hidden rounded-lg border border-gray-200 bg-white flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <MapContainer
        center={mapCenter}
        zoom={selectedDriverId ? 15 : (driversWithLocations.length > 0 ? 12 : 10)}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        whenReady={() => {
          // Map is ready
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewUpdater
          selectedDriverId={selectedDriverId}
          driversWithLocations={driversWithLocations}
          drivers={drivers}
        />
        {driversWithLocations.length > 0 ? (
          driversWithLocations.map((driver) => {
          const location = drivers.locations[driver.id] || driver.location;
          if (!location || !location.latitude || !location.longitude) {
            return null;
          }

          // Consider driver as active if they have location data (moving/online)
          // This includes simulated movement from route simulation
          const isDriverActive = driver.isActive || (location && location.timestamp);

          return (
            <UpdatingMarker
              key={driver.id}
              driverId={driver.id}
              position={[location.latitude, location.longitude]}
              icon={createDriverIcon(isDriverActive)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {driver.name || "Unknown Driver"}
                  </h3>
                  {driver.phone && (
                    <p className="mt-1 text-xs text-gray-600">Phone: {driver.phone}</p>
                  )}
                  {driver.licenseNumber && (
                    <p className="text-xs text-gray-600">
                      License: {driver.licenseNumber}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        isDriverActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {isDriverActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Location: {location.latitude.toFixed(4)},{" "}
                    {location.longitude.toFixed(4)}
                  </p>
                  {location.timestamp && (
                    <p className="mt-1 text-xs text-gray-400">
                      Updated: {new Date(location.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </Popup>
            </UpdatingMarker>
          );
          })
        ) : (
          <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 shadow-md">
            <p className="text-xs font-medium text-gray-700">No drivers with location data</p>
            <p className="text-xs text-gray-500">
              Driver locations will appear here when available
            </p>
          </div>
        )}
      </MapContainer>
    </div>
  );
}

