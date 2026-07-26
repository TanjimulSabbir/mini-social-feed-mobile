import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { jwtDecode } from "jwt-decode";
import { Alert, Platform } from "react-native";

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

  if (lastSyncedToken === deviceToken) return;

  let backendToken: string | null = null;

  try {
    const accessToken = await storageService.getAccessToken();
    Alert.alert(accessToken ?? "AccessToken not found");
    if (accessToken) {
      const user = jwtDecode<DecodedUser>(accessToken);
      backendToken = user.fcmToken ?? null;
    }
  } catch (error) {
    console.warn("Failed to decode access token.");
  }

  // Backend already has the latest token
  if (backendToken === deviceToken) {
    lastSyncedToken = deviceToken;
    return;
  }

  try {
    await notificationApi.updateFcmToken(deviceToken);

    lastSyncedToken = deviceToken;

    console.log("✅ FCM token synced successfully");
  } catch (err: any) {
    console.error(
      "Failed to sync FCM token",
      "\nname:",
      err?.name,
      "\nmessage:",
      err?.message,
      "\nstatus:",
      err?.response?.status,
      "\ndata:",
      err?.response?.data,
    );
  }
}

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  if (!Device.isDevice) {
    Alert.alert("Push notifications require a physical device.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Push notification permission not granted.");
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

  const token = await Notifications.getDevicePushTokenAsync();

  return token.data;
}

export async function syncPushTokenWithBackend() {
  const token = await registerForPushNotificationsAsync();

  if (!token) {
    console.warn("No FCM token available.");
    return;
  }

  // await sendTokenToBackend(token);
}
