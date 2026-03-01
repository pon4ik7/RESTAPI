'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { isEndpointMissing, postsApi } from '@/lib/api';

import { useTimeAgo } from '@/hooks/use-time-ago';

import { EndpointBanner } from '../common/endpoint-banner';
import { PageEmpty } from '../common/page-empty';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

type Props = { postId: string };

function CommentItem({ content, author, createdAt }: { content: string; author: string; createdAt: string }): JSX.Element {
  const timeAgo = useTimeAgo(createdAt);
  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <div className="mb-1 text-sm font-medium">@{author}</div>
        <div className="text-sm">{content}</div>
        <div className="mt-2 text-xs text-muted-foreground">{timeAgo}</div>
      </CardContent>
    </Card>
  );
}

export function CommentList({ postId }: Props): JSX.Element {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }: { pageParam: string | null }) => postsApi.getComments(postId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => postsApi.createComment(postId, { content }),
    onSuccess: () => {
      setComment('');
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      void queryClient.invalidateQueries({ queryKey: ['post', postId] });
      toast.success('Comment added');
    },
    onError: () => toast.error('Could not add comment')
  });

  if (query.error && isEndpointMissing(query.error)) {
    return <EndpointBanner />;
  }

  const comments = query.data?.pages.flatMap((p) => p.items) || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 p-4">
          <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment" />
          <div className="flex justify-end">
            <Button
              onClick={() => createMutation.mutate(comment.trim())}
              disabled={comment.trim().length < 2 || createMutation.isPending}
            >
              Add comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {!comments.length && !query.isPending && (
        <PageEmpty title="No comments yet" description="Start the discussion." />
      )}

      {comments.map((item) => (
        <CommentItem
          key={item.id}
          content={item.content}
          author={item.author.username}
          createdAt={item.createdAt}
        />
      ))}

      {query.hasNextPage && (
        <Button variant="secondary" onClick={() => query.fetchNextPage()}>
          Load more comments
        </Button>
      )}
    </div>
  );
}
