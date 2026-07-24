import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/api/query-keys";
import { notificationApi } from "@/api/notification.api";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markAsRead(notificationId),

    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      const previous = queryClient.getQueryData(notificationKeys.list());

      queryClient.setQueryData(notificationKeys.list(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            notifications: page.notifications.map((n: any) =>
              n.id === notificationId ? { ...n, isRead: true } : n,
            ),
            unreadCount: Math.max(0, page.unreadCount - 1),
          })),
        };
      });

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.list(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}