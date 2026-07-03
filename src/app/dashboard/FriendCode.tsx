'use client';

import { useState } from 'react';

export function FriendCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — leave the code visible.
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-2xl font-semibold tabular-nums tracking-wider"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-accent-gold)',
        }}
      >
        {code}
      </span>
      <button
        onClick={copy}
        className="rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-white/5"
        style={{
          borderColor: 'var(--color-gold-hairline-bright)',
          color: copied
            ? 'var(--color-accent-gold)'
            : 'var(--color-accent-cream)',
        }}
        aria-live="polite"
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
    </div>
  );
}
