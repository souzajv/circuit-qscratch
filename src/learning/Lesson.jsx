import { SCHOOL_LEVELS, QUIZ_SUCCESS_DELAY_MS } from '../shared/config/experience.cjs';
import React, { useState, useEffect, useRef } from 'react';
import Icon from '../shared/ui/Icon';
import Mascot from '../shared/ui/Mascot';
import { canPlace, reveal } from '../circuit/practice.cjs';
import { score } from '../progress/rules.cjs';
import {CONTENT_REVISION,getLessons,getQuestions} from './content';
import LearningExample from './LearningExample';
import MissionDialog from './MissionDialog';
import DirectionalText from './DirectionalText';
import PracticeReflection from './PracticeReflection';
import {reflectionIsReady} from './practiceReflections';
const explorationVisuals = ['preparation','measurement','double-h','order-compare','bell-compare'];
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
  const [answered,setAnswered] = useState(saved.answered ?? saved.correct ?? false);
  const [advanceReady,setAdvanceReady] = useState(Boolean(saved.answered ?? saved.correct));
  const [correct, setCorrect] = useState(saved.correct ?? false);
  const [quizIndex,setQuizIndex] = useState(saved.quizIndex ?? 0);
  const [questionHint,setQuestionHint] = useState(saved.questionHint ?? false);
  const [errors, setErrors] = useState(saved.errors ?? 0);
  const [hint, setHint] = useState(saved.hint ?? false);
  const [message, setMessage] = useState('');
  const [piece, setPiece] = useState(null);
  const [slots, setSlots] = useState(saved.slots ?? []);
  const [measured, setMeasured] = useState(saved.measured ?? null);
  const measuredRef = useRef(saved.measured ?? null);
  const [finished, setFinished] = useState(saved.finished ?? false);
  // A revisão acompanha a tentativa inteira, inclusive quando ela volta à explicação.
  const [questionRevision] = useState(saved.contentRevision === 2 ? 2 : CONTENT_REVISION);
  const [reflection,setReflection] = useState(saved.reflection ?? {choice:null,confirmed:false});
  const practiceReady = finished || reflectionIsReady(index,reflection);
  const practiceBoard=useRef(null),previousReady=useRef(practiceReady);
  useEffect(()=>{
    // Após a previsão, o teclado segue para a ação que acabou de ser liberada.
    if(phase==='practice' && practiceReady && !previousReady.current)practiceBoard.current.querySelector('.gate-piece, .measurement').focus();
    previousReady.current=practiceReady;
  },[phase,practiceReady]);
  useEffect(() => {onCheckpoint?.({phase,page,quizIndex,questionHint,contentRevision:questionRevision,choice,correct,answered,errors,hint,slots,measured,finished,reflection});},[phase,page,quizIndex,questionHint,choice,correct,answered,errors,hint,slots,measured,finished,reflection]);
  const title = useRef();
  const questionTitle = useRef();
  const lessonTitle = useRef();
  const [missionOpen,setMissionOpen]=useState(Boolean(saved.finished));
  // Cada fala apresenta uma ideia; a plataforma usa a versão introdutória para todos.
  const pages = getLessons(block,level);
  const questions = getQuestions(block,level,questionRevision);
  // Um checkpoint antigo não deve apontar para fora da nova sequência.
  const pageIndex = Math.min(page,pages.length-1);
  const questionIndex = Math.min(quizIndex,questions.length-1);
  const question = questions[questionIndex];
  const lastQuestion = questionIndex === questions.length-1;
  const lesson = pages[pageIndex];
  const conclusion = block.conclusion[level===SCHOOL_LEVELS[1]?'advanced':'basic'];
  useEffect(() => {
    if(phase === 'quiz')questionTitle.current?.focus();
    else if(phase === 'learn')lessonTitle.current?.focus();
    else title.current?.focus();
  }, [phase, questionIndex, pageIndex]);

  useEffect(()=>{
    if(!answered || phase!=='quiz')return;
    const timer=setTimeout(()=>setAdvanceReady(true),QUIZ_SUCCESS_DELAY_MS);
    return ()=>clearTimeout(timer);
  },[answered,phase,questionIndex]);
  const advance = () => {
    if(lastQuestion)transition(()=>{setPhase('practice');setMessage('');});
    else {setQuizIndex(questionIndex+1);setCorrect(false);setAnswered(false);setAdvanceReady(false);setChoice(null);setQuestionHint(false);setMessage('');play('tick');}
  };
  const complete = () => {
    if (finished) return;
    setFinished(true);
    setMissionOpen(true);
    onComplete(score(errors, hint));
    play('success');
  };
  const put = (value, slot) => {
    if (finished || !practiceReady) return;
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
    if (!practiceReady || measuredRef.current !== null) return;
    const result = reveal(null, index);
    measuredRef.current = result;
    setMeasured(result);
    complete();
  };
  const target = (slot, label) => <button disabled={!practiceReady || finished} className={`drop-slot ${index === 3 ? 'pair-slot' : ''} ${slots.includes(slot) ? 'filled' : ''}`} aria-label={label} onDragOver={e => {
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
                <div className="speaker"><Mascot motion={motion} thinking={phase === 'quiz'} celebrating={phase === 'quiz' && correct} failed={phase === 'quiz' && answered && !correct}  /></div>
                <section className="speech" aria-label={phase === 'learn' ? 'Explicação do professor' : phase === 'quiz' ? 'Pergunta do professor' : 'Missão prática'}>
                    {phase === 'learn' && <><p className="speech-greeting">Vamos juntos, {name || 'explorador'}.</p><h2 ref={lessonTitle} tabIndex="-1" className="speech-topic">{lesson.title}</h2><p className="speech-copy" key={pageIndex}><DirectionalText text={lesson.text}/></p><div className="speech-navigation"><button className="text-button" disabled={pageIndex === 0} onClick={() => {
                setPage(pageIndex - 1);
                play('tick');
              }}><Icon name="back" /> Anterior</button><span>{pageIndex + 1} de {pages.length}</span><button className="primary" onClick={() => {
                if (pageIndex < pages.length - 1) {
                  setPage(pageIndex + 1);
                  play('tick');
                } else transition(() => setPhase('quiz'), {
                  countdown: true
                });
              }}>{pageIndex === pages.length - 1 ? 'Iniciar teste' : 'Próximo'} <Icon name="arrow" /></button></div></>}
                    {phase === 'quiz' && <><p className="quiz-position">Pergunta {questionIndex+1} de {questions.length}</p><fieldset disabled={answered}><legend ref={questionTitle} tabIndex="-1">{question.question}</legend>{question.options.map((option, i) => <label className={'answer ' + (choice === i ? 'selected ' : '') + (answered && i === question.answer ? 'answer-correct' : '') + (answered && !correct && choice === i ? ' answer-wrong' : '')} key={option}><input type="radio" name="answer" checked={choice === i} onChange={() => {
                  setChoice(i);
                  setMessage('');
                }} />{option}{answered && (choice===i || i===question.answer) && <span className="correct-mark" aria-label={i===question.answer?"Resposta correta":"Resposta incorreta"}><Icon name={i===question.answer?"check":"close"} /></span>}</label>)}</fieldset><div className="lesson-actions"><button className="text-button" disabled={answered || questionHint} onClick={() => {setHint(true);setQuestionHint(true);}}>Ver dica {questionHint ? '' : hint ? '(sem novo desconto)' : '(−2 pontos no bloco)'}</button><button className={`primary quiz-confirm ${answered && !advanceReady ? correct ? 'answer-jump' : 'answer-shake' : ''}`} disabled={choice === null || (answered && !advanceReady)} onClick={() => {
                if(answered){advance();return;}
                setAnswered(true);
                if (choice === question.answer) {
                  setCorrect(true);
                  setMessage(question.feedback);
                  play('success');
                } else {
                  setErrors(errors + 1);
                  setMessage(`A resposta correta é “${question.options[question.answer]}”. ${question.retry}`);
                  play('tick');
                }
              }}>{answered ? advanceReady ? lastQuestion ? 'Experimentar no circuito' : 'Próxima pergunta' : correct ? 'Resposta correta!' : 'Resposta incorreta' : 'Conferir resposta'}{answered && advanceReady && <> <Icon name="arrow" /></>}</button></div>{questionHint && <p className="hint">{question.hint}</p>}<p className="feedback quiz-feedback" role="status">{correct ? question.feedback : answered ? message || `A resposta correta é “${question.options[question.answer]}”. ${question.retry}` : message}</p><button className="text-button quiz-review" onClick={()=>{setPhase('learn');setPage(0);setMessage('');}}>Rever explicação sem apagar esta tentativa</button></>}
                    {phase === 'practice' && <><p className="speech-copy">{!practiceReady ? 'Antes de usar a peça, vamos entender o que esperamos dela. Confira a previsão na bancada. Esse treino não muda sua nota.' : index === 0 ? 'Vamos preparar as duas linhas. Leve um qubit para cada encaixe.' : index === 2 ? 'Leve a porta H para a primeira posição do qubit de cima.' : index === 3 ? 'Agora leve CNOT para depois de H. O controle fica em cima e o alvo embaixo.' : <>Clique no medidor para medir. Pelo teclado, use <kbd>Tab</kbd> para focar e <kbd>Enter</kbd> ou <kbd>Espaço</kbd> para medir.</>}</p><p className="practice-tip">{isMeasurement ? 'Uma rodada, um resultado. Uma nova preparação permite medir outra vez.' : 'Arraste a peça ou selecione e clique no encaixe. As duas formas funcionam.'}</p></>}
                </section>
                {pages.map((item,i)=><div className="lesson-example-slot" key={`${i}-${level}`} hidden={phase!=='learn' || pageIndex!==i}><LearningExample active={phase==='learn' && pageIndex===i} visual={item.visual} title={item.title} motion={motion} level={level}/></div>)}
            </div>

            {phase === 'practice' && <section ref={practiceBoard} className="practice-board" aria-label="Circuito interativo">
                <div className="board-heading"><h2>{index === 1 ? 'Treino de medição separado' : 'Sua bancada de descobertas'}</h2><span>Leitura da esquerda para a direita →</span></div>
                {!finished && <PracticeReflection index={index} value={reflection} onChange={setReflection}/>}
                <div className="practice-workspace" hidden={!practiceReady}>
                {!isMeasurement && <div className="piece-tray"><span>Suas peças</span><button className={`gate-piece ${piece ? 'chosen' : ''}`} draggable={practiceReady && !finished} disabled={finished || !practiceReady} onDragStart={e => {
            const value = index === 0 ? 'qubit' : index === 2 ? 'H' : 'CNOT';
            e.dataTransfer.setData('text/plain', value);
            setPiece(value);
          }} onClick={() => setPiece(index === 0 ? 'qubit' : index === 2 ? 'H' : 'CNOT')}>{index === 0 ? '|0⟩ Qubit' : index === 2 ? 'H · Hadamard' : '● ⊕ · CNOT'}</button></div>}
                <div className="assembly">
                    <div className="assembly-line"><span>q₁</span>{index === 0 ? target('q1', 'Encaixe do primeiro qubit') : <b className="prepared">|0⟩</b>}<div className="track">{index === 2 ? target('q1-first', 'Primeira posição do qubit de cima') : index >= 3 ? <b className="fixed-gate">H</b> : null}{index === 3 ? target('pair-second', 'CNOT depois de H, controle em cima e alvo embaixo') : index === 4 ? <b className="cnot-pair">●<span>│</span><span>⊕</span></b> : null}</div>{isMeasurement && <button disabled={!practiceReady} className={`measurement ${measured !== null ? 'revealed' : ''}`} onClick={sample} aria-label="Medir circuito preparado">{measured === null ? 'Medir' : measured}</button>}</div>
                    {index !== 1 && <div className="assembly-line"><span>q₂</span>{index === 0 ? target('q2', 'Encaixe do segundo qubit') : <b className="prepared">|0⟩</b>}<div className="track" /></div>}
                </div>
                <p className="practice-status" role="status">{measured !== null ? `Resultado: ${measured}. ${index === 4 ? 'Nesta preparação ideal, 00 e 11 têm 50% de chance cada. Poucas rodadas podem repetir o mesmo par.' : 'Um qubit preparado em 0 deu resultado 0.'}` : message || 'O circuito está pronto para a sua ação.'}</p>
                <small>Simulação clássica de um circuito quântico ideal.</small>
                </div>
            </section>}
                {missionOpen && <MissionDialog motion={motion} conclusion={conclusion} last={index===4} onContinue={()=>{setMissionOpen(false);if(index===4)onCertificate();else onBack();}} onDismiss={()=>setMissionOpen(false)} onRepeat={isMeasurement?()=>{setMissionOpen(false);measuredRef.current=null;setMeasured(null);setMessage('Nova preparação pronta. Clique no medidor ou use Enter ou Espaço para medir.');}:undefined}/>}
                {phase === 'practice' && <details className={`practice-exploration ${finished?'':'exploration-locked'}`}><summary>Compare e experimente mais, sem alterar sua montagem</summary>{finished && <><LearningExample visual={explorationVisuals[index]} title="O que muda em outro preparo?" motion={motion} level={level}/><button className="secondary" onClick={()=>setMissionOpen(true)}>Ver missão concluída</button></>}</details>}
        </div>
    </div>;
}
