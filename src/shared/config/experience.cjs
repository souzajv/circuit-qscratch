// Valores compartilhados pelas regras e pelas transições da experiência.
module.exports = {
  SCORE: {
    maximum: 10,
    errorPenalty: 2,
    hintPenalty: 2,
    minimum: 2
  },
  TRANSITION: {
    closingMs: 1100,
    openingMs: 850,
    countMs: 800,
    countFrom: 5
  },
  QUIZ_SUCCESS_DELAY_MS: 2000,
  MASCOT_LAYOUT: {fit:"contain",align:[0.5,0.5]},
  PROGRESS_SAVE_DELAY_MS: 300,
  MASCOT_REFRESH_MS: 500,
  SCHOOL_LEVELS: ['Fundamental Anos Finais', 'Ensino Médio']
};
