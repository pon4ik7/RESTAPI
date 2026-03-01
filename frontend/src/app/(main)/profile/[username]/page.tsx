'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { EndpointBanner } from '@/components/common/endpoint-banner';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { FollowButton } from '@/components/profile/follow-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCard } from '@/components/posts/post-card';
import { isEndpointMissing, usersApi } from '@/lib/api';

export default function ProfilePage({ params }: { params: { username: string } }): JSX.Element {
  const userQuery = useQuery({
    queryKey: ['user', params.username],
    queryFn: () => usersApi.getUserByUsername(params.username)
  });

  const postsQuery = useInfiniteQuery({
    queryKey: ['user-posts', params.username],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      usersApi.getUserPosts(params.username, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined
  });

  if (userQuery.isPending) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (userQuery.error) {
    if (isEndpointMissing(userQuery.error)) return <EndpointBanner />;
    return <PageError message={userQuery.error.message} />;
  }

  const posts = postsQuery.data?.pages.flatMap((p) => p.items) || [];

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarImage src={userQuery.data.avatarUrl || ''} alt={userQuery.data.username} />
              <AvatarFallback>{userQuery.data.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">@{userQuery.data.username}</h1>
              <p className="text-sm text-muted-foreground">{userQuery.data.bio || 'No bio yet'}</p>
            </div>
          </div>
          <FollowButton username={userQuery.data.username} />
        </CardContent>
      </Card>

      {postsQuery.error && isEndpointMissing(postsQuery.error) && <EndpointBanner />}

      {!posts.length && !postsQuery.isPending && (
        <PageEmpty title="No posts yet" description="This user has not posted anything." />
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {postsQuery.hasNextPage && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => postsQuery.fetchNextPage()}>
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
