import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCreateComment } from "@/hooks/useCommentMutations";
import { Post } from "@/types/post.types";
import { Comment } from "@/types/comment.types";
import { User } from "@/types/user.types";

interface PostCardProps {
  post: Post;
  highlighted?: boolean;
  onToggleLike: (postId: string) => void;
  me:User
}

function CommentRow({ comment }: { comment: Comment }) {
  const authorName = comment.authorName ?? "Anonymous";
  return (
    <View style={styles.commentRow}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {authorName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.commentBody}>
        <Text style={styles.commentAuthor}>{authorName}</Text>
        <Text style={styles.commentContent}>{comment.content}</Text>
      </View>
    </View>
  );
}

export function PostCard({ post, highlighted, onToggleLike, me }: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const createComment = useCreateComment();

  const isLiked = post?.likes?.length ? true : false;
  const likesCount = isLiked ? post?.likes?.length :0;
  const comments = post?.comments ?? [];
  const commentsCount = post?.comments?.length ?? 0;
  const authorName = post?.author?.name ?? "Anonymous";

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
          style={[styles.actionBtn, isLiked && styles.actionBtnActive]}
          onPress={() => onToggleLike(post.id)}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={18}
            color={post.likes?.some((l) => l.userId === me.id) ? "#A3E635" : "#94A3B8"}
          />
          <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
            {likesCount}
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionBtn}
          onPress={() => setIsCommentsOpen(true)}
        >
          <Ionicons name="chatbubble-outline" size={17} color="#94A3B8" />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </Pressable>
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
            (!commentText.trim() || createComment.isPending) &&
              styles.sendBtnDisabled,
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

      {/* Comments Modal */}
      <Modal
        visible={isCommentsOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsCommentsOpen(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Comments {commentsCount > 0 ? `(${commentsCount})` : ""}
            </Text>
            <Pressable
              onPress={() => setIsCommentsOpen(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color="#94A3B8" />
            </Pressable>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CommentRow comment={item} />}
            contentContainerStyle={styles.modalListContent}
            ListEmptyComponent={
              <View style={styles.modalEmpty}>
                <Ionicons name="chatbubble-outline" size={28} color="#64748B" />
                <Text style={styles.modalEmptyText}>
                  No comments yet — be the first!
                </Text>
              </View>
            }
          />

          {/* Reuse the same input inside the modal for convenience */}
          <View style={[styles.commentInputRow, styles.modalInputRow]}>
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
                (!commentText.trim() || createComment.isPending) &&
                  styles.sendBtnDisabled,
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
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(20, 38, 38, 0.75)",
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

  // Modal styles
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#071A1B",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  modalListContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
  modalEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 10,
  },
  modalEmptyText: {
    color: "#64748B",
    fontSize: 13,
  },
  commentRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: "rgba(163, 230, 53, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarText: {
    color: "#A3E635",
    fontWeight: "800",
    fontSize: 13,
  },
  commentBody: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    padding: 10,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "700",
    color: "#A3E635",
    marginBottom: 3,
  },
  commentContent: {
    fontSize: 13,
    color: "#E2E8F0",
    lineHeight: 18,
  },
  modalInputRow: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
});
