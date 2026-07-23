import { StyleSheet } from "react-native";
export const SignupScreenStyles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#071A1B", // Deep dark teal
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "rgba(163, 230, 53, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#A3E635",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "rgba(20, 38, 38, 0.7)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
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
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#00A86B", // Lime Label Accent
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1516",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
    backgroundColor: "#00A86B", // Lime Green Accent
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#A3E635",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#071A1B", // Dark contrast text on Lime
    fontSize: 16,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  footerText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  link: {
    color: "#00A86B",
    fontWeight: "700",
    fontSize: 14,
  },
});
