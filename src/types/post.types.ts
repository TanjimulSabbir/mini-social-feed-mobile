export interface Author {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: Author;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
}

export type UpdatePostPayload = Partial<CreatePostPayload>;

export interface PostStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
}