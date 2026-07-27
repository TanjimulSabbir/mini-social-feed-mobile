import { apiClient } from "./client";

interface GetNotificationsParams {
  page?: number;
  limit?: number;
}

const getMyNotifications = async ({ page, limit }: GetNotificationsParams) => {
  const res = await apiClient.get("/notifications", {
    params: { page, limit },
  });
  return res.data.data;
};

const markAsRead = async (notificationId: string) => {
  const res = await apiClient.patch(`/notifications/${notificationId}/read`);
  return res.data.data;
};

const markAllAsRead = async () => {
  const res = await apiClient.patch("/notifications/read-all");
  return res.data.data;
};

const updateFcmToken = async (fcmToken: string) => {
  const res = await apiClient.patch("/users/device/update-fcm-token", {
    fcmToken,
  });
  return res.data.data;
};

export const notificationApi = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  updateFcmToken,
};
