'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usersApi } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';

export default function SettingsPage(): JSX.Element {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const form = useForm({
    values: {
      username: user?.username || '',
      avatarUrl: user?.avatarUrl || '',
      bio: user?.bio || ''
    }
  });

  const mutation = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: (updated) => {
      queryClient.setQueryData(['me'], updated);
      toast.success('Profile updated');
    },
    onError: () => toast.error('Could not update profile')
  });

  return (
    <section className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => {
              mutation.mutate(values);
            })}
          >
            <Input placeholder="Username" {...form.register('username')} />
            <Input placeholder="Avatar URL" {...form.register('avatarUrl')} />
            <Textarea placeholder="Bio" {...form.register('bio')} />
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={mutation.isPending}>
                Save changes
              </Button>
              <Button type="button" variant="outline" onClick={() => void logout()}>
                Logout
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
