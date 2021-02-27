export interface Pawn {
  playerId: string;
  playerName: string;
  position: number;
  color: string;
  totalPoints: number;
  points: number;
  property: string[];
  prisonImmunity: 0;
  isPrisoner: boolean;
}

export const PawnColor = [
  "#FFCCB6",
  "#C6DBDA",
  "#97C1A9",
  "#55CBCD",
  "#ABDEE6",
  "#CBAACB",
];

export enum PowerUp {
  REDUCE_POINTS,
  ADD_POINTS,
  // DISABLE_MULTIPLIER,
  PRISON_IMMUNITY,
}

export interface GameEventPacket<T> {
  eventName: string;
  body?: T | null;
}
