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

export const PawnColor = ["#FF0000", "#00FF00", "#0000FF", "#00FFFF"];

export enum PowerUp {
  REDUCE_POINTS,
  ADD_POINTS,
  DISABLE_MULTIPLIER,
  PRISON_IMMUNITY,
}

export interface GameEventPacket<T> {
  eventName: string;
  body?: T | null;
}
