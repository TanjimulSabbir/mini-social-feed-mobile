import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { postApi } from "@/api/posts.api";
import { COLORS } from "@/constants/theme";
import { generateRandomPost } from "@/data/generate.post";
import { PostCreateStyles as styles } from "@/styles/post.create.styles";
import { getErrorMessage } from "@/utils/error.utils";

const MAX_TITLE_LENGTH = 255;
const MAX_CONTENT_LENGTH = 5000;

export default function CreatePostScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);

  const hasUnsavedChanges =
    title.trim().length > 0 || content.trim().length > 0;

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

  const isBusy = createPostMutation.isPending;

  const handleClose = useCallback(() => {
    if (isBusy) return;

    if (!hasUnsavedChanges) {
      router.back();
      return;
    }

    Alert.alert(
      "Discard post?",
      "You have unsaved changes. If you leave now, they'll be lost.",
      [
        { text: "Keep editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
  }, [hasUnsavedChanges, isBusy, router]);

  const handleGeneratePost = useCallback(() => {
    const generated = generateRandomPost(title);
    setTitle(generated.title);
    setContent(generated.content);
    if (error) setError(null);
  }, [title, error]);

  const handleSubmit = useCallback(() => {
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
  }, [title, content, createPostMutation]);

  const contentLength = content.length;
  const isPublishDisabled = !title.trim() || !content.trim() || isBusy;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed,
                isBusy && styles.btnDisabled,
              ]}
              onPress={handleClose}
              disabled={isBusy}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel={
                hasUnsavedChanges ? "Discard and close" : "Close"
              }
            >
              <Ionicons name="close" size={22} color={COLORS.text} />
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
              accessibilityRole="button"
              accessibilityState={{ disabled: isPublishDisabled, busy: isBusy }}
            >
              {isBusy ? (
                <ActivityIndicator size="small" color={COLORS.background} />
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
                    color={
                      isPublishDisabled ? COLORS.inactive : COLORS.background
                    }
                  />
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.card}>
            {error && (
              <View style={styles.bannerError} accessibilityLiveRegion="polite">
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={COLORS.badge}
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
                style={styles.titleInput}
                placeholder="Title your post..."
                placeholderTextColor={COLORS.placeholderText}
                value={title}
                onChangeText={(val) => {
                  setTitle(val);
                  if (error) setError(null);
                }}
                onFocus={() => setIsTitleFocused(true)}
                onBlur={() => setIsTitleFocused(false)}
                maxLength={MAX_TITLE_LENGTH}
                editable={!isBusy}
                accessibilityLabel="Post title"
              />
            </View>

            <View
              style={[
                styles.contentInputContainer,
                isContentFocused && styles.inputFocused,
              ]}
            >
              <TextInput
                style={styles.contentInput}
                placeholder="What's on your mind?"
                placeholderTextColor={COLORS.placeholderText}
                value={content}
                onChangeText={(val) => {
                  setContent(val);
                  if (error) setError(null);
                }}
                onFocus={() => setIsContentFocused(true)}
                onBlur={() => setIsContentFocused(false)}
                multiline
                textAlignVertical="top"
                maxLength={MAX_CONTENT_LENGTH}
                editable={!isBusy}
                accessibilityLabel="Post content"
              />
            </View>

            <View style={styles.cardFooter}>
              <Pressable
                style={({ pressed }) => [
                  styles.generateBtn,
                  pressed && styles.generateBtnPressed,
                ]}
                onPress={handleGeneratePost}
                disabled={isBusy}
                accessibilityRole="button"
                accessibilityLabel="Generate a random post"
              >
                <Ionicons name="sparkles" size={14} color={COLORS.active} />
                <Text style={styles.generateBtnText}>Generate Post</Text>
              </Pressable>

              <View style={styles.charCountBadge}>
                <Text style={styles.charCountText}>
                  {contentLength}/{MAX_CONTENT_LENGTH}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
