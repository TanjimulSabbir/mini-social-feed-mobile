import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeApi } from "@/api/like.api";
import { postKeys } from "@/api/query-keys";
import { CreatePostPayload, Post, UpdatePostPayload } from "@/types/post.types";
import { postApi } from "@/api/posts.api";

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postApi.createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: UpdatePostPayload;
    }) => postApi.updatePost(postId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(postKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
  });
}

function patchPostInCache(
  oldData: any,
  postId: string,
  transform: (p: Post) => Post,
) {
  if (!oldData) return oldData;
  if (Array.isArray(oldData)) {
    return oldData.map((p: Post) => (p.id === postId ? transform(p) : p));
  }
  if (oldData.pages) {
    return {
      ...oldData,
      pages: oldData.pages.map((page: any) => ({
        ...page,
        posts: page.posts.map((p: Post) =>
          p.id === postId ? transform(p) : p,
        ),
      })),
    };
  }
  return oldData;
}
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => likeApi.toggleLike({ postId }),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      const previous = queryClient.getQueriesData({ queryKey: postKeys.all });

      queryClient.setQueriesData({ queryKey: postKeys.all }, (old) =>
        patchPostInCache(old, postId, (p) => ({ ...p, isLiked: !p.isLiked })),
      );

      return { previous };
    },

    onError: (_err, _postId, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
