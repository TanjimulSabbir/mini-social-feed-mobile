import { create } from "zustand";

import { notificationsApi } from "@/api/notifications.api";
import { AppNotification } from "@/types/app.types";

interface NotificationsState {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
  polling: boolean;
  fetch: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

let pollHandle: ReturnType<typeof setInterval> | null = null;
const POLL_INTERVAL_MS = 15000;

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,
  polling: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await notificationsApi.getNotifications(1);
      set({
        items: res.items,
        unreadCount: res.items.filter((n) => !n.read).length,
      });
    } catch {
      // silent fail on a background poll — don't interrupt the user
    } finally {
      set({ loading: false });
    }
  },

  markRead: async (id: string) => {
    set((state) => ({
      items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await notificationsApi.markRead(id);
    } catch {
      // leave as optimistically-read; next poll will reconcile
    }
  },

  markAllRead: async () => {
    set((state) => ({
      items: state.items.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
    try {
      await notificationsApi.markAllRead();
    } catch {
      // next poll will reconcile
    }
  },

  startPolling: () => {
    if (pollHandle) return;
    set({ polling: true });
    get().fetch();
    pollHandle = setInterval(() => {
      get().fetch();
    }, POLL_INTERVAL_MS);
  },

  stopPolling: () => {
    if (pollHandle) {
      clearInterval(pollHandle);
      pollHandle = null;
    }
    set({ polling: false });
  },
}));
