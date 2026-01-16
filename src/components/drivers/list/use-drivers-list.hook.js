import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDrivers } from "@/provider/features/drivers/drivers.slice";
import useSocket from "@/common/hooks/use-socket.hook";

export function useDriversListHook() {
  const dispatch = useDispatch();
  const drivers = useSelector((state) => state.drivers);

  // Initialize Socket.IO for real-time location updates
  useSocket();

  useEffect(() => {
    dispatch(getAllDrivers());
  }, [dispatch]);

  return {
    drivers,
  };
}
