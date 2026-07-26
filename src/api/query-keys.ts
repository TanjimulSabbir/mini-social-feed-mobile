export const postKeys = {
  all: ["posts"] as const,
  list: ( searchTerm: string = "") => [...postKeys.all, "list", searchTerm] as const,
  myPosts: () => [...postKeys.all, "my-posts"] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
};

export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: string) => [...commentKeys.all, postId] as const,
};

export const likeKeys = {
  all: ["likes"] as const,
  byPost: (postId: string) => [...likeKeys.all, postId] as const,
};
export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
};
