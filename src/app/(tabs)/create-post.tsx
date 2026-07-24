import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { postApi } from "@/api/posts.api";
import { getErrorMessage } from "@/utils/error.utils";
import { PostCreateStyles as styles } from "@/styles/post.create.styles";

const MAX_CONTENT_LENGTH = 280;
const MAX_TITLE_LENGTH = 255; // matches Post.title @db.VarChar(255)

export default function CreatePostScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createPostMutation = useMutation({
    mutationFn: (payload: { title: string; content: string }) =>
      postApi.createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setTitle("");
      setContent("");
      router.push("/(tabs)/feed");
    },
    onError: (err) => {
      setError(getErrorMessage(err));
    },
  });

  function handleSubmit() {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("Give your post a title.");
      return;
    }
    if (!trimmedContent) {
      setError("Write something before posting.");
      return;
    }
    setError(null);
    createPostMutation.mutate({ title: trimmedTitle, content: trimmedContent });
  }

  const remainingChars = MAX_CONTENT_LENGTH - content.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>New Post</Text>

            <TouchableOpacity
              style={[
                styles.publishBtn,
                (!title.trim() || !content.trim() || createPostMutation.isPending) &&
                  styles.btnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!title.trim() || !content.trim() || createPostMutation.isPending}
              activeOpacity={0.8}
            >
              {createPostMutation.isPending ? (
                <ActivityIndicator size="small" color="#071A1B" />
              ) : (
                <Text style={styles.publishBtnText}>Publish</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {error && (
              <View style={styles.bannerError}>
                <Ionicons name="alert-circle-outline" size={16} color="#F87171" />
                <Text style={styles.bannerErrorText}>{error}</Text>
              </View>
            )}

            <TextInput
              style={styles.textarea}
              placeholder="Title"
              placeholderTextColor="#64748B"
              value={title}
              onChangeText={(val) => {
                setTitle(val);
                if (error) setError(null);
              }}
              maxLength={MAX_TITLE_LENGTH}
            />

            <TextInput
              style={styles.textarea}
              placeholder="What's happening?"
              placeholderTextColor="#64748B"
              value={content}
              onChangeText={(val) => {
                setContent(val);
                if (error) setError(null);
              }}
              maxLength={MAX_CONTENT_LENGTH}
              multiline
            />

            <View style={styles.cardFooter}>
              <Ionicons name="sparkles-outline" size={18} color="#A3E635" />
              <Text
                style={[
                  styles.charCountText,
                  remainingChars <= 20 && styles.charCountLimit,
                ]}
              >
                {remainingChars} characters left
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}