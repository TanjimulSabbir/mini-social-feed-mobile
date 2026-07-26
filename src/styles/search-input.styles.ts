import { StyleSheet } from "react-native";

export const searchBarStyles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  SearchBarcontainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(11, 21, 22, 0.85)",
    borderRadius: 16,
    paddingHorizontal:12,
    height: 48,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
SearchBarcontainerFocused: {
    borderColor: "#A3E635",
    backgroundColor: "#071213",
    shadowColor: "#A3E635",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  searchIcon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 0,
    height: "100%",
    outlineStyle: "dashed",
    outlineWidth: 0,
  },
  clearBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  clearBtnPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },
});