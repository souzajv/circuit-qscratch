import React from 'react';
export default function Circuit({
  completed
}) {
  return <section className="circuit-preview"><h2>Seu circuito, peça por peça</h2><div className="wire">{completed.includes(0) && <span>q₁ |0⟩</span>}<div>{completed.includes(2) && <b>H</b>}{completed.includes(3) && <b className="control">●</b>}</div></div><div className="wire">{completed.includes(0) && <span>q₂ |0⟩</span>}<div>{completed.includes(3) && <b className="target">⊕</b>}</div></div><p>{completed.includes(3) ? 'H → CNOT · controle em q₁, alvo em q₂' : completed.includes(2) ? 'Hadamard no primeiro qubit.' : 'Duas linhas. Muitas descobertas pela frente.'}</p></section>;
}
