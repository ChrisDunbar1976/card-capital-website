import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';
import { SectionEyebrow } from './SectionEyebrow';

const CHARACTERS = [
  { name: 'Belle', tag: 'Reads you like a dime novel' },
  { name: 'Dutch', tag: 'Bets big, apologises never' },
  { name: 'Ruby', tag: 'Counts cards. And your tells' },
  { name: 'Cole', tag: 'Quiet until the river' },
  { name: 'Carmen', tag: 'Never draws dead' },
  { name: 'Sam', tag: 'Pours drinks, takes pots' },
  { name: 'Clyde', tag: 'Bluffs with the best hand' },
  { name: 'Cora', tag: 'Folds until she doesn’t' },
  { name: 'Etta', tag: 'Remembers every discard' },
  { name: 'Mateo', tag: 'Plays the long game' },
  { name: 'Reginald', tag: 'Banks on your mistakes' },
  { name: 'Lenny', tag: 'Luckier than he looks' },
];

export function SaloonSection() {
  return (
    <section
      className="py-20 sm:py-28"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="mb-10 text-center">
            <SectionEyebrow suit="♥">The Saloon</SectionEyebrow>
            <h2
              className="mx-auto mb-4 max-w-2xl font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-fluid-3xl)',
                lineHeight: 1.15,
              }}
            >
              Twelve regulars. Twelve ways to lose your shirt.
            </h2>
            <p
              className="mx-auto max-w-lg"
              style={{
                fontSize: 'var(--font-size-fluid-base)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Every opponent plays a genuinely different game. Learn their
              habits — then use them.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal direction="none">
        <div className="portrait-rail flex gap-6 overflow-x-auto px-4 pb-4 sm:px-8 lg:px-[max(2rem,calc((100vw-72rem)/2))]">
          {CHARACTERS.map((c) => (
            <figure key={c.name} className="w-40 flex-none sm:w-48">
              <div
                className="hover-lift-lg relative flex items-end justify-center overflow-hidden rounded-t-xl"
                style={{
                  height: 220,
                  background:
                    'linear-gradient(180deg, rgba(212,168,75,0.06) 0%, transparent 40%)',
                  borderBottom: '3px solid var(--color-wood-mid)',
                }}
              >
                <Image
                  src={`/characters/saloon-${c.name.toLowerCase()}.webp`}
                  alt={`${c.name}, Card Capital AI opponent`}
                  width={300}
                  height={450}
                  className="h-[210px] w-auto object-contain object-bottom"
                />
              </div>
              <figcaption className="text-center">
                <div
                  className="nameplate mx-auto -mt-px w-fit rounded-b-md px-4 py-1 text-sm font-semibold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-accent-cream)',
                    textShadow: '0 1px 1px rgba(0,0,0,0.6)',
                  }}
                >
                  {c.name}
                </div>
                <p
                  className="mt-2 text-xs leading-snug"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {c.tag}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
