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
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
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
    letterSpacing: -0.3,
  },
  publishBtn: {
    backgroundColor: "#A3E635",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 84,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A3E635",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
  publishBtnText: {
    color: "#071A1B",
    fontSize: 14,
    fontWeight: "800",
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(20, 38, 38, 0.75)",
    borderRadius: 24,
    padding: 18,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  bannerErrorText: {
    color: "#F87171",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },
  
  /* Title Input */
  titleInput: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
    backgroundColor: "rgba(7, 26, 27, 0.5)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent", 
    outlineStyle: "dashed",       
    outlineWidth: 0,
  },
  titleInputFocused: {
    borderColor: "#A3E635",      
    backgroundColor: "rgba(7, 26, 27, 0.8)",
  },

  /* Content Input Container */
  contentInputContainer: {
    flex: 1,
    backgroundColor: "rgba(7, 26, 27, 0.5)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "transparent",
  },
  contentInputContainerFocused: {
    borderColor: "#A3E635",      
    backgroundColor: "rgba(7, 26, 27, 0.8)",
  },
  contentInput: {
    flex: 1,
    fontSize: 15,
    color: "#E2E8F0",
    textAlignVertical: "top",
    lineHeight: 22,
    borderWidth: 0,
    outlineStyle: "dashed",        // Updated from 'dotted' to 'none'
    outlineWidth: 0,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
  },
  charCountGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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