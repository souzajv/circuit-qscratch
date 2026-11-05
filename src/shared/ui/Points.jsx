import React, { useState, useId } from 'react';
import Icon from './Icon';
export default function Points({
  total
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <span className="points-group">
        <span className="map-points" aria-live="polite"><Icon name="star" /><b>{total}</b><span>pontos</span></span>
        <span className="points-help" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button className="points-help-button" aria-label="Como funciona a pontuação" aria-describedby={open ? id : undefined} aria-expanded={open} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onClick={() => setOpen(true)} onKeyDown={e => {
        if (e.key === 'Escape') setOpen(false);
      }}>?</button>
            {open && <span className="points-tooltip" id={id} role="tooltip"><strong>Cada descoberta vale pontos!</strong><span>Um acerto começa valendo 10 pontos. Cada erro reduz 2 pontos, e a primeira dica também reduz 2. O acerto vale no mínimo 2 pontos.</span><span>Você não perde pontos já conquistados. Ao refazer, só ganha a diferença se superar sua melhor nota. Os pontos entram ao concluir a prática do bloco.</span></span>}
        </span>
    </span>;
}
