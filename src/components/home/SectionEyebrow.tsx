type Suit = '♠' | '♥' | '♦' | '♣';

export function SectionEyebrow({
  suit,
  children,
}: {
  suit: Suit;
  children: React.ReactNode;
}) {
  return (
    <p
      className="mb-3 text-xs font-semibold uppercase"
      style={{
        letterSpacing: '0.14em',
        color: 'var(--color-accent-gold)',
      }}
    >
      <span className="mr-2" aria-hidden="true">
        {suit}
      </span>
      {children}
    </p>
  );
}
