import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20">
      <h1
        className="mb-2 font-semibold"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-size-fluid-3xl)',
        }}
      >
        Terms of Service
      </h1>
      <p className="mb-10 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Last updated: 3 July 2026
      </p>

      <div
        className="flex flex-col gap-6 text-sm leading-relaxed sm:text-base"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <p>
          These terms govern your use of Card Capital, operated by Rhubarb
          Press Ltd (company number 16646878, 86-90 Paul Street, London, EC2A
          4NE, United Kingdom). By using the service you agree to them.
        </p>

        <h2 className="mt-2 font-semibold text-white">The service</h2>
        <p>
          Card Capital provides digital card games for entertainment. Games
          use virtual coins with no monetary value — nothing in Card Capital
          is gambling, and virtual coins cannot be exchanged for money.
        </p>

        <h2 className="mt-2 font-semibold text-white">Your account</h2>
        <p>
          You are responsible for keeping your sign-in credentials secure. One
          account per person. We may suspend accounts used for cheating,
          abuse, or disruption of other players.
        </p>

        <h2 className="mt-2 font-semibold text-white">Fair play</h2>
        <p>
          Online multiplayer depends on everyone playing straight. Automated
          play, exploiting bugs, or harassing other players may result in
          account suspension.
        </p>

        <h2 className="mt-2 font-semibold text-white">Content and ownership</h2>
        <p>
          Card Capital, including its artwork, characters and software, is the
          property of Rhubarb Press Ltd. You may not copy, redistribute or
          reverse-engineer the service.
        </p>

        <h2 className="mt-2 font-semibold text-white">Liability</h2>
        <p>
          The service is provided &ldquo;as is&rdquo;. To the fullest extent
          permitted by law, Rhubarb Press Ltd is not liable for indirect or
          consequential losses arising from your use of the service.
        </p>

        <h2 className="mt-2 font-semibold text-white">Changes</h2>
        <p>
          We may update these terms; continued use after an update constitutes
          acceptance. Questions:{' '}
          <a
            href="mailto:christopher.john.dunbar@gmail.com"
            className="underline"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            christopher.john.dunbar@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
