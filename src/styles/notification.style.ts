import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const notificationsStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  markAllText: {
    color: COLORS.active,
    fontWeight: "600",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowUnread: {
    backgroundColor: COLORS.surface,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconBadgeLike: {
    backgroundColor: "rgba(248, 113, 113, 0.15)", // COLORS.error tint
  },
  iconBadgeComment: {
    backgroundColor: "rgba(163, 230, 53, 0.15)", // COLORS.active tint
  },
  rowBody: {
    flex: 1,
  },
  rowText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 19,
  },
  rowUsername: {
    fontWeight: "700",
    color: COLORS.text,
  },
  rowTime: {
    fontSize: 12,
    color: COLORS.inactive,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.active,
    marginLeft: 8,
  },
  emptyContent: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyText: {
    color: COLORS.inactive,
    fontSize: 14,
  },
  footerLoader: {
    marginVertical: 16,
  },
});