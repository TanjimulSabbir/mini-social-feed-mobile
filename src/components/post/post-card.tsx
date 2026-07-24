import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useCreateComment } from "@/hooks/useCommentMutations";
import { Post } from "@/types/post.types";

interface PostCardProps {
  post: Post;
  highlighted?: boolean;
  onToggleLike: (postId: string) => void;
}

export function PostCard({ post, highlighted, onToggleLike }: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const createComment = useCreateComment();

  const likesCount = post._count?.likes ?? 0;
  const commentsCount = post._count?.comments ?? 0;
  const authorName = post.author?.name ?? "Anonymous";

  function handleSubmitComment() {
    const trimmed = commentText.trim();
    if (!trimmed || createComment.isPending) return;
    createComment.mutate({ postId: post.id, content: trimmed });
    setCommentText("");
  }

  return (
    <View style={[styles.card, highlighted && styles.cardHighlighted]}>
      {/* Header / Author Section */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {authorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.titleText}>{post.title}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Action Bar */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, post.isLiked && styles.actionBtnActive]}
          onPress={() => onToggleLike(post.id)}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={18}
            color={post.isLiked ? "#A3E635" : "#94A3B8"}
          />
          <Text style={[styles.actionText, post.isLiked && styles.actionTextActive]}>
            {likesCount}
          </Text>
        </Pressable>

        <View style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={17} color="#94A3B8" />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </View>
      </View>

      {/* Comment Input Row */}
      <View style={styles.commentInputRow}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment…"
          placeholderTextColor="#64748B"
          value={commentText}
          onChangeText={setCommentText}
          onSubmitEditing={handleSubmitComment}
          returnKeyType="send"
        />
        <Pressable
          style={[
            styles.sendBtn,
            (!commentText.trim() || createComment.isPending) && styles.sendBtnDisabled,
          ]}
          onPress={handleSubmitComment}
          disabled={!commentText.trim() || createComment.isPending}
        >
          {createComment.isPending ? (
            <ActivityIndicator size="small" color="#071A1B" />
          ) : (
            <Ionicons name="send" size={15} color="#071A1B" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(20, 38, 38, 0.75)", // Dark teal card background
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardHighlighted: {
    borderColor: "#A3E635",
    borderWidth: 1.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(163, 230, 53, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#A3E635",
    fontWeight: "800",
    fontSize: 16,
  },
  headerInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#A3E635",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  content: {
    fontSize: 14,
    color: "#E2E8F0",
    lineHeight: 22,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  actionBtnActive: {
    backgroundColor: "rgba(163, 230, 53, 0.12)",
    borderColor: "rgba(163, 230, 53, 0.25)",
  },
  actionText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "600",
  },
  actionTextActive: {
    color: "#A3E635",
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#0B1516",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#F8FAFC",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#A3E635",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});