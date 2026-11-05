'use strict';

// Estado na ordem |controle, alvo⟩; cada amplitude é [parte real, parte imaginária].
const ROOT2 = Math.SQRT1_2;
function validate(state) {
  if (!Array.isArray(state) || state.length !== 4 || state.some(a => !Array.isArray(a) || a.length !== 2 || a.some(x => !Number.isFinite(x)))) throw new TypeError('São necessárias quatro amplitudes complexas finitas.');
  const norm = state.reduce((s, [r, i]) => s + r * r + i * i, 0);
  if (Math.abs(norm - 1) > 1e-10) throw new RangeError('Estado deve ser normalizado.');
}
function hadamardControl(state) {
  validate(state);
  return [0, 1, 2, 3].map(k => {
    const a = state[k % 2],
      b = state[k % 2 + 2],
      sign = k < 2 ? 1 : -1;
    return [(a[0] + sign * b[0]) * ROOT2, (a[1] + sign * b[1]) * ROOT2];
  });
}
function cnot(state) {
  validate(state);
  return [0, 1, 3, 2].map(i => [...state[i]]);
}
function probabilities(state) {
  validate(state);
  return state.map(([r, i]) => r * r + i * i);
}
function measure(state, random = Math.random) {
  const p = probabilities(state),
    x = random();
  if (!Number.isFinite(x) || x < 0 || x >= 1) throw new RangeError('Amostra deve estar em [0, 1).');
  let total = 0;
  for (let i = 0; i < p.length; i++) {
    total += p[i];
    if (x < total) return {
      outcome: i.toString(2).padStart(2, '0'),
      state: p.map((_, j) => [i === j ? 1 : 0, 0])
    };
  }
  // Arredondamento pode deixar a soma levemente abaixo de 1; usa o último resultado possível.
  const last = p.findLastIndex(value => value > 0);
  return {
    outcome: last.toString(2).padStart(2, '0'),
    state: p.map((_, j) => [last === j ? 1 : 0, 0])
  };
}
module.exports = {
  hadamardControl,
  cnot,
  probabilities,
  measure
};
