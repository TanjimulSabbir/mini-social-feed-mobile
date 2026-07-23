import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Post } from "@/types/app.types";
import { timeAgo } from "@/utils/date";

interface PostCardProps {
  post: Post;
  highlighted?: boolean;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => Promise<void> | void;
}

export function PostCard({ post, highlighted, onToggleLike, onAddComment }: PostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  async function submitComment() {
    const text = commentText.trim();
    if (!text) return;
    setPosting(true);
    try {
      await onAddComment(post.id, text);
      setCommentText("");
    } finally {
      setPosting(false);
    }
  }

  return (
    <View style={[styles.card, highlighted && styles.cardHighlighted]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.author.username[0]?.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.username}>{post.author.username}</Text>
          <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.body}>{post.text}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onToggleLike(post.id)}>
          <Ionicons
            name={post.likedByMe ? "heart" : "heart-outline"}
            size={20}
            color={post.likedByMe ? "#ef4444" : "#6b7280"}
          />
          <Text style={styles.actionText}>{post.likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setCommentsOpen((v) => !v)}>
          <Ionicons name="chatbubble-outline" size={19} color="#6b7280" />
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </TouchableOpacity>
      </View>

      {commentsOpen && (
        <View style={styles.commentsSection}>
          {post.comments?.map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <Text style={styles.commentAuthor}>{c.author.username}</Text>
              <Text style={styles.commentText}>{c.text}</Text>
            </View>
          ))}

          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment…"
              placeholderTextColor="#9ca3af"
              value={commentText}
              onChangeText={setCommentText}
              editable={!posting}
              onSubmitEditing={submitComment}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={submitComment} disabled={posting || !commentText.trim()}>
              {posting ? (
                <ActivityIndicator size="small" color="#4f46e5" />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={commentText.trim() ? "#4f46e5" : "#c7c9d1"}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHighlighted: { borderWidth: 2, borderColor: "#4f46e5" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: { color: "#fff", fontWeight: "700" },
  username: { fontWeight: "700", fontSize: 14, color: "#111827" },
  timestamp: { fontSize: 12, color: "#9ca3af" },
  body: { fontSize: 15, color: "#1f2937", lineHeight: 21, marginBottom: 12 },
  actions: { flexDirection: "row", gap: 20 },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontSize: 13, color: "#6b7280", fontWeight: "600" },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f2f4",
  },
  commentRow: { flexDirection: "row", gap: 6, marginBottom: 6 },
  commentAuthor: { fontWeight: "700", fontSize: 13, color: "#111827" },
  commentText: { fontSize: 13, color: "#374151", flexShrink: 1 },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: "#111827",
  },
});
