export interface Notification {
  id: string;
  type: "LIKE" | "COMMENT";
  isRead: boolean;
  createdAt: string;
  postId?: string;
  actor?: {
    id: string;
    name: string;
  };
}