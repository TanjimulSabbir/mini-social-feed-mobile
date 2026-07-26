import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { notificationsStyles as styles } from "@/styles/notification.style";
import { Notification } from "@/types/notification.types";
import { formatTimeAgo } from "@/utils/date";

interface NotificationRowProps {
  notification: Notification;
  onPress: () => void;
}

function NotificationRowComponent({ notification, onPress }: NotificationRowProps) {
  const isLike = notification.type === "LIKE";
  const actorName = notification.actor?.name ?? "Someone";

  return (
    <TouchableOpacity
      style={[styles.row, !notification.isRead && styles.rowUnread]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${actorName} ${isLike ? "liked" : "commented on"} your post${
        notification.isRead ? "" : ", unread"
      }`}
    >
      <View style={[styles.iconBadge, isLike ? styles.iconBadgeLike : styles.iconBadgeComment]}>
        <Ionicons
          name={isLike ? "heart" : "chatbubble"}
          size={16}
          color={isLike ? COLORS.error : COLORS.active}
        />
      </View>

      <View style={styles.rowBody}>
        <Text style={styles.rowText}>
          <Text style={styles.rowUsername}>{actorName}</Text>{" "}
          {isLike ? "liked your post" : "commented on your post"}
        </Text>
        <Text style={styles.rowTime}>{formatTimeAgo(notification.createdAt)}</Text>
      </View>

      {!notification.isRead && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

export const NotificationRow = memo(NotificationRowComponent, (prev, next) => {
  return (
    prev.notification === next.notification &&
    prev.onPress === next.onPress
  );
});