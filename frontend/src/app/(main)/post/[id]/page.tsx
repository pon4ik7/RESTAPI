'use client';

import { useQuery } from '@tanstack/react-query';

import { EndpointBanner } from '@/components/common/endpoint-banner';
import { PageError } from '@/components/common/page-error';
import { CommentList } from '@/components/posts/comment-list';
import { PostCard } from '@/components/posts/post-card';
import { Skeleton } from '@/components/ui/skeleton';
import { isEndpointMissing, postsApi } from '@/lib/api';

export default function PostPage({ params }: { params: { id: string } }): JSX.Element {
  const query = useQuery({
    queryKey: ['post', params.id],
    queryFn: () => postsApi.getPost(params.id)
  });

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      {query.isPending && <Skeleton className="h-32 w-full" />}
      {query.error &&
        (isEndpointMissing(query.error) ? (
          <EndpointBanner />
        ) : (
          <PageError message={query.error.message} />
        ))}
      {query.data && <PostCard post={query.data} />}
      <CommentList postId={params.id} />
    </section>
  );
}
