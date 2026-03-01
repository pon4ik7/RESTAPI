import { normalizeCursorPage } from '@/lib/api/pagination';
import {
  commentSchema,
  cursorPageSchema,
  postSchema,
  type Comment,
  type CursorPage,
  type Post
} from '@/types/models';

import { request } from './client';

export async function getFeed(cursor?: string | null, limit = 10): Promise<CursorPage<Post>> {
  const data = await request<unknown>('/api/feed', {
    auth: true,
    query: { cursor: cursor || undefined, limit }
  });
  return cursorPageSchema(postSchema).parse(normalizeCursorPage<Post>(data));
}

export async function createPost(payload: { content: string }): Promise<Post> {
  const data = await request<unknown, { content: string }>('/api/posts', {
    method: 'POST',
    auth: true,
    body: payload
  });
  return postSchema.parse(data);
}

export async function getPost(id: string): Promise<Post> {
  const data = await request<unknown>(`/api/posts/${id}`, { auth: true });
  return postSchema.parse(data);
}

export async function deletePost(id: string): Promise<void> {
  await request(`/api/posts/${id}`, { method: 'DELETE', auth: true });
}

export async function getComments(postId: string, cursor?: string | null, limit = 10): Promise<CursorPage<Comment>> {
  const data = await request<unknown>(`/api/posts/${postId}/comments`, {
    auth: true,
    query: { cursor: cursor || undefined, limit }
  });
  return cursorPageSchema(commentSchema).parse(normalizeCursorPage<Comment>(data));
}

export async function createComment(postId: string, payload: { content: string }): Promise<Comment> {
  const data = await request<unknown, { content: string }>(`/api/posts/${postId}/comments`, {
    method: 'POST',
    auth: true,
    body: payload
  });
  return commentSchema.parse(data);
}

export async function likePost(postId: string): Promise<void> {
  await request(`/api/posts/${postId}/like`, {
    method: 'POST',
    auth: true
  });
}

export async function unlikePost(postId: string): Promise<void> {
  await request(`/api/posts/${postId}/like`, {
    method: 'DELETE',
    auth: true
  });
}

export async function bookmarkPost(postId: string): Promise<void> {
  await request(`/api/posts/${postId}/bookmark`, {
    method: 'POST',
    auth: true
  });
}

export async function unbookmarkPost(postId: string): Promise<void> {
  await request(`/api/posts/${postId}/bookmark`, {
    method: 'DELETE',
    auth: true
  });
}
