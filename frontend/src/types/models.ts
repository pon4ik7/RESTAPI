import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  bio: z.string().optional(),
  createdAt: z.string()
});

export const postSchema = z.object({
  id: z.string(),
  author: userSchema,
  content: z.string(),
  createdAt: z.string(),
  likeCount: z.number().int().nonnegative(),
  commentCount: z.number().int().nonnegative(),
  isLiked: z.boolean(),
  isBookmarked: z.boolean()
});

export const commentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  author: userSchema,
  content: z.string(),
  createdAt: z.string()
});

export const notificationSchema = z.object({
  id: z.string(),
  type: z.enum(['like', 'comment', 'follow', 'mention', 'system']),
  actor: userSchema,
  postId: z.string().optional(),
  createdAt: z.string(),
  isRead: z.boolean()
});

export const cursorPageSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable()
  });

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export type User = z.infer<typeof userSchema>;
export type Post = z.infer<typeof postSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
export type CursorPage<T> = { items: T[]; nextCursor: string | null };
