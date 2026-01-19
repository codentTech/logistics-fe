"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/provider/features/notifications/notifications.slice";
import Private from "@/auth/private.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import useSocket from "@/common/hooks/use-socket.hook";
import {
  Check,
  CheckCheck,
  Package,
  CheckCircle,
  XCircle,
  Ban,
  Truck,
  PackageCheck,
  Bell,
} from "lucide-react";

function NotificationsPage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 20;
  
  // Initialize socket for real-time updates
  useSocket();

  const { notifications, total, unreadCount, list } = useSelector((state) => {
    // Filter out invalid/empty notifications
    const allNotifications = state.notifications?.notifications || [];
    const validNotifications = allNotifications.filter((notification) => {
      return (
        notification &&
        typeof notification === 'object' &&
        notification.id &&
        (notification.title || notification.message)
      );
    });
    
    // Calculate unread count based on valid notifications
    const validUnreadCount = validNotifications.filter(
      (notification) => notification.status === 'UNREAD'
    ).length;
    
    return {
      notifications: validNotifications,
      total: state.notifications?.total || 0,
      unreadCount: validUnreadCount,
      list: state.notifications?.list || { isLoading: false, isSuccess: false, isError: false },
    };
  });

  useEffect(() => {
    dispatch(getNotifications({ limit, offset: (page - 1) * limit }));
    dispatch(getUnreadCount());
  }, [dispatch, page]);

  const handleMarkAsRead = async (notificationId) => {
    await dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  const getNotificationIcon = (type) => {
    const iconClass = "h-5 w-5 flex-shrink-0";

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
    return null;
  };

  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const hasMore = notifications.length === limit && page * limit < total;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <CustomButton
            text="Mark all as read"
            onClick={handleMarkAllAsRead}
            variant="outline"
            size="sm"
            icon={<CheckCheck className="h-4 w-4" />}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {list.isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader loading={true} size={60} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white">
            <Bell className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-sm text-gray-500">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const link = getNotificationLink(notification);
              const content = (
                <div
                  className={`rounded-lg border mt-4 p-4 transition-colors ${
                    notification.status === "UNREAD"
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {(() => {
                              try {
                                if (!notification.createdAt) {
                                  return "Just now";
                                }
                                
                                // Parse the date string - handle ISO strings and other formats
                                let date;
                                if (typeof notification.createdAt === 'string') {
                                  date = new Date(notification.createdAt);
                                  if (isNaN(date.getTime())) {
                                    const timestamp = Date.parse(notification.createdAt);
                                    if (!isNaN(timestamp)) {
                                      date = new Date(timestamp);
                                    } else {
                                      return "Just now";
                                    }
                                  }
                                } else if (notification.createdAt instanceof Date) {
                                  date = notification.createdAt;
                                } else {
                                  return "Just now";
                                }
                                
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
                        {notification.status === "UNREAD" && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Mark as read"
                          >
                            <Check className="h-4 w-4 text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );

              return link ? (
                <Link key={notification.id} href={link}>
                  {content}
                </Link>
              ) : (
                <div key={notification.id}>{content}</div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination - Fixed to bottom */}
      {(notifications.length > 0 || page > 1) && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 mt-4 flex items-center justify-center gap-4">
          <CustomButton
            text="Previous"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            variant="outline"
            size="sm"
            disabled={page === 1}
          />
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <CustomButton
            text="Next"
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
            size="sm"
            disabled={!hasMore}
          />
        </div>
      )}
    </div>
  );
}

export default function Notifications() {
  return <Private component={<NotificationsPage />} title="Notifications" />;
}
