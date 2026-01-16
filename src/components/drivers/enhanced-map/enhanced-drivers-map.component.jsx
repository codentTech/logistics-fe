"use client";

/**
 * Enhanced Drivers Map Component with all improvements:
 * - Custom vehicle icons with direction indicators
 * - Route polyline visualization
 * - Pickup/delivery markers
 * - History trail
 * - Enhanced popup with speed, distance, ETA
 * - Map controls
 * - Smooth animations
 */

import { useMemo, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import { Package, Phone } from "lucide-react";
import "leaflet/dist/leaflet.css";
import {
  formatDistance,
  formatSpeed,
  formatETA,
} from "@/common/utils/map-calculations.util";
import { useEnhancedDriversMapHook } from "./use-enhanced-drivers-map.hook";

// Fix Leaflet default icon issue
import L from "leaflet";
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

// Create vehicle icon with direction indicator
const createVehicleIcon = (isActive, bearing = 0) => {
  const color = isActive ? "#10B981" : "#6B7280";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <g transform="rotate(${bearing} 20 20)">
        <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="2"/>
        <path d="M20 8 L24 18 L20 16 L16 18 Z" fill="white" stroke="${color}" stroke-width="1"/>
        <circle cx="20" cy="20" r="4" fill="white"/>
      </g>
    </svg>
  `;
  
  return new Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(svg),
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Create pickup/delivery marker icon
const createLocationIcon = (type) => {
  const color = type === "pickup" ? "#3B82F6" : "#EF4444";
  const symbol = type === "pickup" ? "P" : "D";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="16" y="20" font-family="Arial" font-size="12" font-weight="bold" fill="white" text-anchor="middle">${symbol}</text>
    </svg>
  `;
  
  return new Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(svg),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Map view updater component
function MapViewUpdater({ selectedDriverId, driversWithLocations, drivers, followDriver }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    try {
      const container = map.getContainer();
      if (!container || !container.parentElement) return;

      if (selectedDriverId && followDriver) {
        const selectedDriver = driversWithLocations.find((driver) => driver.id === selectedDriverId);
        if (selectedDriver) {
          const location = drivers.locations[selectedDriver.id] || selectedDriver.location;
          if (location?.latitude && location?.longitude) {
            map.setView([location.latitude, location.longitude], 15, {
              animate: true,
              duration: 0.5,
            });
          }
        }
      }
    } catch (error) {
      console.warn("Map view updater error:", error);
    }
  }, [selectedDriverId, driversWithLocations, drivers.locations, map, followDriver]);

  return null;
}

// Enhanced marker with smooth animation
function EnhancedMarker({ position, icon, children, driverId, history = [] }) {
  const markerRef = useRef(null);
  const prevPositionRef = useRef(position);
  const animationRef = useRef(null);

  useEffect(() => {
    if (markerRef.current && position && Array.isArray(position) && position.length === 2) {
      const [lat, lng] = position;
      const prevPos = prevPositionRef.current;

      if (!prevPos || !Array.isArray(prevPos) || prevPos[0] !== lat || prevPos[1] !== lng) {
        // Smooth animation
        if (prevPos && Array.isArray(prevPos)) {
          const startPos = [...prevPos];
          const endPos = [lat, lng];
          const duration = 1000; // 1 second
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

            const currentLat = startPos[0] + (endPos[0] - startPos[0]) * easeProgress;
            const currentLng = startPos[1] + (endPos[1] - startPos[1]) * easeProgress;

            if (markerRef.current) {
              markerRef.current.setLatLng([currentLat, currentLng]);
            }

            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animate);
            } else {
              prevPositionRef.current = position;
            }
          };

          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // First position, no animation
          markerRef.current.setLatLng([lat, lng]);
          prevPositionRef.current = position;
        }
      }
    }
  }, [position, driverId]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <Marker ref={markerRef} position={position} icon={icon}>
        {children}
      </Marker>
      {/* History trail */}
      {history.length > 1 && (
        <Polyline
          positions={history.map((h) => [h.latitude, h.longitude])}
          pathOptions={{
            color: "#10B981",
            weight: 3,
            opacity: 0.6,
          }}
        />
      )}
    </>
  );
}

