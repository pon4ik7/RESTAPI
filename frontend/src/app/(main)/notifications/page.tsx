'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { EndpointBanner } from '@/components/common/endpoint-banner';
import { PageEmpty } from '@/components/common/page-empty';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { isEndpointMissing, notificationsApi } from '@/lib/api';

export default function NotificationsPage(): JSX.Element {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }: { pageParam: string | null }) => notificationsApi.getNotifications(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined
  });

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markNotificationRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  if (query.error && isEndpointMissing(query.error)) return <EndpointBanner />;

  const items = query.data?.pages.flatMap((p) => p.items) || [];

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      {!items.length && !query.isPending && (
        <PageEmpty title="No notifications" description="You are all caught up." />
      )}

      {items.map((notification) => (
        <Card key={notification.id}>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={notification.actor.avatarUrl || ''} alt={notification.actor.username} />
                <AvatarFallback>{notification.actor.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div>
                  <span className="font-medium">@{notification.actor.username}</span> {notification.type}
                </div>
                <div className="text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</div>
              </div>
            </div>
            {!notification.isRead ? (
              <Button size="sm" variant="outline" onClick={() => markReadMutation.mutate(notification.id)}>
                Mark read
              </Button>
            ) : (
              <Badge variant="secondary">Read</Badge>
            )}
          </CardContent>
        </Card>
      ))}

      {query.hasNextPage && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => query.fetchNextPage()}>
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
