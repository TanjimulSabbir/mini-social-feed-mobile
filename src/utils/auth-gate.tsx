import { syncPushTokenWithBackend } from "@/lib/push-notifications";
import { useNotificationResponseListener } from "@/hooks/notifications/useNotificationResponseListener";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import * as Notifications from "expo-notifications";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isHydrated, isAuthenticated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    syncPushTokenWithBackend();

    const sub = Notifications.addPushTokenListener(() => {
      syncPushTokenWithBackend();
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
