import {
  syncPushTokenWithBackend,
  sendTokenToBackend,
} from "@/lib/push-notifications";
import { useNotificationResponseListener } from "@/hooks/notifications/useNotificationResponseListener";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import * as Notifications from "expo-notifications";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isHydrated, isAuthenticated, hydrate } = useAuthStore();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) {
      hasSyncedRef.current = false;
      return;
    }

    if (!hasSyncedRef.current) {
      hasSyncedRef.current = true;
      syncPushTokenWithBackend();
    }
    const sub = Notifications.addPushTokenListener((event) => {
      sendTokenToBackend(event.data);
    });

    return () => sub.remove();
  }, [isHydrated, isAuthenticated]);

  useNotificationResponseListener();

  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#071A1B",
        }}
      >
        <ActivityIndicator size="large" color="#A3E635" />
      </View>
    );
  }

  return <>{children}</>;
}

export default AuthGate;
