// Vendored from cardgame-engine (@card-capital/engine) src/types/Hand.ts

import { Card, cardEquals, rankValue } from './Card';

export interface Hand {
  readonly cards: readonly Card[];
}

export function createHand(cards: Card[] = []): Hand {
  return { cards: [...cards] };
}

export function addToHand(hand: Hand, ...newCards: Card[]): Hand {
  return { cards: [...hand.cards, ...newCards] };
}

export function removeFromHand(hand: Hand, card: Card): Hand {
  const index = hand.cards.findIndex(c => cardEquals(c, card));
  if (index === -1) return hand;
  const cards = [...hand.cards];
  cards.splice(index, 1);
  return { cards };
}

export function removeMultipleFromHand(hand: Hand, cardsToRemove: Card[]): Hand {
  let result = hand;
  for (const card of cardsToRemove) {
    result = removeFromHand(result, card);
  }
  return result;
}

export function handContains(hand: Hand, card: Card): boolean {
  return hand.cards.some(c => cardEquals(c, card));
}

export function handSize(hand: Hand): number {
  return hand.cards.length;
}

export function isEmpty(hand: Hand): boolean {
  return hand.cards.length === 0;
}

export function sortHand(hand: Hand): Hand {
  const suitOrder = { hearts: 0, diamonds: 1, clubs: 2, spades: 3 } as const;
  const sorted = [...hand.cards].sort((a, b) => {
    const suitDiff = suitOrder[a.suit] - suitOrder[b.suit];
    if (suitDiff !== 0) return suitDiff;
    return rankValue(a.rank) - rankValue(b.rank);
  });
  return { cards: sorted };
}

export function getCardsOfRank(hand: Hand, rank: Card['rank']): Card[] {
  return hand.cards.filter(c => c.rank === rank);
}

export function getCardsOfSuit(hand: Hand, suit: Card['suit']): Card[] {
  return hand.cards.filter(c => c.suit === suit);
}
