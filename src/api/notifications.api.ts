import { apiRequest } from "./client";
import { AppNotification, PaginatedResponse } from "@/types/app.types";


export const notificationsApi = {
  getNotifications: (page = 1) =>
    apiRequest<PaginatedResponse<AppNotification>>("/notifications", {
      query: { page },
    }),

  markRead: (notificationId: string) =>
    apiRequest<void>(`/notifications/${notificationId}/read`, {
      method: "POST",
    }),

  markAllRead: () =>
    apiRequest<void>("/notifications/read-all", {
      method: "POST",
    }),
};
