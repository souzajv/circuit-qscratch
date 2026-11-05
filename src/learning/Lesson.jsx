import { SCHOOL_LEVELS } from '../shared/config/experience.cjs';
import React, { useState, useEffect, useRef } from 'react';
import Icon from '../shared/ui/Icon';
import Mascot from '../shared/ui/Mascot';
import { canPlace, reveal } from '../circuit/practice.cjs';
import { score } from '../progress/rules.cjs';
export default function Lesson({
  saved = {},
  onCheckpoint,
  block,
  index,
  level,
  name,
  motion,
  transition,
  onComplete,
  onBack,
  onCertificate,
  play
}) {
  const [phase, setPhase] = useState(saved.phase ?? 'learn');
  const [page, setPage] = useState(saved.page ?? 0);
  const [choice, setChoice] = useState(saved.choice ?? null);
  const [correct, setCorrect] = useState(saved.correct ?? false);
  const [errors, setErrors] = useState(saved.errors ?? 0);
  const [hint, setHint] = useState(saved.hint ?? false);
  const [message, setMessage] = useState('');
  const [piece, setPiece] = useState(null);
  const [slots, setSlots] = useState(saved.slots ?? []);
  const [measured, setMeasured] = useState(saved.measured ?? null);
  const measuredRef = useRef(saved.measured ?? null);
  const [finished, setFinished] = useState(saved.finished ?? false);
  useEffect(() => {onCheckpoint?.({phase,page,choice,correct,errors,hint,slots,measured,finished});},[phase,page,choice,correct,errors,hint,slots,measured,finished]);
  const title = useRef();
  const outcome = useRef();
  // Cada fala apresenta uma ideia e preserva o texto da escolaridade escolhida.
  const pages = (level === SCHOOL_LEVELS[1] ? block.advanced : block.basic).match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  useEffect(() => {
    title.current?.focus();
  }, [phase]);
  useEffect(() => {
    if (!correct && !finished) return;
    const frame = requestAnimationFrame(() => outcome.current?.scrollIntoView({
      block: 'nearest',
      behavior: motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto'
    }));
    return () => cancelAnimationFrame(frame);
  }, [correct, finished, phase, motion]);
  const complete = () => {
    if (finished) return;
    setFinished(true);
    onComplete(score(errors, hint));
    play('success');
  };
  const put = (value, slot) => {
    if (finished) return;
    if (!canPlace(index, value, slot)) {
      setMessage(index === 2 ? 'Nesta missão, H vai na primeira posição do qubit de cima. Tente outro encaixe.' : 'Vamos tentar o encaixe indicado para esta peça.');
      return;
    }
    const next = slots.includes(slot) ? slots : [...slots, slot];
    setSlots(next);
    setPiece(null);
    setMessage('Bom encaixe!');
    play('tick');
    if (index !== 0 || next.length === 2) complete();
  };
  const sample = () => {
    if (measuredRef.current !== null) return;
    const result = reveal(null, index);
    measuredRef.current = result;
    setMeasured(result);
    complete();
  };
  const target = (slot, label) => <button className={`drop-slot ${index === 3 ? 'pair-slot' : ''} ${slots.includes(slot) ? 'filled' : ''}`} aria-label={label} onDragOver={e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }} onDrop={e => {
    e.preventDefault();
    put(e.dataTransfer.getData('text/plain'), slot);
  }} onClick={() => piece ? put(piece, slot) : setMessage('Selecione uma peça na bandeja e depois escolha um encaixe.')}>
        {slots.includes(slot) ? index === 0 ? '|0⟩' : index === 2 ? 'H' : <svg width="44" height="142" viewBox="0 0 44 142" aria-hidden="true"><path d="M22 26V116" stroke="currentColor" strokeWidth="3" /><circle cx="22" cy="26" r="7" fill="currentColor" /><circle cx="22" cy="116" r="15" fill="var(--accent)" stroke="currentColor" strokeWidth="3" /><path d="M22 104v24M10 116h24" stroke="currentColor" strokeWidth="3" /></svg> : '+'}
    </button>;
  const isMeasurement = index === 1 || index === 4;
  return <div className={`lesson-stage phase-${phase}`}>
        <div className="stage-bar"><button className="back" onClick={onBack}><Icon name="back" /> Voltar à trilha</button><div className="stage-progress"><span>Trilha de Bell · Bloco {index + 1} de 5 · {phase === 'learn' ? 'Descobrir' : phase === 'practice' ? 'Experimentar' : 'Testar'}</span><span className="stage-dots" aria-hidden="true"><b className="active" /><b className={phase !== 'learn' ? 'active' : ''} /><b className={phase === 'practice' ? 'active' : ''} /></span></div></div>
        <h1 className="stage-title" ref={title} tabIndex="-1">{block.title}</h1>
        <div className="activity-layout">
            <div className={`conversation ${phase === 'practice' ? 'compact' : ''}`}>
                <div className="speaker"><Mascot motion={motion} thinking={phase === 'quiz'} celebrating={phase === 'quiz' && correct} treasure={phase === 'practice' && finished} /></div>
                <section className="speech" aria-label={phase === 'learn' ? 'Explicação do professor' : phase === 'quiz' ? 'Pergunta do professor' : 'Missão prática'}>
                    {phase === 'learn' && <><p className="speech-greeting">Vamos juntos, {name || 'explorador'}.</p><p className="speech-copy" key={page}>{pages[page]?.trim()}</p><div className="speech-navigation"><button className="text-button" disabled={page === 0} onClick={() => {
                setPage(page - 1);
                play('tick');
              }}><Icon name="back" /> Anterior</button><span>{page + 1} de {pages.length}</span><button className="primary" onClick={() => {
                if (page < pages.length - 1) {
                  setPage(page + 1);
                  play('tick');
                } else transition(() => setPhase('quiz'), {
                  countdown: true
                });
              }}>{page === pages.length - 1 ? 'Iniciar teste' : 'Próximo'} <Icon name="arrow" /></button></div></>}
                    {phase === 'quiz' && <><fieldset disabled={correct}><legend>{block.question}</legend>{block.options.map((option, i) => <label className={'answer ' + (choice === i ? 'selected ' : '') + (correct && choice === i ? 'answer-correct' : '')} key={option}><input type="radio" name="answer" checked={choice === i} onChange={() => {
                  setChoice(i);
                  setMessage('');
                }} />{option}{correct && choice === i && <span className="correct-mark" aria-label="Resposta correta"><Icon name="check" /></span>}</label>)}</fieldset><div className="lesson-actions"><button className="text-button" disabled={correct || hint} onClick={() => setHint(true)}>Ver dica {hint ? '' : '(−2 pontos)'}</button><button className={`primary ${correct ? 'answer-jump' : ''}`} disabled={choice === null || correct} onClick={() => {
                if (choice === block.answer) {
                  setCorrect(true);
                  setMessage(block.feedback);
                  play('success');
                } else {
                  setErrors(errors + 1);
                  setMessage('Ainda não. Releia a pergunta ou veja a dica. Vamos tentar de novo?');
                  play('tick');
                }
              }}>{correct ? 'Resposta correta!' : 'Conferir resposta'}</button></div>{hint && <p className="hint">{block.hint}</p>}<p className="feedback" role="status">{!correct && message}</p></>}
                    {phase === 'practice' && <><p className="speech-copy">{finished ? index === 0 ? 'Parabéns! Você preparou os dois qubits em 0. As primeiras peças do seu circuito estão prontas!' : index === 2 ? 'Parabéns! Você colocou Hadamard no primeiro qubit. Agora seu circuito tem uma nova preparação!' : index === 3 ? 'Parabéns! Você conectou a CNOT depois de H e montou o circuito de Bell!' : index === 1 ? 'Parabéns! Você fez uma medição no treino e observou o resultado 0.' : 'Parabéns! Você preparou e mediu seu circuito de Bell. Sua trilha está concluída!' : index === 0 ? 'Vamos preparar as duas linhas. Leve um qubit para cada encaixe.' : index === 2 ? 'Leve a porta H para a primeira posição do qubit de cima.' : index === 3 ? 'Agora leve CNOT para depois de H. O controle fica em cima e o alvo embaixo.' : 'Passe o mouse sobre o medidor para medir. Você também pode clicar ou usar Tab para focar e Enter para medir.'}</p><p className="practice-tip">{finished ? 'Sua descoberta está registrada nesta sessão. Vamos continuar aprendendo?' : isMeasurement ? 'Uma rodada, um resultado. Uma nova preparação permite medir outra vez.' : 'Arraste a peça ou selecione e clique no encaixe. As duas formas funcionam.'}</p></>}
                </section>

            </div>
                {phase === 'quiz' && correct && <section ref={outcome} className="outcome quiz-outcome" aria-label="Resultado do teste"><span className="outcome-check"><Icon name="check" /></span><p role="status">{message}</p><button className="primary" onClick={() => transition(() => {
          setPhase('practice');
          setMessage('');
        })}>Experimentar no circuito <Icon name="arrow" /></button></section>}
            {phase === 'practice' && <section className="practice-board" aria-label="Circuito interativo">
                <div className="board-heading"><h2>{index === 1 ? 'Treino de medição separado' : 'Sua bancada de descobertas'}</h2><span>Leitura da esquerda para a direita →</span></div>
                {!isMeasurement && <div className="piece-tray"><span>Suas peças</span><button className={`gate-piece ${piece ? 'chosen' : ''}`} draggable={!finished} disabled={finished} onDragStart={e => {
            const value = index === 0 ? 'qubit' : index === 2 ? 'H' : 'CNOT';
            e.dataTransfer.setData('text/plain', value);
            setPiece(value);
          }} onClick={() => setPiece(index === 0 ? 'qubit' : index === 2 ? 'H' : 'CNOT')}>{index === 0 ? '|0⟩ Qubit' : index === 2 ? 'H · Hadamard' : '● ⊕ · CNOT'}</button></div>}
                <div className="assembly">
                    <div className="assembly-line"><span>q₁</span>{index === 0 ? target('q1', 'Encaixe do primeiro qubit') : <b className="prepared">|0⟩</b>}<div className="track">{index === 2 ? target('q1-first', 'Primeira posição do qubit de cima') : index >= 3 ? <b className="fixed-gate">H</b> : null}{index === 3 ? target('pair-second', 'CNOT depois de H, controle em cima e alvo embaixo') : index === 4 ? <b className="cnot-pair">●<span>│</span><span>⊕</span></b> : null}</div>{isMeasurement && <button className={`measurement ${measured !== null ? 'revealed' : ''}`} onMouseEnter={sample} onFocus={sample} onClick={sample} aria-label="Medir circuito preparado">{measured === null ? 'Medir' : measured}</button>}</div>
                    {index !== 1 && <div className="assembly-line"><span>q₂</span>{index === 0 ? target('q2', 'Encaixe do segundo qubit') : <b className="prepared">|0⟩</b>}<div className="track" /></div>}
                </div>
                <p className="practice-status" role="status">{measured !== null ? `Resultado: ${measured}. ${index === 4 ? 'Nesta preparação ideal, 00 e 11 têm 50% de chance cada. Poucas rodadas podem repetir o mesmo par.' : 'Um qubit preparado em 0 deu resultado 0.'}` : message || 'O circuito está pronto para a sua ação.'}</p>
                <small>Simulação clássica de um circuito quântico ideal.</small>
            </section>}
                {finished && <section ref={outcome} className="outcome practice-outcome"><span className="outcome-check"><Icon name="check" /></span><strong>Missão concluída!</strong><div>{isMeasurement && <button className="secondary" onClick={() => {
            measuredRef.current = null;
            setMeasured(null);
            setMessage('Nova preparação pronta. Passe o mouse ou foque o medidor para medir.');
          }}>Preparar outra rodada</button>}<button className="primary" onClick={index === 4 ? onCertificate : onBack}>{index === 4 ? 'Ver minha conclusão' : 'Voltar à trilha'} <Icon name="arrow" /></button></div></section>}
        </div>
    </div>;
}
