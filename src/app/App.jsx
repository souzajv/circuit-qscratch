import { SCHOOL_LEVELS } from '../shared/config/experience.cjs';
import useCurtain from './hooks/useCurtain';
import playFeedback from '../infrastructure/audio/playFeedback';
import CertificateScreen from './screens/CertificateScreen';
import HelpScreen from './screens/HelpScreen';
import SettingsScreen from './screens/SettingsScreen';
import MapScreen from './screens/MapScreen';
import React, { useState, useEffect, useRef } from 'react';
import { blocks } from '../learning/content';
import { improve } from '../progress/rules.cjs';
import Icon from '../shared/ui/Icon';
import Lesson from '../learning/Lesson';
import SurveyDialog from '../learning/SurveyDialog';
import {EDUCATION_OPTIONS,SURVEY_VERSION} from '../learning/surveys';
import './tokens.css';
import './platform.css';
import './experience.css';
import './responsive.css';
export default function App({initial = {}, onProgress, saveStatus, onRetry, onSignOut,onSurveySave}) {
  const [screen, setScreen] = useState('map');
  const level = SCHOOL_LEVELS[0];
  const [surveys,setSurveys]=useState(initial.surveys || {});
  const [surveyKind,setSurveyKind]=useState(null);
  const surveyNext=useRef(null);
  const [current, setCurrent] = useState(initial.current ?? 0);
  const [completed, setCompleted] = useState(initial.completed ?? []);
  const [best, setBest] = useState(initial.best ?? {});
  const [name, setName] = useState(initial.name ?? 'Explorador');
  const [first, setFirst] = useState(initial.first ?? null);
  const [motion, setMotion] = useState(initial.motion ?? true);
  const [sound, setSound] = useState(initial.sound ?? true);
  const [attempt, setAttempt] = useState(initial.attempt ?? {});
  useEffect(() => {onProgress?.({level,current,completed,best,name,first,motion,sound,attempt,surveys});}, [level,current,completed,best,name,first,motion,sound,attempt,surveys,onProgress]);
  const heading = useRef();
  const trailRef = useRef();
  const nextBlockToReveal = useRef(null);
  useEffect(() => {
    heading.current?.focus();
  }, [screen, current]);
  useEffect(() => {
    if (screen !== 'map' || nextBlockToReveal.current === null) return;
    const frame = requestAnimationFrame(() => {
      const node = trailRef.current?.querySelectorAll('li')[nextBlockToReveal.current];
      if (!node) return;
      node.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto'
      });
      nextBlockToReveal.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [screen, completed, motion]);
  const total = Object.values(best).reduce((sum, n) => sum + n, 0);
  const block = blocks[current];
  const allDone = blocks.every((_, index) => completed.includes(index));
  const play = kind => playFeedback(kind, sound);
  const {
    curtain,
    countdown,
    transition
  } = useCurtain(motion, play);
  const backToMap = () => {if(allDone && !settled('after')){surveyNext.current=()=>transition(()=>setScreen('map'));setSurveyKind('after');}else transition(()=>setScreen('map'));};
  const openLesson = index => transition(() => {
    if (completed.includes(index)) setAttempt(previous => ({...previous,[index]:{}}));
    setCurrent(index);
    setScreen('lesson');
  });
  const settled = kind => kind==='before' ? surveys.before?.status==='completed' && surveys.before.version===SURVEY_VERSION && EDUCATION_OPTIONS.includes(surveys.before.answers?.education) : ['completed','skipped'].includes(surveys[kind]?.status);
  const open = index => {
    if(index===0 && completed.length===0 && !settled('before')){surveyNext.current=()=>openLesson(index);setSurveyKind('before');}
    else openLesson(index);
  };
  const conclude = () => {
    if(!settled('after')){surveyNext.current=()=>transition(()=>setScreen('certificate'));setSurveyKind('after');}
    else transition(()=>setScreen('certificate'));
  };
  const finish = value => {
    if (!completed.includes(current)) nextBlockToReveal.current = Math.min(current + 1, blocks.length - 1);
    setCompleted(previous => previous.includes(current) ? previous : [...previous, current]);
    setBest(previous => ({
      ...previous,
      [current]: improve(previous[current] || 0, value).best
    }));
    if (current === blocks.length - 1 && !first) setFirst({
      name,
      level:'Percurso introdutório',
      date: new Date().toLocaleDateString('pt-BR')
    });
  };
  return <div className={screen === 'lesson' ? 'platform lesson-mode' : screen === 'map' ? 'platform map-mode' : 'platform'} data-motion={motion}>
        <div className={`curtain ${curtain || ''}`} aria-hidden="true"><div /><div /></div>{countdown !== null && <div className="curtain-countdown" role="status" aria-live="polite"><div><p>Hora de testar sua descoberta!</p><strong key={countdown}>{countdown}</strong><p>Sem pressa. Você pode tentar de novo.</p></div></div>}<a className="skip" href="#main">Ir para o conteúdo</a>
        {screen !== 'lesson' && <aside className="sidebar">
            <a className="brand" href="#" onClick={e => {
        e.preventDefault();
        backToMap();
      }}><span className="brand-mark">q<span>+</span></span><span>Circuit<br />QScratch</span></a>
            <p className="side-caption">Uma peça. Uma descoberta.</p>
            <nav aria-label="Navegação principal">
                <button className={screen === 'map' || screen === 'certificate' ? 'nav-active' : ''} aria-current={screen === 'map' || screen === 'certificate' ? 'page' : undefined} onClick={backToMap}>Trilhas <Icon name="qubit" /></button>
                <button className={screen === 'help' ? 'nav-active' : ''} aria-current={screen === 'help' ? 'page' : undefined} onClick={() => transition(() => setScreen('help'))}>Como funciona <Icon name="help" /></button>
                <button className={screen === 'settings' ? 'nav-active' : ''} aria-current={screen === 'settings' ? 'page' : undefined} onClick={() => transition(() => setScreen('settings'))}>Preferências <Icon name="settings" /></button>
            </nav>
            <div className="side-bottom"><div className="avatar">{name.slice(0, 1).toUpperCase()}</div><div className="account-details"><strong>{name}</strong><small role="status" aria-live="polite">{saveStatus || 'Modo demonstração'}</small></div>{onSignOut && <button disabled={saveStatus !== 'Progresso salvo na conta'} onClick={onSignOut}>Sair da conta <Icon name="back" /></button>}{saveStatus?.startsWith('Não foi possível') && <button onClick={onRetry}>Tentar salvar novamente</button>}</div>
        </aside>}
        {surveyKind && <SurveyDialog key={surveyKind} kind={surveyKind} saved={surveys[surveyKind]} motion={motion} persistent={Boolean(onProgress)} onDraft={draft=>setSurveys(previous=>({...previous,[surveyKind]:draft}))} onSubmit={async record=>{await onSurveySave?.(surveyKind,record);setSurveys(previous=>({...previous,[surveyKind]:record}));setSurveyKind(null);surveyNext.current();}}/>}
        <div className="workspace">

            <main id="main" tabIndex="-1">
                {screen === 'map' && <MapScreen heading={heading} completed={completed} total={total} trailRef={trailRef} motion={motion} allDone={allDone} open={open} />}
                {screen === 'lesson' && <Lesson saved={attempt[current]} onCheckpoint={onProgress ? data => setAttempt(previous => JSON.stringify(previous[current]) === JSON.stringify(data) ? previous : {...previous,[current]:data}) : undefined} key={current} block={block} index={current} level={level} name={name} motion={motion} transition={transition} onComplete={finish} onBack={backToMap} onCertificate={conclude} play={play} />}
                {screen === 'settings' && <SettingsScreen persistent={Boolean(onProgress)} heading={heading} name={name} setName={setName} sound={sound} setSound={setSound} motion={motion} setMotion={setMotion} />}
                {screen === 'help' && <HelpScreen heading={heading} backToMap={backToMap} />}
                {screen === 'certificate' && first && <CertificateScreen heading={heading} first={first} backToMap={backToMap} />}
                <footer><span className="author-credit">Feito por <a href="https://www.linkedin.com/in/joao-souza-campos/" target="_blank" rel="noopener noreferrer">João Campos <Icon name="linkedin" /></a></span><span aria-hidden="true"> · </span>Uma experiência baseada no <a href="https://github.com/marcosrv-ULL/QScratch">QScratch</a> · Gato professor: <a href="https://lottiefiles.com/free-animation/professor-cat-OMSGkVND6g">Christine Somkunwar</a> · <a href="https://lottiefiles.com/page/license">Lottie Simple License</a></footer>
            </main>
        </div>
    </div>;
}
