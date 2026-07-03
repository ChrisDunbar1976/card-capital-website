import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, TOTAL_GAMES, categorysuit, type GameInfo } from '@/data/games';
import { Reveal } from '@/components/motion/Reveal';
import { SectionEyebrow } from '@/components/home/SectionEyebrow';

export const metadata: Metadata = {
  title: 'Games',
  description: `Browse the Card Capital game library — ${TOTAL_GAMES} card games across ${CATEGORIES.length} categories.`,
};

export default function PlayPage() {
  return (
    <>
      {/* Hero */}
      <section className="felt-surface relative overflow-hidden">
        <div className="felt-vignette" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <SectionEyebrow suit="♠">The Games</SectionEyebrow>
          <h1
            className="mb-4 font-semibold"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--font-size-fluid-4xl)',
              lineHeight: 1.1,
            }}
          >
            Pick your game.
          </h1>
          <p
            className="mx-auto max-w-lg"
            style={{
              fontSize: 'var(--font-size-fluid-base)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {TOTAL_GAMES} card games across {CATEGORIES.length} categories
            &mdash; from five-minute shedders to full contract bridge. Solo,
            with friends, or against the saloon&rsquo;s sharpest AI.
          </p>
        </div>
      </section>

      {/* Category nav */}
      <nav
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: 'rgba(11, 40, 24, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: 'var(--color-gold-hairline)',
        }}
      >
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-3">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors hover:text-white"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-gold-hairline)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {cat.name}
                <span
                  className="rounded-full px-1.5 py-px text-[11px] tabular-nums"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {cat.games.length}
                </span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Game catalogue */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {CATEGORIES.map((cat, ci) => (
          <section
            key={cat.id}
            id={cat.id}
            className="mb-16 last:mb-0"
            style={{ scrollMarginTop: '5rem' }}
          >
            <Reveal>
              <div className="mb-6">
                <div className="mb-1 flex items-center gap-3">
                  <span
                    className="text-lg"
                    style={{ color: 'var(--color-accent-gold)' }}
                    aria-hidden="true"
                  >
                    {categorysuit(ci)}
                  </span>
                  <h2
                    className="font-semibold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--font-size-fluid-2xl)',
                      lineHeight: 1.2,
                    }}
                  >
                    {cat.name}
                  </h2>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums"
                    style={{
                      color: 'var(--color-accent-gold)',
                      backgroundColor: 'var(--color-surface-highlight)',
                    }}
                  >
                    {cat.games.length}
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {cat.tagline}
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...cat.games]
                .sort((a, b) => b.priority - a.priority)
                .map((game, gi) => (
                  <Reveal key={game.id} delay={gi * 0.04}>
                    <GameTile game={game} />
                  </Reveal>
                ))}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="felt-surface relative overflow-hidden">
        <div className="felt-vignette" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <Reveal>
            <h2
              className="mb-4 font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-fluid-3xl)',
                lineHeight: 1.15,
              }}
            >
              The app is the fastest way to the&nbsp;table.
            </h2>
            <p
              className="mx-auto mb-8 max-w-md"
              style={{
                fontSize: 'var(--font-size-fluid-base)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Download Card Capital for iOS and Android. All {TOTAL_GAMES} games,
              offline AI, online multiplayer, and the Western Saloon.
            </p>
            <Link
              href="/"
              className="inline-block rounded-full px-8 py-3 font-semibold transition-transform hover:scale-105"
              style={{
                background: 'var(--gradient-gold)',
                color: 'var(--color-text-inverse)',
              }}
            >
              Back to the saloon
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function GameTile({ game }: { game: GameInfo }) {
  const subtitle = game.players === '1' ? 'Solo' : `${game.players} players`;

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3
            className="font-semibold leading-snug"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {game.name}
          </h3>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {subtitle}
          </p>
        </div>
        {game.gambling && (
          <span
            className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{
              color: 'var(--color-accent-amber)',
              backgroundColor: 'rgba(245, 166, 35, 0.12)',
              border: '1px solid rgba(245, 166, 35, 0.2)',
            }}
          >
            Chips
          </span>
        )}
      </div>
      {game.href && (
        <span
          className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{
            color: 'var(--color-accent-gold)',
            backgroundColor: 'var(--color-surface-highlight)',
            border: '1px solid var(--color-gold-hairline-bright)',
          }}
        >
          Play now →
        </span>
      )}
    </>
  );

  if (game.href) {
    return (
      <Link
        href={game.href}
        className="hover-lift block rounded-xl p-4"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-gold-hairline-bright)',
        }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className="hover-lift rounded-xl p-4"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-gold-hairline)',
      }}
    >
      {inner}
    </div>
  );
}
