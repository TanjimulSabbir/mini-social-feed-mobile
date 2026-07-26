import { Ionicons } from "@expo/vector-icons";
import { memo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { postCardStyles as styles } from "@/styles/post.card.styles";
import { Post } from "@/types/post.types";
import { formatTimeAgo } from "@/utils/date";
import CommentInput from "./comment-bar";
import { CommentsModal } from "./comment-modal";

interface PostCardProps {
  post: Post;
  highlighted?: boolean;
  onToggleLike: (postId: string) => void;
}

function PostCardComponent({ post, highlighted, onToggleLike }: PostCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const authorName = post?.author?.name ?? "Anonymous";
  const likesCount = post?._count?.likes ?? 0;
  const commentsCount = post?._count?.comments ?? 0;
  const isLikedByMe = post?.isLikedByMe ?? false;

  return (
    <>
      <View style={[styles.card, highlighted && styles.cardHighlighted]}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{authorName.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.authorName} numberOfLines={1}>
              {authorName}
            </Text>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={12} color={COLORS.inactive} />
              <Text style={styles.globalTimeText}>{formatTimeAgo(post.createdAt)}</Text>
            </View>
          </View>
        </View>

        {post.title && (
          <Text style={styles.titleText} numberOfLines={3}>
            {post.title}
          </Text>
        )}
        <Text style={styles.content} numberOfLines={12}>
          {post.content}
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, isLikedByMe && styles.actionBtnActive]}
            onPress={() => onToggleLike(post.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={isLikedByMe ? "Unlike post" : "Like post"}
            accessibilityState={{ selected: isLikedByMe }}
          >
            <Ionicons
              name={isLikedByMe ? "heart" : "heart-outline"}
              size={18}
              color={isLikedByMe ? COLORS.active : COLORS.inactive}
            />
            <Text style={[styles.actionText, isLikedByMe && styles.actionTextActive]}>
              {likesCount}
            </Text>
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={() => setIsCommentsOpen(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`View ${commentsCount} comments`}
          >
            <Ionicons name="chatbubble-outline" size={17} color={COLORS.inactive} />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </Pressable>
        </View>

        <CommentInput value={commentText} onChangeText={setCommentText} postId={post.id} />
      </View>

      <CommentsModal
        visible={isCommentsOpen}
        postId={post.id}
        onClose={() => setIsCommentsOpen(false)}
      />
    </>
  );
}

// The Feed's FlatList re-renders on every keystroke in the search bar (parent
// state change). Without memo, every visible PostCard re-renders too, even
// though its own `post` prop hasn't changed. This is the single biggest
// perf fix available here for free.
export const PostCard = memo(PostCardComponent, (prev, next) => {
  return (
    prev.post === next.post &&
    prev.highlighted === next.highlighted &&
    prev.onToggleLike === next.onToggleLike
  );
});