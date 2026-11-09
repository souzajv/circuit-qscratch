const {hadamardControl,cnot,probabilities,measure} = require('../circuit/model.cjs');
const OUTCOMES = ['00','01','10','11'];
const LAB = {batchSize:20,historyLimit:20,percentageScale:100};
const EXPERIMENTS = {
 cnot:{label:'Somente CNOT',start:'00',gates:['CNOT']},
 zero:{label:'Preparar em 0',start:'00',gates:[]},
 one:{label:'Preparar em 1',start:'10',gates:[]},
 hadamard:{label:'H uma vez',start:'00',gates:['H']},
 doubleH:{label:'H duas vezes',start:'00',gates:['H','H']},
 bell:{label:'H e depois CNOT',start:'00',gates:['H','CNOT']},
 reverse:{label:'CNOT e depois H',start:'00',gates:['CNOT','H']}
};
function prepareExperiment(id){
 const config=EXPERIMENTS[id];
 if(!config)throw new RangeError('Experimento desconhecido.');
 let state=OUTCOMES.map(value=>[value===config.start?1:0,0]);
 config.gates.forEach(gate=>{state=gate==='H'?hadamardControl(state):cnot(state);});
 return state;
}
function runExperiment(id,rounds,random=Math.random){
 if(!Number.isInteger(rounds)||rounds<1||rounds>LAB.batchSize)throw new RangeError('Quantidade de rodadas inválida.');
 const counts=Object.fromEntries(OUTCOMES.map(value=>[value,0]));
 const history=[];
 // Medir nunca alimenta a rodada seguinte: cada amostra parte de um novo preparo.
 for(let i=0;i<rounds;i++){
  const {outcome}=measure(prepareExperiment(id),random);counts[outcome]++;history.push(outcome);
 }
 return {counts,history,probabilities:probabilities(prepareExperiment(id))};
}
function truthRow(input){
 if(!OUTCOMES.includes(input))throw new RangeError('Par de entrada inválido.');
 const state=OUTCOMES.map(value=>[value===input?1:0,0]);
 return OUTCOMES[probabilities(cnot(state)).findIndex(value=>value===1)];
}
module.exports={OUTCOMES,LAB,EXPERIMENTS,prepareExperiment,runExperiment,truthRow};
