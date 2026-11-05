'use strict';
const assert = require('node:assert/strict');
const {hadamardControl:h,cnot,probabilities,measure} = require('../../src/circuit/model.cjs');
const basis = i => Array.from({length:4},(_,j)=>[i===j?1:0,0]);
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-10, `${a} != ${b}`);
function nearState(a,b) { a.forEach((v,i)=>v.forEach((x,j)=>near(x,b[i][j]))); }
test('CNOT age nas quatro entradas de base',()=>[0,1,3,2].forEach((out,i)=>nearState(cnot(basis(i)),basis(out))));
test('H aplicada duas vezes restaura estado com fase complexa',()=>{const s=[[0.5,0],[0,0.5],[0,-0.5],[-0.5,0]]; nearState(h(h(s)),s);});
test('H preserva fase negativa de |1> e |0>',()=>{const r=Math.SQRT1_2;nearState(h(basis(0)),[[r,0],[0,0],[r,0],[0,0]]);nearState(h(basis(2)),[[r,0],[0,0],[-r,0],[0,0]]);});
test('Bell tem amplitudes e probabilidades corretas',()=>{const s=cnot(h(basis(0))),r=Math.SQRT1_2;nearState(s,[[r,0],[0,0],[0,0],[r,0]]);probabilities(s).forEach((x,i)=>near(x,[.5,0,0,.5][i]));});
test('Medição retorna 00 ou 11 e colapsa corretamente',()=>{const s=cnot(h(basis(0)));assert.equal(measure(s,()=>0.1).outcome,'00');const m=measure(s,()=>0.9);assert.equal(m.outcome,'11');nearState(m.state,basis(3));});
test('rejeita estados e amostras inválidos',()=>{assert.throws(()=>h([[1,0]]));assert.throws(()=>cnot([[1,0],[1,0],[0,0],[0,0]]));assert.throws(()=>measure(basis(0),()=>1));});
test('arredondamento não perde amostras próximas de 1',()=>{const s=[[Math.sqrt(1-1e-12),0],[0,0],[0,0],[0,0]]; assert.equal(measure(s,()=>1-Number.EPSILON).outcome,'00');});
