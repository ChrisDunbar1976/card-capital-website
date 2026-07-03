// Vendored from cardgame-engine (@card-capital/engine) src/core/Deck.ts

import { Card, createCard, SUITS, RANKS } from './Card';

export function createStandardDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(createCard(suit, rank));
    }
  }
  return deck;
}

export function shuffle(cards: readonly Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

export function deal(
  deck: readonly Card[],
  playerCount: number,
  cardsPerPlayer: number
): { hands: Card[][]; remaining: Card[] } {
  const mutable = [...deck];
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);

  for (let card = 0; card < cardsPerPlayer; card++) {
    for (let player = 0; player < playerCount; player++) {
      const drawn = mutable.pop();
      if (!drawn) throw new Error('Not enough cards to deal');
      hands[player]!.push(drawn);
    }
  }

  return { hands, remaining: mutable };
}

export function drawFromPile(pile: readonly Card[], count: number = 1): { drawn: Card[]; remaining: Card[] } {
  if (pile.length < count) {
    throw new Error(`Cannot draw ${count} cards from pile of ${pile.length}`);
  }
  const mutable = [...pile];
  const drawn: Card[] = [];
  for (let i = 0; i < count; i++) {
    drawn.push(mutable.pop()!);
  }
  return { drawn, remaining: mutable };
}

export function dealAll(deck: readonly Card[], playerCount: number): Card[][] {
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  const mutable = [...deck];
  let idx = 0;
  while (mutable.length > 0) {
    hands[idx % playerCount]!.push(mutable.pop()!);
    idx++;
  }
  return hands;
}

export function reshuffleDiscardPile(discardPile: readonly Card[]): { topCard: Card; newDrawPile: Card[] } {
  if (discardPile.length < 2) {
    throw new Error('Not enough cards in discard pile to reshuffle');
  }
  const topCard = discardPile[discardPile.length - 1]!;
  const rest = discardPile.slice(0, -1);
  return { topCard, newDrawPile: shuffle(rest) };
}
