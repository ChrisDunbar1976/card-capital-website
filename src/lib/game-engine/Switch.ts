// Vendored from cardgame-engine (@card-capital/engine) src/games/shedding/Switch.ts
// Keep in sync with the mobile app engine. Pure, framework-free.

import { Card, Rank, Suit, cardEquals } from './Card';
import { Hand, createHand, addToHand, removeFromHand, handSize, isEmpty, getCardsOfRank } from './Hand';
import { createPlayer, updatePlayerHand } from './Player';
import { SheddingGameState, getTopCard, getCurrentPlayer, getNextPlayerIndex } from './GameState';
import { createStandardDeck, shuffle, deal, drawFromPile, reshuffleDiscardPile } from './Deck';
import type { FilteredGameState, FilteredPlayerInfo } from './FilteredState';

const WILD_RANKS: readonly Rank[] = ['2', '3', '8', 'J', 'A'];
const CARDS_PER_PLAYER = 7;

export interface SwitchState extends SheddingGameState {
  readonly pendingDrawCount: number;
  readonly pendingDrawRank: '2' | '3' | null;
  readonly pendingDrawSourceId: string | null;
  readonly pendingSkipTurns: number;
  readonly skipTargetId: string | null;
  readonly freeTurnsRemaining: number;
  readonly freeTurnPlayerId: string | null;
  readonly lastCardCalled: Record<string, boolean>;
  readonly jackChainActive: boolean;
  readonly jackChainSuit: Suit | null;
}

export type SwitchAction =
  | { type: 'play'; cards: Card[]; declaredSuit?: Suit }
  | { type: 'draw' };

export interface SwitchActionResult {
  readonly state: SwitchState;
  readonly events: SwitchEvent[];
}

export type SwitchEvent =
  | { type: 'cardPlayed'; playerId: string; card: Card }
  | { type: 'cardsDrawn'; playerId: string; count: number }
  | { type: 'suitDeclared'; playerId: string; suit: Suit }
  | { type: 'turnSkipped'; playerId: string; turnsRemaining: number }
  | { type: 'lastCardsCalled'; playerId: string; remainingCards: number }
  | { type: 'gameWon'; playerId: string }
  | { type: 'drawPileReshuffled' }
  | { type: 'jackChainStart'; playerId: string }
  | { type: 'jackChainFailed'; playerId: string };

function isWildRank(rank: Rank): boolean {
  return (WILD_RANKS as readonly string[]).includes(rank);
}

// True iff the entire hand can be discharged in one legal play and the last
// card is not a Jack (a Jack as the final card triggers the Jack chain rather
// than a win — see handlePlay). Used to gate the automatic `lastCardsCalled`
// warning so it fires only when the player could actually finish next turn.
function canFinishInOneTurn(hand: Hand): boolean {
  const cards = hand.cards;
  const n = cards.length;
  if (n === 0) return false;
  if (n === 1) return cards[0]!.rank !== 'J';

  const firstRank = cards[0]!.rank;
  if (firstRank !== 'J' && cards.every(c => c.rank === firstRank)) return true;

  const jacks = cards.filter(c => c.rank === 'J');
  const nonJacks = cards.filter(c => c.rank !== 'J');
  if (jacks.length === 0 || nonJacks.length === 0) return false;

  const tailRank = nonJacks[0]!.rank;
  if (!nonJacks.every(c => c.rank === tailRank)) return false;

  // Ace as first follow-up is always valid regardless of Jack suit.
  if (tailRank === 'A') return true;

  // Otherwise the last Jack's suit must equal one of the non-Jack suits.
  const nonJackSuits = new Set(nonJacks.map(c => c.suit));
  return jacks.some(j => nonJackSuits.has(j.suit));
}

function findSafeStartCard(drawPile: readonly Card[]): { startCard: Card; remaining: Card[]; skipped: Card[] } {
  const mutable = [...drawPile];
  const skipped: Card[] = [];

  while (mutable.length > 0) {
    const card = mutable.pop()!;
    if (!isWildRank(card.rank)) {
      return { startCard: card, remaining: mutable, skipped };
    }
    skipped.push(card);
  }

  throw new Error('No non-wild cards in deck');
}

