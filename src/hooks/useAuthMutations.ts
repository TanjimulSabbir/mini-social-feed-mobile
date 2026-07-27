import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth.store";
import { LoginPayload } from "@/types/auth.types";
import { pushModal } from "./modal";
import { router } from "expo-router";
import { getErrorMessage, getErrorStatusCode } from "@/utils/error.utils";

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => login(payload),
    meta: { skipGlobalErrorModal: true },
    onSuccess: () => {
      pushModal("Login successful!", 200);
      router.replace("/(tabs)");
    },
    onError: (err) => {
      pushModal(getErrorMessage(err), getErrorStatusCode(err));
    },
  });
}
