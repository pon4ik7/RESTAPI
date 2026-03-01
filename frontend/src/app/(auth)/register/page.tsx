'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { useAuth } from '@/providers/auth-provider';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6)
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage(): JSX.Element {
  const { register: registerUser, isLoading } = useAuth();
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Join the learning community</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            try {
              await registerUser(values);
              toast.success('Account created');
            } catch (error) {
              toast.error((error as Error).message || 'Registration failed');
            }
          })}
        >
          <Input placeholder="Email" {...form.register('email')} />
          <Input placeholder="Username" {...form.register('username')} />
          <Input type="password" placeholder="Password" {...form.register('password')} />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create account'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link className="text-primary underline" href="/login">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
