"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { updateDriverLocation } from "@/provider/features/drivers/drivers.slice";
import {
  addNotification,
  incrementUnreadCount,
  getNotifications,
  getUnreadCount,
} from "@/provider/features/notifications/notifications.slice";
import { setCurrentShipment } from "@/provider/features/shipments/shipments.slice";
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
      console.log("⚠️ useSocket: No user or token found");
      return;
    }

    // If global socket exists and is connected, use it immediately
    if (globalSocket && globalSocket.connected) {
      socketRef.current = globalSocket;
      console.log("✅ Reusing existing global socket:", globalSocket.id);
      return;
    }

    // If socket is already being created, wait for it
    if (globalSocket && !globalSocket.connected) {
      console.log("⏳ Socket is connecting, waiting...");
      socketRef.current = globalSocket;
      return;
    }

    console.log("🔍 useSocket: Creating new socket connection");

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_MAIN_URL ||
      "http://localhost:5000";

    console.log("🔌 Creating new socket connection to:", socketUrl);
    const socket = io(socketUrl, {
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
    socketRef.current = socket; // Set ref immediately so component can use it

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      if (user.tenantId) {
        socket.emit("join-tenant", user.tenantId);
        console.log("👋 Joined tenant room:", user.tenantId);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
    });

    socket.off("driver-location-update");
    socket.off("notification");
    socket.off("notification-updated");

    socket.on("driver-location-update", (payload) => {
      if (payload && payload.driverId && payload.location) {
        // Directly dispatch to Redux to ensure location updates are always processed
        dispatch(
          updateDriverLocation({
            driverId: payload.driverId,
            location: payload.location,
          })
        );
        // Also call callback if it exists (for backward compatibility)
        if (locationUpdateCallback) {
          locationUpdateCallback(payload);
        }
      }
    });

    // Note: shipment-status-update is handled by individual components
    // No global listener needed - each component listens for its own shipmentId

    socket.on("notification", (payload) => {
      if (payload) {
        // Add notification to Redux store
        dispatch(
          addNotification({
            id: payload.shipmentId || Date.now().toString(),
            type: payload.type,
            title: payload.title,
            message: payload.message,
            shipmentId: payload.shipmentId,
            status: "UNREAD",
            createdAt: payload.timestamp || new Date().toISOString(),
            metadata: payload,
          })
        );
        dispatch(incrementUnreadCount());

        // Show toast notification
        enqueueSnackbar(payload.message || payload.title, {
          variant: "info",
          autoHideDuration: 5000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      }
    });

    // Listen for notification updates (refresh notification list)
    socket.on("notification-updated", () => {
      // Refresh notifications from server to avoid duplicates
      dispatch(getNotifications({ limit: 20, offset: 0 }));
      dispatch(getUnreadCount());
    });

    return () => {
      // Don't disconnect on unmount - keep global socket alive for other components
      // Only clear the ref for this component instance
    };
  }, [dispatch]);

  // Return the socket from ref, or global socket if ref is null
  return socketRef.current || globalSocket;
}
