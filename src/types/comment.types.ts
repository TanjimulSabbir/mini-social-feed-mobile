export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author?: { id: string; name: string };
  content: string;
  createdAt: string;
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
}