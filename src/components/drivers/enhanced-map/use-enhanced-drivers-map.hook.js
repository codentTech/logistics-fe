import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import useSocket from "@/common/hooks/use-socket.hook";
import {
  calculateBearing,
  calculateSpeed,
  calculateDistance,
  calculateETA,
} from "@/common/utils/map-calculations.util";
import api from "@/common/utils/api";
import { refreshConfig } from "@/common/config/refresh.config";

export function useEnhancedDriversMapHook(selectedDriverId = null, showOnlyDriverId = null) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [followDriver, setFollowDriver] = useState(false);
  const [routeData, setRouteData] = useState({});
  const [driverHistory, setDriverHistory] = useState({});
  const [driverSpeeds, setDriverSpeeds] = useState({});
  const [driverETAs, setDriverETAs] = useState({});
  
  const drivers = useSelector((state) => ({
    list: state.drivers?.list || [],
    locations: state.drivers?.locations || {},
    isLoading: state.drivers?.isLoading || false,
  }));

  const shipments = useSelector((state) => state.shipments?.shipments?.list || []);
  
  const socket = useSocket();

  // Log shipments state changes
  useEffect(() => {
    console.log(`[EnhancedDriversMap] 📦 Shipments state updated:`, {
      totalShipments: shipments.length,
      shipments: shipments.map(s => ({
        id: s.id,
        status: s.status,
        driverId: s.driverId,
        isRelevant: s.driverId && (s.status === "APPROVED" || s.status === "IN_TRANSIT"),
      })),
      relevantCount: shipments.filter(s => s.driverId && (s.status === "APPROVED" || s.status === "IN_TRANSIT")).length,
    });
  }, [shipments]);

  useEffect(() => {
    // Ensure we're in the browser and DOM is ready
    if (typeof window === "undefined") return;
    
    // Check if container exists and is in DOM
    let attempts = 0;
    const maxAttempts = 10;
    const checkContainer = () => {
      attempts++;
      if (containerRef.current && document.body.contains(containerRef.current)) {
        // Verify the element is actually visible/rendered
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setIsMounted(true);
          return;
        }
      }
      
      // Retry after a short delay (max attempts)
      if (attempts < maxAttempts) {
        setTimeout(checkContainer, 100);
      } else {
        console.warn("Map container not ready after max attempts");
        // Still try to set mounted to allow rendering
        setIsMounted(true);
      }
    };
    
    // Initial check with delay to ensure DOM is ready
    const timer = setTimeout(checkContainer, 150);
    return () => clearTimeout(timer);
  }, []);
  
  // Reset map on unmount to prevent reuse errors
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
      setIsMounted(false);
    };
  }, []);

  // Fetch route data for drivers with active shipments
  const fetchRoutes = useCallback(async (retryCount = 0) => {
    console.log(`[EnhancedDriversMap] 🔍 fetchRoutes called (retry: ${retryCount})`, {
      totalShipments: shipments.length,
      shipments: shipments.map(s => ({ id: s.id, status: s.status, driverId: s.driverId })),
    });
    
    const relevantShipments = shipments.filter(
      (s) => s.driverId && (s.status === "APPROVED" || s.status === "IN_TRANSIT")
    );
    
    console.log(`[EnhancedDriversMap] 📦 Relevant shipments (APPROVED/IN_TRANSIT):`, {
      count: relevantShipments.length,
      shipments: relevantShipments.map(s => ({ id: s.id, status: s.status, driverId: s.driverId })),
    });
    
    if (relevantShipments.length === 0) {
      console.log(`[EnhancedDriversMap] ⚠️ No relevant shipments found, clearing route data`);
      setRouteData({});
      return;
    }

    console.log(`[EnhancedDriversMap] 🌐 Fetching routes for ${relevantShipments.length} shipments...`);
    
    const routePromises = relevantShipments.map(async (shipment) => {
      try {
        console.log(`[EnhancedDriversMap] 📡 Fetching route for shipment ${shipment.id} (driver: ${shipment.driverId})`);
        const response = await api().get(`/v1/shipments/${shipment.id}/route`);
        console.log(`[EnhancedDriversMap] 📡 Route API response for shipment ${shipment.id}:`, {
          success: response.data?.success,
          hasData: !!response.data?.data,
          routePoints: response.data?.data?.routePoints?.length || 0,
          phase: response.data?.data?.phase,
        });
        
        if (response.data?.success && response.data?.data) {
          console.log(`[EnhancedDriversMap] ✅ Route fetched successfully for driver ${shipment.driverId}`);
          return { driverId: shipment.driverId, route: response.data.data };
        } else {
          console.log(`[EnhancedDriversMap] ⚠️ Route API returned no data for shipment ${shipment.id}`);
        }
      } catch (error) {
        console.log(`[EnhancedDriversMap] ❌ Route fetch error for shipment ${shipment.id}:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          retryCount,
        });
        
        // Route not available yet - simulation might not have started
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3 && error.response?.status !== 404) {
          // Will retry in next call
          return null;
        }
        // Only log final failures
        if (retryCount >= 3) {
          console.log(`[EnhancedDriversMap] ⚠️ Route not available for shipment ${shipment.id} after ${retryCount} retries`);
        }
      }
      return null;
    });

    const routes = await Promise.all(routePromises);
    const routeMap = {};
    routes.forEach((r) => {
      if (r) routeMap[r.driverId] = r.route;
    });
    
    console.log(`[EnhancedDriversMap] 📊 Route fetch results:`, {
      totalFetched: routes.length,
      successful: Object.keys(routeMap).length,
      driverIds: Object.keys(routeMap),
    });
    
    // If no routes found and we haven't retried, retry once after a delay
    if (Object.keys(routeMap).length === 0 && retryCount < 3 && relevantShipments.length > 0) {
      const delay = 1000 * (retryCount + 1);
      console.log(`[EnhancedDriversMap] 🔄 No routes found, retrying in ${delay}ms (attempt ${retryCount + 1}/3)`);
      setTimeout(() => {
        fetchRoutes(retryCount + 1);
      }, delay); // Exponential backoff: 1s, 2s, 3s
      return;
    }
    
    if (Object.keys(routeMap).length > 0) {
      console.log(`[EnhancedDriversMap] ✅ Routes successfully loaded for drivers:`, Object.keys(routeMap));
    } else {
      console.log(`[EnhancedDriversMap] ⚠️ No routes found after all retries`);
    }
    
    setRouteData(routeMap);
    console.log(`[EnhancedDriversMap] 💾 Route data updated in state:`, Object.keys(routeMap));
  }, [shipments]);

  useEffect(() => {
    console.log(`[EnhancedDriversMap] 📦 Shipments changed, checking for route fetch:`, {
      shipmentsCount: shipments.length,
      shipments: shipments.map(s => ({ 
        id: s.id, 
        status: s.status, 
        driverId: s.driverId,
        isRelevant: s.driverId && (s.status === "APPROVED" || s.status === "IN_TRANSIT")
      })),
    });
    
    if (shipments.length > 0) {
      console.log(`[EnhancedDriversMap] 🚀 Triggering fetchRoutes from shipments change`);
      fetchRoutes();
    } else {
      console.log(`[EnhancedDriversMap] ⚠️ No shipments available, skipping route fetch`);
    }
  }, [shipments, fetchRoutes]);

  // Listen for shipment status updates and driver location updates to refresh routes
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (payload) => {
      // Refresh routes when shipment status changes to APPROVED or IN_TRANSIT
      if (payload && (payload.newStatus === "APPROVED" || payload.newStatus === "IN_TRANSIT")) {
        console.log("[EnhancedDriversMap] 🔄 Shipment status changed to", payload.newStatus, "- Refreshing routes...", {
          shipmentId: payload.shipmentId,
          newStatus: payload.newStatus,
          delay: refreshConfig.routeRefreshDelay,
        });
        // Small delay to ensure backend has processed the route simulation
        setTimeout(() => {
          console.log("[EnhancedDriversMap] 🔄 Executing route refresh after status change");
          fetchRoutes();
        }, refreshConfig.routeRefreshDelay);
      }
    };

    const handleLocationUpdate = (payload) => {
      // Refresh routes when driver location updates (throttled)
      // This ensures route data stays current during simulation
      if (payload && payload.driverId) {
        console.log(`[EnhancedDriversMap] 📍 Location update received:`, {
          driverId: payload.driverId,
          location: payload.location,
          source: payload.source || 'UNKNOWN',
          hasRoute: Object.keys(routeData).includes(payload.driverId),
        });
        
        // Only refresh if this driver has an active route
        const hasRoute = Object.keys(routeData).includes(payload.driverId);
        if (hasRoute) {
          // Throttle: only refresh routes at configured interval during location updates
          // But reduce throttle for simulation updates to keep route data fresh
          const throttleTime = payload.source === 'SIMULATED' 
            ? Math.min(refreshConfig.locationUpdateThrottle, 2000) // Max 2s for simulated
            : refreshConfig.locationUpdateThrottle;
          
          console.log(`[EnhancedDriversMap] 🔄 Scheduling route refresh in ${throttleTime}ms for driver ${payload.driverId}`);
          
          clearTimeout(handleLocationUpdate.timeout);
          handleLocationUpdate.timeout = setTimeout(() => {
            console.log(`[EnhancedDriversMap] 🔄 Refreshing routes for driver ${payload.driverId}`);
            fetchRoutes(0); // Reset retry count on location update
          }, throttleTime);
        } else {
          console.log(`[EnhancedDriversMap] ⚠️ No route data for driver ${payload.driverId}, attempting to fetch routes...`);
          // If no route data but we have location updates, try fetching routes
          // This handles the case where route simulation started but frontend hasn't fetched yet
          // Fetch routes regardless of source - route simulation might have started
          console.log(`[EnhancedDriversMap] 🔄 Fetching routes for driver ${payload.driverId} (source: ${payload.source || 'UNKNOWN'})`);
          fetchRoutes(0);
        }
      }
    };

    socket.on("shipment-status-update", handleStatusUpdate);
    socket.on("driver-location-update", handleLocationUpdate);

    return () => {
      socket.off("shipment-status-update", handleStatusUpdate);
      socket.off("driver-location-update", handleLocationUpdate);
      if (handleLocationUpdate.timeout) {
        clearTimeout(handleLocationUpdate.timeout);
      }
    };
  }, [socket, fetchRoutes, routeData]);

  // Log when routeData changes
  useEffect(() => {
    console.log(`[EnhancedDriversMap] 📊 Route data state changed:`, {
      routeDataKeys: Object.keys(routeData),
      routeDataCount: Object.keys(routeData).length,
      routeData: Object.entries(routeData).map(([driverId, route]) => ({
        driverId,
        hasRoutePoints: !!route?.routePoints,
        routePointsCount: route?.routePoints?.length || 0,
        phase: route?.phase,
      })),
    });
  }, [routeData]);

  // Track driver history and calculate speed/ETA
  useEffect(() => {
    const newHistory = { ...driverHistory };
    const newSpeeds = { ...driverSpeeds };
    const newETAs = { ...driverETAs };

    drivers.list.forEach((driver) => {
      const location = drivers.locations[driver.id] || driver.location;
      if (!location?.latitude || !location?.longitude) return;

      const driverHist = newHistory[driver.id] || [];
      const lastLocation = driverHist[driverHist.length - 1];

      // Add to history if position changed
      if (!lastLocation || lastLocation.latitude !== location.latitude || lastLocation.longitude !== location.longitude) {
        const updatedHistory = [...driverHist, { ...location, timestamp: location.timestamp || new Date().toISOString() }].slice(-20); // Keep last 20 points
        newHistory[driver.id] = updatedHistory;

        // Calculate speed
        if (lastLocation && location.timestamp && lastLocation.timestamp) {
          const timeDiff = new Date(location.timestamp).getTime() - new Date(lastLocation.timestamp).getTime();
          if (timeDiff > 0) {
            const speed = calculateSpeed(
              lastLocation.latitude,
              lastLocation.longitude,
              location.latitude,
              location.longitude,
              timeDiff
            );
            newSpeeds[driver.id] = speed;

            // Calculate ETA if route exists
            const route = routeData[driver.id];
            if (route?.routePoints && route?.deliveryPoint) {
              const remainingDistance = calculateDistance(
                location.latitude,
                location.longitude,
                route.deliveryPoint.lat,
                route.deliveryPoint.lng
              );
              const eta = calculateETA(remainingDistance, speed);
              newETAs[driver.id] = { eta, distance: remainingDistance };
            }
          }
        }
      }
    });

    setDriverHistory(newHistory);
    setDriverSpeeds(newSpeeds);
    setDriverETAs(newETAs);
  }, [drivers.locations, routeData]);

  const driversWithLocations = useMemo(() => {
    return drivers.list.filter((driver) => {
      // If showOnlyDriverId is specified, only show that driver
      if (showOnlyDriverId && driver.id !== showOnlyDriverId) {
        return false;
      }
      
      // Check Redux locations first (most up-to-date), then fallback to driver.location
      const location = drivers.locations[driver.id] || driver.location;
      
      // If showOnlyDriverId is set and this is the selected driver, show it even if location is not perfect
      // This ensures the map shows the driver immediately when location is first shared
      if (showOnlyDriverId && driver.id === showOnlyDriverId) {
        // If we have any location data, show the driver
        if (location && location.latitude && location.longitude) {
          return (
            !isNaN(location.latitude) &&
            !isNaN(location.longitude) &&
            location.latitude !== 0 &&
            location.longitude !== 0
          );
        }
        // If no location yet, don't show (will appear when location is received)
        return false;
      }
      
      // For other drivers, use strict validation
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
  }, [drivers.list, drivers.locations, showOnlyDriverId]);

  // Get shipments for selected driver
  const selectedDriverShipments = useMemo(() => {
    if (!selectedDriverId) return [];
    return shipments.filter((s) => s.driverId === selectedDriverId && (s.status === "APPROVED" || s.status === "IN_TRANSIT"));
  }, [selectedDriverId, shipments]);

  const mapCenter = useMemo(() => {
    if (selectedDriverId) {
      const selectedDriver = driversWithLocations.find((d) => d.id === selectedDriverId);
      if (selectedDriver) {
        const location = drivers.locations[selectedDriver.id] || selectedDriver.location;
        if (location?.latitude && location?.longitude) {
          return [location.latitude, location.longitude];
        }
      }
    }

    if (driversWithLocations.length === 0) {
      return [40.7128, -74.006];
    }

    const avgLat = driversWithLocations.reduce((sum, driver) => {
      const location = drivers.locations[driver.id] || driver.location;
      return sum + location.latitude;
    }, 0) / driversWithLocations.length;

    const avgLng = driversWithLocations.reduce((sum, driver) => {
      const location = drivers.locations[driver.id] || driver.location;
      return sum + location.longitude;
    }, 0) / driversWithLocations.length;

    return [avgLat, avgLng];
  }, [selectedDriverId, driversWithLocations, drivers.locations]);

  // Calculate bearing for each driver
  const driverBearings = useMemo(() => {
    const bearings = {};
    driversWithLocations.forEach((driver) => {
      const history = driverHistory[driver.id] || [];
      if (history.length >= 2) {
        const last = history[history.length - 1];
        const prev = history[history.length - 2];
        bearings[driver.id] = calculateBearing(
          prev.latitude,
          prev.longitude,
          last.latitude,
          last.longitude
        );
      }
    });
    return bearings;
  }, [driversWithLocations, driverHistory]);

  return {
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
    selectedDriverId,
    showOnlyDriverId,
  };
}
