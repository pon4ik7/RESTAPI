'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api/errors';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/lib/api/token-storage';
import type { User } from '@/types/models';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: { login: string; password: string }) => Promise<void>;
  register: (payload: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refetchMe: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const publicRoutes = new Set(['/login', '/register']);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    retry: false,
    enabled: !!getAccessToken() || !!getRefreshToken()
  });

  useEffect(() => {
    if (meQuery.error instanceof ApiError && meQuery.error.status === 401) {
      clearTokens();
      queryClient.setQueryData(['me'], null);
      if (!publicRoutes.has(pathname)) {
        router.replace('/login');
      }
    }
  }, [meQuery.error, pathname, queryClient, router]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, tokens }) => {
      setTokens(tokens);
      queryClient.setQueryData(['me'], user);
    }
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ user, tokens }) => {
      setTokens(tokens);
      queryClient.setQueryData(['me'], user);
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authApi.logout();
      clearTokens();
      queryClient.setQueryData(['me'], null);
      queryClient.removeQueries({ queryKey: ['feed'] });
    }
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: (meQuery.data as User | undefined) ?? null,
      isLoading:
        meQuery.isPending || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
      isAuthenticated: !!meQuery.data,
      login: async (payload) => {
        await loginMutation.mutateAsync(payload);
        router.replace('/feed');
      },
      register: async (payload) => {
        await registerMutation.mutateAsync(payload);
        router.replace('/feed');
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
        router.replace('/login');
      },
      refetchMe: async () => {
        const result = await meQuery.refetch();
        return result.data ?? null;
      }
    }),
    [loginMutation, logoutMutation, meQuery, registerMutation, router]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
