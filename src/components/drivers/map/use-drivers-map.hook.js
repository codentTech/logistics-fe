import { useMemo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSocket from "@/common/hooks/use-socket.hook";

export function useDriversMapHook(selectedDriverId = null) {
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

  return {
    isMounted,
    drivers,
    driversWithLocations,
    mapCenter,
    selectedDriverId,
  };
}