export function createSwitchGame(playerConfigs: { id: string; name: string; isAI: boolean }[]): SwitchState {
  if (playerConfigs.length < 2 || playerConfigs.length > 8) {
    throw new Error('Switch requires 2-8 players');
  }

  const deck = shuffle(createStandardDeck());
  const { hands, remaining } = deal(deck, playerConfigs.length, CARDS_PER_PLAYER);

  const players = playerConfigs.map((config, i) =>
    updatePlayerHand(createPlayer(config.id, config.name, config.isAI), createHand(hands[i]!))
  );

  const { startCard, remaining: drawPile, skipped } = findSafeStartCard(remaining);

  const drawPileWithSkipped = [...skipped, ...drawPile];

  return {
    players,
    currentPlayerIndex: 0,
    direction: 'clockwise',
    phase: 'playing',
    winnerId: null,
    drawPile: shuffle(drawPileWithSkipped),
    discardPile: [startCard],
    declaredSuit: null,
    pendingDrawCount: 0,
    pendingDrawRank: null,
    pendingDrawSourceId: null,
    pendingSkipTurns: 0,
    skipTargetId: null,
    freeTurnsRemaining: 0,
    freeTurnPlayerId: null,
    lastCardCalled: {},
    jackChainActive: false,
    jackChainSuit: null,
  };
}

function canPlayOnTop(card: Card, topCard: Card, state: SwitchState): boolean {
  if (state.jackChainActive) {
    return card.rank === 'J' || card.suit === state.jackChainSuit;
  }

  if (state.pendingDrawCount > 0) {
    return card.rank === state.pendingDrawRank;
  }

  if (state.pendingSkipTurns > 0 && state.skipTargetId === getCurrentPlayer(state).id) {
    return card.rank === '8';
  }

  if (card.rank === 'A') {
    return true;
  }

  if (card.rank === 'J') {
    return true;
  }

  const effectiveSuit = state.declaredSuit ?? topCard.suit;
  return card.suit === effectiveSuit || card.rank === topCard.rank;
}

export function getValidPlays(state: SwitchState): Card[][] {
  if (state.phase !== 'playing') return [];
  const player = getCurrentPlayer(state);
  const topCard = getTopCard(state);
  if (!topCard) return [];

  const validSingle: Card[][] = [];

  for (const card of player.hand.cards) {
    if (canPlayOnTop(card, topCard, state)) {
      validSingle.push([card]);

      const sameRank = getCardsOfRank(player.hand, card.rank)
        .filter(c => !cardEquals(c, card));
      for (let count = 1; count <= sameRank.length; count++) {
        validSingle.push([card, ...sameRank.slice(0, count)]);
      }
    }
  }

  // Jack combos: Jack(s) followed by a card matching the last Jack's suit
  // (or an Ace, which is wild), optionally followed by same-rank cards.
  const playableJacks = player.hand.cards.filter(
    c => c.rank === 'J' && canPlayOnTop(c, topCard, state),
  );
  if (playableJacks.length > 0) {
    const nonJacks = player.hand.cards.filter(c => c.rank !== 'J');
    for (const followUp of nonJacks) {
      // Aces are wild — any Jack can precede them
      const followUpIsWild = followUp.rank === 'A';
      const matchingJacks = followUpIsWild
        ? playableJacks
        : playableJacks.filter(j => j.suit === followUp.suit);
      const otherJacks = followUpIsWild
        ? []
        : playableJacks.filter(j => j.suit !== followUp.suit);

      // Same-rank cards that can extend after the follow-up
      const sameRankExtras = nonJacks.filter(
        c => c.rank === followUp.rank && !cardEquals(c, followUp),
      );

      for (const lastJack of matchingJacks) {
        // Build all Jack prefix variations for this lastJack
        const jackPrefixes: Card[][] = [[lastJack]];
        for (let extra = 1; extra <= otherJacks.length; extra++) {
          jackPrefixes.push([...otherJacks.slice(0, extra), lastJack]);
        }
        const otherMatching = matchingJacks.filter(j => !cardEquals(j, lastJack));
        for (let extra = 1; extra <= otherMatching.length; extra++) {
          jackPrefixes.push([...otherMatching.slice(0, extra), lastJack]);
        }

        // For each prefix, add follow-up alone + follow-up with same-rank extensions
        for (const prefix of jackPrefixes) {
          validSingle.push([...prefix, followUp]);
          for (let ext = 1; ext <= sameRankExtras.length; ext++) {
            validSingle.push([...prefix, followUp, ...sameRankExtras.slice(0, ext)]);
          }
        }
      }
    }
  }

  return validSingle;
}

