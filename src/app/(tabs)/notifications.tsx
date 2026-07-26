import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useMarkAllAsRead,
  useMarkAsRead,
} from "@/hooks/notifications/useNotificationMutations";
import {
  flattenNotifications,
  useNotificationsInfinite,
} from "@/hooks/notifications/userNotificationInfinite";
import { formatTimeAgo } from "@/utils/date";
import { StatusBar } from "expo-status-bar";

function NotificationRow({
  notification,
  onPress,
}: {
  notification: any;
  onPress: () => void;
}) {
  const isLike = notification.type === "LIKE";
  return (
    <TouchableOpacity
      style={[styles.row, !notification.isRead && styles.rowUnread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isLike ? "heart" : "chatbubble"}
        size={20}
        color={isLike ? "#ef4444" : "#4f46e5"}
        style={styles.rowIcon}
      />
      <View style={styles.rowBody}>
        <Text style={styles.rowText}>
          <Text style={styles.rowUsername}>
            {notification.actor?.name ?? "Someone"}
          </Text>{" "}
          {isLike ? "liked your post" : "commented on your post"}
        </Text>
        <Text style={styles.rowTime}>
          {formatTimeAgo(notification.createdAt)}
        </Text>
      </View>
      {!notification.isRead && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotificationsInfinite();

  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = useMemo(
    () => flattenNotifications(data?.pages),
    [data],
  );

  const unreadCount = data?.pages?.[0]?.unreadCount ?? 0;

  function handlePress(notification: any) {
    if (!notification.isRead) markAsRead.mutate(notification.id);
    if (notification.postId) {
      router.push({
        pathname: "/",
        params: { highlightPostId: notification.postId },
      });
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => markAllAsRead.mutate()}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationRow
            notification={item}
            onPress={() => handlePress(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        contentContainerStyle={
          notifications.length === 0 ? styles.emptyContent : undefined
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color="#4f46e5" style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.centered}>
              <Ionicons
                name="notifications-outline"
                size={36}
                color="#d1d5db"
              />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f4",
  },
  title: { fontSize: 20, fontWeight: "800", color: "#111827" },
  markAllText: { color: "#4f46e5", fontWeight: "600", fontSize: 13 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  rowUnread: { backgroundColor: "#f5f6ff" },
  rowIcon: { marginRight: 12 },
  rowBody: { flex: 1 },
  rowText: { fontSize: 14, color: "#374151" },
  rowUsername: { fontWeight: "700", color: "#111827" },
  rowTime: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4f46e5",
    marginLeft: 8,
  },
  emptyContent: { flexGrow: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyText: { color: "#9ca3af", fontSize: 14 },
});
