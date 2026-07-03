import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { SectionEyebrow } from '@/components/home/SectionEyebrow';

export const metadata: Metadata = {
  title: 'Community',
  description:
    'The Card Capital community — strategy talk, rules debates, and table stories.',
};

const BOARDS = [
  {
    name: 'Strategy & Tips',
    description: 'Game strategies, winning techniques, and hand analysis.',
    threads: 124,
    suit: '♠',
  },
  {
    name: 'Rules & Disputes',
    description: 'Settle arguments and clarify edge cases, once and for all.',
    threads: 89,
    suit: '♦',
  },
  {
    name: 'General Discussion',
    description: 'Table talk, introductions, and anything off the felt.',
    threads: 203,
    suit: '♣',
  },
  {
    name: 'Show & Tell',
    description: 'Share winning hands, epic streaks, and achievements.',
    threads: 67,
    suit: '♥',
  },
  {
    name: 'Feature Requests',
    description: 'Tell us what you want to see next in Card Capital.',
    threads: 41,
    suit: '♠',
  },
  {
    name: 'Help & Support',
    description: 'Questions, bug reports, and getting started guides.',
    threads: 56,
    suit: '♣',
  },
];

const THREADS = [
  {
    title: 'Can you play a Jack on anything in Switch?',
    author: 'Belle',
    board: 'Rules & Disputes',
    replies: 67,
    timeAgo: '3 hours ago',
    pinned: false,
    hot: true,
  },
  {
    title: 'My first Grandmaster rating!',
    author: 'Carmen',
    board: 'Show & Tell',
    replies: 12,
    timeAgo: '1 hour ago',
    pinned: false,
    hot: false,
  },
  {
    title: 'When to go nil in Spades — the maths',
    author: 'Ruby',
    board: 'Strategy & Tips',
    replies: 45,
    timeAgo: '5 hours ago',
    pinned: false,
    hot: true,
  },
  {
    title: 'Stacking 2s: official rules vs. house rules',
    author: 'Cole',
    board: 'Rules & Disputes',
    replies: 34,
    timeAgo: '6 hours ago',
    pinned: false,
    hot: false,
  },
  {
    title: 'Blackjack basic strategy chart for beginners',
    author: 'Reginald',
    board: 'Strategy & Tips',
    replies: 31,
    timeAgo: '1 day ago',
    pinned: false,
    hot: false,
  },
  {
    title: 'What card game does your family always argue about?',
    author: 'Etta',
    board: 'General Discussion',
    replies: 89,
    timeAgo: '4 days ago',
    pinned: false,
    hot: true,
  },
  {
    title: 'Poker night stories thread',
    author: 'Clyde',
    board: 'General Discussion',
    replies: 56,
    timeAgo: '2 days ago',
    pinned: false,
    hot: false,
  },
  {
    title: 'Best Gin Rummy opening — discard high or hold?',
    author: 'Dutch',
    board: 'Strategy & Tips',
    replies: 23,
    timeAgo: '2 days ago',
    pinned: false,
    hot: false,
  },
];

const HOUSE_RULES = [
  'Be respectful at the table — disagree with the argument, not the person.',
  'No spam, no scams, no dealing from the bottom of the deck.',
  'Keep it about the cards — politics and religion belong at another saloon.',
  'Help newer players. Everyone was a beginner once.',
];

export default function CommunityPage() {
  return (
    <>
      {/* Hero */}
      <section className="felt-surface relative overflow-hidden">
        <div className="felt-vignette" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <SectionEyebrow suit="♣">The Community</SectionEyebrow>
          <h1
            className="mb-4 font-semibold"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--font-size-fluid-4xl)',
              lineHeight: 1.1,
            }}
          >
            Where the regulars meet.
          </h1>
          <p
            className="mx-auto max-w-lg"
            style={{
              fontSize: 'var(--font-size-fluid-base)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Table talk without the table stakes. Strategy debates, rule
            arguments, hand showdowns, and the occasional poker night story.
          </p>
        </div>
      </section>

      {/* Forum boards */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <Reveal>
          <div className="mb-10">
            <SectionEyebrow suit="♠">Boards</SectionEyebrow>
            <h2
              className="font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-fluid-2xl)',
                lineHeight: 1.2,
              }}
            >
              Find your table.
            </h2>
          </div>
        </Reveal>

        <div className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOARDS.map((board, i) => (
            <Reveal key={board.name} delay={i * 0.06}>
              <div
                className="hover-lift rounded-xl p-5"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-gold-hairline)',
                }}
              >
                <span
                  className="text-xl"
                  style={{ color: 'var(--color-accent-gold)' }}
                  aria-hidden="true"
                >
                  {board.suit}
                </span>
                <h3
                  className="mt-2 mb-1 font-semibold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {board.name}
                </h3>
                <p
                  className="mb-3 text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {board.description}
                </p>
                <span
                  className="text-xs tabular-nums"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {board.threads} threads
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trending threads */}
        <Reveal>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <SectionEyebrow suit="♥">Trending</SectionEyebrow>
              <h2
                className="font-semibold"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--font-size-fluid-2xl)',
                  lineHeight: 1.2,
                }}
              >
                What&rsquo;s on the table.
              </h2>
            </div>
          </div>
        </Reveal>

        <div
          className="mb-20 overflow-hidden rounded-2xl"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-gold-hairline)',
          }}
        >
          {THREADS.map((thread, i) => (
            <Reveal key={thread.title} delay={i * 0.04} direction="up">
              <div
                className="flex items-center gap-4 px-5 py-4"
                style={{
                  borderBottom:
                    i < THREADS.length - 1
                      ? '1px solid var(--color-surface-divider)'
                      : 'none',
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate font-medium leading-snug">
                      {thread.title}
                    </h4>
                    {thread.hot && (
                      <span
                        className="shrink-0 rounded-full px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide"
                        style={{
                          color: 'var(--color-accent-red)',
                          backgroundColor: 'rgba(229, 57, 53, 0.12)',
                          border: '1px solid rgba(229, 57, 53, 0.2)',
                        }}
                      >
                        Hot
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-0.5 text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {thread.author}
                    <span className="mx-1.5" aria-hidden="true">
                      &middot;
                    </span>
                    {thread.board}
                    <span className="mx-1.5" aria-hidden="true">
                      &middot;
                    </span>
                    {thread.timeAgo}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className="text-sm tabular-nums"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {thread.replies}
                  </span>
                  <span
                    className="ml-1 text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    replies
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* House rules */}
        <Reveal>
          <div className="mb-8">
            <SectionEyebrow suit="♦">House Rules</SectionEyebrow>
            <h2
              className="mb-5 font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-fluid-2xl)',
                lineHeight: 1.2,
              }}
            >
              The way we play.
            </h2>
            <div className="flex flex-col gap-4">
              {HOUSE_RULES.map((rule) => (
                <div key={rule} className="flex gap-4">
                  <span
                    className="mt-1.5 h-2 w-2 flex-none rotate-45"
                    style={{ backgroundColor: 'var(--color-accent-gold)' }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
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
              Pull up a chair.
            </h2>
            <p
              className="mx-auto mb-8 max-w-md"
              style={{
                fontSize: 'var(--font-size-fluid-base)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Sign in to start a thread, share a hand, or settle a rules dispute
              once and for all.
            </p>
            <Link
              href="/sign-in"
              className="inline-block rounded-full px-8 py-3 font-semibold transition-transform hover:scale-105"
              style={{
                background: 'var(--gradient-gold)',
                color: 'var(--color-text-inverse)',
              }}
            >
              Sign in to join
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
