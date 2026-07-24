import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/api/comment.api";
import { commentKeys, postKeys } from "@/api/query-keys";
import { CreateCommentPayload } from "@/types/comment.types";

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentApi.createComment(payload),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byPost(variables.postId),
      });
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      commentApi.deleteComment(commentId),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byPost(variables.postId),
      });
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
}
