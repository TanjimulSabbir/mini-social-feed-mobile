import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/auth.types';
import { CreatePostPayload, Post, PostStats, UpdatePostPayload } from '@/types/post.types';

export const postApi = {
  async getAllPosts(): Promise<Post[]> {
    const { data } = await apiClient.get<ApiResponse<Post[]>>('/posts');
    return data.data;
  },

  async getMyPosts(): Promise<Post[]> {
    const { data } = await apiClient.get<ApiResponse<Post[]>>('/posts/my-posts');
    return data.data;
  },

  async getPostById(postId: string): Promise<Post> {
    const { data } = await apiClient.get<ApiResponse<Post>>(`/posts/${postId}`);
    return data.data;
  },

  async createPost(payload: CreatePostPayload): Promise<Post> {
    const { data } = await apiClient.post<ApiResponse<Post>>('/posts', payload);
    return data.data;
  },

  async updatePost(postId: string, payload: UpdatePostPayload): Promise<Post> {
    const { data } = await apiClient.patch<ApiResponse<Post>>(`/posts/${postId}`, payload);
    return data.data;
  },

  async deletePost(postId: string): Promise<void> {
    await apiClient.delete<ApiResponse<unknown>>(`/posts/${postId}`);
  },
};