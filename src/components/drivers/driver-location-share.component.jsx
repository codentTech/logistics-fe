"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import driversService from "@/provider/features/drivers/drivers.service";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import { MapPin, XCircle } from "lucide-react";
import Loader from "@/common/components/loader/loader.component";

export default function DriverLocationShare() {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    const authUser = state.auth?.login?.data;
    if (authUser) {
      return { id: authUser.user?.id || authUser.id, token: authUser.token };
    }
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        return { id: storedUser.id, token: storedUser.token };
      } catch {
        return null;
      }
    }
    return null;
  });
  
  const drivers = useSelector((state) => state.drivers);
  const [driverId, setDriverId] = useState(null);
  const [isLoadingDriver, setIsLoadingDriver] = useState(true);

  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Find driver ID from user ID
  useEffect(() => {
    if (user?.id) {
      dispatch(getAllDrivers());
    } else {
      setIsLoadingDriver(false);
    }
  }, [user?.id, dispatch]);

  // Find driver ID once drivers list is loaded
  useEffect(() => {
    if (user?.id && drivers.list.length > 0 && !driverId) {
      // Find driver that matches this user ID
      const driver = drivers.list.find((d) => d.userId === user.id);
      if (driver) {
        setDriverId(driver.id);
        setIsLoadingDriver(false);
      } else if (!drivers.isLoading) {
        setError("No driver profile found for this user. Please contact admin.");
        setIsLoadingDriver(false);
      }
    } else if (user?.id && !drivers.isLoading && drivers.list.length === 0 && !driverId) {
      setError("No driver profile found for this user. Please contact admin.");
      setIsLoadingDriver(false);
    }
  }, [user?.id, drivers.list, drivers.isLoading, driverId]);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        setCurrentLocation(location);
        setError(null);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const sendLocation = async (location) => {
    if (!driverId || !user?.token) {
      setError("Driver not found. Please contact admin.");
      setIsSharing(false);
      return;
    }

    try {
      await driversService.updateLocation(driverId, {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.timestamp,
      });
      setLastUpdate(new Date());
      if (error && (error.includes("Warning:") || error.includes("Failed"))) {
        setError(null);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to send location";
      const status = err.response?.status;
      
      if (status === 401) {
        setError(`Authentication failed: ${errorMessage}. Please login again.`);
        setIsSharing(false);
      } else if (status === 404) {
        setError(`Driver not found: ${errorMessage}`);
        setIsSharing(false);
      } else {
        if (!error || !error.includes("Warning:")) {
          setError(`Warning: ${errorMessage}. Location tracking continues...`);
        }
      }
    }
  };

  const startSharing = () => {
    if (!driverId) {
      setError("Driver profile not found. Please contact admin.");
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsSharing(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        setCurrentLocation(location);
        sendLocation(location).catch(() => {});
      },
      (err) => {
        setError(`Error getting location: ${err.message}. Please check browser permissions.`);
        setIsSharing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        setCurrentLocation(location);
        sendLocation(location).catch(() => {});
      },
      (err) => {
        if (err.code === 1) {
          setError(`Permission denied: ${err.message}. Please allow location access in browser settings.`);
          setIsSharing(false);
        } else if (err.code === 3) {
          setError(`Timeout: ${err.message}. Retrying...`);
        } else {
          setError(`Location warning: ${err.message}. Retrying...`);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    setWatchId(id);
  };

  const stopSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsSharing(false);
    setCurrentLocation(null);
    setLastUpdate(null);
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  if (isLoadingDriver) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader loading={true} size={60} />
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-lg font-semibold text-gray-900">
            Driver Authentication Required
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Please login as a driver to share your location
          </p>
        </div>
      </div>
    );
  }

  if (!driverId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-lg font-semibold text-gray-900">
            Driver Profile Not Found
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {error || "No driver profile found for this user. Please contact admin."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Share My Location</h1>
        <p className="mt-1 text-sm text-gray-500">
          Share your real-time GPS location with the admin dashboard
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {!isSharing ? (
          <div className="text-center">
            <MapPin className="mx-auto h-16 w-16 text-indigo-600" />
            <p className="mt-4 text-lg font-semibold text-gray-900">
              Location Sharing is Off
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Click the button below to start sharing your location in real-time
            </p>
            <div className="mt-6">
              <CustomButton
                text="Start Sharing Location"
                onClick={startSharing}
                variant="primary"
                size="md"
                startIcon={<MapPin className="h-4 w-4" />}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-600"></div>
                <span className="text-sm font-medium text-green-800">
                  Sharing Location...
                </span>
              </div>
            </div>

            {currentLocation && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Current Location
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-mono text-gray-900">
                      {currentLocation.latitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-mono text-gray-900">
                      {currentLocation.longitude.toFixed(6)}
                    </span>
                  </div>
                  {lastUpdate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sent:</span>
                      <span className="text-gray-900">
                        {new Date(lastUpdate).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className={`rounded-lg p-3 ${
                error.includes("Warning:") || error.includes("Retrying")
                  ? "bg-yellow-50"
                  : "bg-red-50"
              }`}>
                <div className="flex items-center gap-2">
                  <XCircle className={`h-4 w-4 ${
                    error.includes("Warning:") || error.includes("Retrying")
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`} />
                  <p className={`text-sm ${
                    error.includes("Warning:") || error.includes("Retrying")
                      ? "text-yellow-800"
                      : "text-red-600"
                  }`}>{error}</p>
                </div>
              </div>
            )}

            <div className="pt-4">
              <CustomButton
                text="Stop Sharing"
                onClick={stopSharing}
                variant="outline"
                size="md"
              />
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Your location is being sent to the admin dashboard
                every 30 seconds. Make sure to allow location permissions in your browser.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