export default function EnhancedDriversMap({ selectedDriverId = null, showOnlyDriverId = null }) {
  const {
    containerRef,
    mapInstanceRef,
    isMounted,
    mapKey,
    followDriver,
    setFollowDriver,
    routeData,
    driverHistory,
    driverSpeeds,
    driverETAs,
    drivers,
    shipments,
    driversWithLocations,
    selectedDriverShipments,
    mapCenter,
    driverBearings,
  } = useEnhancedDriversMapHook(selectedDriverId, showOnlyDriverId);

  if (typeof window === "undefined" || !isMounted) {
    return (
      <div className="relative h-96 w-full overflow-hidden rounded-lg border border-gray-200 bg-white flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-96 w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setFollowDriver(!followDriver)}
          className={`rounded-lg px-3 py-2 text-xs font-medium shadow-md transition-colors ${
            followDriver
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {followDriver ? "📍 Following" : "📍 Follow"}
        </button>
      </div>

      {isMounted && containerRef.current && (() => {
        try {
          // Double-check container is in DOM and has dimensions
          if (!containerRef.current || !document.body.contains(containerRef.current)) {
            return null;
          }
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            return null;
          }
          
          return (
            <MapContainer
              key={`map-${mapKey}`}
              center={mapCenter}
              zoom={selectedDriverId ? 15 : driversWithLocations.length > 0 ? 12 : 10}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
              whenCreated={(mapInstance) => {
                try {
                  mapInstanceRef.current = mapInstance;
                } catch (e) {
                  console.warn("Map instance creation error:", e);
                }
              }}
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
                followDriver={followDriver}
              />

              {/* Route polylines */}
              {Object.entries(routeData).map(([driverId, route]) => {
                if (!route?.routePoints || route.routePoints.length < 2) return null;
                
                // Different colors/styles for different phases
                const isPhase1 = route.phase === 'TO_PICKUP';
                const pathOptions = {
                  color: isPhase1 ? "#10B981" : "#3B82F6", // Green for TO_PICKUP, Blue for TO_DELIVERY
                  weight: 4,
                  opacity: 0.7,
                  dashArray: isPhase1 ? "15, 10" : "10, 5", // Different dash pattern
                };
                
                return (
                  <Polyline
                    key={`route-${driverId}-${route.phase || 'default'}`}
                    positions={route.routePoints.map((p) => [p.lat, p.lng])}
                    pathOptions={pathOptions}
                  />
                );
              })}

              {/* Pickup and Delivery Markers */}
              {selectedDriverShipments.map((shipment) => {
                // These would need to be geocoded - for now, we'll skip if addresses aren't coordinates
                // In production, you'd geocode pickupAddress and deliveryAddress
                return null; // Placeholder - would need geocoding service
              })}

              {/* Driver Markers */}
              {driversWithLocations.length > 0 ? (
                driversWithLocations.map((driver) => {
                  const location = drivers.locations[driver.id] || driver.location;
                  if (!location?.latitude || !location?.longitude) return null;

                  const isDriverActive = driver.isActive || (location && location.timestamp);
                  const bearing = driverBearings[driver.id] || 0;
                  const history = driverHistory[driver.id] || [];
                  const speed = driverSpeeds[driver.id] || 0;
                  const etaData = driverETAs[driver.id];
                  
                  // Get active shipment for this driver
                  const activeShipment = shipments.find(
                    (s) => s.driverId === driver.id && (s.status === "APPROVED" || s.status === "IN_TRANSIT")
                  );

                  return (
                    <EnhancedMarker
                      key={driver.id}
                      driverId={driver.id}
                      position={[location.latitude, location.longitude]}
                      icon={createVehicleIcon(isDriverActive, bearing)}
                      history={history}
                    >
                      <Popup>
                        <div className="min-w-[250px]">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {driver.name || "Unknown Driver"}
                          </h3>
                          {driver.phone && (
                            <p className="mt-1 text-xs text-gray-600">Phone: {driver.phone}</p>
                          )}
                          {driver.licenseNumber && (
                            <p className="text-xs text-gray-600">License: {driver.licenseNumber}</p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                isDriverActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {isDriverActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                            {speed > 0 && (
                              <span className="text-xs text-gray-600">
                                🚗 {formatSpeed(speed)}
                              </span>
                            )}
                          </div>
                          {etaData && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-gray-600">
                                📍 Distance: {formatDistance(etaData.distance)}
                              </p>
                              <p className="text-xs text-gray-600">
                                ⏱️ ETA: {formatETA(etaData.eta)}
                              </p>
                            </div>
                          )}
                          <p className="mt-2 text-xs text-gray-500">
                            Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </p>
                          {location.timestamp && (
                            <p className="mt-1 text-xs text-gray-400">
                              Updated: {new Date(location.timestamp).toLocaleTimeString()}
                            </p>
                          )}
                          <div className="mt-3 flex gap-2">
                            {driver.phone && (
                              <button
                                className="flex items-center justify-center gap-1 rounded bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-700"
                                onClick={() => window.open(`tel:${driver.phone}`)}
                              >
                                <Phone size={14} />
                                Call
                              </button>
                            )}
                            {activeShipment ? (
                              <button
                                className="flex items-center justify-center gap-1 rounded bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-700"
                                onClick={() => window.open(`/shipments/${activeShipment.id}`, '_blank')}
                              >
                                <Package size={14} />
                                View Shipment
                              </button>
                            ) : (
                              <button
                                className="flex items-center justify-center gap-1 rounded bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-700"
                                onClick={() => window.open("/shipments", '_blank')}
                              >
                                <Package size={14} />
                                View All
                              </button>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </EnhancedMarker>
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
          );
        } catch (error) {
          console.error("Error rendering map:", error);
          return (
            <div className="flex h-full items-center justify-center">
              <div className="text-sm text-red-600">Error loading map. Please refresh the page.</div>
            </div>
          );
        }
      })()}
    </div>
  );
}
