import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";

import { notificationApi } from "@/api/notification.api";
import { storageService } from "@/services/storage.services";
import { DecodedUser } from "@/types/auth.types";

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

export async function sendTokenToBackend(deviceToken: string) {
  if (!deviceToken) return;
  if (lastSyncedToken === deviceToken) {
    return;
  }

  let backendToken: string | null = null;

  try {
    const accessToken = await storageService.getAccessToken();
    if (accessToken) {
      const user = jwtDecode<DecodedUser>(accessToken);
      backendToken = user.fcmToken ?? null;
    }
  } catch (error) {
    console.warn("Failed to decode access token.");
  }

  if (backendToken === deviceToken) {
    lastSyncedToken = deviceToken;
    return;
  }

  try {
    await notificationApi.updateFcmToken(deviceToken);
    lastSyncedToken = deviceToken;
    console.log("FCM token synced successfully");
  } catch (err: any) {
    const details = [
      `message: ${err?.message}`,
      `status: ${err?.response?.status}`,
      `data: ${JSON.stringify(err?.response?.data)}`,
      `code: ${err?.code}`,
    ].join("\n");

    console.error("Failed to sync FCM token:", details);
  }
}

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      lightColor: "#A3E635",
    });
  }

  try {
    const token = await Notifications.getDevicePushTokenAsync();
    return token.data;
  } catch (err: any) {
    return null;
  }
}

export async function syncPushTokenWithBackend() {
  const token = await registerForPushNotificationsAsync();

  if (!token) {
    return;
  }

  await sendTokenToBackend(token);
}
