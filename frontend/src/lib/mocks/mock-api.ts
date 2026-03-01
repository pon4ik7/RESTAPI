import type { Comment, Post, User } from '@/types/models';

import {
  currentUser,
  mockComments,
  mockFollows,
  mockNotifications,
  mockPosts,
  mockUsers,
  setCurrentUser
} from './db';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function paginate<T>(items: T[], cursor?: string | null, limit = 10): { items: T[]; nextCursor: string | null } {
  const start = cursor ? Number(cursor) : 0;
  const next = start + limit;
  return {
    items: items.slice(start, next),
    nextCursor: next < items.length ? String(next) : null
  };
}

function requireAuth(): User {
  if (!currentUser) {
    throw { status: 401, body: { error: { code: 'unauthorized', message: 'Unauthorized' } } };
  }
  return currentUser;
}

function readBody<T>(body: unknown): T {
  return (body || {}) as T;
}

function findPost(postId: string): Post {
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) {
    throw { status: 404, body: { error: { code: 'not_found', message: 'Post not found' } } };
  }
  return post;
}

export async function handleMockRequest<T>(args: {
  method: Method;
  path: string;
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}): Promise<T> {
  await delay();

  const { method, path, query, body } = args;
  const parts = path.split('/').filter(Boolean);

  if (path === '/api/auth/register' && method === 'POST') {
    const payload = readBody<{ email: string; username: string; password: string }>(body);
    const user: User = {
      id: randomId(),
      email: payload.email,
      username: payload.username,
      avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=${payload.username}`,
      bio: '',
      createdAt: new Date().toISOString()
    };
    mockUsers.push(user);
    setCurrentUser(user);
    return {
      user,
      accessToken: `mock-access-${user.id}`,
      refreshToken: `mock-refresh-${user.id}`
    } as T;
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const payload = readBody<{ login: string; password: string }>(body);
    const user = mockUsers.find((u) => u.username === payload.login || u.email === payload.login);
    if (!user) {
      throw { status: 401, body: { error: { code: 'invalid_credentials', message: 'Invalid credentials' } } };
    }
    setCurrentUser(user);
    return {
      user,
      accessToken: `mock-access-${user.id}`,
      refreshToken: `mock-refresh-${user.id}`
    } as T;
  }

  if (path === '/api/auth/refresh' && method === 'POST') {
    const user = currentUser || mockUsers[0];
    setCurrentUser(user);
    return {
      accessToken: `mock-access-${user.id}`,
      refreshToken: `mock-refresh-${user.id}`
    } as T;
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    setCurrentUser(null);
    return {} as T;
  }

  if (path === '/api/me' && method === 'GET') {
    return requireAuth() as T;
  }

  if (path === '/api/me' && method === 'PATCH') {
    const user = requireAuth();
    const payload = readBody<Partial<Pick<User, 'username' | 'avatarUrl' | 'bio'>>>(body);
    Object.assign(user, payload);
    return user as T;
  }

  if (path === '/api/feed' && method === 'GET') {
    requireAuth();
    const page = paginate([...mockPosts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)), query?.cursor as string, Number(query?.limit || 10));
    return page as T;
  }

  if (path === '/api/posts' && method === 'POST') {
    const user = requireAuth();
    const payload = readBody<{ content: string }>(body);
    const post: Post = {
      id: randomId(),
      author: user,
      content: payload.content,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      isBookmarked: false
    };
    mockPosts.unshift(post);
    return post as T;
  }

  if (parts[0] === 'api' && parts[1] === 'posts' && parts[2] && method === 'GET' && parts.length === 3) {
    return findPost(parts[2]) as T;
  }

  if (parts[0] === 'api' && parts[1] === 'posts' && parts[2] && method === 'DELETE' && parts.length === 3) {
    const user = requireAuth();
    const idx = mockPosts.findIndex((p) => p.id === parts[2] && p.author.id === user.id);
    if (idx < 0) {
      throw { status: 404, body: { error: { message: 'Post not found' } } };
    }
    mockPosts.splice(idx, 1);
    return {} as T;
  }

  if (parts[0] === 'api' && parts[1] === 'posts' && parts[2] && parts[3] === 'comments' && method === 'GET') {
    requireAuth();
    const comments = mockComments.filter((c) => c.postId === parts[2]);
    return paginate(comments, query?.cursor as string, Number(query?.limit || 10)) as T;
  }

  if (parts[0] === 'api' && parts[1] === 'posts' && parts[2] && parts[3] === 'comments' && method === 'POST') {
    const user = requireAuth();
    const payload = readBody<{ content: string }>(body);
    const post = findPost(parts[2]);
    const comment: Comment = {
      id: randomId(),
      postId: post.id,
      author: user,
      content: payload.content,
      createdAt: new Date().toISOString()
    };
    post.commentCount += 1;
    mockComments.unshift(comment);
    return comment as T;
  }

  if (parts[0] === 'api' && parts[1] === 'posts' && parts[2] && parts[3] === 'like') {
    requireAuth();
    const post = findPost(parts[2]);
    if (method === 'POST' && !post.isLiked) {
      post.isLiked = true;
      post.likeCount += 1;
    }
    if (method === 'DELETE' && post.isLiked) {
      post.isLiked = false;
      post.likeCount = Math.max(post.likeCount - 1, 0);
    }
    return post as T;
  }

  if (parts[0] === 'api' && parts[1] === 'posts' && parts[2] && parts[3] === 'bookmark') {
    requireAuth();
    const post = findPost(parts[2]);
    post.isBookmarked = method === 'POST';
    return post as T;
  }

  if (parts[0] === 'api' && parts[1] === 'users' && parts[2] && method === 'GET' && parts.length === 3) {
    const user = mockUsers.find((u) => u.username === parts[2]);
    if (!user) {
      throw { status: 404, body: { error: { message: 'User not found' } } };
    }
    return user as T;
  }

  if (parts[0] === 'api' && parts[1] === 'users' && parts[2] && parts[3] === 'posts' && method === 'GET') {
    const posts = mockPosts.filter((p) => p.author.username === parts[2]);
    return paginate(posts, query?.cursor as string, Number(query?.limit || 10)) as T;
  }

  if (parts[0] === 'api' && parts[1] === 'users' && parts[2] && parts[3] === 'follow') {
    requireAuth();
    const username = parts[2];
    if (method === 'POST') mockFollows.add(username);
    if (method === 'DELETE') mockFollows.delete(username);
    return { username, isFollowing: mockFollows.has(username) } as T;
  }

  if (path === '/api/search' && method === 'GET') {
    requireAuth();
    const q = String(query?.q || '').toLowerCase();
    return {
      users: mockUsers.filter((u) => u.username.toLowerCase().includes(q)),
      posts: mockPosts.filter((p) => p.content.toLowerCase().includes(q))
    } as T;
  }

  if (path === '/api/notifications' && method === 'GET') {
    requireAuth();
    return paginate(mockNotifications, query?.cursor as string, Number(query?.limit || 10)) as T;
  }

  if (parts[0] === 'api' && parts[1] === 'notifications' && parts[2] && parts[3] === 'read' && method === 'POST') {
    requireAuth();
    const notification = mockNotifications.find((n) => n.id === parts[2]);
    if (notification) notification.isRead = true;
    return notification as T;
  }

  throw {
    status: 404,
    body: {
      error: {
        code: 'endpoint_not_implemented',
        message: 'Backend endpoint not implemented yet.'
      }
    }
  };
}
