import { commentApi } from "@/api/comment.api";
import { commentKeys, postKeys } from "@/api/query-keys";
import { CreateCommentPayload } from "@/types/comment.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchPostInCache } from "./posts/usePostMutation";

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentApi.createComment(payload),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byPost(variables.postId),
      });

      queryClient.setQueriesData({ queryKey: postKeys.all }, (old) =>
        patchPostInCache(old, variables.postId, (p) => ({
          ...p,
          _count: {
            ...p._count,
            likes: p._count?.likes ?? 0,
            comments: (p._count?.comments ?? 0) + 1,
          },
        })),
      );
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
    onError: (err) => {
      console.error("deleteComment failed:", err);
    },
  });
}
