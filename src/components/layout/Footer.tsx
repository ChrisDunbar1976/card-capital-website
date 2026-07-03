import Link from 'next/link';
import Image from 'next/image';

const EXPLORE = [
  { href: '/play', label: 'Play Games' },
  { href: '/news', label: 'News' },
  { href: '/community', label: 'Community' },
];

const LEGAL = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderTop: '2px solid var(--color-wood-mid)',
        boxShadow: 'inset 0 1px 0 var(--color-gold-hairline)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Image
              src="/card-capital-logo-white.png"
              alt="Card Capital"
              width={144}
              height={155}
              className="mb-4 h-12 w-auto"
            />
            <p
              className="max-w-xs text-sm leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              60 card games. One table. Solo against the saloon regulars, or
              players worldwide.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3
              className="mb-3 text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Explore
            </h3>
            <div className="flex flex-col gap-2">
              {EXPLORE.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="mb-3 text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Legal
            </h3>
            <div className="flex flex-col gap-2">
              {LEGAL.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Get the App */}
          <div>
            <h3
              className="mb-3 text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Get the App
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Coming soon to the App Store and Google Play. Play free on the
              web today.
            </p>
            <Link
              href="/play"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: 'var(--color-accent-gold)' }}
            >
              Play on Web &rarr;
            </Link>
          </div>
        </div>

        {/* Suit divider */}
        <div className="my-10 flex items-center gap-4" aria-hidden="true">
          <div
            className="h-px flex-1"
            style={{ backgroundColor: 'var(--color-gold-hairline)' }}
          />
          <span style={{ color: 'var(--color-accent-gold)' }}>♠</span>
          <div
            className="h-px flex-1"
            style={{ backgroundColor: 'var(--color-gold-hairline)' }}
          />
        </div>

        <div
          className="text-center text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          &copy; {new Date().getFullYear()} Rhubarb Press Ltd. All rights
          reserved.
          <span
            className="mt-1 block text-xs uppercase tracking-widest"
            style={{ opacity: 0.7 }}
          >
            A Rhubarb Press production
          </span>
          <span className="mt-1 block" style={{ opacity: 0.6 }}>
            v{process.env.NEXT_PUBLIC_APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
}
