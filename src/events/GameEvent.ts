export const GameEvent = {
  // Turn related events
  START_TURN: "GAME_startTurn",
  END_TURN: "GAME_endTurn",

  MOVE: "GAME_move",
  START_TILE: "GAME_startTile",

  FREE_PARKING_TILE: "GAME_freeParkingTile",
  FREE_PARKING_PICK_TILE: "GAME_freeParkingPickTile",

  PROPERTY_TILE: "GAME_propertyTile",

  GIVE_PROBLEM: "GAME_giveProblem",
  ANSWER_PROBLEM: "GAME_answerProblem",
  CORRECT_ANSWER: "GAME_correctAnswer",
  WRONG_ANSWER: "GAME_wrongAnswer",

  PRISON_TILE: "GAME_prisonTile",

  POWER_UP_TILE: "GAME_powerUpTile",
  POWER_UP_GET_ADD: "GAME_powerUpGetAdd",
  POWER_UP_GET_PRISON: "GAME_powerUpGetPrisonImmunity",
  POWER_UP_GET_REMOVE: "GAME_powerUpGetRemove",
  POWER_UP_GET_DISABLE_MULTIPLIER: "GAME_powerUpGetDisableMultiplier",
  POWER_UP_PICK_PLAYER: "GAME_powerUpPickPlayerToRemove",
};
