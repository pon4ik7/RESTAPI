import { z } from 'zod';

import { authTokensSchema, userSchema, type AuthTokens, type User } from '@/types/models';

import { request } from './client';

const authResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
  refreshToken: z.string()
});

export type LoginInput = { login: string; password: string };
export type RegisterInput = { email: string; username: string; password: string };

export async function register(payload: RegisterInput): Promise<{ user: User; tokens: AuthTokens }> {
  const data = await request<unknown, RegisterInput>('/api/auth/register', { method: 'POST', body: payload });
  const parsed = authResponseSchema.parse(data);
  return {
    user: parsed.user,
    tokens: authTokensSchema.parse(parsed)
  };
}

export async function login(payload: LoginInput): Promise<{ user: User; tokens: AuthTokens }> {
  const data = await request<unknown, LoginInput>('/api/auth/login', { method: 'POST', body: payload });
  const parsed = authResponseSchema.parse(data);
  return {
    user: parsed.user,
    tokens: authTokensSchema.parse(parsed)
  };
}

export async function logout(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST', auth: true });
}

export async function me(): Promise<User> {
  const data = await request<unknown>('/api/me', { auth: true });
  return userSchema.parse(data);
}
