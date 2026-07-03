import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: 'var(--color-surface-divider)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/card-capital-logo.png"
                alt="Card Capital"
                width={32}
                height={32}
              />
              <span
                className="font-bold"
                style={{ color: 'var(--color-accent-gold)' }}
              >
                Card Capital
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              60 card games. One table. Play solo against AI or challenge players worldwide.
            </p>
          </div>

          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Explore
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/play"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Play Games
              </Link>
              <Link
                href="/news"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: 'var(--color-text-muted)' }}
              >
                News
              </Link>
              <Link
                href="/community"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Community
              </Link>
            </div>
          </div>

          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Legal
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/privacy"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div
          className="border-t mt-8 pt-6 text-center text-sm"
          style={{
            borderColor: 'var(--color-surface-divider)',
            color: 'var(--color-text-muted)',
          }}
        >
          &copy; {new Date().getFullYear()} Rhubarb Press Ltd. All rights reserved.
          <span className="block mt-1" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
            v{process.env.NEXT_PUBLIC_APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
}
