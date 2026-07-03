// Vendored from cardgame-engine (@card-capital/engine) src/types/GameState.ts

import { Card } from './Card';
import { Player } from './Player';

export type PlayDirection = 'clockwise' | 'anticlockwise';

export type GamePhase = 'waiting' | 'playing' | 'finished';

export interface BaseGameState {
  readonly players: readonly Player[];
  readonly currentPlayerIndex: number;
  readonly direction: PlayDirection;
  readonly phase: GamePhase;
  readonly winnerId: string | null;
}

export interface SheddingGameState extends BaseGameState {
  readonly drawPile: readonly Card[];
  readonly discardPile: readonly Card[];
  readonly declaredSuit: Card['suit'] | null;
}

export function getTopCard(state: SheddingGameState): Card | undefined {
  return state.discardPile[state.discardPile.length - 1];
}

export function getCurrentPlayer(state: BaseGameState): Player {
  return state.players[state.currentPlayerIndex]!;
}

export function getNextPlayerIndex(state: BaseGameState, skip: number = 0): number {
  const step = state.direction === 'clockwise' ? 1 : -1;
  const total = state.players.length;
  return ((state.currentPlayerIndex + step * (1 + skip)) % total + total) % total;
}
