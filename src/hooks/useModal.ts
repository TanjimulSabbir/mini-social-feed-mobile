import { useCallback, useState } from "react";
import { AppModalAction, ModalVariant } from "@/components/ui/AppModal";

interface ModalState {
  visible: boolean;
  variant: ModalVariant;
  title: string;
  message?: string;
  actions?: AppModalAction[];
  autoDismissMs?: number;
}

const initialState: ModalState = {
  visible: false,
  variant: "info",
  title: "",
};

export function useAppModal() {
  const [modalState, setModalState] = useState<ModalState>(initialState);

  const hide = useCallback(() => {
    setModalState((prev) => ({ ...prev, visible: false }));
  }, []);

  const show = useCallback((config: Omit<ModalState, "visible">) => {
    setModalState({ ...config, visible: true });
  }, []);

  // Convenience shortcuts for common cases
  const showSuccess = useCallback(
    (title: string, message?: string, autoDismissMs = 1200) => {
      show({ variant: "success", title, message, autoDismissMs });
    },
    [show],
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      show({
        variant: "error",
        title,
        message,
        actions: [{ label: "OK", onPress: hide, style: "primary" }],
      });
    },
    [show, hide],
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      options?: { confirmLabel?: string; cancelLabel?: string; destructive?: boolean },
    ) => {
      show({
        variant: "confirm",
        title,
        message,
        actions: [
          { label: options?.cancelLabel ?? "Cancel", onPress: hide, style: "secondary" },
          {
            label: options?.confirmLabel ?? "Confirm",
            onPress: () => {
              hide();
              onConfirm();
            },
            style: options?.destructive ? "destructive" : "primary",
          },
        ],
      });
    },
    [show, hide],
  );

  return { modalState, show, hide, showSuccess, showError, showConfirm };
}