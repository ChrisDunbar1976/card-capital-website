import type { Metadata } from 'next';
import { SectionEyebrow } from '@/components/home/SectionEyebrow';

export const metadata: Metadata = {
  title: 'Play',
  description: 'The Card Capital game library — 60 card games in your browser.',
};

export default function PlayPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-28 text-center">
      <SectionEyebrow suit="♠">The Games</SectionEyebrow>
      <h1
        className="mb-4 font-semibold"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-size-fluid-3xl)',
          lineHeight: 1.15,
        }}
      >
        The table is being set.
      </h1>
      <p
        className="mx-auto max-w-md"
        style={{
          fontSize: 'var(--font-size-fluid-base)',
          color: 'var(--color-text-secondary)',
        }}
      >
        60 card games are on their way to the browser — Rummy, Poker,
        Blackjack, Solitaire and the rest of the deck. Until then, the saloon
        regulars are keeping your seat warm.
      </p>
    </section>
  );
}
