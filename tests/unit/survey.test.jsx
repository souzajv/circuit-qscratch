import React from 'react';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import SurveyDialog from '../../src/learning/SurveyDialog';
import {surveyQuestions} from '../../src/learning/surveys';
afterEach(cleanup);
const click=name=>fireEvent.click(screen.getByRole('button',{name}));
test.each(['before','after'])('questionário %s pergunta uma vez por etapa e aceita Não',async kind=>{
 const submit=jest.fn().mockResolvedValue(),draft=jest.fn();
 render(<SurveyDialog kind={kind} motion persistent onSubmit={submit} onDraft={draft}/>);
 expect(screen.getByText(/vinculadas à sua conta/)).toBeVisible();click(/Quero responder/);
 for(let i=0;i<surveyQuestions[kind].length;i++){
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  expect(screen.getByRole('button',{name:i===surveyQuestions[kind].length-1?/Enviar respostas/:/Próxima/})).toBeDisabled();
  click(kind==='before'&&i===0?'Ensino Médio':'Não');if(i===(kind==='before'?1:0)){click(/Próxima/);click(/Anterior/);expect(screen.getByRole('button',{name:'Não'})).toHaveAttribute('aria-pressed','true');}
  click(i===surveyQuestions[kind].length-1?/Enviar respostas/:/Próxima/);
 }
 await waitFor(()=>expect(submit).toHaveBeenCalledWith(expect.objectContaining({version:2,status:'completed',answers:Object.fromEntries(surveyQuestions[kind].map(q=>[q.id,q.id==='education'?'Ensino Médio':false]))})));
 expect(draft).toHaveBeenCalled();
});
test('falha de gravação mantém respostas e permite nova tentativa; cancelamento não perde dados',async()=>{
 const submit=jest.fn().mockRejectedValueOnce(Error()).mockResolvedValue();
 render(<SurveyDialog kind="before" motion={false} saved={{version:2,answers:{education:'Ensino Médio',heardBefore:true,firstStudy:false,priorCircuit:false,interest:true},index:4}} onSubmit={submit} onDraft={jest.fn()}/>);
 fireEvent(screen.getByRole('dialog'),new Event('cancel',{cancelable:true}));expect(screen.getByRole('dialog')).toBeVisible();
 click(/Enviar respostas/);await screen.findByText(/Não foi possível salvar/);expect(screen.getByRole('button',{name:'Sim'})).toHaveAttribute('aria-pressed','true');click(/Enviar respostas/);await waitFor(()=>expect(submit).toHaveBeenCalledTimes(2));
});
test('pular registra ausência de participação, sem preencher respostas com Não',async()=>{
 const submit=jest.fn().mockResolvedValue();render(<SurveyDialog kind="after" motion={false} onDraft={jest.fn()} onSubmit={submit}/>);
 expect(screen.getByText(/apenas nesta sessão/)).toBeVisible();click(/Pular questionário/);await waitFor(()=>expect(submit).toHaveBeenCalledWith(expect.objectContaining({status:'skipped',answers:{}})));
});


test('rascunho incompleto não pode finalizar pulando a escolaridade',()=>{
 const submit=jest.fn();render(<SurveyDialog kind="before" saved={{version:2,index:4,answers:{interest:true}}} motion={false} onDraft={jest.fn()} onSubmit={submit}/>);
 click(/Enviar respostas/);expect(submit).not.toHaveBeenCalled();expect(screen.getByRole('heading',{name:'Qual é a sua escolaridade?'})).toBeVisible();
});