function ensureDrawPile(state: SwitchState): SwitchState {
  if (state.drawPile.length > 0) return state;
  if (state.discardPile.length < 2) return state;

  const { topCard, newDrawPile } = reshuffleDiscardPile(state.discardPile);
  return {
    ...state,
    drawPile: newDrawPile,
    discardPile: [topCard],
  };
}

function advanceToNextPlayer(state: SwitchState): SwitchState {
  return {
    ...state,
    currentPlayerIndex: getNextPlayerIndex(state),
  };
}

/**
 * Resolve ALL pending skips at once. The skip target misses N turns,
 * and the next player receives N consecutive free turns.
 */
function resolveAllSkips(state: SwitchState): { state: SwitchState; events: SwitchEvent[] } {
  const skipCount = state.pendingSkipTurns;
  if (skipCount === 0) return { state, events: [] };

  const skippedPlayer = getCurrentPlayer(state);
  const events: SwitchEvent[] = [{
    type: 'turnSkipped',
    playerId: skippedPlayer.id,
    turnsRemaining: 0,
  }];

  const advanced = advanceToNextPlayer(state);
  const freePlayer = getCurrentPlayer(advanced);

  return {
    state: {
      ...advanced,
      pendingSkipTurns: 0,
      skipTargetId: null,
      freeTurnsRemaining: skipCount,
      freeTurnPlayerId: freePlayer.id,
    },
    events,
  };
}

/**
 * Check if all four 8s are on the discard pile (public info — no secrets revealed).
 */
function allEightsPlayed(state: SwitchState): boolean {
  return state.discardPile.filter(c => c.rank === '8').length >= 4;
}

/**
 * Advance after an action, respecting free turns.
 * During free turns the same player keeps going; when free turns run out, advance normally.
 */
function advanceAfterAction(state: SwitchState): SwitchState {
  if (state.freeTurnsRemaining > 1) {
    return { ...state, freeTurnsRemaining: state.freeTurnsRemaining - 1 };
  }
  if (state.freeTurnsRemaining === 1) {
    return advanceToNextPlayer({
      ...state,
      freeTurnsRemaining: 0,
      freeTurnPlayerId: null,
    });
  }
  return advanceToNextPlayer(state);
}

/**
 * After any turn-advancing action, check if a pending draw has cycled
 * back to the player who played the 2/3 and void it.
 */
function voidCycledPendingDraw(state: SwitchState): SwitchState {
  if (
    state.pendingDrawCount > 0 &&
    state.pendingDrawSourceId &&
    getCurrentPlayer(state).id === state.pendingDrawSourceId
  ) {
    return {
      ...state,
      pendingDrawCount: 0,
      pendingDrawRank: null,
      pendingDrawSourceId: null,
    };
  }
  return state;
}

export function executeAction(state: SwitchState, action: SwitchAction): SwitchActionResult {
  if (state.phase !== 'playing') {
    throw new Error('Game is not in playing phase');
  }

  switch (action.type) {
    case 'draw':
      return handleDraw(state);
    case 'play':
      return handlePlay(state, action.cards, action.declaredSuit);
  }
}

function handleDraw(state: SwitchState): SwitchActionResult {
  const player = getCurrentPlayer(state);
  const events: SwitchEvent[] = [];

  if (state.jackChainActive) {
    // Drawing during a Jack chain: draw 1 card and end the chain
    events.push({ type: 'jackChainFailed', playerId: player.id });
    let current = ensureDrawPile(state);
    const actualDraw = Math.min(1, current.drawPile.length);
    if (actualDraw > 0) {
      const { drawn, remaining } = drawFromPile(current.drawPile, actualDraw);
      const updatedHand = addToHand(player.hand, ...drawn);
      const updatedPlayers = current.players.map((p, i) =>
        i === current.currentPlayerIndex ? updatePlayerHand(p, updatedHand) : p
      );
      events.push({ type: 'cardsDrawn', playerId: player.id, count: actualDraw });
      current = { ...current, players: updatedPlayers, drawPile: remaining };
    }
    const jackDrawState = advanceAfterAction({
      ...current,
      jackChainActive: false,
      jackChainSuit: null,
    });
    return { state: voidCycledPendingDraw(jackDrawState), events };
  }

  // Accept pending skip — resolve ALL skips at once, give free turns to opponent
  if (state.pendingSkipTurns > 0 && state.skipTargetId === player.id) {
    const skipResult = resolveAllSkips(state);
    return { state: voidCycledPendingDraw(skipResult.state), events: skipResult.events };
  }

  const drawCount = state.pendingDrawCount > 0 ? state.pendingDrawCount : 1;

  let current = ensureDrawPile(state);
  const actualDraw = Math.min(drawCount, current.drawPile.length);

  if (actualDraw === 0) {
    return { state: voidCycledPendingDraw(advanceAfterAction(current)), events };
  }

  const { drawn, remaining } = drawFromPile(current.drawPile, actualDraw);
  const updatedHand = addToHand(player.hand, ...drawn);
  const updatedPlayers = current.players.map((p, i) =>
    i === current.currentPlayerIndex ? updatePlayerHand(p, updatedHand) : p
  );

  events.push({ type: 'cardsDrawn', playerId: player.id, count: actualDraw });

  let next: SwitchState = {
    ...current,
    players: updatedPlayers,
    drawPile: remaining,
    pendingDrawCount: 0,
    pendingDrawRank: null,
    pendingDrawSourceId: null,
    lastCardCalled: { ...current.lastCardCalled, [player.id]: false },
  };

  next = advanceAfterAction(next);

  return { state: voidCycledPendingDraw(next), events };
}

