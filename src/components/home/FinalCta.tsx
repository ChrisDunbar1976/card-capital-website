import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { PlayingCard } from '@/components/cards/PlayingCard';

const FAN = [-28, -14, 0, 14, 28];

export function FinalCta() {
  return (
    <section className="felt-surface felt-vignette relative overflow-hidden py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        {/* Static fan of card backs — bookends the hero */}
        <div
          className="relative mx-auto mb-10 h-32 w-72"
          aria-hidden="true"
        >
          {FAN.map((rot, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1"
              style={{
                transform: `translateX(-50%) rotate(${rot}deg)`,
                transformOrigin: '50% 125%',
                filter: 'drop-shadow(0 8px 14px rgba(0, 0, 0, 0.45))',
              }}
            >
              <PlayingCard faceDown width={76} />
            </div>
          ))}
        </div>

        <Reveal>
          <h2
            className="mb-4 font-semibold"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--font-size-fluid-4xl)',
              lineHeight: 1.1,
            }}
          >
            <span className="text-gradient-gold">Pull up a chair.</span>
          </h2>
          <p
            className="mx-auto mb-9 max-w-md"
            style={{
              fontSize: 'var(--font-size-fluid-base)',
              color: 'var(--color-text-secondary)',
            }}
          >
            A free account keeps your seat — stats, coins and progress carry
            across web, iOS and Android.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/play"
              className="inline-flex items-center rounded-lg px-8 py-3.5 text-base font-semibold transition-all hover:brightness-110"
              style={{
                background: 'var(--gradient-gold)',
                color: 'var(--color-text-inverse)',
                boxShadow: '0 4px 14px rgba(212, 168, 75, 0.25)',
              }}
            >
              Play Free on Web
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center rounded-lg border px-8 py-3.5 text-base font-semibold transition-colors hover:bg-white/5"
              style={{
                borderColor: 'var(--color-gold-hairline-bright)',
                color: 'var(--color-accent-cream)',
              }}
            >
              Create free account
            </Link>
          </div>

          <p
            className="mt-7 text-xs sm:text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Coming soon to the App Store and Google Play.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
