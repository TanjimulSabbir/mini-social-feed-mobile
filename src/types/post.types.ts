import { AuthorSummary } from "./user.types";

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Post {
  id: string;
  title: string;
  content: string;
  thumbnail: string | null;
  isFeatured: boolean;
  status: PostStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: AuthorSummary;

  _count?: { likes: number; comments: number };
  isLiked?: boolean;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  tags?: string[];
}

export type UpdatePostPayload = Partial<CreatePostPayload>;

export interface PostStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
}
