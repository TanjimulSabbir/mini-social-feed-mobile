import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/theme";
import { useComments } from "@/hooks/useCommentQueries";
import { postCardStyles as styles } from "@/styles/post.card.styles";
import CommentInput from "./comment-bar";
import { CommentList } from "./comment-list";

interface CommentsModalProps {
  visible: boolean;
  postId: string;
  onClose: () => void;
}

export function CommentsModal({
  visible,
  postId,
  onClose,
}: CommentsModalProps) {
  const {
    data: comments = [],
    isLoading,
    isError,
    refetch,
  } = useComments(postId, visible);
  const [commentText, setCommentText] = useState("");

  const commentsCount = comments.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            Comments {commentsCount > 0 ? `(${commentsCount})` : ""}
          </Text>

          <Pressable
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Close comments"
          >
            <Ionicons name="close" size={22} color={COLORS.inactive} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }}>
            {isError ? (
              <View style={styles.modalEmpty}>
                <Text style={styles.modalEmptyText}>
                  Could not load comments.
                </Text>
                <Pressable onPress={() => refetch()} accessibilityRole="button">
                  <Text
                    style={[
                      styles.modalEmptyText,
                      { color: COLORS.active, marginTop: 8 },
                    ]}
                  >
                    Try again
                  </Text>
                </Pressable>
              </View>
            ) : (
              <CommentList comments={comments} isLoading={isLoading} />
            )}
          </View>

          <CommentInput
            value={commentText}
            onChangeText={setCommentText}
            postId={postId}
            isModal
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
