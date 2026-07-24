import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/auth.types';
import { ToggleLikePayload } from '@/types/like.types';

export const likeApi = {
  async toggleLike(payload: ToggleLikePayload): Promise<unknown> {
    const { data } = await apiClient.post<ApiResponse<unknown>>('/likes', payload);
    return data.data;
  },
};