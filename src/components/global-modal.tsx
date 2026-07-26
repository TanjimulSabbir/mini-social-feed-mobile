// components/global-modal.tsx
import { Ionicons } from "@expo/vector-icons";
import httpStatus from "http-status";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useModalStore } from "@/store/modal.store";

function getPresentation(statusCode: number | null) {
  if (statusCode === null) {
    return {
      icon: "wifi-outline" as const,
      color: "#F87171",
      title: "Connection problem",
    };
  }

  switch (statusCode) {
    case httpStatus.UNAUTHORIZED:
      return {
        icon: "lock-closed-outline" as const,
        color: "#F87171",
        title: "Not authorized",
      };
    case httpStatus.FORBIDDEN:
      return {
        icon: "shield-outline" as const,
        color: "#F87171",
        title: "Access denied",
      };
    case httpStatus.NOT_FOUND:
      return {
        icon: "search-outline" as const,
        color: "#F87171",
        title: "Not found",
      };
    case httpStatus.INTERNAL_SERVER_ERROR:
    case httpStatus.BAD_GATEWAY:
    case httpStatus.SERVICE_UNAVAILABLE:
      return {
        icon: "server-outline" as const,
        color: "#F87171",
        title: "Server error",
      };
  }

  if (statusCode >= 400 && statusCode < 500) {
    return {
      icon: "alert-circle-outline" as const,
      color: "#F87171",
      title: "Invalid request",
    };
  }

  if (statusCode >= 500) {
    return {
      icon: "server-outline" as const,
      color: "#F87171",
      title: "Server error",
    };
  }

  if (statusCode >= 200 && statusCode < 300) {
    return {
      icon: "checkmark-circle" as const,
      color: "#A3E635",
      title: "Success",
    };
  }

  return {
    icon: "information-circle" as const,
    color: "#A3E635",
    title: "Notice",
  };
}

export function GlobalModal() {
  const queue = useModalStore((s) => s.queue);
  const dismiss = useModalStore((s) => s.dismiss);
  const current = queue[0];
  const isVisible = !!current;

  const presentation = current ? getPresentation(current.statusCode) : null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={dismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {presentation && (
            <Ionicons
              name={presentation.icon}
              size={32}
              color={presentation.color}
              style={styles.icon}
            />
          )}
          {presentation && (
            <Text style={styles.title}>{presentation.title}</Text>
          )}
          <Text style={styles.message}>{current?.message}</Text>
          <Pressable style={styles.button} onPress={dismiss}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#0F1F1F",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  icon: { marginBottom: 10 },
  title: { fontSize: 16, fontWeight: "800", color: "#F8FAFC", marginBottom: 8 },
  message: {
    fontSize: 14,
    color: "#CBD5E1",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#A3E635",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
  },
  buttonText: { color: "#071A1B", fontWeight: "800", fontSize: 14 },
});
