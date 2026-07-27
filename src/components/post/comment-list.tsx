import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { postCardStyles as styles } from "@/styles/post.card.styles";
import { Comment } from "@/types/comment.types";
import { CommentRow } from "./comment-row";

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

export function CommentList({ comments, isLoading }: CommentListProps) {
  if (isLoading) {
    return (
      <View style={styles.modalEmpty}>
        <ActivityIndicator size="large" color={COLORS.active} />
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CommentRow comment={item} />}
      contentContainerStyle={styles.modalListContent}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <View style={styles.modalEmpty}>
          <Text style={styles.modalEmptyText}>No comments yet — be the first!</Text>
        </View>
      }
    />
  );
}