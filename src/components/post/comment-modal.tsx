import { Ionicons } from "@expo/vector-icons";

import { Modal, Pressable, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { postCardStyles as styles } from "@/styles/post.card.styles";
import { useComments } from "@/hooks/useCommentQueries";
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
  const { data: comments = [], isLoading } = useComments(postId, visible);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Comments</Text>

          <Pressable onPress={onClose}>
            <Ionicons name="close" size={22} color="#94A3B8" />
          </Pressable>
        </View>

        <CommentList comments={comments} isLoading={isLoading} />
      </SafeAreaView>
    </Modal>
  );
}
