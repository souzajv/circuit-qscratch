import React from 'react';
import {render, screen, fireEvent, act, cleanup} from '@testing-library/react';
import AppComponent from '../../src/app/App';
import SettingsScreen from '../../src/app/screens/SettingsScreen';
test('preferências permitem editar o nome por padrão fora do acesso vinculado',()=>{render(<SettingsScreen name="Sol" heading={{current:null}}/>);expect(screen.getByLabelText('Como posso te chamar?')).toHaveValue('Sol');});
jest.mock('../../src/classroom/ClassroomPanel',()=>({role})=><div>Painel {role}</div>);
const settled={before:{status:'completed',version:3,answers:{education:'Ensino Médio'}},after:{status:'skipped'}};
const App=props=><AppComponent {...props} initial={{...props.initial,surveys:settled}}/>;
// A composição é testada com uma atividade controlada; Lesson tem sua própria suíte.
jest.mock('../../src/learning/Lesson',()=> props => <section><span>Atividade {props.index}</span><button onClick={()=>props.onAnswer({id:'a',correct:false})}>Registrar resposta</button><button onClick={()=>props.onCheckpoint?.({phase:'quiz',errors:2,hint:true})}>Registrar passo</button><button onClick={()=>props.onComplete(8)}>Concluir prática controlada</button><button onClick={()=>props.onComplete(4)}>Repetir sem melhora</button><button onClick={()=>props.transition(()=>{}, {countdown:true})}>Preparar teste controlado</button><button onClick={props.onBack}>Retornar ao mapa</button><button onClick={props.onCertificate}>Abrir conclusão</button></section>);
const click=name=>fireEvent.click(screen.getByRole('button',{name}));
const flush=()=>act(()=>jest.advanceTimersByTime(2000));
beforeEach(()=>{jest.useFakeTimers();window.matchMedia.mockReturnValue({matches:false});});
afterEach(()=>{cleanup();jest.useRealTimers();});
test('acesso por link não oferece saída nem edição do apelido',()=>{
 render(<App role="linkedStudent" onSignOut={jest.fn()} initial={{motion:false}}/>);expect(screen.queryByRole('button',{name:/Sair da conta/})).toBeNull();click('Preferências');expect(screen.queryByLabelText('Como posso te chamar?')).toBeNull();expect(screen.getByLabelText('Animações do mascote')).toBeVisible();
});

test.each(['teacher','admin'])('navegação oferece painel apenas ao papel permitido: %s',role=>{
 const progress=jest.fn();render(<App role={role} onProgress={progress} initial={{motion:false}}/>);click(role==='teacher'?'Meus alunos':'Administração');expect(screen.getByText('Painel '+role)).toBeVisible();expect(screen.getByRole('button',{name:role==='teacher'?'Meus alunos':'Administração'})).toHaveAttribute('aria-current','page');click('Trilhas');click('Vamos começar');click('Registrar resposta');expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({answerHistory:{a:{id:'a',correct:false,block:0}}}));
});
test('preferências e ajuda mantêm navegação e estado ativo',()=>{
 render(<App/>);click('Como funciona');flush();expect(screen.getByRole('button',{name:'Como funciona'})).toHaveAttribute('aria-current','page');
 click('Ir para a trilha');flush();click('Preferências');flush();
 fireEvent.change(screen.getByLabelText('Como posso te chamar?'),{target:{value:'Sol'}});
 expect(screen.queryByLabelText('Escolaridade')).toBeNull();
 fireEvent.click(screen.getByLabelText('Sons de acerto'));fireEvent.click(screen.getByLabelText('Animações do mascote'));
 click('Trilhas');expect(screen.getByText('Sol')).toBeVisible();
 click('Como funciona');click('Ir para a trilha');
 fireEvent.click(screen.getByRole('link',{name:/Circuit/}));
 expect(screen.getByRole('button',{name:'Conheça os qubits: disponível'})).toBeEnabled();
});
test('avança cinco blocos, soma melhores notas e preserva primeira conclusão',()=>{
 render(<App/>);click('Preferências');flush();fireEvent.click(screen.getByLabelText('Animações do mascote'));click('Trilhas');
 for(let i=0;i<5;i++){
   click(i===0?'Vamos começar':'Continuar a trilha');
   expect(screen.getByText('Atividade '+i)).toBeVisible();
   click('Concluir prática controlada');click('Repetir sem melhora');
   if(i===4){click('Abrir conclusão');expect(screen.getByText(/você concluiu/)).toBeVisible();click('Revisar minha trilha');}
   else click('Retornar ao mapa');
   act(()=>jest.advanceTimersByTime(20));
 }
 expect(screen.getByText('40')).toBeVisible();expect(screen.getByText('Você concluiu a trilha!')).toBeVisible();
 click('Revisar a trilha');click('Retornar ao mapa');
 fireEvent.click(screen.getByRole('button',{name:'Descubra o estado de Bell: concluído, refazer'}));click('Concluir prática controlada');click('Abrir conclusão');
 expect(screen.getByText(/Explorador, você concluiu/)).toBeVisible();
});
test('rolagem considera movimento reduzido e transição continua funcionando',()=>{
 window.matchMedia.mockReturnValue({matches:true});render(<App/>);
 click('Vamos começar');flush();click('Concluir prática controlada');click('Retornar ao mapa');flush();act(()=>jest.advanceTimersByTime(20));
 expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({behavior:'auto'}));
});



