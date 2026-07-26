// utils/modal.ts
import { useModalStore } from "@/store/modal.store";

export function pushModal(message: string, statusCode: number | null = null) {
  useModalStore.getState().push({ message, statusCode });
}