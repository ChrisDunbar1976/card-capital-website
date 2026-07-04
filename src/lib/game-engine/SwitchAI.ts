// Switch AI — extracted from cardgame-engine src/ai/SheddingAI.ts (Switch section)
// and src/ai/types.ts. Self-contained so it doesn't drag in the other 10
// shedding games. Behaviour is identical to the mobile app's Switch AI.

import { Card, Suit, Rank } from './Card';
import { Player } from './Player';
import { getCurrentPlayer } from './GameState';
import { SwitchState, SwitchAction, getValidPlays } from './Switch';
import {
  AIDifficulty,
  AIPersonality,
  ResolvedTraits,
  resolveTraits,
} from './personality';

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

export function chooseSwitchAction(
  state: SwitchState,
  difficulty: AIDifficulty,
  personality?: AIPersonality,
): SwitchAction {
  const player = getCurrentPlayer(state);

  const plays = getValidPlays(state);
  if (plays.length === 0) return { type: 'draw' };

  // Personality-driven play: the saloon regulars actually play their identity.
  if (personality) {
    return choosePersonalitySwitch(state, player, plays, resolveTraits(personality, difficulty));
  }

  // --- Difficulty-only fallback (unchanged; used when no personality is set) ---
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

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** How close the game is to ending, from this player's seat (0 = early, 1 = imminent). */
export function switchLateness(state: SwitchState, playerId: string): number {
  let minOpp = Infinity;
  let selfSize = Infinity;
  for (const p of state.players) {
    const size = p.hand.cards.length;
    if (p.id === playerId) selfSize = size;
    else if (size < minOpp) minOpp = size;
  }
  const oppThreat = minOpp <= 1 ? 1 : minOpp <= 2 ? 0.7 : minOpp <= 3 ? 0.4 : 0;
  const selfClose = selfSize <= 2 ? 1 : selfSize <= 3 ? 0.6 : selfSize <= 4 ? 0.3 : 0;
  return clamp01(Math.max(oppThreat, selfClose));
}

/** How hard the character wants to press special/penalty cards right now. */
export function switchPressure(traits: ResolvedTraits, lateness: number): number {
  const earliness = 1 - lateness;
  return clamp01(
    traits.aggression
    + traits.escalation * lateness
    - traits.patience * earliness * 0.5,
  );
}

function choosePersonalitySwitch(
  state: SwitchState,
  player: Player,
  plays: Card[][],
  t: ResolvedTraits,
): SwitchAction {
  // Discipline: an undisciplined character plays loose — a random valid card,
  // and occasionally a needless draw.
  if (Math.random() > t.discipline) {
    if (Math.random() < (1 - t.discipline) * 0.2) return { type: 'draw' };
    return buildPersonalitySwitchPlay(pickRandom(plays), player.hand.cards, t);
  }

  const specials = plays.filter(p => SWITCH_SPECIALS.has(p[0]!.rank));
  const nonSpecial = plays.filter(p => !SWITCH_SPECIALS.has(p[0]!.rank));

  const lateness = switchLateness(state, player.id);
  const pressure = switchPressure(t, lateness);

  let pool: Card[][];
  if (specials.length === 0) pool = plays;
  else if (nonSpecial.length === 0) pool = specials; // forced (e.g. pending pickup)
  else pool = Math.random() < pressure ? specials : nonSpecial;

  const chosen = Math.random() < t.foresight
    ? pool.reduce((best, p) => (p.length > best.length ? p : best), pool[0]!)
    : pickRandom(pool);

  return buildPersonalitySwitchPlay(chosen, player.hand.cards, t);
}

function buildPersonalitySwitchPlay(
  cards: Card[],
  hand: readonly Card[],
  t: ResolvedTraits,
): SwitchAction {
  const last = cards[cards.length - 1]!;
  let declaredSuit: Suit | undefined;

  if (last.rank === 'A') {
    const remaining = hand.filter(c => !cards.some(p => p.suit === c.suit && p.rank === c.rank));
    declaredSuit = Math.random() < t.memory ? mostCommonSuit(remaining) : pickRandom([...SUITS]);
  }

  return { type: 'play', cards, declaredSuit };
}
