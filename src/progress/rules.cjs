const {
  SCORE
} = require('../shared/config/experience.cjs');
const score = (errors, hint) => Math.max(SCORE.minimum, SCORE.maximum - errors * SCORE.errorPenalty - (hint ? SCORE.hintPenalty : 0));
const improve = (previous, current) => ({
  best: Math.max(previous, current),
  earned: Math.max(0, current - previous)
});
const validateCircuit = gates => gates.length === 2 && gates[0] === 'H' && gates[1] === 'CNOT';
module.exports = {
  score,
  improve,
  validateCircuit
};
