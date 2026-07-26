import { useInfiniteQuery } from "@tanstack/react-query";
import { postKeys } from "@/api/query-keys";
import { postApi } from "@/api/posts.api";

const PAGE_LIMIT = 10;


export function usePostsInfinite(searchTerm: string = "") {
  return useInfiniteQuery({
    queryKey: postKeys.list(searchTerm),
    queryFn: ({ pageParam }) =>
      postApi.getAllPosts({ page: pageParam, limit: PAGE_LIMIT, searchTerm }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.posts.length, 0);
      if (lastPage.meta && loaded < lastPage.meta.total) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 30_000,
  });
}