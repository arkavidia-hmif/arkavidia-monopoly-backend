export const GameEvent = {
  PAWN_LIST: "GAME_pawnList",

  // Turn related events
  START_TURN: "GAME_startTurn",
  END_TURN: "GAME_endTurn",
  INVALID_TURN: "GAME_invalidTurn",

  MOVE: "GAME_move",

  // Tile related events
  START_TILE: "GAME_startTile",

  FREE_PARKING_TILE: "GAME_freeParkingTile",
  FREE_PARKING_PICK_TILE: "GAME_freeParkingPickTile",

  PROPERTY_TILE: "GAME_propertyTile",

  GIVE_PROBLEM: "GAME_giveProblem",
  PROBLEM: "GAME_problem",
  ANSWER_PROBLEM: "GAME_answerProblem",
  CORRECT_ANSWER: "GAME_correctAnswer",
  WRONG_ANSWER: "GAME_wrongAnswer",

  PRISON_TILE: "GAME_prisonTile",

  POWER_UP_TILE: "GAME_powerUpTile",
  POWER_UP_GET_ADD_POINTS: "GAME_powerUpGetAdd",
  POWER_UP_GET_PRISON: "GAME_powerUpGetPrisonImmunity",
  POWER_UP_GET_REDUCE_POINTS: "GAME_powerUpGetRemove",
  POWER_UP_GET_DISABLE_MULTIPLIER: "GAME_powerUpGetDisableMultiplier",
  POWER_UP_PRE_PICK_PROPERTY: "GAME_powerUpPropertyList",
  POWER_UP_POST_PICK_PROPERTY: "GAME_powerUpPickProperty",
  POWER_UP_PICK_PLAYER: "GAME_powerUpPickPlayerToRemove",

  FORCE_SKIP_TURN: "GAME_forceSkipTurn",
};
