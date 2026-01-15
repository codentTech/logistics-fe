"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import driversService from "@/provider/features/drivers/drivers.service";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import { MapPin, XCircle } from "lucide-react";
import Loader from "@/common/components/loader/loader.component";
import { refreshConfig } from "@/common/config/refresh.config";

export default function DriverLocationShare() {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    // First try Redux state
    const authUser = state.auth?.login?.data;
    if (authUser) {
      // Handle both formats: { user: {...}, token: "..." } and { id: "...", token: "..." }
      const userId = authUser.user?.id || authUser.id;
      const token = authUser.token || authUser.user?.token;
      if (userId && token) {
        return { id: userId, token };
      }
    }
    // Fallback to localStorage
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        // localStorage format: { id, email, role, tenantId, token }
        if (storedUser.id && storedUser.token) {
          return { id: storedUser.id, token: storedUser.token };
        }
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
  const locationIntervalRef = useRef(null);
  const currentLocationRef = useRef(null);

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
      // Check both userId field and user.id if user object exists
      const driver = drivers.list.find((d) => {
        return d.userId === user.id || d.user?.id === user.id;
      });
      if (driver) {
        setDriverId(driver.id);
        setIsLoadingDriver(false);
        setError(null);
      } else if (!drivers.isLoading) {
        setError(
          "No driver profile found for this user. Please contact admin."
        );
        setIsLoadingDriver(false);
      }
    } else if (
      user?.id &&
      !drivers.isLoading &&
      drivers.list.length === 0 &&
      !driverId
    ) {
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

    // Validate location data
    if (
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number" ||
      isNaN(location.latitude) ||
      isNaN(location.longitude) ||
      location.latitude < -90 ||
      location.latitude > 90 ||
      location.longitude < -180 ||
      location.longitude > 180
    ) {
      setError("Invalid location coordinates. Please check GPS signal.");
      return;
    }

    try {
      const response = await driversService.updateLocation(driverId, {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.timestamp,
      });

      if (response && response.success) {
        setLastUpdate(new Date());
        // Clear error if location was sent successfully
        if (error && (error.includes("Warning:") || error.includes("Failed"))) {
          setError(null);
        }
      } else {
        const errorMsg = response?.message || "Failed to send location";
        if (!error || !error.includes(errorMsg)) {
          setError(`Warning: ${errorMsg}. Location tracking continues...`);
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to send location";
      const status = err.response?.status;

      if (status === 401) {
        setError(`Authentication failed: ${errorMessage}. Please login again.`);
        setIsSharing(false);
      } else if (status === 404) {
        setError(`Driver not found: ${errorMessage}`);
        setIsSharing(false);
      } else if (status === 400) {
        setError(`Invalid location data: ${errorMessage}`);
      } else {
        // For other errors (network, timeout, etc.), show warning but continue tracking
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
        setError(
          `Error getting location: ${err.message}. Please check browser permissions.`
        );
        setIsSharing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Watch position for UI updates (updates frequently for display)
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        setCurrentLocation(location);
        currentLocationRef.current = location; // Store in ref for interval access
        // Don't send immediately - will be sent via interval
      },
      (err) => {
        if (err.code === 1) {
          setError(
            `Permission denied: ${err.message}. Please allow location access in browser settings.`
          );
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

    // Send location to server at configured interval
    const sendLocationInterval = setInterval(() => {
      const location = currentLocationRef.current;
      if (location) {
        sendLocation(location).catch(() => {});
      } else {
        // Get fresh location if not available
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const freshLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString(),
            };
            setCurrentLocation(freshLocation);
            currentLocationRef.current = freshLocation;
            sendLocation(freshLocation).catch(() => {});
          },
          (err) => {
            if (err.code === 1) {
              setError(
                `Permission denied: ${err.message}. Please allow location access in browser settings.`
              );
              setIsSharing(false);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }
    }, refreshConfig.driverLocationShareInterval);

    locationIntervalRef.current = sendLocationInterval;

    // Send initial location immediately
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        setCurrentLocation(location);
        currentLocationRef.current = location;
        sendLocation(location).catch(() => {});
      },
      (err) => {
        if (err.code === 1) {
          setError(
            `Permission denied: ${err.message}. Please allow location access in browser settings.`
          );
          setIsSharing(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const stopSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    if (locationIntervalRef.current !== null) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    setIsSharing(false);
    setCurrentLocation(null);
    currentLocationRef.current = null;
    setLastUpdate(null);
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (locationIntervalRef.current !== null) {
        clearInterval(locationIntervalRef.current);
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
            {error ||
              "No driver profile found for this user. Please contact admin."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Share My Location
        </h1>
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
              <div className="flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600"></div>
                <span className="text-sm font-medium text-indigo-800">
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
              <div
                className={`rounded-lg p-3 ${
                  error.includes("Warning:") || error.includes("Retrying")
                    ? "bg-yellow-50"
                    : "bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <XCircle
                    className={`h-4 w-4 ${
                      error.includes("Warning:") || error.includes("Retrying")
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      error.includes("Warning:") || error.includes("Retrying")
                        ? "text-yellow-800"
                        : "text-red-600"
                    }`}
                  >
                    {error}
                  </p>
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
                <strong>Note:</strong> Your location is being sent to the admin
                dashboard at configured intervals. Make sure to allow location
                permissions in your browser.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
