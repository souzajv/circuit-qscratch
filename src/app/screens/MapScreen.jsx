import React from 'react';
import useTrailScroll from '../hooks/useTrailScroll';
import { blocks } from '../../learning/content';
import Mascot from '../../shared/ui/Mascot';
import Icon from '../../shared/ui/Icon';
import Points from '../../shared/ui/Points';
import Circuit from '../../circuit/Circuit';
import TrailPath from '../../learning/TrailPath';
export default function MapScreen({
  heading,
  completed,
  total,
  trailRef,
  motion,
  allDone,
  open
}) {
  useTrailScroll(trailRef, motion);
  return <>
                    <div className="title-row"><div><h1 tabIndex="-1" ref={heading}>Pequenas peças.<br />Grandes descobertas.</h1><p>Do primeiro qubit ao estado de Bell. Vamos montar juntos?</p></div><span className="trail-label">Trilha de Bell<br /><strong>{completed.length} de 5 blocos</strong><Points total={total} /></span></div>
                    <div className="map-layout"><section className="path-section" aria-label="Mapa da trilha"><div className="path-intro"><Icon name="flag" className="start-flag" /><div><strong>Sua jornada começa aqui</strong><span>Não precisa saber nada de computação quântica.</span></div></div><ol className="trail" ref={trailRef}><TrailPath containerRef={trailRef} />{blocks.map((item, i) => {
            const done = completed.includes(i),
              unlocked = i === 0 || completed.includes(i - 1);
            return <li key={item.title} className={done ? 'done' : unlocked ? 'available' : 'locked'}><button disabled={!unlocked} onClick={() => open(i)} aria-label={`${item.title}: ${done ? 'concluído, refazer' : unlocked ? 'disponível' : 'bloqueado'}`}><span>{done ? <Icon name="check" /> : <Icon name={['qubit', 'measure', 'gate', 'cnot', 'bell'][i]} />}</span></button><div><small>{done ? 'Concluído' : unlocked ? 'Comece por aqui' : 'A seguir'}</small><h2>{item.title}</h2><p>{item.short}</p></div></li>;
          })}</ol></section><aside className="discovery"><div className="guide-card"><Mascot motion={motion} exploring={!allDone} treasure={allDone} /><h2>{allDone ? 'Você concluiu a trilha!' : 'Oi! Vamos descobrir?'}</h2><p>{allDone ? 'Peça por peça, você montou seu primeiro circuito de Bell. Hora de comemorar essa conquista! Que tal revisar suas descobertas?' : 'Vou te acompanhar nessa jornada. Cada ideia que você aprende vira uma peça do seu circuito.'}</p><button className="primary" onClick={() => open(blocks.findIndex((_, i) => !completed.includes(i)) < 0 ? 0 : blocks.findIndex((_, i) => !completed.includes(i)))}>{allDone ? 'Revisar a trilha' : completed.length ? 'Continuar a trilha' : 'Vamos começar'} <Icon name="arrow" /></button></div><Circuit completed={completed} /><p className="session-note">Seu circuito cresce a cada bloco. Confira o estado do salvamento junto ao seu nome. Na demonstração, o progresso dura somente esta sessão.</p></aside></div>
                </>;
}
