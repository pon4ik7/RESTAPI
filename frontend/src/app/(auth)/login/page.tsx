'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useAuth } from '@/providers/auth-provider';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const schema = z.object({
  login: z.string().min(3),
  password: z.string().min(6)
});

type FormData = z.infer<typeof schema>;

export default function LoginPage(): JSX.Element {
  const { login, isLoading } = useAuth();
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            try {
              await login(values);
              toast.success('Welcome back');
            } catch (error) {
              toast.error((error as Error).message || 'Login failed');
            }
          })}
        >
          <Input placeholder="Email or username" {...form.register('login')} />
          <Input type="password" placeholder="Password" {...form.register('password')} />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          No account?{' '}
          <Link className="text-primary underline" href="/register">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
