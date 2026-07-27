import { authApi } from "@/api/auth.api";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

import { storageService } from "@/services/storage.services";
import { DecodedUser, LoginPayload, SignupPayload } from "@/types/auth.types";
import { router } from "expo-router";

interface AuthState {
  user: DecodedUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  login: async (payload) => {
    const tokens = await authApi.login(payload);
    await storageService.saveTokens(tokens);
    const user = jwtDecode<DecodedUser>(tokens.accessToken);
    set({ user, isAuthenticated: true });
  },

  signup: async (payload) => {
    await authApi.signup(payload);
  },

  logout: async () => {
    await storageService.clearTokens();
    set({ user: null, isAuthenticated: false });
    router.push("/(auth)/login");
  },

  hydrate: async () => {
    if (useAuthStore.getState().isHydrated) return;

    try {
      const token = await storageService.getAccessToken();

      if (token) {
        const user = jwtDecode<DecodedUser>(token);

        if (user.exp * 1000 > Date.now()) {
          set({
            user,
            isAuthenticated: true,
            isHydrated: true,
          });
          return;
        }
      }

      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
      });
    }
  },
}));
