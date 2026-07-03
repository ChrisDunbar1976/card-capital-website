'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/play', label: 'Games' },
  { href: '/news', label: 'News' },
  { href: '/community', label: 'The Pack' },
];

function displayNameOf(user: {
  user_metadata?: Record<string, unknown>;
  email?: string;
}): string {
  const meta = user.user_metadata ?? {};
  return (
    (meta.display_name as string) ||
    (meta.full_name as string) ||
    (meta.name as string) ||
    user.email?.split('@')[0] ||
    'Player'
  );
}

export function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(11, 40, 24, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled
          ? '1px solid var(--color-gold-hairline)'
          : '1px solid transparent',
      }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center" aria-label="Card Capital home">
          <Image
            src="/card-capital-logo-white.png"
            alt="Card Capital"
            width={144}
            height={155}
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center gap-6">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative hidden text-sm font-medium transition-colors hover:text-white sm:inline"
                style={{
                  color: active
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
                }}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--color-accent-gold)' }}
                  />
                )}
              </Link>
            );
          })}

          {!loading && !user && (
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-all hover:brightness-110"
              style={{
                background: 'var(--gradient-gold)',
                color: 'var(--color-text-inverse)',
              }}
            >
              Sign in
            </Link>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden max-w-[10rem] truncate text-sm font-medium transition-colors hover:text-white sm:inline"
                style={{
                  color: pathname.startsWith('/dashboard')
                    ? 'var(--color-accent-gold)'
                    : 'var(--color-accent-cream)',
                }}
              >
                {displayNameOf(user)}
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg border px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-white/5"
                style={{
                  borderColor: 'var(--color-gold-hairline-bright)',
                  color: 'var(--color-accent-cream)',
                }}
              >
                Sign out
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg sm:hidden"
            style={{ color: 'var(--color-accent-gold)' }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu — full-screen felt overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 flex flex-col gap-2 px-6 pt-8 sm:hidden"
          style={{ backgroundColor: 'rgba(11, 40, 24, 0.98)' }}
        >
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b py-4 text-2xl font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                color: pathname.startsWith(item.href)
                  ? 'var(--color-accent-gold)'
                  : 'var(--color-accent-cream)',
                borderColor: 'var(--color-surface-divider)',
                animation: `hero-rise 0.35s var(--ease-out-quart) ${i * 0.06}s backwards`,
              }}
            >
              {item.label}
            </Link>
          ))}
          {!user && (
            <Link
              href="/sign-in"
              className="py-4 text-2xl font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-gold)',
                animation: `hero-rise 0.35s var(--ease-out-quart) 0.18s backwards`,
              }}
            >
              Sign in
            </Link>
          )}
          {user && (
            <Link
              href="/dashboard"
              className="border-b py-4 text-2xl font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                color: pathname.startsWith('/dashboard')
                  ? 'var(--color-accent-gold)'
                  : 'var(--color-accent-cream)',
                borderColor: 'var(--color-surface-divider)',
                animation: `hero-rise 0.35s var(--ease-out-quart) 0.18s backwards`,
              }}
            >
              My Table
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
