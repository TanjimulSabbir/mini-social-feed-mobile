import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNotificationsInfinite } from "@/hooks/notifications/userNotificationInfinite";
import { useAuthStore } from "@/store/auth.store";
import { COLORS } from "@/constants/theme";

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const { data } = useNotificationsInfinite({
    enabled: isAuthenticated && isHydrated,
  });
  const insets = useSafeAreaInsets();

  const unreadCount = data?.pages?.[0]?.unreadCount ?? 0;

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.active,
          tabBarInactiveTintColor: COLORS.inactive,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
          tabBarBadgeStyle: {
            backgroundColor: COLORS.badge,
            color: "#0A1C1C",
            fontSize: 10,
            fontWeight: "700",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Feed",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create-post"
          options={{
            title: "Post",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Alerts",
            tabBarBadge:
              unreadCount > 0 ? Math.min(unreadCount, 99) : undefined,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
