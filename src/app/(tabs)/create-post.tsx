import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "@/api/client";
import { postsApi } from "@/api/posts.api";
import { CForm } from "@/components/form/CForm";
import { CTextarea } from "@/components/form/CTextarea";

const MAX_LENGTH = 280;

export default function CreatePostScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Write something before posting.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await postsApi.createPost(trimmed);
      setText("");
      router.push("/(tabs)/feed");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't publish your post. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>New post</Text>
          <Text style={styles.subtitle}>Share a text update with everyone.</Text>

          <CTextarea
            placeholder="What's on your mind?"
            value={text}
            onChangeText={setText}
            maxLength={MAX_LENGTH}
            autoFocus
          />

          <CForm onSubmit={handleSubmit} submitLabel="Publish" submitting={submitting} formError={error}>
            <View />
          </CForm>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "800", color: "#111827", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
});
