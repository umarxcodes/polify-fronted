import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../api/notificationsApi";

export const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
