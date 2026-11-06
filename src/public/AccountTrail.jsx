import React,{useState,useEffect,useCallback,useRef} from 'react';
import App from '../app/App';
import LoadingScreen from './LoadingScreen';
import {gsap} from 'gsap';
import {LANDING_MOTION as timing} from './motionConfig';
import {PROGRESS_SAVE_DELAY_MS} from '../shared/config/experience.cjs';
import {watchAccount,logout} from '../infrastructure/firebase/auth';
import {loadProgress,saveProgress} from '../infrastructure/firebase/progress';

export default function AccountTrail(){
 const entrance=useRef(null);
 const [account,setAccount]=useState(undefined);
 const [initial,setInitial]=useState(null);
 const [error,setError]=useState(false);
 const [status,setStatus]=useState('Carregando progresso...');
 const latest=useRef(null),queue=useRef(Promise.resolve()),revision=useRef(0),timer=useRef(null),active=useRef(null);
 useEffect(()=>watchAccount(user=>{clearTimeout(timer.current);active.current=user?.uid;revision.current++;setInitial(null);latest.current=null;setAccount(user);}),[]);
 const load=useCallback(async()=>{
  setError(false);
  try {const uid=account.uid;const state=await loadProgress(uid);if(active.current!==uid)return;setInitial({...state,name:state.name || account.displayName || 'Explorador'});setStatus('Progresso salvo na conta');}
  catch {setError(true);}
 },[account]);
 useEffect(()=>{if(account) load();},[account,load]);
 const persist=useCallback(state=>{
  latest.current=state;const version=++revision.current;
  setStatus('Salvando progresso...');
  clearTimeout(timer.current);
  timer.current=setTimeout(()=>{
  queue.current=queue.current.catch(()=>{}).then(()=>saveProgress(account.uid,state));
  queue.current.then(()=>{if(version===revision.current)setStatus('Progresso salvo na conta');},()=>{if(version===revision.current)setStatus('Não foi possível salvar. Tentar novamente');});
  },PROGRESS_SAVE_DELAY_MS);
 },[account]);
 // A animação começa somente depois da restauração; desmontar reverte os estilos.
 useEffect(()=>{
  if(!initial || !entrance.current || initial.motion===false || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const context=gsap.context(()=>{
   gsap.fromTo(entrance.current.querySelectorAll('.sidebar, .title-row, .path-intro, .trail > li, .discovery > *, footer'),
    {autoAlpha:0,y:timing.revealDistance},
    {autoAlpha:1,y:0,duration:timing.revealDuration,stagger:timing.stagger,ease:'power2.out',clearProps:'all'});
  },entrance);
  return ()=>context.revert();
 },[initial]);
 const commitSurvey=useCallback(async(kind,record)=>{
  clearTimeout(timer.current);const version=++revision.current;
  const state={...latest.current,surveys:{...latest.current.surveys,[kind]:record}};
  latest.current=state;setStatus('Salvando progresso...');
  const pending=queue.current.catch(()=>{}).then(()=>saveProgress(account.uid,state));queue.current=pending;
  try{await pending;if(version===revision.current)setStatus('Progresso salvo na conta');}
  catch(error){if(version===revision.current)setStatus('Não foi possível salvar. Tentar novamente');throw error;}
 },[account]);
 const leave=async()=>{await logout();window.location.hash='/entrar';};
 if(account===undefined || (account && !initial && !error))return <LoadingScreen/>;
 if(!account)return <main><h1>Entre para salvar sua trilha</h1><a href="#/entrar">Entrar</a><a href="#/demo">Conhecer a demonstração</a></main>;
 if(error)return <main><p>Não foi possível carregar seu progresso. Seus dados não foram substituídos.</p><button onClick={load}>Tentar novamente</button></main>;
 return <div ref={entrance}><App key={account.uid} initial={initial} onProgress={persist} saveStatus={status} onRetry={()=>persist(latest.current)} onSignOut={leave} onSurveySave={commitSurvey}/></div>;
}
