'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PlayingCard } from '@/components/cards/PlayingCard';
import {
  type Card,
  type Suit,
  type AIDifficulty,
  rankValue,
} from '@/lib/game-engine';
import { useSwitchGame, HUMAN_ID } from './useSwitchGame';
import { OpponentFigure } from './OpponentFigure';

const SUIT_GLYPH: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};
const SUIT_COLOR: Record<Suit, string> = {
  spades: '#1F1F1F',
  clubs: '#1F1F1F',
  hearts: '#C0392B',
  diamonds: '#C0392B',
};
const SUIT_ORDER: Record<Suit, number> = { hearts: 0, diamonds: 1, clubs: 2, spades: 3 };

const cardKey = (c: Card) => `${c.rank}-${c.suit}`;

function sortCards(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const s = SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
    return s !== 0 ? s : rankValue(a.rank) - rankValue(b.rank);
  });
}

const DIFFICULTIES: { value: AIDifficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function SwitchGame() {
  const g = useSwitchGame({ opponents: 2, difficulty: 'medium' });
  const { game, view, validPlays, isMyTurn, status } = g;

  const [selected, setSelected] = useState<Card[]>([]);
  const [suitPicker, setSuitPicker] = useState<Card[] | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [draftOpponents, setDraftOpponents] = useState(2);
  const [draftDifficulty, setDraftDifficulty] = useState<AIDifficulty>('medium');

  // The game is dealt with Math.random(), so it must render client-only to
  // avoid an SSR/client hydration mismatch. Show a static shell until mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const selectedKeys = useMemo(() => new Set(selected.map(cardKey)), [selected]);

  // Find a valid engine-ordered play whose card set exactly matches `cards`.
  const matchingPlay = useMemo(() => {
    const wantKeys = selectedKeys;
    if (wantKeys.size === 0) return null;
    for (const play of validPlays) {
      if (play.length !== wantKeys.size) continue;
      if (play.every((c) => wantKeys.has(cardKey(c)))) return play;
    }
    return null;
  }, [validPlays, selectedKeys]);

  // Set of card keys that could START a play (playable when nothing selected).
  const startableKeys = useMemo(() => {
    const s = new Set<string>();
    for (const play of validPlays) s.add(cardKey(play[0]!));
    return s;
  }, [validPlays]);

  if (!mounted) {
    return (
      <div className="felt-surface relative min-h-[100svh]">
        <div className="felt-vignette" />
        <div className="relative z-10 flex min-h-[100svh] items-center justify-center">
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Dealing…
          </span>
        </div>
      </div>
    );
  }

  // Can this card be added to the current selection (forms prefix of some play)?
  const canAdd = (card: Card): boolean => {
    const wantKeys = new Set(selectedKeys);
    wantKeys.add(cardKey(card));
    return validPlays.some(
      (play) =>
        play.length >= wantKeys.size &&
        [...wantKeys].every((k) => play.some((c) => cardKey(c) === k)),
    );
  };

  const handleCardClick = (card: Card) => {
    if (!isMyTurn) return;
    const key = cardKey(card);
    if (selectedKeys.has(key)) {
      setSelected((prev) => prev.filter((c) => cardKey(c) !== key));
      return;
    }
    if (selected.length > 0 && canAdd(card)) {
      setSelected((prev) => [...prev, card]);
    } else if (startableKeys.has(key)) {
      setSelected([card]); // start a fresh selection
    }
  };

  const submitPlay = (cards: Card[], declaredSuit?: Suit) => {
    g.play(cards, declaredSuit);
    setSelected([]);
    setSuitPicker(null);
  };

  const handlePlay = () => {
    if (!matchingPlay) return;
    const last = matchingPlay[matchingPlay.length - 1]!;
    if (last.rank === 'A') {
      setSuitPicker(matchingPlay);
    } else {
      submitPlay(matchingPlay);
    }
  };

  const startNewGame = () => {
    g.newGame({ opponents: draftOpponents, difficulty: draftDifficulty });
    setSelected([]);
    setSuitPicker(null);
    setShowSetup(false);
  };

  // ─── Derived UI hints ────────────────────────────────────────────
  const opponents = view.players.filter((p) => p.userId !== HUMAN_ID);
  const me = view.players.find((p) => p.userId === HUMAN_ID);
  const currentName =
    view.players.find((p) => p.userId === view.currentPlayerId)?.displayName ?? '';
  const myHand = sortCards(view.myHand);

  const drawLabel = (() => {
    if (game.pendingDrawCount > 0) return `Pick up ${game.pendingDrawCount}`;
    if (game.pendingSkipTurns > 0 && game.skipTargetId === HUMAN_ID) return 'Take the skip';
    return 'Draw a card';
  })();

  const banner = (() => {
    if (!isMyTurn) return null;
    if (game.jackChainActive) {
      const s = game.jackChainSuit;
      return `Jack in play — play a Jack or a ${s ? SUIT_GLYPH[s] : ''} card, or draw.`;
    }
    if (game.pendingDrawCount > 0) {
      return `Stack a ${game.pendingDrawRank} to pass it on, or pick up ${game.pendingDrawCount}.`;
    }
    if (game.pendingSkipTurns > 0 && game.skipTargetId === HUMAN_ID) {
      return `Play an 8 to bounce it back, or take the skip (miss ${game.pendingSkipTurns} turn${game.pendingSkipTurns === 1 ? '' : 's'}).`;
    }
    if (validPlays.length === 0) return 'No legal play — draw a card.';
    return null;
  })();

  const top = view.discardPileTop;

  return (
    <div className="felt-surface relative min-h-[100svh]">
      <div className="felt-vignette" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-3xl flex-col px-4 pb-6 pt-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <Link
            href="/play"
            className="text-sm transition-colors hover:text-white"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ‹ Games
          </Link>
          <h1
            className="font-semibold"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-fluid-lg)' }}
          >
            Switch
          </h1>
          <button
            onClick={() => {
              setDraftOpponents(g.options.opponents);
              setDraftDifficulty(g.options.difficulty);
              setShowSetup(true);
            }}
            className="rounded-full px-3 py-1 text-sm transition-colors hover:text-white"
            style={{
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-gold-hairline)',
            }}
          >
            New game
          </button>
        </div>

        {/* Opponents */}
        <div className="mb-2 flex flex-wrap items-end justify-center gap-4 sm:gap-8">
          {opponents.map((p) => (
            <OpponentFigure
              key={p.userId}
              name={p.displayName}
              cardCount={p.cardCount}
              isCurrentTurn={p.isCurrentTurn}
            />
          ))}
        </div>

        {/* Table */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-2">
          <div className="flex items-center justify-center gap-6">
            {/* Draw pile */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => isMyTurn && g.draw()}
                disabled={!isMyTurn}
                aria-label="Draw pile"
                className="relative transition-transform disabled:cursor-default"
                style={{ cursor: isMyTurn ? 'pointer' : 'default' }}
              >
                <PlayingCard faceDown width={76} />
                {isMyTurn && (
                  <span
                    className="absolute inset-0 rounded-[7px]"
                    style={{ boxShadow: '0 0 0 2px var(--color-accent-gold)' }}
                  />
                )}
              </button>
              <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                Draw · {view.drawPileCount}
              </span>
            </div>

            {/* Discard pile */}
            <div className="flex flex-col items-center gap-1.5">
              {top ? (
                <PlayingCard rank={top.rank} suit={top.suit} width={76} />
              ) : (
                <PlayingCard faceDown width={76} />
              )}
              <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                Discard
              </span>
            </div>

            {/* Declared suit */}
            {view.declaredSuit && (
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-2xl"
                  style={{
                    backgroundColor: '#FFFFFE',
                    color: SUIT_COLOR[view.declaredSuit],
                    border: '1px solid var(--color-gold-hairline-bright)',
                  }}
                >
                  {SUIT_GLYPH[view.declaredSuit]}
                </div>
                <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                  Called
                </span>
              </div>
            )}
          </div>

          {/* Turn / banner */}
          <div className="flex min-h-[2.5rem] flex-col items-center gap-1 text-center">
            <span
              className="text-sm font-semibold"
              style={{ color: isMyTurn ? 'var(--color-accent-gold)' : 'var(--color-text-secondary)' }}
            >
              {status === 'playing'
                ? isMyTurn
                  ? 'Your turn'
                  : `${currentName} is thinking…`
                : status === 'won'
                  ? 'You win!'
                  : `${currentName || 'Opponent'} wins`}
            </span>
            {banner && (
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {banner}
              </span>
            )}
          </div>
        </div>

        {/* Your hand */}
        <div className="mt-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">
              Your hand
              <span className="ml-1.5" style={{ color: 'var(--color-text-muted)' }}>
                ({me?.cardCount ?? myHand.length})
              </span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {myHand.map((card) => {
              const key = cardKey(card);
              const isSelected = selectedKeys.has(key);
              // Mirror handleCardClick: a card is clickable iff clicking it does
              // something — it's selected (to deselect), extends the current
              // selection, or can start a fresh play.
              const playableNow =
                isMyTurn &&
                (isSelected ||
                  (selected.length > 0 && canAdd(card)) ||
                  startableKeys.has(key));
              // Positive highlight on cards you CAN play; every card stays fully
              // opaque so none look like a different card back.
              const boxShadow = isSelected
                ? '0 0 0 2px var(--color-accent-gold), 0 8px 18px rgba(0,0,0,0.5)'
                : playableNow
                  ? '0 0 0 2px var(--color-accent-gold-light), 0 0 12px rgba(212,168,75,0.45)'
                  : 'none';
              return (
                <button
                  key={key}
                  onClick={() => handleCardClick(card)}
                  disabled={!isMyTurn}
                  className="transition-transform"
                  style={{
                    transform: isSelected
                      ? 'translateY(-14px)'
                      : playableNow
                        ? 'translateY(-6px)'
                        : 'none',
                    cursor: isMyTurn && playableNow ? 'pointer' : 'default',
                    borderRadius: 8,
                    boxShadow,
                  }}
                >
                  <PlayingCard rank={card.rank} suit={card.suit} width={62} />
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setSelected([])}
              disabled={selected.length === 0}
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40"
              style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-gold-hairline)' }}
            >
              Clear
            </button>
            <button
              onClick={handlePlay}
              disabled={!matchingPlay}
              className="rounded-full px-8 py-2.5 text-sm font-semibold transition-transform enabled:hover:scale-105 disabled:opacity-40"
              style={{ background: 'var(--gradient-gold)', color: 'var(--color-text-inverse)' }}
            >
              Play{selected.length > 1 ? ` ${selected.length}` : ''}
            </button>
            <button
              onClick={() => g.draw()}
              disabled={!isMyTurn}
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40"
              style={{
                color: 'var(--color-accent-gold)',
                border: '1px solid var(--color-gold-hairline-bright)',
              }}
            >
              {drawLabel}
            </button>
          </div>
        </div>

        {/* Activity log */}
        <details className="mt-4">
          <summary
            className="cursor-pointer text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Game log
          </summary>
          <div className="mt-2 max-h-32 overflow-y-auto text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {g.log.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>Play a card to begin.</p>
            ) : (
              [...g.log].reverse().map((e) => (
                <p
                  key={e.id}
                  className="py-0.5"
                  style={{
                    color:
                      e.kind === 'you'
                        ? 'var(--color-accent-gold)'
                        : e.kind === 'system'
                          ? 'var(--color-text-muted)'
                          : 'var(--color-text-secondary)',
                  }}
                >
                  {e.text}
                </p>
              ))
            )}
          </div>
        </details>
      </div>

      {/* Suit picker */}
      {suitPicker && (
        <Overlay onClose={() => setSuitPicker(null)}>
          <h2 className="mb-4 text-center font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-fluid-lg)' }}>
            Call a suit
          </h2>
          <div className="flex justify-center gap-3">
            {(['spades', 'hearts', 'diamonds', 'clubs'] as Suit[]).map((s) => (
              <button
                key={s}
                onClick={() => submitPlay(suitPicker, s)}
                className="flex h-16 w-16 items-center justify-center rounded-xl text-3xl transition-transform hover:scale-105"
                style={{
                  backgroundColor: '#FFFFFE',
                  color: SUIT_COLOR[s],
                  border: '1px solid var(--color-gold-hairline-bright)',
                }}
                aria-label={s}
              >
                {SUIT_GLYPH[s]}
              </button>
            ))}
          </div>
        </Overlay>
      )}

      {/* Setup */}
      {showSetup && (
        <Overlay onClose={() => setShowSetup(false)}>
          <h2 className="mb-4 text-center font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-fluid-lg)' }}>
            New game
          </h2>
          <div className="mb-4">
            <p className="mb-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Opponents</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectChip key={n} active={draftOpponents === n} onClick={() => setDraftOpponents(n)}>
                  {n}
                </SelectChip>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="mb-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Difficulty</p>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <SelectChip key={d.value} active={draftDifficulty === d.value} onClick={() => setDraftDifficulty(d.value)}>
                  {d.label}
                </SelectChip>
              ))}
            </div>
          </div>
          <button
            onClick={startNewGame}
            className="w-full rounded-full py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--gradient-gold)', color: 'var(--color-text-inverse)' }}
          >
            Deal
          </button>
        </Overlay>
      )}

      {/* Win / lose */}
      {status !== 'playing' && (
        <Overlay>
          <div className="text-center">
            <p
              className="mb-1 font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-fluid-2xl)',
                color: status === 'won' ? 'var(--color-accent-gold)' : 'var(--color-text-primary)',
              }}
            >
              {status === 'won' ? 'You win!' : 'You lose'}
            </p>
            <p className="mb-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {status === 'won'
                ? 'Hand cleared. The saloon tips its hat.'
                : `${currentName} emptied their hand first.`}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  g.newGame();
                  setSelected([]);
                }}
                className="rounded-full px-7 py-2.5 text-sm font-semibold transition-transform hover:scale-105"
                style={{ background: 'var(--gradient-gold)', color: 'var(--color-text-inverse)' }}
              >
                Play again
              </button>
              <Link
                href="/play"
                className="rounded-full px-7 py-2.5 text-sm font-semibold transition-colors"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-gold-hairline)' }}
              >
                Games
              </Link>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function SelectChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
      style={{
        backgroundColor: active ? 'var(--color-surface-highlight)' : 'var(--color-bg-card)',
        color: active ? 'var(--color-accent-gold)' : 'var(--color-text-secondary)',
        border: `1px solid ${active ? 'var(--color-accent-gold)' : 'var(--color-gold-hairline)'}`,
      }}
    >
      {children}
    </button>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-surface-overlay)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-gold-hairline-bright)',
          boxShadow: 'var(--shadow-lift)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
