import { z } from 'zod';

import { postSchema, userSchema, type Post, type User } from '@/types/models';

import { request } from './client';

const searchSchema = z.object({
  users: z.array(userSchema),
  posts: z.array(postSchema)
});

export type SearchResult = { users: User[]; posts: Post[] };

export async function searchEverything(q: string): Promise<SearchResult> {
  const data = await request<unknown>('/api/search', {
    auth: true,
    query: { q }
  });
  return searchSchema.parse(data);
}
