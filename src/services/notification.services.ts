import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { notificationApi } from "@/api/notifications.api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn("Push notifications require a physical device.");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Push notification permission denied.");
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const pushToken = tokenData.data;

    try {
      await notificationApi.registerPushToken({
        fcmToken: pushToken,
      });
    } catch (err) {
      console.warn("Failed to register push token with backend:", err);
    }

    return pushToken;
  },

  addNotificationListener(
    callback: (notification: Notifications.Notification) => void,
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void,
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },
};
