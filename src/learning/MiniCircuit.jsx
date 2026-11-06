import React from 'react';
import {EXPERIMENTS} from './experiments.cjs';

// A geometria do diagrama usa viewBox; as cores vêm dos tokens da plataforma.
export default function MiniCircuit({experiment='bell',highlight,input}) {
 const {gates}=EXPERIMENTS[experiment];
 const start=input ?? EXPERIMENTS[experiment].start;
 return <svg className="lab-circuit" viewBox="0 0 560 150" role="img" aria-label={`Circuito: início ${start}, ${gates.length?gates.join(' → '):'sem portas'}. Primeiro símbolo: qubit de cima.`}>
  {[0,1].map(row=><g key={row} className={highlight===row?'lab-line-selected':''}><text x="12" y={row?118:48}>q{row?'₂':'₁'}</text><text x="65" y={row?118:48}>|{start[row]}⟩</text><path className="lab-wire" d={`M115 ${row?110:40}H530`}/></g>)}
  {gates.map((gate,index)=>{const x=200+index*130;return gate==='H'?<g key={index}><rect className="lab-gate" x={x-23} y="17" width="46" height="46" rx="8"/><text className="lab-gate-letter" x={x} y="48">H</text></g>:<g key={index}><path className="lab-wire" d={`M${x} 40V110`}/><circle cx={x} cy="40" r="8" fill="currentColor"/><circle className="lab-gate" cx={x} cy="110" r="20"/><path className="lab-wire" d={`M${x-11} 110h22M${x} 99v22`}/></g>;})}
 </svg>;
}
