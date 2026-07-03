// Vendored from cardgame-engine (@card-capital/engine) src/types/Player.ts

import { Hand, createHand } from './Hand';

export interface Player {
  readonly id: string;
  readonly name: string;
  readonly hand: Hand;
  readonly isAI: boolean;
}

export function createPlayer(id: string, name: string, isAI: boolean = false): Player {
  return { id, name, hand: createHand(), isAI };
}

export function updatePlayerHand(player: Player, hand: Hand): Player {
  return { ...player, hand };
}
