import React, {useState} from 'react';
import Icon from '../shared/ui/Icon';
import {practiceReflections, reflectionIsReady} from './practiceReflections';

export default function PracticeReflection({index, value, onChange}) {
  const [submitted, setSubmitted] = useState(false);
  const prompt = practiceReflections[index];
  const ready = reflectionIsReady(index, value);
  return <section className="practice-prediction" aria-label="Previsão antes da prática">
    <h3>{ready ? <><Icon name="check"/> Previsão conferida</> : 'Vamos fazer uma previsão?'}</h3>
    {ready ? <p>{prompt.explanation}</p> : <>
      <p>Este treino não vale pontos. Você pode tentar de novo e usar a explicação.</p>
      <p className="prediction-question">{prompt.question}</p>
      <div className="prediction-options" role="group" aria-label="Sua previsão">
        {prompt.options.map((option, choice) => <button key={option} type="button" className="secondary"
          aria-pressed={value.choice === choice} onClick={() => {setSubmitted(false); onChange({choice, confirmed: false});}}>{option}</button>)}
      </div>
      <button className="secondary" disabled={value.choice === null} onClick={() => {
        setSubmitted(true); onChange({...value, confirmed: value.choice === prompt.answer});
      }}>Conferir previsão</button>
      {submitted && <p role="status" aria-label="Retorno da previsão">Vamos comparar. {prompt.explanation} Escolha novamente quando estiver pronto.</p>}
    </>}
  </section>;
}
