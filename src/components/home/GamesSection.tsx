import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { SectionEyebrow } from './SectionEyebrow';
import { CountUp } from './CountUp';

const FEATURED = [
  { name: 'Poker', tag: 'Eight variants, one felt', art: '/cards/face-king-spades.webp' },
  { name: 'Rummy', tag: 'Six ways to meld', art: '/cards/face-queen-hearts.webp' },
  { name: 'Blackjack', tag: 'Twenty-one, dealt right', art: '/cards/face-jack-clubs.webp' },
  { name: 'Solitaire', tag: 'Ten patiences, zero ads mid-game', art: '/cards/face-jack-diamonds.webp' },
  { name: 'Hearts', tag: 'Shoot the moon', art: '/cards/face-king-hearts.webp' },
  { name: 'Spades', tag: 'Bid it, make it', art: '/cards/face-queen-spades.webp' },
];

// The full library — grouped roughly evenly into three marquee rows.
const ROW_1 = [
  'Texas Hold’em', 'Gin Rummy', 'Hearts', 'Klondike', 'Switch', 'Whist',
  'Blackjack', 'Canasta', 'Euchre', 'FreeCell', 'President', 'Scopa',
  'Seven-Card Stud', 'Cribbage', 'Old Maid', 'Spider', 'Teen Patti',
  'Knockout Whist', 'Pontoon', 'Rummy 500', 'War',
];
const ROW_2 = [
  'Pot Limit Omaha', 'Standard Rummy', 'Spades', 'Pyramid', 'Last Card',
  'Contract Bridge', 'Baccarat', 'Contract Rummy', 'Oh Hell', 'TriPeaks',
  'Cheat', 'Briscola', 'Five-Card Draw', 'Go Fish', 'Golf Solitaire',
  'Andar Bahar', 'Solo Whist', 'Crazy Eights', 'Yukon', 'Call Break', 'Snap',
];
const ROW_3 = [
  'Omaha Hi-Lo', 'Indian Rummy', 'Pinochle', 'Demon', 'Palace',
  'Three-Card Brag', 'Scopone Scientifico', 'Egyptian Ratscrew', 'Razz',
  'Forty Thieves', 'Mau-Mau', 'Tressette', 'Caribbean Stud', 'Speed',
  'Clock Patience', 'Court Piece', 'Sette e Mezzo', 'Beggar My Neighbour',
  'Satte Pe Satta', 'Teen Do Paanch',
];

function MarqueeRow({
  games,
  direction,
}: {
  games: string[];
  direction: 'left' | 'right';
}) {
  const plaques = [...games, ...games];
  return (
    <div className="marquee">
      <div
        className={`marquee-track ${
          direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'
        }`}
      >
        {plaques.map((name, i) => (
          <Link
            key={`${name}-${i}`}
            href="/play"
            className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors hover:text-white"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-gold-hairline)',
              color: 'var(--color-text-secondary)',
            }}
            tabIndex={-1}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GamesSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="mb-12 text-center">
            <SectionEyebrow suit="♠">The Games</SectionEyebrow>
            <h2
              className="mx-auto mb-4 max-w-2xl font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-fluid-3xl)',
                lineHeight: 1.15,
                color: 'var(--color-text-primary)',
              }}
            >
              Every game you grew up with. And the ones you&rsquo;ve been
              meaning to learn.
            </h2>
            <p
              className="mx-auto max-w-lg"
              style={{
                fontSize: 'var(--font-size-fluid-base)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <CountUp
                to={60}
                className="font-semibold"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4em',
                  color: 'var(--color-accent-gold)',
                }}
              />{' '}
              card games across ten categories — from five-minute shedders to
              full contract bridge.
            </p>
          </div>
        </Reveal>

        {/* Featured tiles */}
        <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {FEATURED.map((game, i) => (
            <Reveal key={game.name} delay={i * 0.07}>
              <Link
                href="/play"
                className="card-tilt group block overflow-hidden rounded-xl"
                style={{
                  aspectRatio: '5 / 7',
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-gold-hairline)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={game.art}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 180px"
                    className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-10"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(6, 22, 13, 0.95) 30%, transparent)',
                    }}
                  >
                    <h3
                      className="font-semibold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-accent-gold-light)',
                      }}
                    >
                      {game.name}
                    </h3>
                    <p
                      className="text-xs leading-snug"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {game.tag}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Full library marquee */}
        <Reveal>
          <div className="flex flex-col gap-3">
            <MarqueeRow games={ROW_1} direction="left" />
            <MarqueeRow games={ROW_2} direction="right" />
            <MarqueeRow games={ROW_3} direction="left" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
