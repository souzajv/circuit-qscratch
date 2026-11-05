import React from 'react';
import {render, screen, fireEvent, act, cleanup} from '@testing-library/react';
import Points from '../../src/shared/ui/Points';
import Mascot from '../../src/shared/ui/Mascot';
import Icon from '../../src/shared/ui/Icon';
import Circuit from '../../src/circuit/Circuit';
import TrailPath from '../../src/learning/TrailPath';
import playFeedback from '../../src/infrastructure/audio/playFeedback';
import useCurtain from '../../src/app/hooks/useCurtain';

afterEach(()=>{cleanup();jest.useRealTimers();});
test('ajuda de pontos por hover, foco, toque e Escape',()=>{
 render(<Points total={18}/>);const button=screen.getByRole('button');
 fireEvent.mouseEnter(button.parentElement);expect(screen.getByRole('tooltip')).toHaveTextContent('10 pontos');
 fireEvent.mouseLeave(button.parentElement);expect(screen.queryByRole('tooltip')).toBeNull();
 fireEvent.focus(button);fireEvent.keyDown(button,{key:'Tab'});expect(screen.getByRole('tooltip')).toBeVisible();
 fireEvent.keyDown(button,{key:'Escape'});expect(screen.queryByRole('tooltip')).toBeNull();
 fireEvent.click(button);fireEvent.blur(button);expect(screen.queryByRole('tooltip')).toBeNull();
});
test('todos os ícones e todas as fases do circuito renderizam',()=>{
 for(const name of ['linkedin','arrow','back','help','settings','qubit','measure','gate','cnot','bell','check','flag','star']){const view=render(<Icon name={name}/>);expect(view.container.querySelector('svg')).toBeTruthy();view.unmount();}
 const view=render(<Circuit completed={[]}/>);expect(screen.queryByText('q₁ |0⟩')).toBeNull();
 view.rerender(<Circuit completed={[0]}/>);expect(screen.getByText('q₁ |0⟩')).toBeVisible();
 view.rerender(<Circuit completed={[0,2]}/>);expect(screen.getByText('H')).toBeVisible();
 view.rerender(<Circuit completed={[0,2,3]}/>);expect(screen.getByText(/controle em/)).toBeVisible();
});
test('mascote respeita pose e comando de pausa após carregar',()=>{
 jest.useFakeTimers();
 const view=render(<Mascot motion/>);
 const player={play:jest.fn(),pause:jest.fn()};
 view.container.querySelector('dotlottie-wc').dotLottie=player;
 act(()=>jest.advanceTimersByTime(500));expect(player.play).toHaveBeenCalled();
 view.rerender(<Mascot motion={false}/>);expect(player.pause).toHaveBeenCalled();
 for(const pose of [{thinking:true},{exploring:true},{celebrating:true},{trophy:true},{treasure:true},{loading:true},{chess:true},{access:true}]){
 view.rerender(<Mascot motion {...pose}/>);
 const el=view.container.querySelector('dotlottie-wc');el.dotLottie=player;fireEvent(el,new Event('load'));expect(el.getAttribute('src')).toContain('.lottie');
 }
});
test('traçado mede nós em ambas as direções e limpa observador',()=>{
 const disconnect=jest.fn();let update;
 global.ResizeObserver=class {constructor(fn){update=fn;}observe(){}disconnect(){disconnect();}};
 const host=document.createElement('ol');
 host.innerHTML='<li><button>A</button></li><li><button>B</button></li><li><button>C</button></li>';
 document.body.appendChild(host);
 host.querySelectorAll('button').forEach((el,i)=>el.getBoundingClientRect=()=>({left:i===1?70:20,top:i*120,width:60,height:60}));
 const view=render(<TrailPath containerRef={{current:host}}/>);expect(view.container.querySelector('path').getAttribute('d')).toContain('C ');
 act(()=>update());view.unmount();expect(disconnect).toHaveBeenCalled();host.remove();
 render(<TrailPath containerRef={{current:null}}/>);
});
test('áudio opcional, suporte legado e falhas não bloqueiam',()=>{
 playFeedback('tick',false,{});playFeedback('tick',true,{});
 const oscillator={frequency:{setValueAtTime:jest.fn()},connect:jest.fn(),start:jest.fn(),stop:jest.fn()};
 const gain={gain:{setValueAtTime:jest.fn(),exponentialRampToValueAtTime:jest.fn()},connect:jest.fn()};
 const ctx={currentTime:1,createOscillator:()=>oscillator,createGain:()=>gain,close:jest.fn()};
 const Audio=jest.fn(()=>ctx);playFeedback('tick',true,{AudioContext:Audio});oscillator.onended();expect(ctx.close).toHaveBeenCalled();
 playFeedback('success',true,{webkitAudioContext:Audio});expect(oscillator.frequency.setValueAtTime).toHaveBeenCalledWith(784,1.1);
 playFeedback('tick',true,{AudioContext:()=>{throw Error('indisponível');}});
});
test('cortina bloqueia transições simultâneas, conta e revela destino',()=>{
 jest.useFakeTimers();const action=jest.fn(),ignored=jest.fn(),play=jest.fn();let hook;
 function Harness({motion}){hook=useCurtain(motion,play);return <span>{hook.curtain}:{hook.countdown}</span>;}
 const view=render(<Harness motion/>);
 act(()=>{hook.transition(action,{countdown:true});hook.transition(ignored);});expect(ignored).not.toHaveBeenCalled();
 act(()=>jest.advanceTimersByTime(1100));expect(action).toHaveBeenCalledTimes(1);expect(hook.countdown).toBe(5);
 act(()=>jest.advanceTimersByTime(4000));expect(hook.curtain).toBe('opening');
 act(()=>jest.advanceTimersByTime(850));expect(hook.curtain).toBeNull();
 act(()=>hook.transition(action));act(()=>jest.advanceTimersByTime(1950));expect(hook.curtain).toBeNull();
 view.rerender(<Harness motion={false}/>);act(()=>hook.transition(action));expect(action).toHaveBeenCalledTimes(3);
});

test('medição padrão de um estado de base não depende da amostra',()=>{
 const {measure}=require('../../src/circuit/model.cjs');
 expect(measure([[1,0],[0,0],[0,0],[0,0]]).outcome).toBe('00');
 const {canPlace}=require('../../src/circuit/practice.cjs');
 expect(canPlace(1,'H','q1-first')).toBe(false);
 expect(canPlace(4,'CNOT','pair-second')).toBe(false);
});
