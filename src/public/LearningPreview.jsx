import React, {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import {blocks} from '../learning/content';
import Circuit from '../circuit/Circuit';
import Icon from '../shared/ui/Icon';
import {LANDING_MOTION as timing} from './motionConfig';

const steps = [
    {id:'learn', title:'Conheça uma ideia', action:'Ensinar'},
    {id:'quiz', title:'Teste sua descoberta', action:'Perguntar'},
    {id:'practice', title:'Encaixe o que aprendeu', action:'Praticar'}
];

export default function LearningPreview({motion = true}) {
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(() => !document.hidden);
    const contentRef = useRef(null);
    const elapsed = useRef(0);
    const [progress, setProgress] = useState(0);
    const step = steps[index].id;
    const playing = motion && visible && !hovered && !focused;
    const block = blocks[2];

    useEffect(() => {
        const update = () => setVisible(!document.hidden);
        document.addEventListener('visibilitychange', update);
        return () => document.removeEventListener('visibilitychange', update);
    }, []);
    useEffect(() => {
        if (!playing) return;
        const timer = setInterval(() => {
            elapsed.current += timing.progressTickMs;
            if (elapsed.current >= timing.carouselIntervalMs) {
                elapsed.current = 0;
                setIndex(current => (current + 1) % steps.length);
                setAnswer(null);
            }
            setProgress(elapsed.current / timing.carouselIntervalMs);
        }, timing.progressTickMs);
        return () => clearInterval(timer);
    }, [playing]);
    useEffect(() => {
        if (!motion) return;
        const context = gsap.context(() => {
            gsap.fromTo(contentRef.current,
                {autoAlpha: 0, y: timing.slideDistance},
                {autoAlpha: 1, y: 0, duration: timing.slideDuration, ease: 'power2.out', clearProps: 'all'});
        }, contentRef);
        return () => context.revert();
    }, [index, motion]);
    const select = next => {
        elapsed.current = 0;
        setProgress(0);
        setIndex(next);
        setAnswer(null);
    };

    return <div className="learning-preview" data-ui role="region" aria-roledescription="carrossel" aria-label="Como você aprende"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)} onBlurCapture={event => {
            // Trocar de controle dentro da prévia não reinicia a troca automática.
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}>
        <div className="preview-timer" aria-hidden="true"><span style={{transform:`scaleX(${progress})`}}/></div>
        <div className="preview-tabs" role="group" aria-label="Conheça as fases da atividade">
            {steps.map((item, next) => <button key={item.id} type="button" aria-pressed={step === item.id} aria-controls="preview-slide" onClick={() => select(next)}>{item.action}</button>)}
        </div>
        <div className="preview-content" id="preview-slide" ref={contentRef} aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
            <h3>{steps[index].title}</h3>
            {step === 'learn' && <><span className="preview-gate" aria-hidden="true">H</span><p>{block.basic.split('. ')[0]}.</p><p>Depois da explicação, você testa a ideia antes de colocar a peça no circuito.</p></>}
            {step === 'quiz' && <><p>{block.question}</p><div className="preview-answers">{block.options.map((option, optionIndex) => <button key={option} onClick={() => setAnswer(optionIndex)} aria-pressed={answer === optionIndex}>{option}{answer === optionIndex && optionIndex === block.answer && <Icon name="check"/>}</button>)}</div>{answer !== null && <p className="preview-feedback">{answer === block.answer ? block.feedback : 'Tente outra vez: nesse exemplo, os dois resultados são possíveis.'}</p>}</>}
            {step === 'practice' && <><Circuit completed={[0,2]}/><p>Uma peça de cada vez. A porta H entra no primeiro qubit; depois, você descobre a CNOT.</p><a className="lp-text-link" href="#/trilha">Experimentar a trilha completa <Icon name="arrow"/></a></>}
        </div>
        <div className="preview-controls"><span>Etapa {index + 1} de {steps.length}</span>{!motion && <span>Explore as etapas acima</span>}</div>
        <span className="preview-caption">Uma prévia da atividade de Hadamard na trilha de Bell.</span>
    </div>;
}
