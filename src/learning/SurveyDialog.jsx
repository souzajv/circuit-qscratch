import React,{useState,useEffect,useRef} from 'react';
import Mascot from '../shared/ui/Mascot';
import {gsap} from 'gsap';
import {LANDING_MOTION as timing} from '../public/motionConfig';
import Icon from '../shared/ui/Icon';
import {SURVEY_VERSION,surveyQuestions,getSurveyOptions,isSurveyAnswerValid,SURVEY_COMMENT_LIMIT} from './surveys';
import './mission-dialog.css';
import './survey.css';
export default function SurveyDialog({kind,saved={},motion,persistent,onDraft,onSubmit}){
 const dialog=useRef(),heading=useRef();
 const questions=surveyQuestions[kind];
 const [started,setStarted]=useState(Boolean(saved.version===SURVEY_VERSION && saved.answers && Object.keys(saved.answers).length));
 const [answers,setAnswers]=useState(saved.version===SURVEY_VERSION?saved.answers || {}:{});
 const [index,setIndex]=useState(saved.version===SURVEY_VERSION?Math.min(saved.index || 0,questions.length-1):0);
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{const node=dialog.current,overflow=document.body.style.overflow;node.showModal();document.body.style.overflow='hidden';return()=>{node.close();document.body.style.overflow=overflow;};},[]);
 useEffect(()=>{heading.current?.focus({preventScroll:true});},[started,index,error]);
 useEffect(()=>{
  if(!motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const context=gsap.context(()=>gsap.fromTo(dialog.current.querySelectorAll('h2,.survey-options'),{autoAlpha:0,y:timing.slideDistance},{autoAlpha:1,y:0,duration:timing.slideDuration,ease:'power2.out',clearProps:'all'}),dialog);
  return ()=>context.revert();
 },[started,index,motion]);
 const send=async status=>{
  if(status==='completed'){
   const missing=questions.findIndex(q=>!q.optional && !isSurveyAnswerValid(q,answers[q.id]));
   if(missing>=0){setIndex(missing);setError('Responda esta etapa antes de enviar o formulário.');return;}
  }
  setBusy(true);setError('');
  try{await onSubmit({version:SURVEY_VERSION,status,answers:status==='completed'?answers:{},submittedAtClient:new Date().toISOString()});}
  catch{setError('Não foi possível salvar as respostas. Elas continuam aqui. Tente enviar novamente.');setBusy(false);}
 };
 const question=questions[index];
 const mandatory=kind==='before';
 const options=getSurveyOptions(question);
 const updateAnswer=value=>{const next={...answers,[question.id]:value};setAnswers(next);onDraft({version:SURVEY_VERSION,status:'in_progress',answers:next,index});};
 return <dialog ref={dialog} className="mission-dialog survey-dialog" aria-labelledby="survey-title" aria-describedby="survey-description" onCancel={e=>e.preventDefault()}>
  <Mascot motion={motion} access/>
  <h2 id="survey-title" tabIndex="-1" ref={heading}>{started?question.text:kind==='before'?'Antes da sua descoberta':'Como foi sua experiência?'}</h2>
  <p id="survey-description">{started?`Pergunta ${index+1} de ${questions.length}. ${question.type==='knowledge'?'Responda como souber. Você pode escolher Não sei ainda. Não vale pontos.':question.optional?'Resposta opcional.':'Não há resposta certa ou errada.'}`:mandatory?'Antes de iniciar, precisamos conhecer seu perfil e sua experiência. Este questionário é obrigatório para começar a trilha e não vale pontos.':'Quer responder algumas perguntas para apoiar o estudo deste projeto? A participação é opcional e não muda seus pontos ou o acesso à trilha.'}</p>
  {!started?<><p className="survey-privacy">{persistent?'As respostas ficam vinculadas à sua conta e serão usadas na análise do projeto.':'Esta é uma demonstração: as respostas ficam apenas nesta sessão.'} {mandatory?'Responda todas as etapas para começar.':'Você pode pular o questionário.'} Vamos perguntar sobre sua experiência e duas ideias de computação quântica. Não há nota nem correção neste formulário. Não escreva dados pessoais no comentário.</p><button className="primary" onClick={()=>setStarted(true)}>Quero responder <Icon name="arrow"/></button></>:<>
   <div className="stage-dots survey-steps" role="progressbar" aria-label="Progresso do questionário" aria-valuemin="0" aria-valuemax={questions.length} aria-valuenow={index+1}>{questions.map((q,i)=><b key={q.id} className={i<=index?'active':''}/>)}</div>
   {question.type==='text'?<div className="survey-comment"><label htmlFor="survey-comment">Comentário opcional</label><textarea id="survey-comment" rows="3" maxLength={SURVEY_COMMENT_LIMIT} value={answers[question.id] || ''} disabled={busy} onChange={event=>updateAnswer(event.target.value)}/><p>Até {SURVEY_COMMENT_LIMIT} caracteres. Você pode deixar em branco.</p></div>:<div className="survey-options" role="group" aria-label="Sua resposta">{options.map(([value,label])=><button className="secondary" key={label} aria-pressed={answers[question.id]===value} disabled={busy} onClick={()=>updateAnswer(value)}>{label}</button>)}</div>}
   <div className="survey-navigation"><button className="text-button" disabled={busy||index===0} onClick={()=>setIndex(index-1)}><Icon name="back"/> Anterior</button><button className="primary" disabled={busy||(!question.optional&&!isSurveyAnswerValid(question,answers[question.id]))} onClick={()=>{if(index===questions.length-1)send('completed');else {setIndex(index+1);onDraft({version:SURVEY_VERSION,status:'in_progress',answers,index:index+1});}}}>{busy?'Salvando...':index===questions.length-1?'Enviar respostas':'Próxima'} <Icon name="arrow"/></button></div>
  </>}
  <p role="alert" className="survey-error">{error}</p>
  {!mandatory && <button className="text-button" disabled={busy} onClick={()=>send('skipped')}>{busy?'Aguarde...':'Pular questionário e continuar'}</button>}
 </dialog>;
}
