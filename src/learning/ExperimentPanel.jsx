import React,{useState} from 'react';
import MiniCircuit from './MiniCircuit';
import {EXPERIMENTS,LAB,OUTCOMES,prepareExperiment,runExperiment} from './experiments.cjs';
import {probabilities} from '../circuit/model.cjs';

const emptyCounts=()=>Object.fromEntries(OUTCOMES.map(value=>[value,0]));
export default function ExperimentPanel({cases,pairs=true,showCircuit=true}) {
 const [selected,setSelected]=useState(cases[0]);
 const [counts,setCounts]=useState(emptyCounts);
 const [history,setHistory]=useState([]);
 const [total,setTotal]=useState(0);
 const forecast=probabilities(prepareExperiment(selected));
 const reset=()=>{setCounts(emptyCounts());setHistory([]);setTotal(0);};
 const sample=rounds=>{
  const result=runExperiment(selected,rounds);
  setCounts(previous=>Object.fromEntries(OUTCOMES.map(outcome=>[outcome,previous[outcome]+result.counts[outcome]])));
  setHistory(previous=>[...previous,...result.history].slice(-LAB.historyLimit));
  setTotal(previous=>previous+rounds);
 };
 const labels=pairs?OUTCOMES:['0','1'];
 return <div className="experiment-panel">
  <div className="lab-choices" role="group" aria-label="Preparação do experimento">{cases.map(id=><button key={id} aria-pressed={selected===id} onClick={()=>{setSelected(id);reset();}}>{!showCircuit && id==='hadamard'?'Superposição com chances iguais':EXPERIMENTS[id].label}</button>)}</div>
  {showCircuit && <MiniCircuit experiment={selected}/>}
  <p className="lab-reading">{pairs?'Cada par está na ordem q₁, q₂: linha de cima, linha de baixo.':'Aqui observamos somente o qubit de treino.'}</p>
  <dl className="lab-bars" aria-label="Probabilidades previstas e resultados observados">{labels.map((label,index)=>{
   const probability=pairs?forecast[index]:forecast[index*2]+forecast[index*2+1];
   const count=pairs?counts[label]:counts[OUTCOMES[index*2]]+counts[OUTCOMES[index*2+1]];
   const percent=Math.round(probability*LAB.percentageScale);
   return <div className="lab-bar-row" key={label}><dt>Resultado <strong>{label}</strong></dt><dd><span>Chance prevista: {percent}%</span><div className="lab-bar-track" aria-hidden="true"><i style={{width:`${percent}%`}}/></div><span className="lab-observed">Observado: {count} de {total} rodadas</span></dd></div>;
  })}</dl>
  <div className="lab-controls"><button onClick={()=>sample(1)}>Preparar e medir uma vez</button><button onClick={()=>sample(LAB.batchSize)}>Fazer {LAB.batchSize} rodadas</button><button onClick={reset} disabled={!total}>Limpar resultados</button></div>
  <p className="lab-result" role="status">{total?`${total} ${total===1?'rodada realizada':'rodadas realizadas'}. Último resultado: ${pairs?history.at(-1):history.at(-1)[0]}.`:'Antes de medir: qual resultado você espera? Escolha uma preparação e experimente.'}</p>
  {history.length>0 && <div className="lab-history" aria-label={`Últimos ${history.length} resultados`}>{history.map((result,index)=><span key={index}>{pairs?result:result[0]}</span>)}</div>}
  <p className="lab-note">Cada rodada prepara de novo o estado e só então mede. A contagem pode variar; não há uma sequência obrigatória. Este laboratório não muda sua montagem nem vale pontos.</p>
 </div>;
}
