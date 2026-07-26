import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useErrorStore } from "@/store/error.store";

export function ErrorModal() {
  const { isVisible, title, message, info, hideError } = useErrorStore();
  const hasInfo = info && Object.keys(info).length > 0;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={hideError}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="alert-circle" size={32} color="#F87171" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {hasInfo && (
            <ScrollView style={styles.infoBox} horizontal={false}>
              <Text style={styles.infoText}>
                {JSON.stringify(info, null, 2)}
              </Text>
            </ScrollView>
          )}

          <Pressable style={styles.button} onPress={hideError}>
            <Text style={styles.buttonText}>Dismiss</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#0F1F1F",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.25)",
    alignItems: "center",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(248, 113, 113, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#CBD5E1",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  infoBox: {
    maxHeight: 120,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: "monospace",
  },
  button: {
    backgroundColor: "#A3E635",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#071A1B",
    fontWeight: "800",
    fontSize: 14,
  },
});