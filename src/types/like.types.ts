export interface ToggleLikePayload {
  postId: string;
}

export interface ToggleLikeResult {
  liked: boolean;
  likesCount?: number;
}