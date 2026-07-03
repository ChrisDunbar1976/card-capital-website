import Image from "next/image";
import Link from "next/link";

const GAMES = [
  { name: "Rummy", icon: "🃏" },
  { name: "Poker", icon: "♠️" },
  { name: "Blackjack", icon: "🂡" },
  { name: "Solitaire", icon: "♦️" },
  { name: "Hearts", icon: "♥️" },
  { name: "Spades", icon: "♣️" },
];

const PILLARS = [
  {
    emoji: "🃏",
    title: "Play",
    description:
      "60 card games across 9 categories. Play solo against AI opponents at the Western Saloon table, or go head-to-head with players worldwide.",
    href: "/play",
    cta: "Browse Games",
  },
  {
    emoji: "📰",
    title: "News",
    description:
      "The latest from the world of card games. Strategy guides, tournament coverage, and curated articles delivered fresh daily.",
    href: "/news",
    cta: "Read News",
  },
  {
    emoji: "💬",
    title: "Community",
    description:
      "Share strategies, discuss games, and connect with fellow card players. Your game stats and achievements on display.",
    href: "/community",
    cta: "Join the Discussion",
  },
];

const FEATURES = [
  {
    emoji: "🤖",
    title: "AI Opponents",
    description: "12 unique characters with distinct play styles, from cautious Cora to daring Dutch.",
  },
  {
    emoji: "🌐",
    title: "Online Multiplayer",
    description: "Matchmaking, game rooms, and real-time play against players across the globe.",
  },
  {
    emoji: "📊",
    title: "Leaderboards",
    description: "Glicko-2 ranking system. Climb the tiers from Novice to Grandmaster.",
  },
  {
    emoji: "🎁",
    title: "Daily Bonus",
    description: "Log in every day to collect coins and unlock new content.",
  },
  {
    emoji: "📱",
    title: "Cross-Platform",
    description: "Your progress syncs between web, iOS, and Android. One account, everywhere.",
  },
  {
    emoji: "🏜️",
    title: "Western Saloon",
    description: "Immersive table environment with ambient lighting, batwing doors, and character art.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212, 168, 75, 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6 pb-[6svh] sm:pb-[8svh] text-center relative">
          <Image
            src="/card-capital-logo.png"
            alt="Card Capital"
            width={537}
            height={580}
            priority
            className="mx-auto mb-[2vw] sm:mb-[2.25rem] w-[38vw] sm:w-48 md:w-56 lg:w-60 h-auto"
          />

          <h1
            className="font-bold tracking-tight mb-[2vw] sm:mb-[1.625rem]"
            style={{
              fontSize: "var(--font-size-fluid-4xl)",
              lineHeight: 1.1,
              color: "var(--color-accent-gold)",
            }}
          >
            60 Card Games: One Table
          </h1>

          <p
            className="max-w-xl mx-auto mb-[2vw] sm:mb-4"
            style={{
              fontSize: "var(--font-size-fluid-lg)",
              color: "var(--color-text-secondary)",
            }}
          >
            Play solo against AI opponents or challenge players worldwide at
            the Western Saloon.
          </p>
          <p
            className="max-w-xl mx-auto mb-[4vw] sm:mb-8"
            style={{
              fontSize: "var(--font-size-fluid-lg)",
              color: "var(--color-text-secondary)",
            }}
          >
            Available on web, iOS, and Android.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/play"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all hover:brightness-110 hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--color-accent-gold)",
                color: "var(--color-text-inverse)",
              }}
            >
              Start Playing
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm sm:text-base border transition-colors hover:bg-white/5"
              style={{
                borderColor: "var(--color-surface-divider)",
                color: "var(--color-text-secondary)",
              }}
            >
              Learn More
            </Link>
          </div>

          {/* Game ticker */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
            {GAMES.map((game) => (
              <span
                key={game.name}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  border: "1px solid var(--color-surface-divider)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <span>{game.icon}</span>
                {game.name}
              </span>
            ))}
            <span
              className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium"
              style={{
                backgroundColor: "var(--color-surface-highlight)",
                color: "var(--color-accent-gold)",
              }}
            >
              +54 more
            </span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        className="h-px max-w-4xl mx-auto"
        style={{ backgroundColor: "var(--color-surface-divider)" }}
      />

      {/* Three Pillars */}
      <section className="max-w-6xl mx-auto px-4 py-[6svh] sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="group rounded-2xl p-6 transition-all hover:scale-[1.02] hover:brightness-110"
              style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-surface-divider)",
              }}
            >
              <span className="text-3xl mb-4 block">{pillar.emoji}</span>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "var(--color-accent-gold)" }}
              >
                {pillar.title}
              </h2>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {pillar.description}
              </p>
              <span
                className="text-sm font-semibold inline-flex items-center gap-1 transition-colors group-hover:brightness-110"
                style={{ color: "var(--color-accent-gold)" }}
              >
                {pillar.cta}
                <span className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="py-[6svh] sm:py-24"
        style={{ backgroundColor: "var(--color-bg-secondary)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2
            className="text-center font-bold mb-3"
            style={{
              fontSize: "var(--font-size-fluid-2xl)",
              color: "var(--color-accent-gold)",
            }}
          >
            Everything at the Table
          </h2>
          <p
            className="text-center max-w-lg mx-auto mb-12"
            style={{
              fontSize: "var(--font-size-fluid-base)",
              color: "var(--color-text-secondary)",
            }}
          >
            Built for card game lovers. Whether you play for five minutes or
            five hours.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl p-5"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  border: "1px solid var(--color-surface-divider)",
                }}
              >
                <span className="text-2xl mb-3 block">{feature.emoji}</span>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-[6svh] sm:py-24 text-center">
        <h2
          className="font-bold mb-4"
          style={{
            fontSize: "var(--font-size-fluid-3xl)",
            color: "var(--color-accent-gold)",
          }}
        >
          Ready to Deal?
        </h2>
        <p
          className="max-w-md mx-auto mb-8"
          style={{
            fontSize: "var(--font-size-fluid-base)",
            color: "var(--color-text-secondary)",
          }}
        >
          Create a free account and start playing. Your progress carries across
          web, iOS, and Android.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:brightness-110 hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--color-accent-gold)",
            color: "var(--color-text-inverse)",
          }}
        >
          Create Free Account
        </Link>
      </section>
    </>
  );
}
