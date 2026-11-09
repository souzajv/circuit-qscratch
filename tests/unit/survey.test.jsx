import React from 'react';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import SurveyDialog from '../../src/learning/SurveyDialog';
import {surveyQuestions,SURVEY_VERSION,SURVEY_COMMENT_LIMIT,isSurveyAnswerValid} from '../../src/learning/surveys';
afterEach(cleanup);
const click=name=>fireEvent.click(screen.getByRole('button',{name}));
const full=kind=>Object.fromEntries(surveyQuestions[kind].map(q=>[q.id,q.type==='text'?'':q.options?q.options[0]:false]));
test.each(['before','after'])('formulário %s aceita escalas, Não, Não sei e comentário sem pontos',async kind=>{
 const submit=jest.fn().mockResolvedValue(),draft=jest.fn();render(<SurveyDialog kind={kind} motion persistent onSubmit={submit} onDraft={draft}/>);
 expect(screen.getByText(/vinculadas à sua conta/)).toBeVisible();click(/Quero responder/);
 const answers={};
 for(let i=0;i<surveyQuestions[kind].length;i++){
  const q=surveyQuestions[kind][i];expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  if(!q.optional)expect(screen.getByRole('button',{name:i===surveyQuestions[kind].length-1?/Enviar respostas/:/Próxima/})).toBeDisabled();
  if(q.type==='text'){fireEvent.change(screen.getByRole('textbox'),{target:{value:'Mais exemplos'}});answers[q.id]='Mais exemplos';}
  else{const value=q.options?(q.type==='knowledge'?'Não sei ainda':q.options[0]):false;click(q.options?value:'Não');answers[q.id]=value;}
  if(i===1){click(/Próxima/);click(/Anterior/);expect(screen.getByRole('heading')).toHaveTextContent(q.text);}
  click(i===surveyQuestions[kind].length-1?/Enviar respostas/:/Próxima/);
 }
 await waitFor(()=>expect(submit).toHaveBeenCalledWith(expect.objectContaining({version:SURVEY_VERSION,status:'completed',answers})));expect(draft).toHaveBeenCalled();
});
test('falha de gravação mantém respostas; cancelamento não fecha',async()=>{
 const submit=jest.fn().mockRejectedValueOnce(Error()).mockResolvedValue();render(<SurveyDialog kind="before" motion={false} saved={{version:SURVEY_VERSION,answers:full('before'),index:surveyQuestions.before.length-1}} onSubmit={submit} onDraft={jest.fn()}/>);
 fireEvent(screen.getByRole('dialog'),new Event('cancel',{cancelable:true}));click(/Enviar respostas/);await screen.findByText(/Não foi possível salvar/);expect(screen.getByRole('dialog')).toBeVisible();click(/Enviar respostas/);await waitFor(()=>expect(submit).toHaveBeenCalledTimes(2));
});
test('pular o pós não gera respostas falsas',async()=>{const submit=jest.fn().mockResolvedValue();render(<SurveyDialog kind="after" motion={false} onDraft={jest.fn()} onSubmit={submit}/>);expect(screen.getByText(/apenas nesta sessão/)).toBeVisible();click(/Pular questionário/);await waitFor(()=>expect(submit).toHaveBeenCalledWith(expect.objectContaining({status:'skipped',answers:{}})));});
test('rascunho incompleto não pode finalizar omitindo escolaridade',()=>{const submit=jest.fn();render(<SurveyDialog kind="before" saved={{version:SURVEY_VERSION,index:surveyQuestions.before.length-1,answers:{hadamardRole:'Não sei ainda'}}} motion={false} onDraft={jest.fn()} onSubmit={submit}/>);click(/Enviar respostas/);expect(submit).not.toHaveBeenCalled();expect(screen.getByRole('heading')).toHaveTextContent('Qual é a sua escolaridade?');});
test('comentário em branco é opcional e tem limite',async()=>{const submit=jest.fn().mockResolvedValue();render(<SurveyDialog kind="after" motion={false} saved={{version:SURVEY_VERSION,index:surveyQuestions.after.length-1,answers:full('after')}} onSubmit={submit} onDraft={jest.fn()}/>);expect(screen.getByRole('textbox')).toHaveAttribute('maxlength',String(SURVEY_COMMENT_LIMIT));click(/Enviar respostas/);await waitFor(()=>expect(submit).toHaveBeenCalled());expect(isSurveyAnswerValid(surveyQuestions.after.at(-1),'x'.repeat(SURVEY_COMMENT_LIMIT+1))).toBe(false);expect(isSurveyAnswerValid(surveyQuestions.after.at(-1),false)).toBe(false);});
test('rascunhos antigos reiniciam sem reinterpretar respostas',()=>{render(<SurveyDialog kind="before" saved={{version:2,index:4,answers:{interest:true}}} motion={false} onDraft={jest.fn()} onSubmit={jest.fn()}/>);click(/Quero responder/);expect(screen.getByRole('heading')).toHaveTextContent('Qual é a sua escolaridade?');});

test('versão atual sem respostas inicia vazia',()=>{render(<SurveyDialog kind="before" saved={{version:SURVEY_VERSION}} motion={false} onDraft={jest.fn()} onSubmit={jest.fn()}/>);click(/Quero responder/);expect(screen.getByRole('button',{name:/Próxima/})).toBeDisabled();});
