'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Mode = 'signIn' | 'signUp' | 'forgot';

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-surface-divider)',
  color: 'var(--color-text-primary)',
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      {children}
    </label>
  );
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const urlError = searchParams.get('error');

  const [mode, setMode] = useState<Mode>(
    searchParams.get('mode') === 'signUp' ? 'signUp' : 'signIn',
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError ? decodeURIComponent(urlError) : null,
  );
  const [info, setInfo] = useState<string | null>(null);

  const supabase = createClient();

  const handleOAuth = async (provider: 'apple' | 'google') => {
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/callback?next=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      setError(error.message);
      setBusy(false);
    }
    // On success the browser redirects to the provider.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === 'forgot') {
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/callback?next=/`,
      });
      setBusy(false);
      if (error) {
        setError(error.message);
      } else {
        setInfo(
          `If an account exists for ${email}, a reset link is on its way.`,
        );
      }
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setBusy(true);
    if (mode === 'signUp') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/callback?next=/`,
          data: displayName.trim()
            ? { display_name: displayName.trim() }
            : undefined,
        },
      });
      setBusy(false);
      if (error) {
        setError(error.message);
      } else if (!data.session) {
        // Email confirmation is on — no session until the link is clicked.
        setInfo(
          'Check your email — we’ve sent a confirmation link to finish creating your account.',
        );
      } else {
        router.replace(redirect);
        router.refresh();
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace(redirect);
      router.refresh();
    }
  };

  const heading =
    mode === 'signUp'
      ? 'Take a seat.'
      : mode === 'forgot'
        ? 'Lost your key?'
        : 'Welcome back to the table.';

  return (
    <div
      className="relative z-10 w-full max-w-sm rounded-2xl p-7"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-gold-hairline)',
        boxShadow: 'var(--shadow-card)',
        animation: 'hero-rise 0.4s var(--ease-out-quart) backwards',
      }}
    >
      <Image
        src="/card-capital-logo-white.png"
        alt="Card Capital"
        width={144}
        height={155}
        className="mx-auto mb-5 h-14 w-auto"
      />

      <h1
        className="mb-1 text-center text-2xl font-semibold"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {heading}
      </h1>
      <p
        className="mb-6 text-center text-sm"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        One account across web, iOS and Android.
      </p>

      {error && (
        <p
          className="mb-4 rounded-lg border px-3 py-2 text-sm"
          role="alert"
          style={{
            color: 'var(--color-accent-red)',
            borderColor: 'rgba(229, 57, 53, 0.4)',
            backgroundColor: 'rgba(229, 57, 53, 0.08)',
          }}
        >
          {error}
        </p>
      )}
      {info && (
        <p
          className="mb-4 rounded-lg border px-3 py-2 text-sm"
          role="status"
          style={{
            color: '#7CC98A',
            borderColor: 'rgba(124, 201, 138, 0.4)',
            backgroundColor: 'rgba(124, 201, 138, 0.08)',
          }}
        >
          {info}
        </p>
      )}

      {mode !== 'forgot' && (
        <>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => handleOAuth('apple')}
              disabled={busy}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#000', color: '#fff' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09v-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </button>
            <button
              onClick={() => handleOAuth('google')}
              disabled={busy}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#fff', color: '#1F1F1F' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3" aria-hidden="true">
            <div
              className="h-px flex-1"
              style={{ backgroundColor: 'var(--color-surface-divider)' }}
            />
            <span
              className="text-xs"
              style={{ color: 'var(--color-accent-gold)' }}
            >
              ♦ or
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: 'var(--color-surface-divider)' }}
            />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'signUp' && (
          <div>
            <FieldLabel htmlFor="displayName">
              Display name{' '}
              <span style={{ color: 'var(--color-text-muted)' }}>
                (optional)
              </span>
            </FieldLabel>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={30}
              className="h-11 w-full rounded-lg px-3 text-sm outline-none focus:border-[var(--color-accent-gold)]"
              style={inputStyle}
              placeholder="What the table calls you"
            />
          </div>
        )}

        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-lg px-3 text-sm outline-none focus:border-[var(--color-accent-gold)]"
            style={inputStyle}
            placeholder="you@example.com"
          />
        </div>

        {mode !== 'forgot' && (
          <div>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <input
              id="password"
              type="password"
              required
              autoComplete={
                mode === 'signUp' ? 'new-password' : 'current-password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-lg px-3 text-sm outline-none focus:border-[var(--color-accent-gold)]"
              style={inputStyle}
              placeholder="At least 8 characters"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="h-11 w-full rounded-lg text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
          style={{
            background: 'var(--gradient-gold)',
            color: 'var(--color-text-inverse)',
          }}
        >
          {busy
            ? 'One moment…'
            : mode === 'signUp'
              ? 'Create account'
              : mode === 'forgot'
                ? 'Send reset link'
                : 'Sign in'}
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-2 text-center text-sm">
        {mode === 'signIn' && (
          <>
            <button
              onClick={() => {
                setMode('forgot');
                setError(null);
                setInfo(null);
              }}
              className="transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Forgot password?
            </button>
            <button
              onClick={() => {
                setMode('signUp');
                setError(null);
                setInfo(null);
              }}
              style={{ color: 'var(--color-accent-gold)' }}
            >
              New to the saloon? Create a free account
            </button>
          </>
        )}
        {mode === 'signUp' && (
          <button
            onClick={() => {
              setMode('signIn');
              setError(null);
              setInfo(null);
            }}
            style={{ color: 'var(--color-accent-gold)' }}
          >
            Already have a seat? Sign in
          </button>
        )}
        {mode === 'forgot' && (
          <button
            onClick={() => {
              setMode('signIn');
              setError(null);
              setInfo(null);
            }}
            style={{ color: 'var(--color-accent-gold)' }}
          >
            Back to sign in
          </button>
        )}
      </div>

      <p
        className="mt-6 text-center text-xs leading-relaxed"
        style={{ color: 'var(--color-text-muted)' }}
      >
        By continuing you agree to our{' '}
        <Link href="/terms" className="underline">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
