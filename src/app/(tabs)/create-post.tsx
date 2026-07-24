import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { postApi } from "@/api/posts.api";
import { PostCreateStyles as styles } from "@/styles/post.create.styles";
import { getErrorMessage } from "@/utils/error.utils";
import { generateRandomPost } from "@/data/generate.post";

const MAX_TITLE_LENGTH = 255;

export default function CreatePostScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: (payload: { title: string; content: string }) =>
      postApi.createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setTitle("");
      setContent("");
      router.back();
    },
    onError: (err) => {
      setError(getErrorMessage(err));
    },
  });

  function handleGeneratePost() {
    const generated = generateRandomPost(title);
    setTitle(generated.title);
    setContent(generated.content);
    if (error) setError(null);
  }

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

  const contentLength = content.length;
  const isPublishDisabled =
    !title.trim() || !content.trim() || createPostMutation.isPending;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Header Bar */}
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed,
              ]}
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={20} color="#CBD5E1" />
            </Pressable>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>New Post</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.publishBtn,
                isPublishDisabled && styles.btnDisabled,
                pressed && !isPublishDisabled && styles.publishBtnPressed,
              ]}
              onPress={handleSubmit}
              disabled={isPublishDisabled}
            >
              {createPostMutation.isPending ? (
                <ActivityIndicator size="small" color="#071A1B" />
              ) : (
                <View style={styles.publishBtnContent}>
                  <Text
                    style={[
                      styles.publishBtnText,
                      isPublishDisabled && styles.publishBtnTextDisabled,
                    ]}
                  >
                    Publish
                  </Text>
                  <Ionicons
                    name="arrow-up"
                    size={14}
                    color={isPublishDisabled ? "#64748B" : "#071A1B"}
                  />
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.card}>
            {error && (
              <View style={styles.bannerError}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color="#F87171"
                />
                <Text style={styles.bannerErrorText}>{error}</Text>
              </View>
            )}

            <View
              style={[
                styles.titleInputContainer,
                isTitleFocused && styles.inputFocused,
              ]}
            >
              <TextInput
                style={[styles.titleInput, { outlineStyle: "none" } as any]}
                placeholder="Title your post..."
                placeholderTextColor="#64748B"
                value={title}
                onChangeText={(val) => {
                  setTitle(val);
                  if (error) setError(null);
                }}
                onFocus={() => setIsTitleFocused(true)}
                onBlur={() => setIsTitleFocused(false)}
                maxLength={MAX_TITLE_LENGTH}
              />
            </View>

            <View
              style={[
                styles.contentInputContainer,
                isContentFocused && styles.inputFocused,
              ]}
            >
              <TextInput
                style={[styles.contentInput, { outlineStyle: "none" } as any]}
                placeholder="What's on your mind?"
                placeholderTextColor="#64748B"
                value={content}
                onChangeText={(val) => {
                  setContent(val);
                  if (error) setError(null);
                }}
                onFocus={() => setIsContentFocused(true)}
                onBlur={() => setIsContentFocused(false)}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.cardFooter}>
              <Pressable
                style={({ pressed }) => [
                  styles.generateBtn,
                  pressed && styles.generateBtnPressed,
                ]}
                onPress={handleGeneratePost}
              >
                <Ionicons name="sparkles" size={14} color="#A3E635" />
                <Text style={styles.generateBtnText}>Generate Post</Text>
              </Pressable>

              <View style={[styles.charCountBadge]}>
                <Text style={[styles.charCountText]}>
                  {contentLength} Characters
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
