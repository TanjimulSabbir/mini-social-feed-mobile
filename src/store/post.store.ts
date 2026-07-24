import { create } from "zustand";
import { likeApi } from "@/api/like.api";

import {
  CreatePostPayload,
  Post,
  PostStats,
  UpdatePostPayload,
} from "@/types/post.types";
import { getErrorMessage } from "@/utils/error.utils";
import { postApi } from "@/api/posts.api";

interface PostState {
  posts: Post[];
  myPosts: Post[];
  stats: PostStats | null;
  isLoading: boolean;
  error: string | null;

  fetchPosts: () => Promise<void>;
  fetchMyPosts: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createPost: (payload: CreatePostPayload) => Promise<Post>;
  updatePost: (postId: string, payload: UpdatePostPayload) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  myPosts: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const posts = await postApi.getAllPosts();
      set({ posts, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchMyPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const myPosts = await postApi.getMyPosts();
      set({ myPosts, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await postApi.getStats();
      set({ stats });
    } catch {
      // Admin-only endpoint — fail silently for non-admin users
    }
  },

  createPost: async (payload) => {
    const newPost = await postApi.createPost(payload);
    set((state) => ({
      posts: [newPost, ...state.posts],
      myPosts: [newPost, ...state.myPosts],
    }));
    return newPost;
  },

  updatePost: async (postId, payload) => {
    const updated = await postApi.updatePost(postId, payload);
    set((state) => ({
      posts: state.posts.map((p) => (p.id === postId ? updated : p)),
      myPosts: state.myPosts.map((p) => (p.id === postId ? updated : p)),
    }));
  },

  deletePost: async (postId) => {
    await postApi.deletePost(postId);
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== postId),
      myPosts: state.myPosts.filter((p) => p.id !== postId),
    }));
  },

  toggleLike: async (postId) => {
    const previousPosts = get().posts;

    // Optimistic flip — only isLiked, since we don't trust a guessed count yet
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, isLiked: !p.isLiked } : p
      ),
    }));

    try {
      const result = await likeApi.toggleLike({ postId });
      set((state) => ({
        posts: state.posts.map((p) => {
          if (p.id !== postId) return p;
          return {
            ...p,
            isLiked: result.liked,
            _count: p._count
              ? { ...p._count, likes: result.likesCount ?? p._count.likes }
              : p._count,
          };
        }),
      }));
    } catch {
      set({ posts: previousPosts });
    }
  },
}));