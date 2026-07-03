// Switch AI — extracted from cardgame-engine src/ai/SheddingAI.ts (Switch section)
// and src/ai/types.ts. Self-contained so it doesn't drag in the other 10
// shedding games. Behaviour is identical to the mobile app's Switch AI.

import { Card, Suit, Rank } from './Card';
import { getCurrentPlayer } from './GameState';
import { SwitchState, SwitchAction, getValidPlays } from './Switch';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const SUITS: readonly Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

function pickRandom<T>(items: readonly T[]): T {
  if (items.length === 0) throw new Error('Cannot pick from empty array');
  return items[Math.floor(Math.random() * items.length)]!;
}

function countBySuit(cards: readonly Card[]): Record<Suit, number> {
  const counts = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
  for (const c of cards) counts[c.suit]++;
  return counts;
}

function mostCommonSuit(cards: readonly Card[]): Suit {
  const counts = countBySuit(cards);
  let best: Suit = 'hearts';
  for (const s of SUITS) {
    if (counts[s] > counts[best]) best = s;
  }
  return best;
}

const SWITCH_SPECIALS = new Set<Rank>(['2', '3', '8', 'J', 'A']);

export function chooseSwitchAction(state: SwitchState, difficulty: AIDifficulty): SwitchAction {
  const player = getCurrentPlayer(state);

  const plays = getValidPlays(state);
  if (plays.length === 0) return { type: 'draw' };

  if (difficulty === 'easy') {
    if (Math.random() < 0.15 && plays.length > 0) return { type: 'draw' };
    const chosen = pickRandom(plays);
    return buildSwitchPlayAction(chosen, player.hand.cards, difficulty);
  }

  const nonSpecial = plays.filter(p => !SWITCH_SPECIALS.has(p[0]!.rank));
  const pool = nonSpecial.length > 0 ? nonSpecial : plays;

  if (difficulty === 'hard') {
    const longest = pool.reduce((best, p) => p.length > best.length ? p : best, pool[0]!);
    return buildSwitchPlayAction(longest, player.hand.cards, difficulty);
  }

  const chosen = pickRandom(pool);
  return buildSwitchPlayAction(chosen, player.hand.cards, difficulty);
}

function buildSwitchPlayAction(cards: Card[], hand: readonly Card[], difficulty: AIDifficulty): SwitchAction {
  const last = cards[cards.length - 1]!;
  let declaredSuit: Suit | undefined;

  if (last.rank === 'A') {
    const remaining = hand.filter(c => !cards.some(p => p.suit === c.suit && p.rank === c.rank));
    declaredSuit = difficulty === 'easy' ? pickRandom([...SUITS]) : mostCommonSuit(remaining);
  }

  return { type: 'play', cards, declaredSuit };
}
