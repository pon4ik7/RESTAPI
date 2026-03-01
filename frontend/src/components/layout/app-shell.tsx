'use client';

import { RequireAuth } from '@/components/auth/require-auth';

import { TopNav } from './top-nav';

export function AppShell({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <RequireAuth>
      <TopNav />
      <main className="container py-6">{children}</main>
    </RequireAuth>
  );
}
