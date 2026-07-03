import { Reveal } from '@/components/motion/Reveal';
import { SectionEyebrow } from './SectionEyebrow';

const FEATURES = [
  {
    title: 'Online multiplayer',
    body: 'Matchmaking and private game rooms. Real people, real time.',
  },
  {
    title: 'Glicko-2 leaderboards',
    body: 'A proper rating system — climb from Novice to Grandmaster.',
  },
  {
    title: 'Friends',
    body: 'Friend codes, QR invites, and a table that’s always open.',
  },
  {
    title: 'Daily bonus',
    body: 'Show up, collect coins, keep your streak honest.',
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Ruby', tier: 'Grandmaster', rating: 2104 },
  { rank: 2, name: 'Dutch', tier: 'Master', rating: 1987 },
  { rank: 3, name: 'Belle', tier: 'Master', rating: 1922 },
  { rank: 4, name: 'Cole', tier: 'Expert', rating: 1846 },
  { rank: 5, name: 'Carmen', tier: 'Expert', rating: 1790 },
];

const TIER_COLORS: Record<string, string> = {
  Grandmaster: '#E0BE6A',
  Master: '#C0C6CE',
  Expert: '#B08D57',
};

export function WorldSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <Reveal>
          <div>
            <SectionEyebrow suit="♦">Beyond the Table</SectionEyebrow>
            <h2
              className="mb-5 font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-fluid-3xl)',
                lineHeight: 1.15,
              }}
            >
              A whole card room, not just a deck.
            </h2>
            <div className="flex flex-col gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <span
                    className="mt-1 h-2 w-2 flex-none rotate-45"
                    style={{ backgroundColor: 'var(--color-accent-gold)' }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="mb-0.5 font-semibold">{f.title}</h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {f.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p
              className="mt-7 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              One account. Progress syncs across web, iOS and Android.
            </p>
          </div>
        </Reveal>

        {/* Mock leaderboard panel */}
        <Reveal direction="left">
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-gold-hairline)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              className="mb-4 flex items-center justify-between border-b pb-3"
              style={{ borderColor: 'var(--color-gold-hairline)' }}
            >
              <h3
                className="font-semibold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-accent-gold)',
                }}
              >
                Leaderboard
              </h3>
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                This season
              </span>
            </div>
            <ol className="flex flex-col">
              {LEADERBOARD.map((row, i) => (
                <Reveal key={row.rank} delay={i * 0.08} direction="up">
                  <li
                    className="flex items-center gap-4 border-b py-3 last:border-b-0"
                    style={{ borderColor: 'var(--color-surface-divider)' }}
                  >
                    <span
                      className="w-6 text-center text-lg font-semibold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color:
                          row.rank === 1
                            ? 'var(--color-accent-gold)'
                            : 'var(--color-text-muted)',
                      }}
                    >
                      {row.rank}
                    </span>
                    <span className="flex-1 font-medium">{row.name}</span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                      style={{
                        color: TIER_COLORS[row.tier],
                        border: `1px solid ${TIER_COLORS[row.tier]}55`,
                        backgroundColor: `${TIER_COLORS[row.tier]}14`,
                      }}
                    >
                      {row.tier}
                    </span>
                    <span
                      className="w-14 text-right text-sm tabular-nums"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {row.rating}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
