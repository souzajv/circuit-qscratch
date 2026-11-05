import { SCHOOL_LEVELS } from '../../shared/config/experience.cjs';
import React from 'react';
export default function SettingsScreen({
  persistent,
  heading,
  name,
  setName,
  level,
  setLevel,
  sound,
  setSound,
  motion,
  setMotion
}) {
  return <section className="settings"><h1 ref={heading} tabIndex="-1">Do seu jeito</h1><p>A escolaridade muda as explicações. Seu avanço continua igual.</p><label>Como posso te chamar?<input maxLength="40" value={name} onChange={e => setName(e.target.value)} /></label><label>Escolaridade<select value={level} onChange={e => setLevel(e.target.value)}>{SCHOOL_LEVELS.map(school => <option key={school}>{school}</option>)}</select></label><label className="toggle"><input type="checkbox" checked={sound} onChange={e => setSound(e.target.checked)} /> Sons de acerto</label><label className="toggle"><input type="checkbox" checked={motion} onChange={e => setMotion(e.target.checked)} /> Animações do mascote</label><p>{persistent ? 'As preferências são salvas na sua conta. Confira o estado do salvamento junto ao seu nome.' : 'Essas preferências valem para esta sessão.'}</p></section>;
}
