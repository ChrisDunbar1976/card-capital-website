// Vendored from cardgame-engine (@card-capital/engine) src/types/FilteredState.ts

import type { Card, Suit } from './Card';

// ─── Filtered Game State (what clients receive) ────────────────────

export interface FilteredPlayerInfo {
  userId: string;
  displayName: string;
  cardCount: number;
  isCurrentTurn: boolean;
}

export interface FilteredGameState {
  myHand: Card[];
  players: FilteredPlayerInfo[];
  discardPileTop: Card | null;
  drawPileCount: number;
  currentPlayerId: string;
  phase: 'waiting' | 'playing' | 'finished';
  direction: 'clockwise' | 'anticlockwise';
  declaredSuit: Suit | null;
  pendingDrawCount: number;
  pendingSkipTurns: number;
  skipTargetId: string | null;
  freeTurnsRemaining: number;
  freeTurnPlayerId: string | null;
  winnerId: string | null;
}
