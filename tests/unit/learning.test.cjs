const assert = require('node:assert/strict');
const {score, improve, validateCircuit} = require('../../src/progress/rules.cjs');
test('erros e primeira dica reduzem pontos com piso de dois', () => {
    assert.equal(score(0, false), 10);
    assert.equal(score(1, true), 6);
    assert.equal(score(20, true), 2);
});
test('repetição só acrescenta melhora positiva', () => {
    assert.deepEqual(improve(6, 8), {best: 8, earned: 2});
    assert.deepEqual(improve(8, 4), {best: 8, earned: 0});
});
test('circuito exige H primeiro e CNOT com controle superior', () => {
    assert.equal(validateCircuit(['H', 'CNOT']), true);
    assert.equal(validateCircuit(['CNOT', 'H']), false);
    assert.equal(validateCircuit(['H']), false);
});
