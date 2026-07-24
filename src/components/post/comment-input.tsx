import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

import { postCardStyles as styles } from "@/styles/post.card.styles";
import { useCreateComment } from "@/hooks/useCommentMutations";

interface CommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  postId: string;
}

export default function CommentInput({
  value,
  onChangeText,
  postId,
  placeholder = "Add a comment…",
}: CommentInputProps) {
  const createComment = useCreateComment();
  const isDisabled = !value.trim() || createComment.isPending;

  function handleSubmitComment() {
    const content = value.trim();
    if (!content || createComment.isPending) return;
    createComment.mutate({
      postId,
      content,
    });
    onChangeText("");
  }

  return (
    <View style={[styles.commentInputRow]}>
      <TextInput
        style={styles.commentInput}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmitComment}
        returnKeyType="send"
      />

      <Pressable
        style={[styles.sendBtn, isDisabled && styles.sendBtnDisabled]}
        onPress={handleSubmitComment}
        disabled={isDisabled}
      >
        {createComment.isPending ? (
          <ActivityIndicator size="small" color="#071A1B" />
        ) : (
          <Ionicons name="send" size={15} color="#071A1B" />
        )}
      </Pressable>
    </View>
  );
}
