import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { COLORS } from "@/constants/theme";
import { useCreateComment } from "@/hooks/useCommentMutations";
import GlobalStyles from "@/styles/global.styles";
import { postCardStyles as styles } from "@/styles/post.card.styles";

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

  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const showFeedback = (text: string, type: "success" | "error") => {
    setStatusMessage({ text, type });
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => setStatusMessage(null), 3000);
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
        onError: () => {
          showFeedback("Couldn't post your comment. Try again.", "error");
        },
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
          placeholderTextColor={COLORS.inactive}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmitComment}
          returnKeyType="send"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!createComment.isPending}
          accessibilityLabel="Comment input"
        />

        <Pressable
          style={[styles.sendBtn, isDisabled && styles.sendBtnDisabled]}
          onPress={handleSubmitComment}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel="Send comment"
          accessibilityState={{
            disabled: isDisabled,
            busy: createComment.isPending,
          }}
        >
          {createComment.isPending ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Ionicons name="send" size={15} color={COLORS.background} />
          )}
        </Pressable>
      </View>

      {statusMessage && (
        <Text
          style={[
            localStyles.statusText,
            {
              color:
                statusMessage.type === "success"
                  ? COLORS.success
                  : COLORS.error,
            },
          ]}
          accessibilityLiveRegion="polite"
        >
          {statusMessage.text}
        </Text>
      )}
    </View>
  );
}
const localStyles = StyleSheet.create({
  statusText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
