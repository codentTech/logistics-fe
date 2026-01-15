import api from "@/common/utils/api";

// Get all notifications
const getNotifications = async (params = {}) => {
  const response = await api().get("/v1/notifications", { params });
  return response.data;
};

// Get unread notification count
const getUnreadCount = async () => {
  const response = await api().get("/v1/notifications/unread-count");
  return response.data;
};

// Mark notification as read
const markAsRead = async (notificationId) => {
  const response = await api().post(`/v1/notifications/${notificationId}/read`);
  return response.data;
};

// Mark all notifications as read
const markAllAsRead = async () => {
  const response = await api().post("/v1/notifications/read-all");
  return response.data;
};

const notificationsService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};

export default notificationsService;

