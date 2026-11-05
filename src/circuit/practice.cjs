function canPlace(block, piece, slot) {
  if (block === 0) return piece === 'qubit' && ['q1', 'q2'].includes(slot);
  if (block === 2) return piece === 'H' && slot === 'q1-first';
  if (block === 3) return piece === 'CNOT' && slot === 'pair-second';
  return false;
}
function reveal(previous, block, random = Math.random) {
  if (previous !== null) return previous;
  if (block === 1) return '0';
  const {
    hadamardControl,
    cnot,
    measure
  } = require('./model.cjs');
  return measure(cnot(hadamardControl([[1, 0], [0, 0], [0, 0], [0, 0]])), random).outcome;
}
module.exports = {
  canPlace,
  reveal
};
