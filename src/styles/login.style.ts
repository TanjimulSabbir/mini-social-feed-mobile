import { StyleSheet } from "react-native";

export const LoginFormStyles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#0A1C1C",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
  },
  appName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#A3E635",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(0, 168, 107, 0.1)", // Green tint
    borderWidth: 1,
    borderColor: "rgba(0, 168, 107, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F8FAFC", // White
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#94A3B8", // Slate
    textAlign: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Dark semi-translucent card from vibe
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  bannerError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  bannerErrorText: {
    color: "#F87171",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#00A86B", // Green Accent
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A1C1C", // Match background
    borderWidth: 1,
    borderColor: "#232D42", // Subdued border
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputErrorBorder: {
    borderColor: "#EF4444",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 15,
  },
  fieldErrorText: {
    color: "#F87171",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
    marginLeft: 2,
  },
  submitBtn: {
    backgroundColor: "#00A86B", // Vibrant Lime-Yellow Accent from vibe
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#D4FF00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.65,
  },
  submitBtnText: {
    color: "#0A1C1C", // Dark text on lime background
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  link: {
    color: "#00A86B", // Lime Accent
    fontWeight: "700",
    fontSize: 14,
  },
});
