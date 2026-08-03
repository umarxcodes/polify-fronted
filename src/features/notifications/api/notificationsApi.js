import { apiClient } from "../../../lib/axios";

export const getNotifications = async () => {
  const { data } = await apiClient.get("/notifications");
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await apiClient.get("/notifications/unread-count");
  return data;
};

export const markAsRead = async (id) => {
  const { data } = await apiClient.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await apiClient.patch("/notifications/read-all");
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await apiClient.delete(`/notifications/${id}`);
  return data;
};

export const deleteAllNotifications = async () => {
  const { data } = await apiClient.delete("/notifications");
  return data;
};
