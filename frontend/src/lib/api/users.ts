import { cursorPageSchema, postSchema, userSchema, type CursorPage, type Post, type User } from '@/types/models';
import { normalizeCursorPage } from '@/lib/api/pagination';

import { request } from './client';

export async function getUserByUsername(username: string): Promise<User> {
  const data = await request<unknown>(`/api/users/${username}`, { auth: true });
  return userSchema.parse(data);
}

export async function updateMe(payload: Partial<Pick<User, 'username' | 'avatarUrl' | 'bio'>>): Promise<User> {
  const data = await request<unknown, typeof payload>('/api/me', {
    method: 'PATCH',
    auth: true,
    body: payload
  });
  return userSchema.parse(data);
}

export async function followUser(username: string): Promise<void> {
  await request(`/api/users/${username}/follow`, { method: 'POST', auth: true });
}

export async function unfollowUser(username: string): Promise<void> {
  await request(`/api/users/${username}/follow`, { method: 'DELETE', auth: true });
}

export async function getUserPosts(username: string, cursor?: string | null, limit = 10): Promise<CursorPage<Post>> {
  const data = await request<unknown>(`/api/users/${username}/posts`, {
    auth: true,
    query: { cursor: cursor || undefined, limit }
  });
  return cursorPageSchema(postSchema).parse(normalizeCursorPage<Post>(data));
}
