import React from 'react';
import Icon from '../../shared/ui/Icon';
export default function CertificateScreen({
  heading,
  first,
  backToMap
}) {
  return <section className="certificate"><span className="certificate-mark">H → ⊕</span><h1 ref={heading} tabIndex="-1">Sua primeira descoberta.</h1><p>{first.name}, você concluiu a prévia da trilha de Bell.</p><strong>{first.level} · {first.date}</strong><p>Você conheceu qubits, medição, Hadamard e CNOT, e acompanhou a construção de um circuito de Bell.</p><p>Comprovante de conclusão exibido na plataforma, sem emissão por uma instituição de ensino.</p><button className="primary" onClick={backToMap}>Revisar minha trilha <Icon name="arrow" /></button></section>;
}
