import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { postCardStyles as styles } from "@/styles/post.card.styles";
import { Post } from "@/types/post.types";
import { formatTimeAgo } from "@/utils/date"; // or your relative time utility
import CommentInput from "./comment-bar";
import { CommentsModal } from "./comment-modal";

interface PostCardProps {
  post: Post;
  highlighted?: boolean;
  onToggleLike: (postId: string) => void;
  onSubmitComment?: (postId: string, text: string) => Promise<void> | void;
}

export function PostCard({ post, highlighted, onToggleLike }: PostCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const authorName = post?.author?.name ?? "Anonymous";
  const likesCount = post?._count?.likes ?? 0;
  const commentsCount = post?._count?.comments ?? 0;
  const isLikedByMe = post?.isLikedByMe ?? false;

  return (
    <>
      <View style={[styles.card, highlighted && styles.cardHighlighted]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {authorName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.authorName}>{authorName}</Text>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={12} color="#64748B" />
              <Text style={styles.globalTimeText}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Title & Body */}
        {post.title && <Text style={styles.titleText}>{post.title}</Text>}
        <Text style={styles.content}>{post.content}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Like Button */}
          <Pressable
            style={[styles.actionBtn, isLikedByMe && styles.actionBtnActive]}
            onPress={() => onToggleLike(post.id)}
          >
            <Ionicons
              name={isLikedByMe ? "heart" : "heart-outline"}
              size={18}
              color={isLikedByMe ? "#A3E635" : "#94A3B8"}
            />
            <Text
              style={[
                styles.actionText,
                isLikedByMe && styles.actionTextActive,
              ]}
            >
              {likesCount}
            </Text>
          </Pressable>

          {/* Comment Count Button (Opens Modal) */}
          <Pressable
            style={styles.actionBtn}
            onPress={() => setIsCommentsOpen(true)}
          >
            <Ionicons name="chatbubble-outline" size={17} color="#94A3B8" />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </Pressable>
        </View>

        <CommentInput
          value={commentText}
          onChangeText={setCommentText}
          postId={post.id}
        />
      </View>

      {/* Full Comments Modal */}
      <CommentsModal
        visible={isCommentsOpen}
        postId={post.id}
        onClose={() => setIsCommentsOpen(false)}
      />
    </>
  );
}
