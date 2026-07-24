import { apiClient } from "@/api/client";
import { ApiResponse } from "@/types/auth.types";

export const notificationApi = {
  async registerPushToken(payload: { fcmToken: string }): Promise<void> {
    await apiClient.post<ApiResponse<unknown>>(
      `/users/device/update-fcm-token`,
      payload,
    );
  },
};
