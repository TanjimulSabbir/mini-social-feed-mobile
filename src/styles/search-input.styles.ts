import { StyleSheet } from "react-native";

export const searchBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0F2B2D",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: "#EAF5F5",
    fontSize: 15,
    paddingVertical: 0,
  },
});