test('mapa acompanha o próximo bloco com movimento e tolera nó ausente',()=>{
 render(<App/>);click('Vamos começar');flush();click('Concluir prática controlada');click('Retornar ao mapa');flush();act(()=>jest.advanceTimersByTime(30));
 expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({behavior:'smooth'}));
 click('Continuar a trilha');flush();click('Concluir prática controlada');click('Retornar ao mapa');
 // Simula a remoção do mapa entre a confirmação e o próximo frame.
 const original=Element.prototype.querySelectorAll;
 const spy=jest.spyOn(Element.prototype,'querySelectorAll').mockImplementation(function(selector){return selector==='li'?[]:original.call(this,selector);});
 flush();act(()=>jest.advanceTimersByTime(30));spy.mockRestore();expect(screen.getByText('2 de 5 blocos')).toBeVisible();
});


test('composição apresenta a contagem sobre a cortina',()=>{
 render(<App/>);click('Vamos começar');flush();click('Preparar teste controlado');
 act(()=>jest.advanceTimersByTime(1100));expect(screen.getByText('5')).toBeVisible();
 act(()=>jest.advanceTimersByTime(4000));expect(screen.queryByText('Hora de testar sua descoberta!')).toBeNull();
 act(()=>jest.advanceTimersByTime(850));
});

test('estado carregado restaura conta e envia checkpoints sem duplicação',()=>{
 const changed=jest.fn(),retry=jest.fn(),leave=jest.fn();
 const initial={name:'Ana',level:'Ensino Médio',current:1,completed:[0],best:{0:8},first:{name:'Ana',level:'Ensino Médio',date:'ontem'},motion:false,sound:false,attempt:{1:{phase:'quiz'}}};
 const view=render(<App initial={initial} onProgress={changed} saveStatus="Não foi possível salvar. Tentar novamente" onRetry={retry} onSignOut={leave}/>);
 click('Tentar salvar novamente');expect(retry).toHaveBeenCalled();expect(screen.getByRole('button',{name:'Sair da conta'})).toBeDisabled();
 view.rerender(<App initial={initial} onProgress={changed} saveStatus="Progresso salvo na conta" onRetry={retry} onSignOut={leave}/>);
 click('Preferências');expect(screen.getByText(/As preferências são salvas/)).toBeVisible();click('Trilhas');
 click('Sair da conta');expect(leave).toHaveBeenCalled();click('Continuar a trilha');click('Registrar passo');click('Registrar passo');
 expect(changed).toHaveBeenLastCalledWith(expect.objectContaining({attempt:{1:{phase:'quiz',errors:2,hint:true}}}));
 click('Retornar ao mapa');click('Conheça os qubits: concluído, refazer');
});

test('demonstração mantém demais blocos bloqueados após concluir o primeiro',()=>{
 render(<App demo initial={{motion:false}}/>);click('Vamos começar');expect(screen.getByText(/Esta é uma demonstração/)).toBeVisible();expect(screen.queryByText('Atividade 0')).toBeNull();click('Experimentar primeiro bloco');expect(screen.getByText('Atividade 0')).toBeVisible();click('Concluir prática controlada');click('Retornar ao mapa');const locked=screen.getByRole('button',{name:/Observe uma medição.*bloqueado/});fireEvent.click(locked);expect(screen.getByRole('button',{name:/Criar minha conta/})).toBeVisible();expect(screen.queryByText('Atividade 1')).toBeNull();click('Continuar explorando');click('Continuar a trilha');click('Experimentar primeiro bloco');expect(screen.getByText('Atividade 0')).toBeVisible();
});

test('menu móvel abre conta e fecha por Escape',()=>{render(<App initial={{motion:false}}/>);const toggle=screen.getByRole('button',{name:'Abrir menu'});fireEvent.click(toggle);expect(screen.getByRole('button',{name:'Fechar menu'})).toHaveAttribute('aria-expanded','true');fireEvent.keyDown(screen.getByRole('button',{name:'Fechar menu'}),{key:'Escape'});expect(screen.getByRole('button',{name:'Abrir menu'})).toHaveAttribute('aria-expanded','false');});

test('menu fecha ao escolher navegação e bloqueio da demo encaminha cadastro',()=>{render(<App demo initial={{motion:false}}/>);fireEvent.keyDown(screen.getByRole('button',{name:'Abrir menu'}),{key:'Tab'});click('Abrir menu');click('Preferências');expect(screen.getByRole('button',{name:'Abrir menu'})).toHaveAttribute('aria-expanded','false');click('Trilhas');click('Observe uma medição: bloqueado');click('Criar minha conta');expect(window.location.hash).toBe('#/criar-conta');window.location.hash='';});

test('sair da demonstração retorna à landingpage',()=>{window.location.hash='/demo';render(<App demo initial={{motion:false}}/>);click('Sair');expect(window.location.hash).toBe('#/');window.location.hash='';});
