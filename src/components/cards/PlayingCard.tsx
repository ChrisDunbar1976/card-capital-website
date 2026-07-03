import type { CSSProperties } from 'react';

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

const SUIT_GLYPH: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

const SUIT_COLOR: Record<Suit, string> = {
  spades: '#1F1F1F',
  clubs: '#1F1F1F',
  hearts: '#C0392B',
  diamonds: '#C0392B',
};

interface PlayingCardProps {
  rank?: string;
  suit?: Suit;
  faceDown?: boolean;
  width?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Server-safe CSS playing card. Crisp at any size, zero image weight.
 * Face-down renders the felt-and-gold Card Capital back.
 */
export function PlayingCard({
  rank = 'A',
  suit = 'spades',
  faceDown = false,
  width = 96,
  className = '',
  style,
}: PlayingCardProps) {
  const w = width;
  const cardStyle: CSSProperties = {
    width: w,
    aspectRatio: '5 / 7',
    borderRadius: w * 0.09,
    ...style,
  };

  if (faceDown) {
    return (
      <div
        className={`relative select-none ${className}`}
        style={{
          ...cardStyle,
          background: 'linear-gradient(160deg, #14522E 0%, #0B2818 100%)',
          border: `1px solid rgba(212, 168, 75, 0.55)`,
          boxShadow:
            'inset 0 0 0 3px #0B2818, inset 0 0 0 4px rgba(212,168,75,0.5), var(--shadow-card)',
        }}
      >
        {/* Gold lattice */}
        <div
          className="absolute rounded-[inherit]"
          style={{
            inset: w * 0.09,
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(212,168,75,0.22) 0, rgba(212,168,75,0.22) 1px, transparent 1px, transparent 7px), repeating-linear-gradient(-45deg, rgba(212,168,75,0.22) 0, rgba(212,168,75,0.22) 1px, transparent 1px, transparent 7px)',
            border: '1px solid rgba(212,168,75,0.35)',
            borderRadius: w * 0.05,
          }}
        />
        {/* Centre monogram */}
        <div
          className="absolute inset-0 flex items-center justify-center font-bold"
          style={{
            color: 'rgba(212, 168, 75, 0.85)',
            fontSize: w * 0.28,
            fontFamily: 'var(--font-display)',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          CC
        </div>
      </div>
    );
  }

  const color = SUIT_COLOR[suit];
  const glyph = SUIT_GLYPH[suit];

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        ...cardStyle,
        background: 'linear-gradient(180deg, #FFFFFE 0%, #F7F3EA 100%)',
        border: '1px solid #C8C0B0',
        boxShadow: 'var(--shadow-card)',
        color,
      }}
    >
      {/* Corner index — top left */}
      <div
        className="absolute leading-none font-semibold text-center"
        style={{ top: w * 0.06, left: w * 0.07, fontSize: w * 0.17 }}
      >
        {rank}
        <div style={{ fontSize: w * 0.15, marginTop: w * 0.01 }}>{glyph}</div>
      </div>
      {/* Corner index — bottom right, rotated */}
      <div
        className="absolute leading-none font-semibold text-center rotate-180"
        style={{ bottom: w * 0.06, right: w * 0.07, fontSize: w * 0.17 }}
      >
        {rank}
        <div style={{ fontSize: w * 0.15, marginTop: w * 0.01 }}>{glyph}</div>
      </div>
      {/* Centre suit medallion */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontSize: w * 0.42 }}
      >
        {glyph}
      </div>
    </div>
  );
}
