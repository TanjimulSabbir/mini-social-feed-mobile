import { useQuery } from "@tanstack/react-query";
import { postKeys } from "@/api/query-keys";
import { postApi } from "@/api/posts.api";

export function useAllPosts() {
  return useQuery({
    queryKey: postKeys.list(),
  });
}

export function useMyPosts() {
  return useQuery({
    queryKey: postKeys.myPosts(),
    queryFn: postApi.getMyPosts,
  });
}

export function usePostByPostId(postId: string) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => postApi.getPostById(postId),
    enabled: !!postId,
  });
}
