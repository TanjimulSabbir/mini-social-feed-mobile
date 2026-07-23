import { useEffect } from "react";
import { AppState } from "react-native";

import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";

/**
 * Keeps the notifications store fresh while the user is logged in, by
 * polling GET /notifications on an interval (see notifications.store.ts).
 *
 * This replaces FCM push for now: Expo Go dropped support for remote push
 * notifications (expo-notifications) starting SDK 53, so push would require
 * a custom dev client (`npx expo install expo-dev-client` +
 * `npx expo run:android`) instead of Expo Go. Polling needs no extra native
 * config and works the same in Expo Go, a dev build, or a production APK.
 *
 * Mount once near the app root.
 */
export function useNotificationsPoller() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const startPolling = useNotificationsStore((s) => s.startPolling);
  const stopPolling = useNotificationsStore((s) => s.stopPolling);
  const fetchNotifications = useNotificationsStore((s) => s.fetch);

  useEffect(() => {
    if (!isAuthenticated) {
      stopPolling();
      return;
    }

    startPolling();

    // Also refresh immediately whenever the app comes back to the foreground,
    // so returning from the background doesn't wait for the next tick.
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") fetchNotifications();
    });

    return () => {
      stopPolling();
      subscription.remove();
    };
  }, [isAuthenticated, startPolling, stopPolling, fetchNotifications]);
}
