const assert = require('node:assert/strict');
const {canPlace, reveal} = require('../../src/circuit/practice.cjs');
test('somente os encaixes da missão são aceitos', () => {
    assert.equal(canPlace(0, 'qubit', 'q2'), true);
    assert.equal(canPlace(2, 'H', 'q1-first'), true);
    assert.equal(canPlace(2, 'H', 'q2-first'), false);
    assert.equal(canPlace(3, 'CNOT', 'pair-second'), true);
    assert.equal(canPlace(3, 'CNOT', 'q1-first'), false);
});
test('hover e foco repetidos preservam a mesma medição', () => {
    let draws = 0;
    const first = reveal(null, 4, () => {draws++; return 0.8;});
    assert.equal(first, '11');
    assert.equal(reveal(first, 4, () => {throw Error('não deve sortear de novo');}), '11');
    assert.equal(draws, 1);
    assert.equal(reveal(null, 4, () => 0.1), '00');
    assert.equal(reveal(null, 1), '0');
});
