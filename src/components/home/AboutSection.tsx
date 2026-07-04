import { Reveal } from '@/components/motion/Reveal';
import { SectionEyebrow } from './SectionEyebrow';

const POINTS = [
  {
    title: 'The whole deck',
    body: 'Rummy, Poker, Blackjack, Hearts, Solitaire and dozens more — one home for every card game you know, and a few you don’t.',
  },
  {
    title: 'Characters, not bots',
    body: 'Sit across from the saloon regulars. Each one plays with a personality of their own — bluffing, needling, and playing to win.',
  },
  {
    title: 'One account everywhere',
    body: 'Your stats, coins and progress follow you across web, iOS and Android. Free to play, no strings.',
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 py-20 sm:py-28"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="mx-auto max-w-4xl px-4 text-center">
        <Reveal>
          <SectionEyebrow suit="♠">About Card Capital</SectionEyebrow>
          <h2
            className="mb-5 font-semibold"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--font-size-fluid-3xl)',
              lineHeight: 1.15,
            }}
          >
            A saloon for the whole deck.
          </h2>
          <p
            className="mx-auto max-w-2xl"
            style={{
              fontSize: 'var(--font-size-fluid-base)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Card Capital brings every card game to a single table with the warmth
            of an old-world saloon. Play solo against opponents with real
            personality, or against players worldwide &mdash; on the web today,
            and on iOS and Android soon.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
          {POINTS.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.09}>
              <div
                className="h-full rounded-2xl p-6"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-gold-hairline)',
                }}
              >
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-accent-gold)',
                  }}
                >
                  {point.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {point.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
