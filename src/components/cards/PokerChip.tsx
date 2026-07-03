import type { CSSProperties } from 'react';

export type ChipVariant = 'gold' | 'red' | 'green' | 'cream';

const CHIP_COLORS: Record<
  ChipVariant,
  { body: string; inner: string; stripe: string }
> = {
  gold: { body: '#B8912F', inner: '#D4A84B', stripe: '#F0E2D6' },
  red: { body: '#A32723', inner: '#C0392B', stripe: '#F0E2D6' },
  green: { body: '#14522E', inner: '#1B6B3A', stripe: '#D4A84B' },
  cream: { body: '#D8C3AE', inner: '#E8D5C4', stripe: '#5C4030' },
};

interface PokerChipProps {
  variant?: ChipVariant;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Server-safe CSS poker chip — layered radial gradients for the disc,
 * dashed border for the classic edge-stripe pattern.
 */
export function PokerChip({
  variant = 'gold',
  size = 56,
  className = '',
  style,
}: PokerChipProps) {
  const c = CHIP_COLORS[variant];
  return (
    <div
      className={`relative rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 32%, rgba(255,255,255,0.28), transparent 55%), radial-gradient(circle, ${c.inner} 0 40%, ${c.body} 40% 100%)`,
        border: `${Math.max(4, size * 0.11)}px dashed ${c.stripe}`,
        boxShadow:
          'inset 0 0 0 2px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.45)',
        ...style,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          inset: '20%',
          border: `1.5px solid ${c.stripe}99`,
        }}
      />
    </div>
  );
}

interface ChipStackProps {
  variant?: ChipVariant;
  count?: number;
  size?: number;
  className?: string;
}

export function ChipStack({
  variant = 'gold',
  count = 4,
  size = 56,
  className = '',
}: ChipStackProps) {
  const offset = size * 0.14;
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size + offset * (count - 1) }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <PokerChip
          key={i}
          variant={variant}
          size={size}
          style={{
            position: 'absolute',
            bottom: i * offset,
            left: 0,
            filter: `brightness(${0.85 + (i / (count - 1 || 1)) * 0.15})`,
          }}
        />
      ))}
    </div>
  );
}
