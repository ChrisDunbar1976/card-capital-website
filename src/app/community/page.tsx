import type { Metadata } from 'next';
import { SectionEyebrow } from '@/components/home/SectionEyebrow';

export const metadata: Metadata = {
  title: 'Community',
  description: 'The Card Capital community — table talk, strategy and rules debates.',
};

export default function CommunityPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-28 text-center">
      <SectionEyebrow suit="♣">The Community</SectionEyebrow>
      <h1
        className="mb-4 font-semibold"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-size-fluid-3xl)',
          lineHeight: 1.15,
        }}
      >
        The back room is under construction.
      </h1>
      <p
        className="mx-auto max-w-md"
        style={{
          fontSize: 'var(--font-size-fluid-base)',
          color: 'var(--color-text-secondary)',
        }}
      >
        Table talk without the table stakes — share hands, argue rules, find
        opponents. Opening soon.
      </p>
    </section>
  );
}
