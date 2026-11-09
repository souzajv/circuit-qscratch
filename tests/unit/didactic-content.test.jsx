import {blocks,getLessons,getQuestions} from '../../src/learning/content';
import {SCHOOL_LEVELS} from '../../src/shared/config/experience.cjs';
const {runExperiment,truthRow,EXPERIMENTS}=require('../../src/learning/experiments.cjs');
test('cinco blocos têm introdução ativa, referências históricas, exemplos e três perguntas',()=>{
 expect(blocks).toHaveLength(5);
 for(const block of blocks){
  const basic=getLessons(block,SCHOOL_LEVELS[0]),advanced=getLessons(block,SCHOOL_LEVELS[1]);
  expect(basic.length).toBeGreaterThanOrEqual(5);expect(advanced).toHaveLength(basic.length);
  basic.forEach((page,i)=>{expect(page.title).toBeTruthy();expect(page.visual).toBeTruthy();expect(page.text).not.toBe(advanced[i].text);});
  const questions=getQuestions(block,SCHOOL_LEVELS[0]);expect(questions).toHaveLength(3);
  questions.forEach(q=>{expect(q.options[q.answer]).toBeTruthy();expect(q.hint).toBeTruthy();expect(q.feedback).toBeTruthy();expect(q.retry).toBeTruthy();});
 }
});
test('comparações usam o mesmo modelo de amplitudes do circuito',()=>{
 expect(runExperiment('zero',4,()=>.1).counts).toEqual({'00':4,'01':0,'10':0,'11':0});
 expect(runExperiment('one',4,()=>.1).counts['10']).toBe(4);
 expect(runExperiment('doubleH',4,()=>.8).counts['00']).toBe(4);
 expect(runExperiment('hadamard',1,()=>.8).history).toEqual(['10']);
 expect(runExperiment('bell',1,()=>.8).history).toEqual(['11']);
 expect(runExperiment('reverse',1,()=>.8).history).toEqual(['10']);
 for(const id of Object.keys(EXPERIMENTS))expect(runExperiment(id,1,()=>0).probabilities.reduce((a,b)=>a+b)).toBeCloseTo(1);
});
test.each([['00','00'],['01','01'],['10','11'],['11','10']])('CNOT: %s vira %s', (input,output)=>{expect(truthRow(input)).toBe(output);});
