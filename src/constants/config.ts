const production = "https://backend-mini-social-app.vercel.app/api";
const development = "http://localhost:7000/api";
export const API_BASE_URL: string = development;

export const PAGE_SIZE = 10;

export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
  PUSH_TOKEN_SYNCED: "push_token_synced",
} as const;
