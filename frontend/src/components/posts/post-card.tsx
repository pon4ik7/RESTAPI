'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { toast } from 'sonner';

import { postsApi } from '@/lib/api';
import type { Post } from '@/types/models';

import { useTimeAgo } from '@/hooks/use-time-ago';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

type Props = {
  post: Post;
};

export function PostCard({ post }: Props): JSX.Element {
  const queryClient = useQueryClient();
  const timeAgo = useTimeAgo(post.createdAt);

  const likeMutation = useMutation({
    mutationFn: async () => (post.isLiked ? postsApi.unlikePost(post.id) : postsApi.likePost(post.id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
      void queryClient.invalidateQueries({ queryKey: ['post', post.id] });
      toast.success(post.isLiked ? 'Like removed' : 'Post liked');
    },
    onError: () => toast.error('Could not update like')
  });

  const bookmarkMutation = useMutation({
    mutationFn: async () =>
      post.isBookmarked ? postsApi.unbookmarkPost(post.id) : postsApi.bookmarkPost(post.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
      void queryClient.invalidateQueries({ queryKey: ['post', post.id] });
      toast.success(post.isBookmarked ? 'Bookmark removed' : 'Bookmarked');
    },
    onError: () => toast.error('Could not update bookmark')
  });

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatarUrl || ''} alt={post.author.username} />
            <AvatarFallback>{post.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <Link href={`/profile/${post.author.username}`} className="font-semibold hover:underline">
                @{post.author.username}
              </Link>
              <span className="text-muted-foreground">{timeAgo}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{post.content}</p>
            <div className="mt-4 flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => likeMutation.mutate()}>
                <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likeCount}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/post/${post.id}`}>
                  <MessageCircle className="h-4 w-4" /> {post.commentCount}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => bookmarkMutation.mutate()}>
                <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.message('Share endpoint not implemented yet.')}
              >
                <Repeat2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
