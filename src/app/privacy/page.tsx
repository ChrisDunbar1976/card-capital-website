import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20">
      <h1
        className="mb-2 font-semibold"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-size-fluid-3xl)',
        }}
      >
        Privacy Policy
      </h1>
      <p className="mb-10 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Last updated: 3 July 2026
      </p>

      <div
        className="flex flex-col gap-6 text-sm leading-relaxed sm:text-base"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <p>
          Card Capital is operated by Rhubarb Press Ltd (company number
          16646878, registered at 86-90 Paul Street, London, EC2A 4NE, United
          Kingdom). This policy explains what we collect and why.
        </p>

        <h2 className="mt-2 font-semibold text-white">What we collect</h2>
        <p>
          When you create an account we store your email address, display name
          and authentication provider (Apple, Google or email). Gameplay
          generates statistics such as games played, results and ratings,
          which are linked to your account.
        </p>

        <h2 className="mt-2 font-semibold text-white">How we use it</h2>
        <p>
          Account data is used to sign you in, sync your progress across
          devices, operate leaderboards and friends features, and keep the
          service secure. We do not sell your personal data.
        </p>

        <h2 className="mt-2 font-semibold text-white">Where it lives</h2>
        <p>
          Account and gameplay data is stored with Supabase, our database and
          authentication provider. Data is transmitted over encrypted
          connections.
        </p>

        <h2 className="mt-2 font-semibold text-white">Your choices</h2>
        <p>
          You can delete your account at any time from the mobile app
          settings, which permanently removes your profile, friends and
          gameplay data. For questions or data requests, contact{' '}
          <a
            href="mailto:christopher.john.dunbar@gmail.com"
            className="underline"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            christopher.john.dunbar@gmail.com
          </a>
          .
        </p>

        <h2 className="mt-2 font-semibold text-white">Changes</h2>
        <p>
          We will update this page when the policy changes and revise the
          &ldquo;Last updated&rdquo; date above.
        </p>
      </div>
    </section>
  );
}
