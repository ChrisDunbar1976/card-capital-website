'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  m,
  useAnimate,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationSequence,
} from 'motion/react';
import { PlayingCard } from '@/components/cards/PlayingCard';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Deck point — where cards fly in from (off bottom-right).
const DECK = { x: 420, y: 560, rot: 40 };

interface DealCard {
  rot: number;
  x: number;
  y: number;
  face: string | null;
  alt: string;
}

// Final fan positions (px offsets from fan centre). Face cards only,
// balanced symmetrically about the centre.
const CARDS_DESKTOP: DealCard[] = [
  { rot: -21, x: -150, y: 26, face: '/cards/face-king-spades.webp', alt: 'King of Spades' },
  { rot: -7, x: -50, y: 4, face: '/cards/face-queen-hearts.webp', alt: 'Queen of Hearts' },
  { rot: 7, x: 50, y: 4, face: '/cards/face-jack-diamonds.webp', alt: 'Jack of Diamonds' },
  { rot: 21, x: 150, y: 26, face: '/cards/face-king-clubs.webp', alt: 'King of Clubs' },
];

const CARDS_MOBILE: DealCard[] = [
  { rot: -10, x: -52, y: 6, face: '/cards/face-queen-hearts.webp', alt: 'Queen of Hearts' },
  { rot: 10, x: 52, y: 6, face: '/cards/face-king-spades.webp', alt: 'King of Spades' },
];

const PLAYED_KEY = 'ccHeroPlayed';

export default function HeroSetPiece() {
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion();
  // ssr:false — first render happens in the browser, so window is available.
  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640,
  );
  const cards = isMobile ? CARDS_MOBILE : CARDS_DESKTOP;
  const cardW = isMobile ? 104 : 148;

  // Desktop pointer parallax — cards drift ±6px, chips ±3px opposite.
  const mx = useSpring(0, { stiffness: 50, damping: 16 });
  const my = useSpring(0, { stiffness: 50, damping: 16 });
  const chipX = useTransform(mx, (v) => v * -0.5);
  const chipY = useTransform(my, (v) => v * -0.5);

  useEffect(() => {
    if (reduced || isMobile) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 12);
      my.set((e.clientY / window.innerHeight - 0.5) * 12);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced, isMobile, mx, my]);

  useEffect(() => {
    if (reduced) return;

    let replay = false;
    try {
      replay = !!sessionStorage.getItem(PLAYED_KEY);
      sessionStorage.setItem(PLAYED_KEY, '1');
    } catch {
      // Private browsing — play the full sequence.
    }

    const seq: AnimationSequence = [];
    // 1. The deal — cards fly in from the deck point off bottom-right.
    //    Explicit [from, to] keyframes: DOM animate() must not rely on
    //    parsing the pre-animation inline transform.
    cards.forEach((c, i) => {
      seq.push([
        `.deal-${i}`,
        {
          x: [DECK.x, c.x],
          y: [DECK.y, c.y],
          rotate: [DECK.rot, c.rot],
          opacity: [0, 1],
        },
        { duration: 0.42, ease: EASE, at: 0.25 + i * 0.09 },
      ]);
    });
    // 2. The flip — face cards turn over.
    cards.forEach((c, i) => {
      if (!c.face) return;
      seq.push([
        `.flip-inner-${i}`,
        { rotateY: [0, 180] },
        { duration: 0.38, ease: 'easeInOut', at: 1.05 + i * 0.08 },
      ]);
    });
    // 3. The chips — one soft spring settle into the corners.
    seq.push([
      '.chip-piece',
      { y: [60, 0], opacity: [0, 1] },
      { type: 'spring', bounce: 0.4, duration: 0.9, at: 1.5 },
    ]);

    const controls = animate(seq);
    if (replay) controls.speed = 2.4;

    let cancelled = false;
    controls.then(() => {
      if (cancelled) return;
      // Idle float — millimetres, desynced per card.
      cards.forEach((c, i) => {
        animate(
          `.deal-${i}`,
          { y: [c.y, c.y - 3, c.y] },
          {
            duration: 6 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        );
      });
    });

    return () => {
      cancelled = true;
      controls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Pre-animation state: hidden at the deck point. Reduced motion: final state.
  const cardStart = (c: DealCard): React.CSSProperties =>
    reduced
      ? {
          transform: `translate(${c.x}px, ${c.y}px) rotate(${c.rot}deg)`,
          opacity: 1,
        }
      : {
          transform: `translate(${DECK.x}px, ${DECK.y}px) rotate(${DECK.rot}deg)`,
          opacity: 0,
        };

  const chipStart: React.CSSProperties = reduced
    ? { opacity: 1 }
    : { transform: 'translateY(60px)', opacity: 0 };

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Card fan — behind the headline block. Outer layer owns parallax,
          inner .deal-N elements are owned by the useAnimate timeline. */}
      <m.div
        className="absolute left-1/2 top-[calc(14vh_+_130px)] sm:top-[calc(14vh_+_170px)]"
        style={{ x: mx, y: my }}
      >
        {cards.map((c, i) => (
          <div
            key={i}
            className={`deal-${i} flip-card absolute`}
            style={{
              width: cardW,
              aspectRatio: '5 / 7',
              left: -cardW / 2,
              top: 0,
              ...cardStart(c),
            }}
          >
            <div
              className={`flip-inner-${i} flip-inner`}
              style={
                reduced && c.face ? { transform: 'rotateY(180deg)' } : undefined
              }
            >
              {/* Back face (visible first) */}
              <div className="flip-face">
                <PlayingCard faceDown width={cardW} />
              </div>
              {/* Front face (revealed by the flip) */}
              {c.face && (
                <div className="flip-face flip-front">
                  <Image
                    src={c.face}
                    alt={c.alt}
                    width={400}
                    height={534}
                    className="h-full w-full object-cover"
                    style={{
                      borderRadius: cardW * 0.09,
                      boxShadow: 'var(--shadow-card)',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </m.div>

      {/* Chip stacks — lower corners. Parallax layer outside, animated
          .chip-piece inside (separate elements so transforms compose). */}
      <m.div
        className="absolute -bottom-6 -left-8 w-36 sm:-left-4 sm:w-56"
        style={{ x: chipX, y: chipY }}
      >
        <div className="chip-piece" style={chipStart}>
          <Image
            src="/chip-stack-left.webp"
            alt=""
            width={450}
            height={450}
            className="h-auto w-full"
          />
        </div>
      </m.div>
      <m.div
        className="absolute -bottom-6 -right-8 w-36 sm:-right-4 sm:w-56"
        style={{ x: chipX, y: chipY }}
      >
        <div className="chip-piece" style={chipStart}>
          <Image
            src="/chip-stack-right.webp"
            alt=""
            width={450}
            height={450}
            className="h-auto w-full"
          />
        </div>
      </m.div>
    </div>
  );
}
