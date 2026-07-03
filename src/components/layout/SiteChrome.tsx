'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Wraps the site header/footer around page content, but hides them on
 * immersive game routes (`/play/<game>`) so a game can own the full viewport.
 * The catalogue at exactly `/play` keeps the chrome.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname?.startsWith('/play/') ?? false;

  return (
    <>
      {!bare && header}
      <main className="flex-1">{children}</main>
      {!bare && footer}
    </>
  );
}
