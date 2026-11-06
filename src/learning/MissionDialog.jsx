import React,{useEffect,useRef} from 'react';
import {gsap} from 'gsap';
import Mascot from '../shared/ui/Mascot';
import Icon from '../shared/ui/Icon';
import {LANDING_MOTION as timing} from '../public/motionConfig';
import './mission-dialog.css';

export default function MissionDialog({motion,conclusion,last,onContinue,onDismiss,onRepeat}){
 const dialog=useRef(null),heading=useRef(null);
 useEffect(()=>{
  const node=dialog.current,previousOverflow=document.body.style.overflow;
  node.showModal();document.body.style.overflow='hidden';heading.current.focus({preventScroll:true});
  const context=gsap.context(()=>{
   if(motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo(node,{autoAlpha:0,y:timing.slideDistance},{autoAlpha:1,y:0,duration:timing.slideDuration,ease:'power2.out',clearProps:'all'});
  },dialog);
  return ()=>{context.revert();node.close();document.body.style.overflow=previousOverflow;};
 },[motion]);
 return <dialog ref={dialog} className="mission-dialog" aria-labelledby="mission-title" aria-describedby="mission-conclusion" onCancel={onDismiss}>
  <button className="mission-close" aria-label="Fechar conquista e continuar explorando" onClick={onDismiss}><Icon name="close"/></button>
  <Mascot motion={motion} rating/>
  <h2 id="mission-title" ref={heading} tabIndex="-1">Missão concluída!</h2>
  <p id="mission-conclusion">{conclusion}</p>
  <div className="mission-actions"><button className="primary" onClick={onContinue}>{last?'Ver minha conclusão':'Voltar à trilha'} <Icon name="arrow"/></button>
  {onRepeat && <button className="secondary" onClick={onRepeat}>Preparar outra rodada</button>}
  <button className="text-button" onClick={onDismiss}>Continuar explorando</button></div>
 </dialog>;
}
