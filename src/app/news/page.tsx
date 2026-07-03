import type { Metadata } from 'next';
import { SectionEyebrow } from '@/components/home/SectionEyebrow';

export const metadata: Metadata = {
  title: 'News',
  description: 'Card game news, strategy and stories — curated daily.',
};

export default function NewsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-28 text-center">
      <SectionEyebrow suit="♥">The News</SectionEyebrow>
      <h1
        className="mb-4 font-semibold"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-size-fluid-3xl)',
          lineHeight: 1.15,
        }}
      >
        The presses are warming up.
      </h1>
      <p
        className="mx-auto max-w-md"
        style={{
          fontSize: 'var(--font-size-fluid-base)',
          color: 'var(--color-text-secondary)',
        }}
      >
        Strategy, tournament coverage and stories from the world of card games
        — curated daily. First edition coming soon.
      </p>
    </section>
  );
}
