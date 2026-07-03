import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SectionEyebrow } from '@/components/home/SectionEyebrow';
import { FriendCode } from './FriendCode';

const FAN_CARDS = [
  { src: '/cards/face-king-spades.webp', alt: 'King of Spades', rot: -15, x: -60, y: 12 },
  { src: '/cards/face-queen-hearts.webp', alt: 'Queen of Hearts', rot: -5, x: -20, y: 2 },
  { src: '/cards/face-jack-diamonds.webp', alt: 'Jack of Diamonds', rot: 5, x: 20, y: 2 },
  { src: '/cards/face-king-clubs.webp', alt: 'King of Clubs', rot: 15, x: 60, y: 12 },
];

export const metadata: Metadata = {
  title: 'My Table',
  description: 'Your seat at the Card Capital saloon.',
};

interface Profile {
  display_name: string;
  friend_code: string;
  coins: number;
  created_at: string;
}

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Europe/London',
    }).format(new Date()),
  );
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

function memberSince(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).format(new Date(iso));
}

const QUICK_LINKS = [
  {
    title: 'Join the community',
    body: 'Strategy talk, rules debates and table stories.',
    href: '/community',
    cta: 'Pull up a chair',
    suit: '♣',
  },
  {
    title: 'Read the news',
    body: 'Stories from the world of card games, curated daily.',
    href: '/news',
    cta: 'See the latest',
    suit: '♥',
  },
];

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?redirect=/dashboard');
  }

  const [{ data: profile }, { count: friendCount }] = await Promise.all([
    supabase
      .from('profiles')
      .select('display_name, friend_code, coins, created_at')
      .eq('id', user.id)
      .single<Profile>(),
    supabase
      .from('friendships')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  const name =
    profile?.display_name ||
    (user.user_metadata?.display_name as string) ||
    (user.user_metadata?.full_name as string) ||
    user.email?.split('@')[0] ||
    'Player';

  return (
    <>
      {/* Welcome band */}
      <section className="felt-surface relative overflow-hidden">
        <div className="felt-vignette" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-16 sm:pb-16 sm:pt-24 lg:grid-cols-[1fr_auto]">
          <div>
            <SectionEyebrow suit="♦">My Table</SectionEyebrow>
            <h1
              className="mb-2 font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-fluid-4xl)',
                lineHeight: 1.1,
              }}
            >
              {greeting()}, {name}.
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-fluid-base)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {profile
                ? `At the table since ${memberSince(profile.created_at)}.`
                : 'Your seat is reserved.'}
            </p>
          </div>

          {/* Card fan — same 4 face cards as landing hero */}
          <div
            className="relative hidden h-44 w-72 lg:block"
            aria-hidden="true"
          >
            {FAN_CARDS.map((card, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: 110,
                  aspectRatio: '5 / 7',
                  transform: `translate(calc(-50% + ${card.x}px), calc(-50% + ${card.y}px)) rotate(${card.rot}deg)`,
                  zIndex: i,
                }}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={400}
                  height={534}
                  className="h-full w-full object-cover"
                  style={{
                    borderRadius: 10,
                    boxShadow: 'var(--shadow-card)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Stat panels */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Friend code */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-gold-hairline)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <p
              className="mb-1 text-xs font-semibold uppercase"
              style={{
                letterSpacing: '0.14em',
                color: 'var(--color-text-muted)',
              }}
            >
              Friend code
            </p>
            {profile?.friend_code ? (
              <FriendCode code={profile.friend_code} />
            ) : (
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Open the app to generate your friend code.
              </p>
            )}
            <p
              className="mt-2 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Share it so friends can find you at the table.
            </p>
          </div>

          {/* Games */}
          <Link
            href="/play"
            className="hover-lift group rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-gold-hairline)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <p
              className="mb-1 text-xs font-semibold uppercase"
              style={{
                letterSpacing: '0.14em',
                color: 'var(--color-text-muted)',
              }}
            >
              Games
            </p>
            <p
              className="text-3xl font-semibold tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-gold)',
              }}
            >
              62
              <span
                className="ml-2 text-base font-normal"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                card games
              </span>
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Browse the full library &mdash; Poker, Rummy, Solitaire and
              more.{' '}
              <span
                className="font-semibold"
                style={{ color: 'var(--color-accent-gold)' }}
              >
                Pick a game &rarr;
              </span>
            </p>
          </Link>

          {/* Friends */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-gold-hairline)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <p
              className="mb-1 text-xs font-semibold uppercase"
              style={{
                letterSpacing: '0.14em',
                color: 'var(--color-text-muted)',
              }}
            >
              Friends
            </p>
            <p
              className="text-3xl font-semibold tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-gold)',
              }}
            >
              {friendCount ?? 0}
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {(friendCount ?? 0) > 0
                ? 'Regulars who know your name.'
                : 'Invite a friend — the table plays better with company.'}
            </p>
          </div>
        </div>

        {/* Stats row — bankroll + online record */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Bankroll */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-gold-hairline)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <p
              className="mb-1 text-xs font-semibold uppercase"
              style={{
                letterSpacing: '0.14em',
                color: 'var(--color-text-muted)',
              }}
            >
              Bankroll
            </p>
            <p
              className="text-3xl font-semibold tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-gold)',
              }}
            >
              {(profile?.coins ?? 0).toLocaleString('en-GB')}
              <span
                className="ml-2 text-base font-normal"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                coins
              </span>
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Collect your daily bonus in the app to keep the stack growing.
            </p>
          </div>

          {/* Online record */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-gold-hairline)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="mb-1 text-xs font-semibold uppercase"
                  style={{
                    letterSpacing: '0.14em',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Online record
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Ratings, win counts and leaderboard standing come from online
                  multiplayer. Play a match and your record appears here.
                </p>
              </div>
              <span
                className="mt-1 shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{
                  color: 'var(--color-accent-gold)',
                  border: '1px solid var(--color-gold-hairline-bright)',
                  backgroundColor: 'var(--color-surface-highlight)',
                }}
              >
                Unrated
              </span>
            </div>
          </div>
        </div>

        {/* Bottom row — profile + quick links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Profile */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-gold-hairline)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <span
              className="text-xl"
              style={{ color: 'var(--color-accent-gold)' }}
              aria-hidden="true"
            >
              ♠
            </span>
            <h3
              className="mt-2 mb-1 font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {name}
            </h3>
            <p
              className="mb-1 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {user.email}
            </p>
            <p
              className="mb-1 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {user.app_metadata?.provider === 'google'
                ? 'Signed in with Google'
                : user.app_metadata?.provider === 'apple'
                  ? 'Signed in with Apple'
                  : 'Email account'}
            </p>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {profile
                ? `Member since ${memberSince(profile.created_at)}`
                : 'New to the table'}
            </p>
          </div>

          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover-lift group block rounded-2xl p-6"
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
                {link.suit}
              </span>
              <h3
                className="mt-2 mb-1 font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {link.title}
              </h3>
              <p
                className="mb-3 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {link.body}
              </p>
              <span
                className="inline-flex items-center gap-1 text-sm font-semibold"
                style={{ color: 'var(--color-accent-gold)' }}
              >
                {link.cta}
                <span className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
