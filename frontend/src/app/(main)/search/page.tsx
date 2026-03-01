'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { EndpointBanner } from '@/components/common/endpoint-banner';
import { PageEmpty } from '@/components/common/page-empty';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isEndpointMissing, searchApi } from '@/lib/api';

export default function SearchPage(): JSX.Element {
  const [q, setQ] = useState('');

  const query = useQuery({
    queryKey: ['search', q],
    queryFn: () => searchApi.searchEverything(q),
    enabled: q.trim().length >= 2
  });

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Search</h1>
      <Input placeholder="Search users or posts" value={q} onChange={(e) => setQ(e.target.value)} />

      {query.error && isEndpointMissing(query.error) && <EndpointBanner />}

      {query.data && (
        <>
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Users</h2>
            {!query.data.users.length && <PageEmpty title="No users found" description="Try a different keyword." />}
            {query.data.users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4 text-sm">
                  <Link href={`/profile/${user.username}`} className="font-semibold hover:underline">
                    @{user.username}
                  </Link>
                  <div className="text-muted-foreground">{user.bio || 'No bio'}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Posts</h2>
            {!query.data.posts.length && <PageEmpty title="No posts found" description="Try a different keyword." />}
            {query.data.posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4 text-sm">
                  <Link href={`/post/${post.id}`} className="font-semibold hover:underline">
                    @{post.author.username}
                  </Link>
                  <p className="mt-2">{post.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
