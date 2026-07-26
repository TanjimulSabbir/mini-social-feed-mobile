import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useCreateComment } from "@/hooks/useCommentMutations";
import GlobalStyles from "@/styles/global.styles";
import { postCardStyles as styles } from "@/styles/post.card.styles";
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

  // State to manage feedback message
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showFeedback = (text: string, type: "success" | "error") => {
    setStatusMessage({ text, type });
    // Automatically clear the message after 3 seconds
    setTimeout(() => setStatusMessage(null), 3000);
  };

  function handleSubmitComment() {
    const content = value.trim();
    if (!content || createComment.isPending) return;

    createComment.mutate(
      { postId, content },
      {
        onSuccess: () => {
          onChangeText("");
          showFeedback("Comment posted!", "success");
        },
        onError: (err) => {
        }
      },
    );
  }

  return (
    <View>
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

      {/* Render status message when present */}
      {statusMessage && (
        <Text
          style={{
            fontSize: 12,
            marginTop: 4,
            marginLeft: 4,
            color: statusMessage.type === "success" ? "#16a34a" : "#dc2626",
          }}
        >
          {statusMessage.text}
        </Text>
      )}
    </View>
  );
}
