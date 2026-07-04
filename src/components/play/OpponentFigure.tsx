'use client';

import Image from 'next/image';
import { PlayingCard } from '@/components/cards/PlayingCard';

const CHARACTER_IDS = new Set([
  'belle', 'dutch', 'ruby', 'cole', 'etta', 'reginald', 'cora',
  'carmen', 'clyde', 'mateo', 'lenny', 'sam',
]);

function portraitFor(name: string): string | null {
  const id = name.toLowerCase();
  return CHARACTER_IDS.has(id) ? `/characters/saloon-${id}.webp` : null;
}

/**
 * A saloon opponent seated across the felt: character portrait, wooden
 * nameplate, and a face-down card fan showing how many cards they hold.
 * The active player glows gold.
 */
export function OpponentFigure({
  name,
  cardCount,
  isCurrentTurn,
}: {
  name: string;
  cardCount: number;
  isCurrentTurn: boolean;
}) {
  const src = portraitFor(name);
  const fan = Math.min(cardCount, 5);

  return (
    <div
      className="flex flex-col items-center transition-all"
      style={{ opacity: isCurrentTurn ? 1 : 0.82 }}
    >
      {/* Portrait */}
      <div className="relative flex h-24 items-end justify-center sm:h-32">
        {isCurrentTurn && (
          <div
            aria-hidden
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: 150,
              height: 150,
              background:
                'radial-gradient(circle at 50% 60%, rgba(212,168,75,0.38) 0%, transparent 65%)',
            }}
          />
        )}
        {src ? (
          <Image
            src={src}
            alt={name}
            width={200}
            height={300}
            priority
            className="relative h-full w-auto object-contain object-bottom"
            style={{
              filter: isCurrentTurn
                ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))'
                : 'grayscale(0.15) brightness(0.92)',
            }}
          />
        ) : (
          <div
            className="flex h-20 w-16 items-end justify-center rounded-t-full"
            style={{ backgroundColor: 'var(--color-bg-card)' }}
          >
            <span style={{ color: 'var(--color-text-muted)' }}>{name[0]}</span>
          </div>
        )}
      </div>

      {/* Nameplate */}
      <div
        className="nameplate relative z-10 -mt-1 w-fit rounded-md px-3 py-0.5 text-xs font-semibold sm:text-sm"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-accent-cream)',
          textShadow: '0 1px 1px rgba(0,0,0,0.6)',
          boxShadow: isCurrentTurn ? '0 0 0 1px var(--color-accent-gold)' : 'none',
        }}
      >
        {name}
      </div>

      {/* Card fan + count */}
      <div className="mt-1.5 flex items-center gap-1.5">
        <div className="relative" style={{ width: 12 + fan * 6, height: 22 }}>
          {Array.from({ length: fan }).map((_, i) => (
            <div key={i} className="absolute top-0" style={{ left: i * 6 }}>
              <PlayingCard faceDown width={15} />
            </div>
          ))}
        </div>
        <span className="text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
          {cardCount}
        </span>
      </div>
    </div>
  );
}
