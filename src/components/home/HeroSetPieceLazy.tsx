'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// ssr:false must live in a client component (Next 16). The set-piece is
// decorative — it never appears in SSR HTML and never affects LCP.
const HeroSetPiece = dynamic(() => import('./HeroSetPiece'), { ssr: false });

export function HeroSetPieceLazy() {
  // Compress CSS text-entrance delays on repeat visits (client-only).
  useEffect(() => {
    try {
      if (sessionStorage.getItem('ccHeroPlayed')) {
        document.documentElement.setAttribute('data-cc-replay', '');
      }
    } catch {}
  }, []);

  return <HeroSetPiece />;
}
