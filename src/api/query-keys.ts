export const postKeys = {
  all: ['posts'] as const,
  list: () => [...postKeys.all, 'list'] as const,
  myPosts: () => [...postKeys.all, 'my-posts'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
  stats: () => [...postKeys.all, 'stats'] as const,
};

export const commentKeys = {
  all: ['comments'] as const,
  byPost: (postId: string) => [...commentKeys.all, postId] as const,
};

export const likeKeys = {
  all: ['likes'] as const,
  byPost: (postId: string) => [...likeKeys.all, postId] as const,
};
