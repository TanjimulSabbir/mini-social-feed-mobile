import { useInfiniteQuery } from "@tanstack/react-query";
import { notificationKeys } from "@/api/query-keys";
import { notificationApi } from "@/api/notification.api";
import { useAuthStore } from "@/store/auth.store";

const PAGE_LIMIT = 20;

interface UseNotificationsInfiniteOptions {
  enabled?: boolean;
}

export function useNotificationsInfinite(
  options?: UseNotificationsInfiniteOptions,
) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  return useInfiniteQuery({
    queryKey: notificationKeys.list(),
    queryFn: ({ pageParam }) =>
      notificationApi.getMyNotifications({
        page: pageParam,
        limit: PAGE_LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, p) => sum + p.notifications.length,
        0,
      );
      if (lastPage.meta && loaded < lastPage.meta.total) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 15_000,
    enabled: (options?.enabled ?? true) && isAuthenticated && isHydrated,
  });
}

export function flattenNotifications(
  pages?: { notifications: { id: string }[] }[],
) {
  if (!pages) return [];
  const seen = new Set<string>();
  const result: any[] = [];
  for (const page of pages) {
    for (const n of page.notifications) {
      if (!seen.has(n.id)) {
        seen.add(n.id);
        result.push(n);
      }
    }
  }
  return result;
}
