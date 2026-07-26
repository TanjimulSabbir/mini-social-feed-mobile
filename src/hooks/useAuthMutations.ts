import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { LoginPayload } from "@/types/auth.types";

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}