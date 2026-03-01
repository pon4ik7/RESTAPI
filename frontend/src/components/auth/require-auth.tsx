'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/providers/auth-provider';

import { Skeleton } from '../ui/skeleton';

export function RequireAuth({ children }: { children: React.ReactNode }): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="mt-4 h-48 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) return <></>;

  return <>{children}</>;
}
