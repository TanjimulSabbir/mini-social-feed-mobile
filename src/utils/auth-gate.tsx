import { useNotificationResponseListener } from "@/hooks/notifications/useNotificationResponseListener";
import {
  sendTokenToBackend,
  syncPushTokenWithBackend,
} from "@/lib/push-notifications";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import * as Notifications from "expo-notifications";

import { COLORS } from "@/constants/theme";

function AuthGate({ children }: { children: React.ReactNode }) {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrate = useAuthStore((s) => s.hydrate);

  const hasSyncedRef = useRef(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) {
      hasSyncedRef.current = false;
      return;
    }

    if (!hasSyncedRef.current) {
      hasSyncedRef.current = true;
      syncPushTokenWithBackend().catch((err) => {
        console.warn("Push token sync failed:", err);
      });
    }

    const sub = Notifications.addPushTokenListener((event) => {
      sendTokenToBackend(event.data);
    });

    return () => sub.remove();
  }, [isHydrated, isAuthenticated]);

  useNotificationResponseListener();

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.active} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = {
  loadingContainer: {
    flex: 1 as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: COLORS.background,
  },
};

export default AuthGate;
