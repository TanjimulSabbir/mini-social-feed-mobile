import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, Alert, FlatList, ListRenderItem, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NotificationRow } from "@/components/norifications/notification-row";
import { COLORS } from "@/constants/theme";
import {
  useMarkAllAsRead,
  useMarkAsRead,
} from "@/hooks/notifications/useNotificationMutations";
import {
  flattenNotifications,
  useNotificationsInfinite,
} from "@/hooks/notifications/userNotificationInfinite";
import { notificationsStyles as styles } from "@/styles/notification.style";
import { Notification } from "@/types/notification.types";

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

  const notifications = useMemo(() => flattenNotifications(data?.pages), [data]);
  const unreadCount = data?.pages?.[0]?.unreadCount ?? 0;

  const handlePress = useCallback(
    (notification: Notification) => {
      if (!notification.isRead) {
        markAsRead.mutate(notification.id, {
          onError: () => {
          },
        });
      }
      if (notification.postId) {
        router.push({
          pathname: "/",
          params: { highlightPostId: notification.postId },
        });
      }
    },
    [markAsRead, router],
  );

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead.mutate(undefined, {
      onError: () => {
        Alert.alert("Couldn't mark all as read", "Please try again.");
      },
    });
  }, [markAllAsRead]);

  const renderItem: ListRenderItem<Notification> = useCallback(
    ({ item }) => <NotificationRow notification={item} onPress={() => handlePress(item)} />,
    [handlePress],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            disabled={markAllAsRead.isPending}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
          >
            {markAllAsRead.isPending ? (
              <ActivityIndicator size="small" color={COLORS.active} />
            ) : (
              <Text style={styles.markAllText}>Mark all read</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={COLORS.active}
            colors={[COLORS.active]}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        contentContainerStyle={notifications.length === 0 ? styles.emptyContent : undefined}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={7}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={COLORS.active} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.centered}>
              <View style={styles.emptyIconBadge}>
                <Ionicons name="notifications-outline" size={30} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footerLoader} color={COLORS.active} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}