import React,{useId,useState,useRef,useEffect} from 'react';
import {gsap} from 'gsap';
import {LANDING_MOTION as timing} from '../public/motionConfig';

// Os painéis permanecem montados: navegar nunca reinicia um experimento.
export default function ExplorationTabs({tabs,motion=false,activeIndex,onSelect}){
 const id=useId();
 const [selected,setSelected]=useState(0);
 const active=activeIndex ?? selected;
 const select=index=>{setSelected(index);onSelect?.(index);};
 const root=useRef(null);
 useEffect(()=>{
  if(!motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const context=gsap.context(()=>gsap.fromTo(root.current.querySelector('[role="tabpanel"]:not([hidden])'),{autoAlpha:0,y:timing.slideDistance},{autoAlpha:1,y:0,duration:timing.slideDuration,ease:'power2.out',clearProps:'all'}),root);
  return ()=>context.revert();
 },[active,motion]);
 const navigate=(event,index)=>{
  const offsets={ArrowRight:1,ArrowLeft:-1,Home:-index,End:tabs.length-1-index};
  if(!(event.key in offsets))return;
  event.preventDefault();
  const next=(index+offsets[event.key]+tabs.length)%tabs.length;
  root.current.querySelectorAll('[role="tab"]')[next].focus();
 };
 return <div ref={root} className="exploration-tabs">
  <div className="lab-tabs" role="tablist" aria-label="Partes da exploração">{tabs.map((tab,index)=><button key={tab.id} type="button" role="tab" id={`${id}-tab-${tab.id}`} aria-controls={`${id}-panel-${tab.id}`} aria-selected={active===index} tabIndex={active===index?0:-1} onKeyDown={event=>navigate(event,index)} onClick={()=>select(index)}>{tab.label}</button>)}</div>
  {tabs.map((tab,index)=><div key={tab.id} id={`${id}-panel-${tab.id}`} role="tabpanel" aria-labelledby={`${id}-tab-${tab.id}`} hidden={active!==index} tabIndex={0} className="lab-tab-panel">{tab.content}</div>)}
 </div>;
}
