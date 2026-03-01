import type { CursorPage } from '@/types/models';

export function normalizeCursorPage<T>(data: unknown): CursorPage<T> {
  if (!data || typeof data !== 'object') {
    return { items: [], nextCursor: null };
  }

  const asObj = data as {
    items?: T[];
    data?: T[];
    nextCursor?: string | null;
    cursor?: string | null;
  };

  const items = Array.isArray(asObj.items)
    ? asObj.items
    : Array.isArray(asObj.data)
      ? asObj.data
      : [];

  return {
    items,
    nextCursor: asObj.nextCursor ?? asObj.cursor ?? null
  };
}
