import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.iconBadge}>
          <Ionicons name="compass-outline" size={32} color="#A3E635" />
        </View>

        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>
          This screen does not exist or may have been moved.
        </Text>

        <Link href="/(tabs)" style={styles.link}>
          <View style={styles.linkButton}>
            <Ionicons name="home-outline" size={16} color="#071A1B" />
            <Text style={styles.linkText}>Back to feed</Text>
          </View>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#071A1B",
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0F2B2D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EAF5F5",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#8FA3A3",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },
  link: {
    borderRadius: 10,
    overflow: "hidden",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#A3E635",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  linkText: {
    color: "#071A1B",
    fontWeight: "700",
    fontSize: 14,
  },
});