import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
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

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
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

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenResponse = await Notifications.getDevicePushTokenAsync();

  // Note: getDevicePushTokenAsync returns the native FCM/APNs token directly —
  // this is what your backend's firebase-admin `getMessaging().send()` expects,
  // NOT the Expo push token (getExpoPushTokenAsync), since your backend calls
  // FCM directly rather than going through Expo's push service.
  return tokenResponse.data;
}

export async function syncPushTokenWithBackend() {
  const token = await registerForPushNotificationsAsync();
  if (!token) return;

  try {
    await notificationApi.updateFcmToken(token);
  } catch (err) {
    console.error("Failed to sync FCM token:", err);
  }
}
