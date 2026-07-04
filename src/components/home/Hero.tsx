import Image from "next/image";
import Link from "next/link";
import { HeroSetPieceLazy } from "./HeroSetPieceLazy";

/**
 * Server-rendered hero — headline, sub-line and CTAs are all in the SSR HTML
 * (LCP-safe). The animated set-piece is a decorative client-only layer behind.
 * Text entrances are pure CSS (animation-fill-mode: backwards + delays).
 */
export function Hero() {
  return (
    <section className="felt-surface felt-vignette relative flex min-h-[92svh] items-center justify-center overflow-hidden">
      {/* Decorative animated layer (cards + chips) */}
      <HeroSetPieceLazy />

      {/* Ambient gold glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 20%, rgba(212, 168, 75, 0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-3xl flex-col items-center px-4 pb-16 pt-7 text-center">
        <Image
          src="/card-capital-logo-white.png"
          alt="Card Capital"
          width={360}
          height={388}
          priority
          className="hero-enter-logo mx-auto h-auto w-28 sm:w-36"
        />

        {/* Reserved space for the animated card fan (rendered behind) */}
        <div aria-hidden className="h-[210px] sm:h-[288px]" />

        <p
          className="hero-enter-sub mx-auto mb-9 max-w-xl"
          style={{
            fontSize: "var(--font-size-fluid-lg)",
            color: "var(--color-text-secondary)",
          }}
        >
          Rummy, Poker, Blackjack, Hearts — and the rest of the deck. Played at
          one saloon table against characters with real personality, or players
          worldwide.
        </p>

        <div className="hero-enter-cta flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#about"
            className="inline-flex items-center rounded-lg px-7 py-3 text-sm font-semibold transition-all hover:brightness-110 sm:text-base"
            style={{
              background: "var(--gradient-gold)",
              color: "var(--color-text-inverse)",
              boxShadow: "0 4px 14px rgba(212, 168, 75, 0.25)",
            }}
          >
            About
          </a>
          <Link
            href="/sign-in"
            className="inline-flex items-center rounded-lg border px-7 py-3 text-sm font-semibold transition-colors hover:bg-white/5 sm:text-base"
            style={{
              borderColor: "var(--color-gold-hairline-bright)",
              color: "var(--color-accent-cream)",
            }}
          >
            Create Free Account
          </Link>
        </div>

        <p
          className="hero-enter-trust mt-7 text-xs sm:text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Free to play &middot; One account everywhere &middot; iOS &amp;
          Android coming soon
        </p>
      </div>

      {/* Scroll cue */}
      <div
        className="scroll-cue hero-enter-trust absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
        style={{ color: "var(--color-accent-gold)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
