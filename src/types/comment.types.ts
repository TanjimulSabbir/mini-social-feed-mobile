import { AuthorSummary } from './user.types';

export type CommentStatus = 'APPROVED' | 'REJECT';

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: AuthorSummary;
  postId: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
}

