import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { authApi } from "@/api/auth.api";

import { DecodedUser, LoginPayload, SignupPayload } from "@/types/auth.types";
import { storageService } from "@/services/storage.services";

interface AuthState {
  user: DecodedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

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
  },

  hydrate: async () => {
    const token = await storageService.getAccessToken();
    if (token) {
      try {
        const user = jwtDecode<DecodedUser>(token);
        // exp is in seconds, Date.now() in ms
        if (user.exp * 1000 > Date.now()) {
          set({ user, isAuthenticated: true, isLoading: false });
          return;
        }
      } catch {
        // fall through to cleared state below
      }
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