function handlePlay(state: SwitchState, cards: Card[], declaredSuit?: Suit): SwitchActionResult {
  if (cards.length === 0) throw new Error('Must play at least one card');

  const player = getCurrentPlayer(state);
  const topCard = getTopCard(state);
  if (!topCard) throw new Error('No top card on discard pile');

  const firstCard = cards[0]!;
  if (!canPlayOnTop(firstCard, topCard, state)) {
    throw new Error('Invalid play: card cannot be played on current top card');
  }

  for (const card of cards) {
    if (!player.hand.cards.some(c => cardEquals(c, card))) {
      throw new Error('Player does not have this card');
    }
  }

  if (cards.length > 1) {
    const allSameRank = cards.every(c => c.rank === firstCard.rank);
    if (!allSameRank) {
      // Allow Jack combo: leading Jacks + follow-up cards matching last Jack's suit
      const jacks = cards.filter(c => c.rank === 'J');
      const nonJacks = cards.filter(c => c.rank !== 'J');
      if (jacks.length === 0 || nonJacks.length === 0) {
        throw new Error('All cards played together must be the same rank');
      }
      // Jacks must be at the front
      for (let i = 0; i < jacks.length; i++) {
        if (cards[i]!.rank !== 'J') {
          throw new Error('Jacks must be played first in a combo');
        }
      }
      // First follow-up must match the last Jack's suit (or be an Ace)
      const lastJackSuit = jacks[jacks.length - 1]!.suit;
      const firstFollowUp = nonJacks[0]!;
      if (firstFollowUp.rank !== 'A' && firstFollowUp.suit !== lastJackSuit) {
        throw new Error('Follow-up card must match the last Jack\'s suit');
      }
      // Remaining follow-ups must be the same rank (same-rank stacking)
      if (!nonJacks.every(c => c.rank === firstFollowUp.rank)) {
        throw new Error('Follow-up cards after a Jack combo must be the same rank');
      }
    }
  }

  const events: SwitchEvent[] = [];
  let updatedHand = player.hand;

  for (const card of cards) {
    updatedHand = removeFromHand(updatedHand, card);
    events.push({ type: 'cardPlayed', playerId: player.id, card });
  }

  if (canFinishInOneTurn(updatedHand)) {
    events.push({ type: 'lastCardsCalled', playerId: player.id, remainingCards: handSize(updatedHand) });
  }

  const updatedPlayers = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? updatePlayerHand(p, updatedHand) : p
  );

  let next: SwitchState = {
    ...state,
    players: updatedPlayers,
    discardPile: [...state.discardPile, ...cards],
    pendingDrawCount: 0,
    pendingDrawRank: null,
    pendingDrawSourceId: null,
    declaredSuit: null,
    jackChainActive: false,
    jackChainSuit: null,
  };

  if (isEmpty(updatedHand)) {
    const lastPlayed = cards[cards.length - 1]!;
    if (lastPlayed.rank !== 'J') {
      // Non-Jack final card: player wins
      return {
        state: { ...next, phase: 'finished', winnerId: player.id },
        events: [...events, { type: 'gameWon', playerId: player.id }],
      };
    }
    // Jack as final card: Jack chain activates, player must draw on next turn
    // (hand is empty but game continues — fall through to card effect processing)
  }

  const lastCard = cards[cards.length - 1]!;
  const playedRank = lastCard.rank;
  const hasLeadingJacks = cards.length > 1 && cards[0]!.rank === 'J' && lastCard.rank !== 'J';
  // Count only the non-Jack cards for effect multipliers
  const effectCards = hasLeadingJacks ? cards.filter(c => c.rank !== 'J') : cards;

  // If the combo started with Jacks, emit Jack chain event
  if (hasLeadingJacks) {
    events.push({ type: 'jackChainStart', playerId: player.id });
  }

  switch (playedRank) {
    case 'A': {
      const suit = declaredSuit ?? lastCard.suit;
      next = { ...next, declaredSuit: suit };
      events.push({ type: 'suitDeclared', playerId: player.id, suit });
      next = advanceAfterAction(next);
      break;
    }

    case '2': {
      const additionalDraw = 2 * effectCards.length;
      const totalPending = (state.pendingDrawRank === '2' ? state.pendingDrawCount : 0) + additionalDraw;
      next = {
        ...next,
        pendingDrawCount: totalPending,
        pendingDrawRank: '2',
        pendingDrawSourceId: player.id,
      };
      next = advanceAfterAction(next);
      break;
    }

    case '3': {
      const additionalDraw = 3 * effectCards.length;
      const totalPending = (state.pendingDrawRank === '3' ? state.pendingDrawCount : 0) + additionalDraw;
      next = {
        ...next,
        pendingDrawCount: totalPending,
        pendingDrawRank: '3',
        pendingDrawSourceId: player.id,
      };
      next = advanceAfterAction(next);
      break;
    }

    case '8': {
      const additionalSkips = effectCards.length;
      const totalSkips = state.pendingSkipTurns + additionalSkips;
      // Playing 8 transfers control to the skip target — any free turns
      // belonging to the playing player are forfeit. resolveAllSkips will
      // award a fresh free-turn series if/when the skip is accepted.
      next = {
        ...next,
        pendingSkipTurns: totalSkips,
        freeTurnsRemaining: 0,
        freeTurnPlayerId: null,
      };
      next = advanceToNextPlayer(next);
      // Target the next player for the skips
      next = { ...next, skipTargetId: getCurrentPlayer(next).id };

      // Auto-resolve if all four 8s are now on the discard pile —
      // the target can't possibly have an 8, so no need for manual approval
      if (allEightsPlayed(next)) {
        const resolved = resolveAllSkips(next);
        next = resolved.state;
        events.push(...resolved.events);
      }
      break;
    }

    case 'J': {
      events.push({ type: 'jackChainStart', playerId: player.id });
      next = {
        ...next,
        jackChainActive: true,
        jackChainSuit: lastCard.suit,
      };
      break;
    }

    default: {
      next = advanceAfterAction(next);
      break;
    }
  }

  return { state: voidCycledPendingDraw(next), events };
}

