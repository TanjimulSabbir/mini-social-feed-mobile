// store/error.store.ts
import { create } from "zustand";

interface ErrorState {
  isVisible: boolean;
  title: string;
  message: string;
  info: Record<string, unknown>;
  showError: (message: string, info?: Record<string, unknown>, title?: string) => void;
  hideError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  isVisible: false,
  title: "Something went wrong",
  message: "",
  info: {},

  showError: (message, info = {}, title = "Something went wrong") =>
    set({ isVisible: true, message, info, title }),

  hideError: () => set({ isVisible: false, message: "", info: {} }),
}));