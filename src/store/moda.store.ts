// store/modal.store.ts
import { create } from "zustand";
import { AppModalAction, ModalVariant } from "@/components/ui/AppModal";

interface ModalStore {
  visible: boolean;
  variant: ModalVariant;
  title: string;
  message?: string;
  actions?: AppModalAction[];
  autoDismissMs?: number;

  show: (config: {
    variant?: ModalVariant;
    title: string;
    message?: string;
    actions?: AppModalAction[];
    autoDismissMs?: number;
  }) => void;
  hide: () => void;

  showSuccess: (title: string, message?: string, autoDismissMs?: number) => void;
  showError: (title: string, message?: string) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: { confirmLabel?: string; cancelLabel?: string; destructive?: boolean },
  ) => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  visible: false,
  variant: "info",
  title: "",

  show: (config) =>
    set({
      visible: true,
      variant: config.variant ?? "info",
      title: config.title,
      message: config.message,
      actions: config.actions,
      autoDismissMs: config.autoDismissMs,
    }),

  hide: () => set({ visible: false }),

  showSuccess: (title, message, autoDismissMs = 1200) =>
    get().show({ variant: "success", title, message, autoDismissMs }),

  showError: (title, message) =>
    get().show({
      variant: "error",
      title,
      message,
      actions: [{ label: "OK", onPress: () => get().hide(), style: "primary" }],
    }),

  showConfirm: (title, message, onConfirm, options) =>
    get().show({
      variant: "confirm",
      title,
      message,
      actions: [
        { label: options?.cancelLabel ?? "Cancel", onPress: () => get().hide(), style: "secondary" },
        {
          label: options?.confirmLabel ?? "Confirm",
          onPress: () => {
            get().hide();
            onConfirm();
          },
          style: options?.destructive ? "destructive" : "primary",
        },
      ],
    }),
}));