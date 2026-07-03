import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header
      className="border-b sticky top-0 z-50 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(11, 40, 24, 0.92)',
        borderColor: 'var(--color-surface-divider)',
      }}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center">
          <Image
            src="/card-capital-logo.png"
            alt="Card Capital"
            width={50}
            height={50}
            className="w-[50px] h-[50px]"
          />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/play"
            className="text-sm font-medium transition-colors hover:opacity-80 hidden sm:inline"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Play
          </Link>
          <Link
            href="/news"
            className="text-sm font-medium transition-colors hover:opacity-80 hidden sm:inline"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            News
          </Link>
          <Link
            href="/community"
            className="text-sm font-medium transition-colors hover:opacity-80 hidden sm:inline"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Community
          </Link>
          <Link
            href="/sign-in"
            className="text-sm px-4 py-1.5 rounded-lg font-semibold transition-all hover:brightness-110"
            style={{
              backgroundColor: 'var(--color-accent-gold)',
              color: 'var(--color-text-inverse)',
            }}
          >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
