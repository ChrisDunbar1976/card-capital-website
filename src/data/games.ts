export interface GameInfo {
  id: string;
  name: string;
  players: string;
  priority: number;
  gambling: boolean;
  /** If set, the game is playable in the browser at this route. */
  href?: string;
}

export interface GameCategory {
  id: string;
  name: string;
  tagline: string;
  games: GameInfo[];
}

export const CATEGORIES: GameCategory[] = [
  {
    id: 'shedding',
    name: 'Shedding',
    tagline: 'Empty your hand first',
    games: [
      { id: 'switch', name: 'Switch', players: '2–8', priority: 5, gambling: false, href: '/play/switch' },
      { id: 'last-card', name: 'Last Card', players: '2–8', priority: 5, gambling: false },
      { id: 'crazy-eights', name: 'Crazy Eights', players: '2–8', priority: 5, gambling: false },
      { id: 'palace', name: 'Palace', players: '2–5', priority: 4, gambling: false },
      { id: 'president', name: 'President', players: '4–8', priority: 4, gambling: false },
      { id: 'snap', name: 'Snap', players: '2–8', priority: 3, gambling: false },
      { id: 'speed', name: 'Speed', players: '2', priority: 3, gambling: false },
      { id: 'go-fish', name: 'Go Fish', players: '2–6', priority: 3, gambling: false },
      { id: 'cheat', name: 'Cheat', players: '3–8', priority: 3, gambling: false },
      { id: 'mau-mau', name: 'Mau-Mau', players: '2–8', priority: 3, gambling: false },
      { id: 'old-maid', name: 'Old Maid', players: '3–8', priority: 2, gambling: false },
    ],
  },
  {
    id: 'trick-taking',
    name: 'Trick-Taking',
    tagline: 'Win (or avoid) tricks',
    games: [
      { id: 'whist', name: 'Whist', players: '4', priority: 5, gambling: false },
      { id: 'hearts', name: 'Hearts', players: '4', priority: 5, gambling: false },
      { id: 'spades', name: 'Spades', players: '4', priority: 5, gambling: false },
      { id: 'bridge', name: 'Contract Bridge', players: '4', priority: 4, gambling: false },
      { id: 'euchre', name: 'Euchre', players: '4', priority: 3, gambling: false },
      { id: 'knockout-whist', name: 'Knockout Whist', players: '2–7', priority: 3, gambling: false },
      { id: 'oh-hell', name: 'Oh Hell', players: '3–7', priority: 3, gambling: false },
      { id: 'solo-whist', name: 'Solo Whist', players: '4', priority: 3, gambling: false },
      { id: 'pinochle', name: 'Pinochle', players: '4', priority: 3, gambling: false },
    ],
  },
  {
    id: 'poker',
    name: 'Poker',
    tagline: 'Best hand wins the pot',
    games: [
      { id: 'texas-holdem', name: 'Texas Hold’em', players: '2–10', priority: 5, gambling: true },
      { id: 'omaha', name: 'Pot Limit Omaha', players: '2–10', priority: 5, gambling: true },
      { id: 'three-card-brag', name: 'Three-Card Brag', players: '2–8', priority: 5, gambling: true },
      { id: 'five-card-draw', name: 'Five-Card Draw', players: '2–6', priority: 4, gambling: true },
      { id: 'seven-card-stud', name: 'Seven-Card Stud', players: '2–8', priority: 4, gambling: true },
      { id: 'omaha-hi-lo', name: 'Omaha Hi-Lo', players: '2–10', priority: 3, gambling: true },
      { id: 'razz', name: 'Razz', players: '2–8', priority: 3, gambling: true },
      { id: 'caribbean-stud', name: 'Caribbean Stud', players: '1–7', priority: 3, gambling: true },
    ],
  },
  {
    id: 'casino',
    name: 'Casino',
    tagline: 'Beat the dealer',
    games: [
      { id: 'blackjack', name: 'Blackjack', players: '1–7', priority: 5, gambling: true },
      { id: 'pontoon', name: 'Pontoon', players: '3–10', priority: 4, gambling: true },
      { id: 'baccarat', name: 'Baccarat', players: '1', priority: 3, gambling: true },
    ],
  },
  {
    id: 'rummy',
    name: 'Rummy',
    tagline: 'Form melds and runs',
    games: [
      { id: 'gin-rummy', name: 'Gin Rummy', players: '2', priority: 5, gambling: false },
      { id: 'standard-rummy', name: 'Standard Rummy', players: '2–6', priority: 5, gambling: false },
      { id: 'rummy-500', name: 'Rummy 500', players: '2–8', priority: 4, gambling: false },
      { id: 'canasta', name: 'Canasta', players: '4', priority: 4, gambling: false },
      { id: 'indian-rummy', name: 'Indian Rummy', players: '2–6', priority: 4, gambling: false },
      { id: 'contract-rummy', name: 'Contract Rummy', players: '3–5', priority: 3, gambling: false },
    ],
  },
  {
    id: 'cribbage',
    name: 'Cribbage',
    tagline: 'Score combinations as you play',
    games: [
      { id: 'cribbage', name: 'Cribbage', players: '2–4', priority: 5, gambling: false },
    ],
  },
  {
    id: 'italian',
    name: 'Italian',
    tagline: 'Capture cards and score points',
    games: [
      { id: 'scopa', name: 'Scopa', players: '2–6', priority: 5, gambling: false },
      { id: 'briscola', name: 'Briscola', players: '2–4', priority: 5, gambling: false },
      { id: 'scopone', name: 'Scopone Scientifico', players: '4', priority: 4, gambling: false },
      { id: 'tressette', name: 'Tressette', players: '4', priority: 4, gambling: false },
      { id: 'sette-e-mezzo', name: 'Sette e Mezzo', players: '2–8', priority: 3, gambling: true },
    ],
  },
  {
    id: 'speed-war',
    name: 'Speed & War',
    tagline: 'Collect cards or react fastest',
    games: [
      { id: 'war', name: 'War', players: '2', priority: 4, gambling: false },
      { id: 'egyptian-ratscrew', name: 'Egyptian Ratscrew', players: '2–8', priority: 4, gambling: false },
      { id: 'beggar-my-neighbour', name: 'Beggar My Neighbour', players: '2–6', priority: 3, gambling: false },
    ],
  },
  {
    id: 'indian',
    name: 'Indian',
    tagline: 'Classic games from the subcontinent',
    games: [
      { id: 'teen-patti', name: 'Teen Patti', players: '3–8', priority: 5, gambling: true },
      { id: 'andar-bahar', name: 'Andar Bahar', players: '2–8', priority: 4, gambling: true },
      { id: 'teen-do-paanch', name: 'Teen Do Paanch', players: '3', priority: 4, gambling: false },
      { id: 'satte-pe-satta', name: 'Satte Pe Satta', players: '3–8', priority: 4, gambling: false },
      { id: 'court-piece', name: 'Court Piece', players: '4', priority: 3, gambling: false },
      { id: 'call-break', name: 'Call Break', players: '4', priority: 3, gambling: false },
    ],
  },
  {
    id: 'solitaire',
    name: 'Solitaire',
    tagline: 'Solo puzzle — beat the deal',
    games: [
      { id: 'klondike', name: 'Klondike', players: '1', priority: 5, gambling: false },
      { id: 'freecell', name: 'FreeCell', players: '1', priority: 5, gambling: false },
      { id: 'spider', name: 'Spider', players: '1', priority: 5, gambling: false },
      { id: 'clock', name: 'Clock Patience', players: '1', priority: 4, gambling: false },
      { id: 'pyramid', name: 'Pyramid', players: '1', priority: 4, gambling: false },
      { id: 'golf', name: 'Golf Solitaire', players: '1', priority: 4, gambling: false },
      { id: 'tripeaks', name: 'TriPeaks', players: '1', priority: 4, gambling: false },
      { id: 'demon', name: 'Demon', players: '1', priority: 3, gambling: false },
      { id: 'yukon', name: 'Yukon', players: '1', priority: 3, gambling: false },
      { id: 'forty-thieves', name: 'Forty Thieves', players: '1', priority: 3, gambling: false },
    ],
  },
];

export const TOTAL_GAMES = CATEGORIES.reduce((sum, c) => sum + c.games.length, 0);

const SUIT_CYCLE = ['♠', '♥', '♦', '♣'] as const;

export function categorysuit(index: number): string {
  return SUIT_CYCLE[index % SUIT_CYCLE.length];
}
