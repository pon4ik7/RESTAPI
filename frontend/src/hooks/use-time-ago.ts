'use client';

import { useMemo } from 'react';

export function useTimeAgo(dateString: string): string {
  return useMemo(() => {
    const date = new Date(dateString).getTime();
    const diffMs = Date.now() - date;
    const mins = Math.floor(diffMs / (1000 * 60));
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }, [dateString]);
}
