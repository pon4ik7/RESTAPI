import { FeedList } from '@/components/feed/feed-list';
import { PostComposer } from '@/components/feed/post-composer';

export default function FeedPage(): JSX.Element {
  return (
    <section className="mx-auto max-w-2xl">
      <PostComposer />
      <FeedList />
    </section>
  );
}
