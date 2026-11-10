import React from 'react';
jest.mock('../../src/infrastructure/firebase/classroom',()=>({classroom:jest.fn().mockResolvedValue({role:'student'})}));
import {render,screen,fireEvent,act,waitFor,cleanup} from '@testing-library/react';
import AccountTrail from '../../src/public/AccountTrail';
import {watchAccount,logout} from '../../src/infrastructure/firebase/auth';
import {loadProgress,saveProgress} from '../../src/infrastructure/firebase/progress';
jest.mock('../../src/infrastructure/firebase/auth',()=>({watchAccount:jest.fn(),logout:jest.fn()}));
jest.mock('../../src/infrastructure/firebase/progress',()=>({loadProgress:jest.fn(),saveProgress:jest.fn()}));
jest.mock('../../src/app/App',()=>function Fake({initial,onProgress,saveStatus,onRetry,onSignOut,onSurveySave}){return <><p>{initial.name}</p><p>{saveStatus}</p><button onClick={()=>onProgress({best:{0:8},completed:[0]})}>Avançar</button><button onClick={onRetry}>Repetir</button><button onClick={onSignOut}>Sair</button><button onClick={()=>onSurveySave("before",{status:"completed",answers:{interest:true}}).catch(()=>{})}>Salvar pesquisa</button></>;});
afterEach(()=>{cleanup();jest.useRealTimers();});
test('espera sessão, oferece login e carrega somente a conta atual',async()=>{
 let observer;watchAccount.mockImplementation(cb=>{observer=cb;return jest.fn();});
 render(<AccountTrail/>);expect(screen.getByText(/Carregando sua conta/)).toBeVisible();act(()=>observer(null));expect(screen.getByRole('link',{name:'Entrar'})).toBeVisible();
 loadProgress.mockResolvedValueOnce({});act(()=>observer({uid:'a',displayName:'João'}));await screen.findByText('João');expect(loadProgress).toHaveBeenCalledWith('a');
 fireEvent.click(screen.getByText('Sair'));await waitFor(()=>expect(logout).toHaveBeenCalled());
});
test('falha de leitura não apaga dados; permite tentar novamente e salvar',async()=>{
 jest.useFakeTimers();watchAccount.mockImplementation(cb=>{cb({uid:'a'});return jest.fn();});loadProgress.mockRejectedValueOnce(Error()).mockResolvedValueOnce({name:'Ana'});
 render(<AccountTrail/>);await screen.findByText(/dados não foram substituídos/);fireEvent.click(screen.getByText('Tentar novamente'));await screen.findByText('Ana');
 saveProgress.mockRejectedValueOnce(Error()).mockResolvedValueOnce();fireEvent.click(screen.getByText('Avançar'));act(()=>jest.advanceTimersByTime(300));await screen.findByText(/Não foi possível salvar/);fireEvent.click(screen.getByText('Repetir'));act(()=>jest.advanceTimersByTime(300));await screen.findByText('Progresso salvo na conta');expect(saveProgress).toHaveBeenCalledWith('a',{best:{0:8},completed:[0]});
});

test('ignora leitura tardia de outra conta e mantém estado de gravações novas',async()=>{
 jest.useFakeTimers();let observer,read,write;
 watchAccount.mockImplementation(cb=>{observer=cb;return jest.fn();});
 loadProgress.mockImplementationOnce(()=>new Promise(resolve=>{read=resolve;})).mockResolvedValue({});
 render(<AccountTrail/>);act(()=>observer({uid:'old'}));act(()=>observer({uid:'new'}));await screen.findByText('Explorador');await act(async()=>read({name:'Conta anterior'}));expect(screen.queryByText('Conta anterior')).toBeNull();
 saveProgress.mockImplementationOnce(()=>new Promise(resolve=>{write=resolve;})).mockResolvedValue();
 fireEvent.click(screen.getByText('Avançar'));act(()=>jest.advanceTimersByTime(300));await act(async()=>{});
 fireEvent.click(screen.getByText('Avançar'));await act(async()=>write());expect(screen.getByText('Salvando progresso...')).toBeVisible();act(()=>jest.advanceTimersByTime(300));await screen.findByText('Progresso salvo na conta');
});

test('falha de gravação antiga não sobrescreve o estado de uma nova gravação',async()=>{
 jest.useFakeTimers();let fail;
 watchAccount.mockImplementation(cb=>{cb({uid:'a'});return jest.fn();});loadProgress.mockResolvedValue({name:'Ana'});
 render(<AccountTrail/>);await screen.findByText('Ana');saveProgress.mockImplementationOnce(()=>new Promise((resolve,reject)=>{fail=reject;})).mockResolvedValueOnce();
 fireEvent.click(screen.getByText('Avançar'));act(()=>jest.advanceTimersByTime(300));await act(async()=>{});
 fireEvent.click(screen.getByText('Avançar'));await act(async()=>fail(Error()));expect(screen.getByText('Salvando progresso...')).toBeVisible();act(()=>jest.advanceTimersByTime(300));await screen.findByText('Progresso salvo na conta');
});

test.each([{motion:false}, {motion:true}])('respeita preferências de movimento ao abrir a conta: %j',async state=>{
 const {gsap}=require('gsap');gsap.fromTo.mockClear();
 window.matchMedia.mockReturnValue({matches:state.motion});
 watchAccount.mockImplementation(cb=>{cb({uid:'movement'});return jest.fn();});
 loadProgress.mockResolvedValue({name:'Movimento',...state});
 render(<AccountTrail/>);await screen.findByText('Movimento');
 expect(gsap.fromTo).not.toHaveBeenCalled();
 window.matchMedia.mockReturnValue({matches:false});
});


test.each([false,true])('salva pesquisa serialmente e informa falha: %s',async fail=>{
 watchAccount.mockImplementation(cb=>{cb({uid:'survey'});return jest.fn();});loadProgress.mockResolvedValue({});
 saveProgress.mockImplementation(()=>fail?Promise.reject(Error()):Promise.resolve());
 render(<AccountTrail/>);await screen.findByText('Explorador');fireEvent.click(screen.getByText('Avançar'));fireEvent.click(screen.getByText('Salvar pesquisa'));
 await screen.findByText(fail?'Não foi possível salvar. Tentar novamente':'Progresso salvo na conta');
 await waitFor(()=>expect(saveProgress).toHaveBeenCalledWith('survey',expect.objectContaining({surveys:{before:{status:'completed',answers:{interest:true}}}})));
 if(fail){saveProgress.mockResolvedValueOnce();fireEvent.click(screen.getByText('Salvar pesquisa'));await screen.findByText('Progresso salvo na conta');}
});
test.each([false,true])('resposta de pesquisa antiga não substitui status mais novo: %s',async fail=>{
 jest.useFakeTimers();let resolve,reject;watchAccount.mockImplementation(cb=>{cb({uid:'survey'});return jest.fn();});loadProgress.mockResolvedValue({});
 saveProgress.mockImplementationOnce(()=>new Promise((a,b)=>{resolve=a;reject=b;})).mockResolvedValue();
 render(<AccountTrail/>);await screen.findByText('Explorador');fireEvent.click(screen.getByText('Avançar'));fireEvent.click(screen.getByText('Salvar pesquisa'));await act(async()=>{});
 fireEvent.click(screen.getByText('Avançar'));await act(async()=>fail?reject(Error()):resolve());
 expect(screen.getByText('Salvando progresso...')).toBeVisible();act(()=>jest.advanceTimersByTime(300));await screen.findByText('Progresso salvo na conta');
});
