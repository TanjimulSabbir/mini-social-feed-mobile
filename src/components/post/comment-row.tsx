import { commentRowStyles as commentStyles } from "@/styles/comment.row";
import { Comment } from "@/types/comment.types";
import { formatTimeAgo } from "@/utils/date";
import React from "react";
import { Text, View } from "react-native";

interface CommentRowProps {
  comment: Comment;
}

export const CommentRow: React.FC<CommentRowProps> = ({ comment }) => {
  const displayName = comment.author?.name || comment.authorName || "Anonymous";
  const authorInitial = displayName.charAt(0).toUpperCase();

  return (
    <View style={commentStyles.container}>
      {/* Avatar Circle */}
      <View style={commentStyles.avatar}>
        <Text style={commentStyles.avatarText}>{authorInitial}</Text>
      </View>

      <View style={commentStyles.contentWrapper}>
        <View style={commentStyles.headerRow}>
          <Text style={commentStyles.authorName} numberOfLines={1}>
            {displayName}
          </Text>

          <Text style={commentStyles.timeText}>
            {formatTimeAgo(comment.createdAt)}
          </Text>
        </View>

        <Text style={commentStyles.commentContent}>{comment.content}</Text>
      </View>
    </View>
  );
};
