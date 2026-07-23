import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
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

import { useNotificationsStore } from "@/store/notifications.store";
import { AppNotification } from "@/types/app.types";
import { timeAgo } from "@/utils/date";

function NotificationRow({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, !notification.read && styles.rowUnread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={notification.type === "like" ? "heart" : "chatbubble"}
        size={20}
        color={notification.type === "like" ? "#ef4444" : "#4f46e5"}
        style={styles.rowIcon}
      />
      <View style={styles.rowBody}>
        <Text style={styles.rowText}>
          <Text style={styles.rowUsername}>{notification.fromUser.username}</Text>{" "}
          {notification.message}
        </Text>
        <Text style={styles.rowTime}>{timeAgo(notification.createdAt)}</Text>
      </View>
      {!notification.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { items, loading, fetch, markRead, markAllRead, unreadCount } = useNotificationsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  function handlePress(notification: AppNotification) {
    if (!notification.read) markRead(notification.id);
    router.push({ pathname: "/(tabs)/feed", params: { highlightPostId: notification.postId } });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => markAllRead()}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationRow notification={item} onPress={() => handlePress(item)} />
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetch} />}
        contentContainerStyle={items.length === 0 && styles.emptyContent}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color="#4f46e5" style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.centered}>
              <Ionicons name="notifications-outline" size={36} color="#d1d5db" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          )
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
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4f46e5", marginLeft: 8 },
  emptyContent: { flexGrow: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 8 },
  emptyText: { color: "#9ca3af", fontSize: 14 },
});
