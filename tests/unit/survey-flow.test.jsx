import React from 'react';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import App from '../../src/app/App';
jest.mock('../../src/learning/Lesson',()=>p=><><span>Bloco {p.index}</span><button onClick={()=>p.onComplete(10)}>Concluir</button><button onClick={p.onCertificate}>Certificado</button><button onClick={p.onBack}>Mapa</button></>);
afterEach(cleanup);const click=n=>fireEvent.click(screen.getByRole('button',{name:n}));
test('questionário inicial precede explicação, salva vinculado e não se repete',async()=>{
 const save=jest.fn().mockResolvedValue(),progress=jest.fn();render(<App initial={{motion:false}} onProgress={progress} onSurveySave={save}/>);
 click('Vamos começar');expect(screen.queryByText('Bloco 0')).toBeNull();click(/Quero responder/);
 for(let i=0;i<5;i++){click(i===0?'Ensino Médio':i===1?'Sim':'Não');click(i===4?/Enviar respostas/:/Próxima/);}
 await screen.findByText('Bloco 0');expect(save).toHaveBeenCalledWith('before',expect.objectContaining({status:'completed',answers:{education:'Ensino Médio',heardBefore:true,firstStudy:false,priorCircuit:false,interest:false}}));
 click('Mapa');click('Vamos começar');expect(screen.getByText('Bloco 0')).toBeVisible();
});
test.each(['Certificado','Mapa'])('questionário final aparece ao sair da missão via %s, sem bloquear conquista',async action=>{
 const save=jest.fn().mockRejectedValueOnce(Error()).mockResolvedValue();render(<App initial={{motion:false,completed:[0,1,2,3]}} onSurveySave={save}/>);
 click('Continuar a trilha');click('Concluir');click(action);expect(screen.getByRole('dialog')).toBeVisible();click(/Pular questionário/);
 await screen.findByText(/Não foi possível salvar/);click(/Pular questionário/);await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());
 expect(save).toHaveBeenLastCalledWith('after',expect.objectContaining({status:'skipped',answers:{}}));
});

test('inicial é obrigatório mesmo na demonstração',()=>{render(<App/>);click('Vamos começar');expect(screen.queryByRole('button',{name:/Pular questionário/})).toBeNull();});
