// AI personalities — the saloon regulars.
// VENDORED COPY of cardgame-engine/src/ai/personality.ts. Keep in sync with the
// mobile engine. AIDifficulty is defined here (rather than imported from
// SwitchAI) so it has a single home in this flattened subset.

export type AIDifficulty = 'easy' | 'medium' | 'hard';

/** Identity dials. Difficulty-independent — these define how a character FEELS. */
export interface AIStyle {
  readonly aggression: number;
  readonly risk: number;
  readonly patience: number;
  readonly deception: number;
  readonly adaptivity: number;
}

/** Strength dials. Scaled down by difficulty — these define how GOOD a character is. */
export interface AISkill {
  readonly memory: number;
  readonly foresight: number;
  readonly discipline: number;
}

export interface AIPersonality {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly bio: string;
  readonly style: AIStyle;
  readonly skill: AISkill;
  /** How much aggression/risk climbs late — the "low then pounce" trap signature. */
  readonly escalation: number;
}

export interface ResolvedTraits extends AIStyle {
  readonly escalation: number;
  readonly memory: number;
  readonly foresight: number;
  readonly discipline: number;
}

export const PERSONALITIES: readonly AIPersonality[] = [
  {
    id: 'dutch',
    name: 'Dutch',
    tagline: 'Bets big, apologises never',
    bio: "A former cattle-drive foreman who plays like he's still barking orders at a stampede. Dutch shoves his whole stack in on a hunch and never looks back to see if it worked.",
    style: { aggression: 1.0, risk: 0.9, patience: 0.1, deception: 0.3, adaptivity: 0.3 },
    skill: { memory: 0.4, foresight: 0.4, discipline: 0.5 },
    escalation: 0,
  },
  {
    id: 'lenny',
    name: 'Lenny',
    tagline: 'Luckier than he looks',
    bio: "The saloon's cheerful stray, half a drink past sensible and twice as lucky. Lenny couldn't count a two-card hand, but the river keeps loving him and nobody can work out why.",
    style: { aggression: 0.6, risk: 0.9, patience: 0.2, deception: 0.4, adaptivity: 0.2 },
    skill: { memory: 0.3, foresight: 0.3, discipline: 0.1 },
    escalation: 0,
  },
  {
    id: 'carmen',
    name: 'Carmen',
    tagline: 'Never draws dead',
    bio: 'A travelling songbird who treats every hand like the last verse — worth singing all the way out. Carmen never lays a hand down while there is a card left to draw.',
    style: { aggression: 0.6, risk: 0.7, patience: 0.4, deception: 0.3, adaptivity: 0.5 },
    skill: { memory: 0.5, foresight: 0.5, discipline: 0.5 },
    escalation: 0,
  },
  {
    id: 'clyde',
    name: 'Clyde',
    tagline: 'Bluffs with the best hand',
    bio: "A card sharp who learned that the truth is just another card you can palm. Clyde will sigh like he's beaten over a winning hand, right up until he takes the pot.",
    style: { aggression: 0.5, risk: 0.6, patience: 0.5, deception: 1.0, adaptivity: 0.6 },
    skill: { memory: 0.5, foresight: 0.6, discipline: 0.5 },
    escalation: 0,
  },
  {
    id: 'belle',
    name: 'Belle',
    tagline: 'Reads you like a dime novel',
    bio: "She reads the room before she reads her cards, and she's usually finished reading you by the second deal. Belle plays the person across the felt, not the hand in her fingers.",
    style: { aggression: 0.5, risk: 0.4, patience: 0.6, deception: 0.6, adaptivity: 1.0 },
    skill: { memory: 0.7, foresight: 0.6, discipline: 0.7 },
    escalation: 0,
  },
  {
    id: 'sam',
    name: 'Sam',
    tagline: 'Pours drinks, takes pots',
    bio: "The house's own barkeep, who's dealt more games than he's poured drinks. Sam keeps the conversation easy and the pots flowing quietly in his direction.",
    style: { aggression: 0.5, risk: 0.4, patience: 0.6, deception: 0.6, adaptivity: 0.7 },
    skill: { memory: 0.7, foresight: 0.7, discipline: 0.8 },
    escalation: 0,
  },
  {
    id: 'ruby',
    name: 'Ruby',
    tagline: 'Counts cards. And your tells',
    bio: 'A one-time faro dealer who never forgot a single card and never will. Ruby tracks the deck and your eyebrows with equal, unnerving precision.',
    style: { aggression: 0.5, risk: 0.4, patience: 0.6, deception: 0.4, adaptivity: 0.8 },
    skill: { memory: 1.0, foresight: 0.8, discipline: 0.9 },
    escalation: 0,
  },
  {
    id: 'cole',
    name: 'Cole',
    tagline: 'Quiet until the river',
    bio: 'A rancher of few words who lets the game come to him. Cole will pass and pass and pass — and then, on the last street, close the trap you never saw him setting.',
    style: { aggression: 0.3, risk: 0.5, patience: 1.0, deception: 0.7, adaptivity: 0.6 },
    skill: { memory: 0.7, foresight: 0.8, discipline: 0.8 },
    escalation: 0.8,
  },
  {
    id: 'cora',
    name: 'Cora',
    tagline: "Folds until she doesn't",
    bio: "A preacher's daughter with iron patience and a sudden mean streak. Cora folds meekly for an hour, then commits everything the moment the odds finally kneel to her.",
    style: { aggression: 0.2, risk: 0.3, patience: 0.9, deception: 0.5, adaptivity: 0.5 },
    skill: { memory: 0.6, foresight: 0.7, discipline: 0.8 },
    escalation: 0.9,
  },
  {
    id: 'etta',
    name: 'Etta',
    tagline: 'Remembers every discard',
    bio: "The saloon's bookkeeper, who files every discard away like a receipt. By the end of the hand Etta knows exactly what you're holding, because she watched everything you let go.",
    style: { aggression: 0.4, risk: 0.3, patience: 0.7, deception: 0.3, adaptivity: 0.7 },
    skill: { memory: 1.0, foresight: 0.7, discipline: 0.9 },
    escalation: 0,
  },
  {
    id: 'reginald',
    name: 'Reginald',
    tagline: 'Banks on your mistakes',
    bio: "A fallen banker who trades in other people's errors instead of gold. Reginald rarely takes a risk of his own — he just waits, ledger open, for you to make one.",
    style: { aggression: 0.4, risk: 0.3, patience: 0.7, deception: 0.5, adaptivity: 1.0 },
    skill: { memory: 0.8, foresight: 0.8, discipline: 0.9 },
    escalation: 0,
  },
  {
    id: 'mateo',
    name: 'Mateo',
    tagline: 'Plays the long game',
    bio: "A chess-playing drifter who sees the whole game three deals ahead. Mateo sacrifices the small pot without blinking, because he's already won the one that matters.",
    style: { aggression: 0.3, risk: 0.3, patience: 1.0, deception: 0.5, adaptivity: 0.8 },
    skill: { memory: 1.0, foresight: 1.0, discipline: 0.9 },
    escalation: 0,
  },
];

export const PERSONALITY_IDS: readonly string[] = PERSONALITIES.map((p) => p.id);

const BY_ID: ReadonlyMap<string, AIPersonality> = new Map(
  PERSONALITIES.map((p) => [p.id, p]),
);

export function getPersonality(id: string): AIPersonality | undefined {
  return BY_ID.get(id);
}

const DIFFICULTY_SKILL_FACTOR: Record<AIDifficulty, number> = {
  easy: 0.5,
  medium: 0.75,
  hard: 1,
};

export function resolveTraits(
  personality: AIPersonality,
  difficulty: AIDifficulty,
): ResolvedTraits {
  const f = DIFFICULTY_SKILL_FACTOR[difficulty];
  return {
    ...personality.style,
    escalation: personality.escalation,
    memory: personality.skill.memory * f,
    foresight: personality.skill.foresight * f,
    discipline: personality.skill.discipline * f,
  };
}
