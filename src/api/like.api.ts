import { apiClient } from "@/api/client";
import { ApiResponse } from "@/types/common.types";
import { ToggleLikePayload, ToggleLikeResult } from "@/types/like.types";

export const likeApi = {
  async toggleLike(payload: ToggleLikePayload): Promise<ToggleLikeResult> {
    const { data } = await apiClient.post<ApiResponse<ToggleLikeResult>>(
      "/likes",
      payload,
    );
    return data.data;
  },
};
