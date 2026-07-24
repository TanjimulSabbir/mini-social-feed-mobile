import { useQuery } from '@tanstack/react-query';
import { commentApi } from '@/api/comment.api';
import { commentKeys } from '@/api/query-keys';

export function useComments(postId: string, enabled = true) {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => commentApi.getCommentsByPostId(postId),
    enabled: enabled && !!postId,
  });
}
