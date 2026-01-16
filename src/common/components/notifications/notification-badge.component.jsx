"use client";

import {
  Bell,
  X,
  Package,
  CheckCircle,
  XCircle,
  Ban,
  Truck,
  PackageCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/provider/features/notifications/notifications.slice";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBadge() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 60,
    right: 24,
  });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const { notifications, unreadCount } = useSelector((state) => ({
    notifications: state.notifications.notifications,
    unreadCount: state.notifications.unreadCount,
  }));

  // Fetch notifications and unread count on mount
  useEffect(() => {
    dispatch(getNotifications({ limit: 20, offset: 0 }));
    dispatch(getUnreadCount());
  }, [dispatch]);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId, e) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatch(markAllNotificationsAsRead());
  };

  const getNotificationIcon = (type) => {
    const iconClass = "h-4 w-4 flex-shrink-0";

    switch (type) {
      case "SHIPMENT_ASSIGNED":
        return <Package className={`${iconClass} text-blue-500`} />;
      case "SHIPMENT_APPROVED":
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case "SHIPMENT_REJECTED":
        return <XCircle className={`${iconClass} text-red-500`} />;
      case "SHIPMENT_CANCELLED":
        return <Ban className={`${iconClass} text-orange-500`} />;
      case "SHIPMENT_IN_TRANSIT":
        return <Truck className={`${iconClass} text-indigo-500`} />;
      case "SHIPMENT_DELIVERED":
        return <PackageCheck className={`${iconClass} text-green-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.shipmentId) {
      return `/shipments/${notification.shipmentId}`;
    }
    return "#";
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 -right-1.5 flex p-1 h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed w-96 rounded-lg border border-gray-200 bg-white shadow-lg max-h-[500px] overflow-hidden flex flex-col"
          style={{
            zIndex: 99999,
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={getNotificationLink(notification)}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                      notification.status === "UNREAD" ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {notification.status === "UNREAD" && (
                            <button
                              onClick={(e) =>
                                handleMarkAsRead(notification.id, e)
                              }
                              className="flex-shrink-0 p-1 hover:bg-gray-200 rounded"
                              aria-label="Mark as read"
                            >
                              <X className="h-3 w-3 text-gray-400" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {(() => {
                            try {
                              if (!notification.createdAt) {
                                return "Just now";
                              }
                              const date = new Date(notification.createdAt);
                              if (isNaN(date.getTime())) {
                                return "Just now";
                              }
                              return formatDistanceToNow(date, {
                                addSuffix: true,
                              });
                            } catch (error) {
                              return "Just now";
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-2 text-center">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
