export interface Pawn {
  playerId: string;
  position: number;
  score: number;
  property: string[];
  prisonImmunity: 0;
  isPrisoner: boolean;
}

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
