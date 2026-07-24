import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthTokens } from "@/types/auth.types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const storageService = {
  async saveTokens(tokens: AuthTokens) {
    await AsyncStorage.setItem(
      ACCESS_TOKEN_KEY,
      tokens.accessToken
    );

    await AsyncStorage.setItem(
      REFRESH_TOKEN_KEY,
      tokens.refreshToken
    );
  },

  async getAccessToken() {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken() {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async clearTokens() {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};