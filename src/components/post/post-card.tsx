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

import { Post } from "@/types/post.types";
import { timeAgo } from "@/utils/date";
import { PostCardStyles as styles } from "@/styles/post.card.styles";

interface PostCardProps {
  post: Post & {
    likesCount?: number;
    commentsCount?: number;
    comments?: Array<{
      id: string;
      author: { username: string };
      text: string;
    }>;
  };
  highlighted?: boolean;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => Promise<void> | void;
}

export function PostCard({
  post,
  highlighted,
  onToggleLike,
  onAddComment,
}: PostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const likesCount = post._count?.likes ?? post.likesCount ?? 0;
  const commentsCount = post._count?.comments ?? post.commentsCount ?? 0;
  const authorName = post?.author?.name || "Anonymous";

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {authorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.username}>{authorName}</Text>
          <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
        </View>
      </View>

      {/* Post Body */}
      <Text style={styles.body}>{post.content}</Text>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            post.isLiked && styles.actionButtonActive,
          ]}
          onPress={() => onToggleLike(post.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={18}
            color={post.isLiked ? "#A3E635" : "#94A3B8"}
          />
          <Text
            style={[styles.actionText, post.isLiked && styles.actionTextActive]}
          >
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setCommentsOpen((v) => !v)}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={17} color="#94A3B8" />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {commentsOpen && (
        <View style={styles.commentsSection}>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <Text style={styles.commentAuthor}>@{c.author.username}</Text>
                <Text style={styles.commentText}>{c.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noCommentsText}>
              No comments yet. Be the first!
            </Text>
          )}

          {/* Comment Input */}
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a reply..."
              placeholderTextColor="#64748B"
              value={commentText}
              onChangeText={setCommentText}
              editable={!posting}
              onSubmitEditing={submitComment}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!commentText.trim() || posting) && styles.sendBtnDisabled,
              ]}
              onPress={submitComment}
              disabled={posting || !commentText.trim()}
            >
              {posting ? (
                <ActivityIndicator size="small" color="#071A1B" />
              ) : (
                <Ionicons name="send" size={15} color="#071A1B" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
