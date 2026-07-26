import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "accessToken";

export const tokenService = {
  async getAccessToken() {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async removeToken() {
    return AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
