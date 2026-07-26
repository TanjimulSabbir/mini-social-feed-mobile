// store/modal.store.ts
import { create } from "zustand";

interface ModalItem {
  message: string;
  statusCode: number | null;
}

interface ModalState {
  queue: ModalItem[];
  push: (item: ModalItem) => void;
  dismiss: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  queue: [],
  push: (item) => set({ queue: [...get().queue, item] }),
  dismiss: () => set({ queue: get().queue.slice(1) }),
}));