// ─── State Filtering ─────────────────────────────────────────────

/**
 * Filters the full game state to produce a player-specific view.
 * Each player only sees their own hand; other players show card counts only.
 * This prevents cheating in a host-authoritative architecture.
 */
export function filterStateForPlayer(
  fullState: SwitchState,
  playerId: string,
): FilteredGameState {
  const currentPlayer = fullState.players[fullState.currentPlayerIndex];
  const currentPlayerId = currentPlayer?.id ?? '';

  const myPlayer = fullState.players.find((p) => p.id === playerId);
  const myHand = [...(myPlayer?.hand.cards ?? [])];

  const players: FilteredPlayerInfo[] = fullState.players.map((p) => ({
    userId: p.id,
    displayName: p.name,
    cardCount: handSize(p.hand),
    isCurrentTurn: p.id === currentPlayerId,
  }));

  const discardPileTop =
    fullState.discardPile.length > 0
      ? fullState.discardPile[fullState.discardPile.length - 1]!
      : null;

  return {
    myHand,
    players,
    discardPileTop,
    drawPileCount: fullState.drawPile.length,
    currentPlayerId,
    phase: fullState.phase === 'finished' ? 'finished' : 'playing',
    direction: fullState.direction === 'clockwise' ? 'clockwise' : 'anticlockwise',
    declaredSuit: fullState.declaredSuit,
    pendingDrawCount: fullState.pendingDrawCount,
    pendingSkipTurns: fullState.pendingSkipTurns,
    skipTargetId: fullState.skipTargetId,
    freeTurnsRemaining: fullState.freeTurnsRemaining,
    freeTurnPlayerId: fullState.freeTurnPlayerId,
    winnerId: fullState.winnerId,
  };
}
