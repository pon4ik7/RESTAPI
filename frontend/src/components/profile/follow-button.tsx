'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { usersApi } from '@/lib/api';

import { Button } from '../ui/button';

export function FollowButton({ username }: { username: string }): JSX.Element {
  const [isFollowing, setFollowing] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        await usersApi.unfollowUser(username);
      } else {
        await usersApi.followUser(username);
      }
    },
    onSuccess: () => {
      setFollowing((v) => !v);
      toast.success(isFollowing ? 'Unfollowed' : 'Following');
    },
    onError: () => toast.error('Could not update follow state')
  });

  return (
    <Button variant={isFollowing ? 'secondary' : 'default'} onClick={() => mutation.mutate()}>
      {mutation.isPending ? 'Please wait...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
