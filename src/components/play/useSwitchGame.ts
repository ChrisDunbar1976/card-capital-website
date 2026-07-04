'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type Card,
  type Suit,
  type SwitchState,
  type SwitchEvent,
  type AIDifficulty,
  type AIPersonality,
  PERSONALITIES,
  createSwitchGame,
  executeAction,
  getValidPlays,
  filterStateForPlayer,
  getCurrentPlayer,
  chooseSwitchAction,
  cardEquals,
} from '@/lib/game-engine';

export const HUMAN_ID = 'you';

const SUIT_GLYPH: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

/** A fresh, random cast of distinct regulars for this game. */
function pickRegulars(count: number): AIPersonality[] {
  const shuffled = [...PERSONALITIES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

interface GameSetup {
  configs: { id: string; name: string; isAI: boolean }[];
  personaById: Record<string, AIPersonality>;
}

function buildSetup(opts: SwitchGameOptions): GameSetup {
  const configs = [
    { id: HUMAN_ID, name: opts.playerName?.trim() || 'You', isAI: false },
  ];
  const personaById: Record<string, AIPersonality> = {};
  pickRegulars(opts.opponents).forEach((persona, i) => {
    const id = `ai-${i + 1}`;
    configs.push({ id, name: persona.name, isAI: true });
    personaById[id] = persona;
  });
  return { configs, personaById };
}

export interface LogEntry {
  id: number;
  text: string;
  kind: 'you' | 'ai' | 'system';
}

export interface SwitchGameOptions {
  opponents: number; // 1..5
  difficulty: AIDifficulty;
  playerName?: string;
}

function describeCards(cards: readonly Card[]): string {
  return cards.map((c) => `${c.rank}${SUIT_GLYPH[c.suit]}`).join(' ');
}

export function useSwitchGame(initial: SwitchGameOptions) {
  const [options, setOptions] = useState<SwitchGameOptions>(initial);
  // Persisted cast (id → personality) for the current game.
  const setupRef = useRef<GameSetup | null>(null);
  if (setupRef.current === null) setupRef.current = buildSetup(initial);
  const [game, setGame] = useState<SwitchState>(() =>
    createSwitchGame(setupRef.current!.configs),
  );
  const [log, setLog] = useState<LogEntry[]>([]);

  const gameRef = useRef(game);
  gameRef.current = game;
  const logId = useRef(0);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const pushLog = useCallback((text: string, kind: LogEntry['kind']) => {
    setLog((prev) => {
      const next = [...prev, { id: logId.current++, text, kind }];
      return next.length > 40 ? next.slice(next.length - 40) : next;
    });
  }, []);

  // Turn events → concise log lines. Uses the pre-action player list for names.
  const logEvents = useCallback(
    (before: SwitchState, action: { type: 'play' | 'draw'; cards?: Card[] }, events: SwitchEvent[]) => {
      const nameOf = (id: string) => before.players.find((p) => p.id === id)?.name ?? id;
      const actor = getCurrentPlayer(before);
      const kind: LogEntry['kind'] = actor.id === HUMAN_ID ? 'you' : 'ai';

      if (action.type === 'play' && action.cards) {
        pushLog(`${actor.name} played ${describeCards(action.cards)}`, kind);
      } else if (action.type === 'draw') {
        const drawn = events.find((e) => e.type === 'cardsDrawn');
        const count = drawn && drawn.type === 'cardsDrawn' ? drawn.count : 0;
        if (events.some((e) => e.type === 'jackChainFailed')) {
          pushLog(`${actor.name} couldn't follow the Jack — drew ${count}`, kind);
        } else if (count > 0) {
          pushLog(`${actor.name} drew ${count} card${count === 1 ? '' : 's'}`, kind);
        } else {
          pushLog(`${actor.name} couldn't play`, kind);
        }
      }

      for (const e of events) {
        switch (e.type) {
          case 'suitDeclared':
            pushLog(`${nameOf(e.playerId)} called ${SUIT_GLYPH[e.suit]} ${e.suit}`, 'system');
            break;
          case 'jackChainStart':
            pushLog('Jack! The next player must follow the suit or draw.', 'system');
            break;
          case 'turnSkipped':
            pushLog(`${nameOf(e.playerId)} was skipped`, 'system');
            break;
          case 'lastCardsCalled':
            pushLog(`${nameOf(e.playerId)} is on last cards!`, 'system');
            break;
          case 'gameWon':
            pushLog(
              e.playerId === HUMAN_ID ? 'You win! 🎉' : `${nameOf(e.playerId)} wins.`,
              'system',
            );
            break;
        }
      }
    },
    [pushLog],
  );

  const apply = useCallback(
    (action: { type: 'play'; cards: Card[]; declaredSuit?: Suit } | { type: 'draw' }) => {
      const before = gameRef.current;
      if (before.phase !== 'playing') return;
      let result;
      try {
        result = executeAction(before, action);
      } catch (err) {
        // Illegal action — ignore (UI should prevent this).
        console.warn('Switch: rejected action', err);
        return;
      }
      logEvents(before, action, result.events);
      gameRef.current = result.state;
      setGame(result.state);
    },
    [logEvents],
  );

  // Drive AI turns. Re-runs after every state change; schedules the current
  // AI player's move, chaining until it's the human's turn or the game ends.
  useEffect(() => {
    if (game.phase !== 'playing') return;
    const current = getCurrentPlayer(game);
    if (!current.isAI) return;

    const delay = 650 + Math.random() * 500;
    const timer = setTimeout(() => {
      const live = gameRef.current;
      if (live.phase !== 'playing') return;
      const actor = getCurrentPlayer(live);
      if (!actor.isAI) return;
      const persona = setupRef.current?.personaById[actor.id];
      apply(chooseSwitchAction(live, optionsRef.current.difficulty, persona));
    }, delay);

    return () => clearTimeout(timer);
  }, [game, apply]);

  const play = useCallback((cards: Card[], declaredSuit?: Suit) => {
    apply({ type: 'play', cards, declaredSuit });
  }, [apply]);

  const draw = useCallback(() => {
    apply({ type: 'draw' });
  }, [apply]);

  const newGame = useCallback((opts?: Partial<SwitchGameOptions>) => {
    const merged = { ...optionsRef.current, ...opts };
    optionsRef.current = merged;
    setOptions(merged);
    const setup = buildSetup(merged);
    setupRef.current = setup;
    const fresh = createSwitchGame(setup.configs);
    gameRef.current = fresh;
    setGame(fresh);
    setLog([]);
    logId.current = 0;
  }, []);

  const view = filterStateForPlayer(game, HUMAN_ID);
  const isMyTurn = game.phase === 'playing' && game.currentPlayerIndex === 0;
  const validPlays = isMyTurn ? getValidPlays(game) : [];

  const status: 'playing' | 'won' | 'lost' =
    game.phase !== 'finished'
      ? 'playing'
      : game.winnerId === HUMAN_ID
        ? 'won'
        : 'lost';

  return {
    game,
    view,
    options,
    isMyTurn,
    validPlays,
    log,
    status,
    play,
    draw,
    newGame,
    cardEquals,
    suitGlyph: SUIT_GLYPH,
  };
}
