import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

import { postCardStyles as styles } from "@/styles/post.card.styles";
import GlobalStyles from "@/styles/global.styles";
import { useCreateComment } from "@/hooks/useCommentMutations";
import { useState } from "react";

interface CommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  postId: string;
  isModal?: boolean;
}

export default function CommentInput({
  value,
  onChangeText,
  postId,
  placeholder = "Add a comment…",
  isModal,
}: CommentInputProps) {
  const createComment = useCreateComment();
  const isDisabled = !value.trim() || createComment.isPending;
  const [isFocused, setIsFocused] = useState(false);

  function handleSubmitComment() {
    const content = value.trim();
    if (!content || createComment.isPending) return;
    createComment.mutate({ postId, content });
    onChangeText("");
  }

  return (
    <View style={[styles.commentInputRow, isModal && styles.modalInputRow]}>
      <TextInput
        style={[
          styles.commentInput,
          isFocused && GlobalStyles.commentInputFocused,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmitComment}
        returnKeyType="send"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
