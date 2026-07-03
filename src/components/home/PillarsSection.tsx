import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { SectionEyebrow } from './SectionEyebrow';

const ICON_PROPS = {
  width: 28,
  height: 28,
  fill: 'none',
  stroke: 'var(--color-accent-gold)',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const PILLARS = [
  {
    title: 'Play',
    description:
      'The full library in your browser. Solo against the saloon regulars, or online against the world.',
    href: '/play',
    cta: 'Browse games',
    icon: (
      <svg {...ICON_PROPS} viewBox="0 0 24 24" aria-hidden="true">
        {/* Two overlapping cards */}
        <rect x="3" y="5" width="11" height="15" rx="1.5" transform="rotate(-8 8.5 12.5)" />
        <rect x="10" y="4" width="11" height="15" rx="1.5" transform="rotate(8 15.5 11.5)" />
      </svg>
    ),
  },
  {
    title: 'News',
    description:
      'Strategy, tournament coverage and stories from the world of card games. Curated daily.',
    href: '/news',
    cta: 'Read the latest',
    icon: (
      <svg {...ICON_PROPS} viewBox="0 0 24 24" aria-hidden="true">
        {/* Newspaper */}
        <rect x="3" y="5" width="15" height="15" rx="1.5" />
        <path d="M18 9h2a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H5" />
        <path d="M6.5 9h8M6.5 12.5h8M6.5 16h5" />
      </svg>
    ),
  },
  {
    title: 'Community',
    description:
      'Table talk without the table stakes. Share hands, argue rules, find opponents.',
    href: '/community',
    cta: 'Join the discussion',
    icon: (
      <svg {...ICON_PROPS} viewBox="0 0 24 24" aria-hidden="true">
        {/* Speech bubbles */}
        <path d="M14 4h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-3-3h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        <path d="M10 9H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v3l3-3h1a2 2 0 0 0 2-2v-1" />
      </svg>
    ),
  },
];

export function PillarsSection() {
  return (
    <section
      className="py-20 sm:py-28"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="mb-12 text-center">
            <SectionEyebrow suit="♣">More Than an App</SectionEyebrow>
            <h2
              className="font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-fluid-3xl)',
                lineHeight: 1.15,
              }}
            >
              Three rooms, one saloon.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.09}>
              <Link
                href={pillar.href}
                className="hover-lift group block rounded-2xl p-6"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-gold-hairline)',
                }}
              >
                <span className="mb-4 block">{pillar.icon}</span>
                <h3
                  className="mb-2 text-xl font-semibold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-accent-gold)',
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="mb-4 text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {pillar.description}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-sm font-semibold"
                  style={{ color: 'var(--color-accent-gold)' }}
                >
                  {pillar.cta}
                  <span className="transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
