import type { Comment, Notification, Post, User } from '@/types/models';

const now = Date.now();

export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'alice',
    email: 'alice@example.com',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alice',
    bio: 'Learning in public, one commit at a time.',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 40).toISOString()
  },
  {
    id: 'u2',
    username: 'bob',
    email: 'bob@example.com',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Bob',
    bio: 'Backend engineer exploring frontend patterns.',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 60).toISOString()
  }
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: mockUsers[0],
    content: 'Today I learned how React Query cache invalidation works. Super useful for feeds.',
    createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
    likeCount: 12,
    commentCount: 2,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 'p2',
    author: mockUsers[1],
    content: 'Building a Go API and Next.js frontend in parallel is actually fun.',
    createdAt: new Date(now - 1000 * 60 * 50).toISOString(),
    likeCount: 5,
    commentCount: 1,
    isLiked: true,
    isBookmarked: false
  }
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: 'p1',
    author: mockUsers[1],
    content: 'Nice! Which query patterns are you using?',
    createdAt: new Date(now - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'c2',
    postId: 'p1',
    author: mockUsers[0],
    content: 'Mainly infinite queries + optimistic likes.',
    createdAt: new Date(now - 1000 * 60 * 100).toISOString()
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'follow',
    actor: mockUsers[1],
    createdAt: new Date(now - 1000 * 60 * 80).toISOString(),
    isRead: false
  },
  {
    id: 'n2',
    type: 'like',
    actor: mockUsers[1],
    postId: 'p1',
    createdAt: new Date(now - 1000 * 60 * 50).toISOString(),
    isRead: true
  }
];

export const mockFollows = new Set<string>();

export let currentUser: User | null = mockUsers[0];

export function setCurrentUser(user: User | null): void {
  currentUser = user;
}
