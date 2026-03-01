import { cursorPageSchema, notificationSchema, type CursorPage, type Notification } from '@/types/models';
import { normalizeCursorPage } from '@/lib/api/pagination';

import { request } from './client';

export async function getNotifications(cursor?: string | null, limit = 10): Promise<CursorPage<Notification>> {
  const data = await request<unknown>('/api/notifications', {
    auth: true,
    query: { cursor: cursor || undefined, limit }
  });
  return cursorPageSchema(notificationSchema).parse(normalizeCursorPage<Notification>(data));
}

export async function markNotificationRead(id: string): Promise<void> {
  await request(`/api/notifications/${id}/read`, { method: 'POST', auth: true });
}
