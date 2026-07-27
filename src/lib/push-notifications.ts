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
  Alert.alert(
    "ধাপ ৪",
    `টোকেন ব্যাকএন্ডে পাঠানো হচ্ছে:\n${deviceToken.slice(0, 30)}...`,
  );

  if (!deviceToken) return;
  if (lastSyncedToken === deviceToken) {
    Alert.alert("ধাপ ৪ স্কিপ", "এই টোকেন আগেই সিঙ্ক করা হয়েছে, কিছু করার দরকার নেই।");
    return;
  }

  let backendToken: string | null = null;

  try {
    const accessToken = await storageService.getAccessToken();
    if (accessToken) {
      const user = jwtDecode<DecodedUser>(accessToken);
      backendToken = user.fcmToken ?? null;
      Alert.alert(
        "ধাপ ৪ক",
        `JWT-তে থাকা fcmToken: ${backendToken ?? "নেই"}\nনতুন ডিভাইস টোকেন: ${deviceToken.slice(0, 20)}...`,
      );
    }
  } catch (error) {
    Alert.alert("ধাপ ৪ক — ডিকোড ব্যর্থ", String(error));
    console.warn("Failed to decode access token.");
  }

  if (backendToken === deviceToken) {
    lastSyncedToken = deviceToken;
    Alert.alert("ধাপ ৪খ", "ব্যাকএন্ডে ইতিমধ্যে এই টোকেন আছে — আপডেট স্কিপ করা হচ্ছে।");
    return;
  }

  try {
    Alert.alert("ধাপ ৫", "notificationApi.updateFcmToken কল করা হচ্ছে...");
    await notificationApi.updateFcmToken(deviceToken);
    lastSyncedToken = deviceToken;
    Alert.alert("✅ ধাপ ৫ সফল", "FCM টোকেন ব্যাকএন্ডে সিঙ্ক হয়ে গেছে।");
    console.log("FCM token synced successfully");
  } catch (err: any) {
    const details = [
      `message: ${err?.message}`,
      `status: ${err?.response?.status}`,
      `data: ${JSON.stringify(err?.response?.data)}`,
      `code: ${err?.code}`,
    ].join("\n");

    Alert.alert("❌ ধাপ ৫ ব্যর্থ", details);
    console.error("Failed to sync FCM token:", details);
  }
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    Alert.alert("পুশ নোটিফিকেশনের জন্য একটি ফিজিক্যাল ডিভাইস প্রয়োজন।");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("ধাপ ১ ব্যর্থ", `পারমিশন দেওয়া হয়নি। স্ট্যাটাস: ${finalStatus}`);
    return null;
  }

  Alert.alert("ধাপ ১ ✅", "পারমিশন পাওয়া গেছে। নোটিফিকেশন চ্যানেল সেট করা হচ্ছে...");

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      lightColor: "#A3E635",
    });
  }

  Alert.alert("ধাপ ২ ✅", "চ্যানেল কনফিগার হয়ে গেছে। ডিভাইস পুশ টোকেন আনা হচ্ছে...");

  try {
    const token = await Notifications.getDevicePushTokenAsync();
    Alert.alert("ধাপ ৩ ✅", `টোকেন তৈরি হয়েছে:\n${token.data.slice(0, 30)}...`);
    return token.data;
  } catch (err: any) {
    Alert.alert("ধাপ ৩ ব্যর্থ", `টোকেন তৈরি করার সময় এরর হয়েছে:\n${err?.message ?? String(err)}`);
    return null;
  }
}

export async function syncPushTokenWithBackend() {
  const token = await registerForPushNotificationsAsync();

  if (!token) {
    Alert.alert("সিঙ্ক থেমে গেছে", "কোনো টোকেন তৈরি হয়নি — উপরের ব্যর্থ ধাপটি দেখুন।");
    return;
  }

  await sendTokenToBackend(token);
}