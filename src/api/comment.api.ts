import { apiClient } from '@/api/client';
import { Comment, CreateCommentPayload } from '@/types/comment.types';
import { ApiResponse } from '@/types/common.types';

export const commentApi = {
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const { data } = await apiClient.get<ApiResponse<Comment[]>>(`/comments/${postId}`);
    return data.data;
  },

  async createComment(payload: CreateCommentPayload): Promise<Comment> {
    const { data } = await apiClient.post<ApiResponse<Comment>>('/comments', payload);
    return data.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete<ApiResponse<unknown>>(`/comments/${commentId}`);
  },
};