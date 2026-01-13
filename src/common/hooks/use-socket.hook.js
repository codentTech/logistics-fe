"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { updateDriverLocation } from "@/provider/features/drivers/drivers.slice";
import { getUser } from "@/common/utils/users.util";

let globalSocket = null;
let locationUpdateCallback = null;

export default function useSocket() {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    locationUpdateCallback = (payload) => {
      if (payload && payload.driverId && payload.location) {
        dispatch(
          updateDriverLocation({
            driverId: payload.driverId,
            location: payload.location,
          })
        );
      }
    };
  }, [dispatch]);

  useEffect(() => {
    const user = getUser();
    if (!user || !user.token) {
      return;
    }

    let socket = globalSocket;

    if (!socket || !socket.connected) {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_MAIN_URL || "http://localhost:5000";
      
      socket = io(socketUrl, {
        auth: {
          token: user.token,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: Infinity,
        timeout: 20000,
      });

      globalSocket = socket;

      socket.on("connect", () => {
        if (user.tenantId) {
          socket.emit("join-tenant", user.tenantId);
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error.message);
      });

      socket.off("driver-location-update");
      socket.off("shipment-status-update");

      socket.on("driver-location-update", (payload) => {
        if (payload && payload.driverId && payload.location) {
          if (locationUpdateCallback) {
            locationUpdateCallback(payload);
          }
        }
      });
    } else {
      if (user.tenantId) {
        socket.emit("join-tenant", user.tenantId);
      }
      
      socket.off("driver-location-update");
      
      const handler = (payload) => {
        if (payload && payload.driverId && payload.location) {
          const callback = locationUpdateCallback;
          if (callback) {
            callback(payload);
          } else {
            setTimeout(() => {
              if (locationUpdateCallback) {
                locationUpdateCallback(payload);
              }
            }, 100);
          }
        }
      };
      
      socket.on("driver-location-update", handler);
    }

    socketRef.current = socket;

    return () => {};
  }, []);

  return socketRef.current;
}

