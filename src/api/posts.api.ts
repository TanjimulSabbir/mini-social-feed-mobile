import { apiClient } from "@/api/client";
import { ApiResponse, Meta } from "@/types/common.types";
import { CreatePostPayload, Post, UpdatePostPayload } from "@/types/post.types";

interface GetAllPostsParams {
  page: number;
  limit: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  title?: string;
  content?: string;
}

export const postApi = {
  async getAllPosts(params: GetAllPostsParams): Promise<{
    posts: Post[];
    meta?: Meta;
  }> {
    const { data } = await apiClient.get<ApiResponse<Post[]>>("/posts", {
      params,
    });
    return { posts: data.data, meta: data.meta };
  },

  async getMyPosts(): Promise<Post[]> {
    const { data } =
      await apiClient.get<ApiResponse<Post[]>>("/posts/my-posts");
    return data.data;
  },

  async getPostById(postId: string): Promise<Post> {
    const { data } = await apiClient.get<ApiResponse<Post>>(`/posts/${postId}`);
    return data.data;
  },

  async createPost(payload: CreatePostPayload): Promise<Post> {
    const { data } = await apiClient.post<ApiResponse<Post>>("/posts", payload);
    return data.data;
  },

  async updatePost(postId: string, payload: UpdatePostPayload): Promise<Post> {
    const { data } = await apiClient.patch<ApiResponse<Post>>(
      `/posts/${postId}`,
      payload,
    );
    return data.data;
  },

  async deletePost(postId: string): Promise<void> {
    await apiClient.delete<ApiResponse<unknown>>(`/posts/${postId}`);
  },
};
