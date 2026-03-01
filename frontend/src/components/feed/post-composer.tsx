'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { postsApi } from '@/lib/api';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export function PostComposer(): JSX.Element {
  const [content, setContent] = useState('');
  const [_imageUrl, setImageUrl] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      setContent('');
      setImageUrl('');
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Post published');
    },
    onError: () => toast.error('Could not publish post')
  });

  return (
    <Card className="mb-6">
      <CardContent className="space-y-3 p-4">
        <Textarea
          placeholder="Share what you learned today..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={600}
        />
        <Input placeholder="Optional image URL (placeholder)" value={_imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <div className="flex justify-end">
          <Button
            disabled={content.trim().length < 3 || createMutation.isPending}
            onClick={() => createMutation.mutate({ content: content.trim() })}
          >
            {createMutation.isPending ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
