import { StyleSheet } from "react-native";

export const PostCreateStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#071A1B", // Deep dark teal
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  publishBtn: {
    backgroundColor: "#A3E635", // Lime Green Accent
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  publishBtnText: {
    color: "#071A1B",
    fontSize: 14,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "rgba(20, 38, 38, 0.75)", // Glassmorphic dark-teal
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  bannerError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  bannerErrorText: {
    color: "#F87171",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 6,
    flex: 1,
  },
  textarea: {
    fontSize: 16,
    color: "#F8FAFC",
    minHeight: 160,
    textAlignVertical: "top",
    lineHeight: 24,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  charCountText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  charCountLimit: {
    color: "#F87171",
  },
});