import React,{useState,useRef,useEffect} from 'react';
import {gsap} from 'gsap';
import {LANDING_MOTION as timing} from '../public/motionConfig';
import {SCHOOL_LEVELS} from '../shared/config/experience.cjs';
import {OUTCOMES,truthRow} from './experiments.cjs';
import ExperimentPanel from './ExperimentPanel';
import MiniCircuit from './MiniCircuit';
import ExplorationTabs from './ExplorationTabs';
import './examples.css';

function BitExample(){
 const [on,setOn]=useState(false);
 return <div className="bit-example"><button className="lab-switch" aria-pressed={on} onClick={()=>setOn(!on)}><span className={on?'lab-lamp lit':'lab-lamp'} aria-hidden="true"/>{on?'Desligar interruptor':'Ligar interruptor'}</button><div className="lab-bit-value" aria-live="polite">Bit: <strong>{on?'1':'0'}</strong><span>{on?'Ligado':'Desligado'}</span></div><p className="lab-note">O interruptor representa duas situações clássicas. Ele não representa uma superposição quântica.</p></div>;
}
function LinesExample({preparation}){
 const [selected,setSelected]=useState(0);
 return <div><div className="lab-choices" role="group" aria-label="Identificar um qubit">{['Linha de cima: q₁','Linha de baixo: q₂'].map((label,i)=><button key={label} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{label}</button>)}</div><MiniCircuit experiment="zero" highlight={selected}/><p className="lab-result" role="status">{preparation?'|00⟩: primeiro 0 para q₁ e segundo 0 para q₂.':`A linha ${selected?'de baixo':'de cima'} acompanha o qubit q${selected?'₂':'₁'}.`} Cada linha começa preparada em |0⟩.</p></div>;
}
function CnotExample({motion}){
 const [input,setInput]=useState('00');
 const output=truthRow(input);
 const toggle=position=>setInput(value=>value.split('').map((bit,i)=>i===position?(bit==='0'?'1':'0'):bit).join(''));
 return <ExplorationTabs motion={motion} tabs={[
  {id:'try',label:'Experimentar',content:<><div className="lab-controls"><button onClick={()=>toggle(0)}>Controle: {input[0]} · trocar</button><button onClick={()=>toggle(1)}>Alvo: {input[1]} · trocar</button></div><MiniCircuit experiment="cnot" input={input}/><div className="cnot-transformation" aria-live="polite"><span>Entrada <b>{input}</b></span><span className="lab-operation">CNOT</span><span>Saída <b>{output}</b></span></div><p>{input[0]==='1'?'Controle 1: o alvo troca.':'Controle 0: o alvo fica igual.'} O controle permanece {input[0]}.</p></>},
  {id:'compare',label:'Comparar entradas',content:<><table className="lab-table"><caption>As quatro entradas da CNOT</caption><thead><tr><th>Entrada</th><th>Saída</th><th>O que acontece?</th></tr></thead><tbody>{OUTCOMES.map(value=><tr key={value} className={value===input?'lab-table-active':''}><td>{value}</td><td>{truthRow(value)}</td><td>{value[0]==='1'?'Alvo troca':'Alvo fica igual'}</td></tr>)}</tbody></table><p className="lab-note">Este treino usa entradas 0 e 1. Na superposição, a mesma porta atua no estado conjunto, sem medir o controle.</p></>}
 ]}/>;
}
function BranchesExample({advanced}){
 const [after,setAfter]=useState(false);
 return <div><div className="lab-choices"><button aria-pressed={!after} onClick={()=>setAfter(false)}>Antes da CNOT</button><button aria-pressed={after} onClick={()=>setAfter(true)}>Depois da CNOT</button></div><MiniCircuit experiment={after?'bell':'hadamard'}/><div className="lab-branches" aria-live="polite"><span>|00⟩ → |00⟩</span><span>|10⟩ → |{after?'11':'10'}⟩</span></div><p>{advanced?(after?'Estado: (|00⟩ + |11⟩)/√2.':'Estado: (|00⟩ + |10⟩)/√2.'):(after?'Agora os pares possíveis ao medir são 00 e 11.':'Antes da CNOT, os pares possíveis ao medir são 00 e 10.')}</p><p className="lab-note">As duas linhas de possibilidades representam termos da superposição, não resultados já escolhidos. Nenhuma medição acontece entre H e CNOT.</p></div>;
}
const sequence=[
 {title:'Preparar',experiment:'zero',basic:'Os dois qubits começam em 0. Medir agora dá 00.',advanced:'Estado inicial: |00⟩.'},
 {title:'Aplicar H',experiment:'hadamard',basic:'H atua em cima. Medir agora permite 00 ou 10.',advanced:'Estado: (|00⟩ + |10⟩)/√2.'},
 {title:'Conectar CNOT',experiment:'bell',basic:'CNOT conecta os qubits. Medir agora permite 00 ou 11.',advanced:'Estado: |Φ+⟩ = (|00⟩ + |11⟩)/√2.'},
 {title:'Medir',experiment:'bell',basic:'Uma medição fornece um único par: 00 ou 11. Aqui mostramos a previsão; use o laboratório para sortear uma rodada.',advanced:'A medição na base computacional fornece 00 ou 11, com 50% cada. O diagrama mostra o preparo antes de medir.'}
];
function SequenceExample({advanced}){
 const [step,setStep]=useState(0);
 return <div><div className="lab-steps" role="group" aria-label="Etapas do circuito">{sequence.map((item,i)=><button key={item.title} aria-pressed={i===step} onClick={()=>setStep(i)}>{i+1}. {item.title}</button>)}</div><MiniCircuit experiment={sequence[step].experiment}/><p className="lab-result" role="status">{sequence[step][advanced?'advanced':'basic']}</p></div>;
}
const variants={qubit:['zero','one','hadamard'],measurement:['zero','one'],hadamard:['zero','hadamard'], 'double-h':['zero','hadamard','doubleH'],'order-compare':['bell','reverse'],bell:['bell'],'bell-compare':['hadamard','bell'],correlation:['bell']};
const exampleTitles = {bit:'Do interruptor ao bit',qubit:'Preparo e chances de medição',lines:'Encontre cada qubit',preparation:'Leia o par 00',order:'Percorra as operações',measurement:'Compare 0 e 1',hadamard:'O que muda com H?', 'double-h':'Uma H ou duas?',cnot:'Troque controle e alvo',branches:'Acompanhe o par inteiro','order-compare':'Qual porta vem primeiro?',bell:'Prepare e meça Bell','bell-compare':'Antes e depois da CNOT',correlation:'Igualdade e emaranhamento',recap:'Reconstrua a sequência'};
export default function LearningExample({visual,title,motion,level}){
 const root=useRef(null);
 const advanced=level===SCHOOL_LEVELS[1];
 useEffect(()=>{
  if(!motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const context=gsap.context(()=>gsap.fromTo(root.current,{autoAlpha:0,y:timing.slideDistance},{autoAlpha:1,y:0,duration:timing.slideDuration,ease:'power2.out',clearProps:'all'}),root);
  return ()=>context.revert();
 },[visual,motion]);
 let content;
 if(visual==='bit')content=<BitExample/>;
 else if(visual==='lines'||visual==='preparation')content=<LinesExample preparation={visual==='preparation'}/>;
 else if(visual==='order'||visual==='recap')content=<SequenceExample advanced={advanced}/>;
 else if(visual==='cnot')content=<CnotExample motion={motion}/>;
 else if(visual==='branches')content=<BranchesExample advanced={advanced}/>;
 else {
  const comparison=visual==='correlation'?<div className="lab-classical"><strong>Compare com cartões comuns</strong><div className="lab-branches"><span>Par de cartões: 00</span><span>Par de cartões: 11</span></div><p>Podemos preparar cartões iguais antes de abri-los. Essa igualdade é clássica. O mesmo gráfico de resultados, sozinho, não distingue esses cartões de um estado emaranhado.</p></div>:undefined;
  content=<ExperimentPanel cases={variants[visual]} pairs={!['qubit','measurement'].includes(visual)} showCircuit={visual!=='qubit'} motion={motion} comparison={comparison}/>;
 }
 return <section ref={root} className="learning-example" aria-label={`Exemplo: ${title}`} data-example={visual}><header><span className="lab-eyebrow">Explore no seu ritmo</span><h2>{exampleTitles[visual]}</h2><p>Use os botões para comparar. Você pode repetir e revisar sem perder pontos.</p></header>{content}</section>;
}
