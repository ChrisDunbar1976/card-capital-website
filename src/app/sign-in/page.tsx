import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignInForm } from './SignInForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description:
    'Sign in to Card Capital. One account across web, iOS and Android.',
};

export default function SignInPage() {
  return (
    <div className="felt-surface felt-vignette relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      {/* Faint spade watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute select-none"
        style={{
          fontSize: 'min(70vw, 34rem)',
          color: 'rgba(212, 168, 75, 0.05)',
          transform: 'translate(28%, -6%) rotate(12deg)',
          right: 0,
          top: 0,
          lineHeight: 1,
        }}
      >
        ♠
      </span>
      <Suspense>
        <SignInForm />
      </Suspense>
    </div>
  );
}
