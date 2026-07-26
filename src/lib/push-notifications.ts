import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { notificationApi } from "@/api/notification.api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

let lastSyncedToken: string | null = null;

export async function sendTokenToBackend(token: string) {
  if (!token || token === lastSyncedToken) return;
  try {
    await notificationApi.updateFcmToken(token);
    lastSyncedToken = token;
    console.log("FCM token synced successfully");
  } catch (err: any) {
    console.error(
      "Failed to sync FCM token —",
      "name:", err?.name,
      "message:", err?.message,
      "status:", err?.response?.status,
      "data:", err?.response?.data,
    );
  }
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Push notification permission not granted");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#A3E635",
    });
  }

  const tokenResponse = await Notifications.getDevicePushTokenAsync();
  return tokenResponse.data;
}

export async function syncPushTokenWithBackend() {
  const token = await registerForPushNotificationsAsync();
  if (!token) {
    console.warn("No push token to sync");
    return;
  }
  await sendTokenToBackend(token);
}