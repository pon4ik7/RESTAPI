'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { isEndpointMissing, postsApi } from '@/lib/api';

import { EndpointBanner } from '../common/endpoint-banner';
import { PageEmpty } from '../common/page-empty';
import { PageError } from '../common/page-error';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { PostCard } from '../posts/post-card';

export function FeedList(): JSX.Element {
  const query = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }: { pageParam: string | null }) => postsApi.getFeed(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined
  });

  if (query.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (query.error) {
    if (isEndpointMissing(query.error)) return <EndpointBanner />;
    return <PageError message={query.error.message} />;
  }

  const posts = query.data.pages.flatMap((p) => p.items);

  if (!posts.length) {
    return <PageEmpty title="No posts yet" description="Be the first one to publish a learning update." />;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {query.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage}>
            {query.isFetchingNextPage ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  );
}
