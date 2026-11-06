import React from 'react';
import {render, screen, fireEvent, act, cleanup} from '@testing-library/react';
import Lesson from '../../src/learning/Lesson';
import {QUIZ_SUCCESS_DELAY_MS} from '../../src/shared/config/experience.cjs';
import {blocks,getQuestions,CONTENT_REVISION} from '../../src/learning/content';
jest.mock('../../src/shared/ui/Mascot',()=>()=> <div data-testid="mascot"/>);
const props = index=>({block:blocks[index],index,level:'Fundamental Anos Finais',name:'Sol',motion:false,transition:action=>action(),onComplete:jest.fn(),onBack:jest.fn(),onCertificate:jest.fn(),play:jest.fn()});
const click = name=>{if(String(name).includes('Próxima pergunta')||String(name).includes('Experimentar no circuito'))act(()=>jest.advanceTimersByTime(QUIZ_SUCCESS_DELAY_MS));fireEvent.click(screen.getByRole('button',{name}));};
function finishQuestions(index, firstAnswered=false){
 getQuestions(blocks[index],'Fundamental Anos Finais').forEach((question,i)=>{
  if(!firstAnswered || i>0){fireEvent.click(screen.getByRole('radio',{name:question.options[question.answer],exact:true}));click('Conferir resposta');}
  if(i<2)click('Próxima pergunta');
 });
}
function quiz(index){while(screen.queryByRole('button',{name:/Próximo/}))click(/Próximo/);click(/Iniciar teste/);finishQuestions(index);}
beforeEach(()=>jest.useFakeTimers());
afterEach(()=>{cleanup();jest.useRealTimers();});
test.each([0,1,2,3,4])('bloco %s exige quiz e sua própria ação prática',index=>{
 const p=props(index);render(<Lesson {...p}/>);
 expect(screen.queryByRole('radio')).toBeNull();quiz(index);expect(p.onComplete).not.toHaveBeenCalled();click(/Experimentar no circuito/);
 if(index===0){click(/Qubit/);click('Encaixe do primeiro qubit');expect(p.onComplete).not.toHaveBeenCalled();click(/Qubit/);click('Encaixe do segundo qubit');fireEvent.click(screen.getByRole('button',{name:'Encaixe do segundo qubit'}));}
 if(index===2){click(/H · Hadamard/);click('Primeira posição do qubit de cima');expect(screen.queryByRole('button',{name:/baixo/})).toBeNull();}
 if(index===3){const dataTransfer={getData:()=> 'H',dropEffect:''};const target=screen.getByRole('button',{name:/CNOT depois/});fireEvent.dragOver(target,{dataTransfer});fireEvent.drop(target,{dataTransfer});expect(p.onComplete).not.toHaveBeenCalled();click(/CNOT$/);fireEvent.drop(target,{dataTransfer:{getData:()=> 'CNOT'}});}
 if(index===1||index===4){const target=screen.getByRole('button',{name:'Medir circuito preparado'});fireEvent.mouseEnter(target);fireEvent.focus(target);fireEvent.click(target);expect(p.onComplete).toHaveBeenCalledTimes(1);click('Preparar outra rodada');fireEvent.click(target);click('Ver missão concluída');}
 expect(p.onComplete).toHaveBeenCalledTimes(1);expect(screen.getByText('Missão concluída!')).toBeVisible();
 fireEvent.click(screen.getAllByRole('button',{name:index===4?/Ver minha conclusão/:/^Voltar à trilha$/}).at(-1));expect(index===4?p.onCertificate:p.onBack).toHaveBeenCalled();
});
test('falas, retorno, dica e erro afetam a nota sem bloquear nova tentativa',()=>{
 const p=props(0);render(<Lesson {...p} name=""/>);click(/Próximo/);click(/Anterior/);click(/Voltar à trilha/);expect(p.onBack).toHaveBeenCalled();
 while(screen.queryByRole('button',{name:/Próximo/}))click(/Próximo/);click(/Iniciar teste/);
 expect(screen.getByRole('button',{name:'Conferir resposta'})).toBeDisabled();click(/Ver dica/);fireEvent.click(screen.getByRole('radio',{name:'Um qubit',exact:true}));click('Conferir resposta');expect(screen.getByText(/Ainda não/)).toBeVisible();
 fireEvent.click(screen.getByRole('radio',{name:'Dois qubits',exact:true}));click('Conferir resposta');finishQuestions(0,true);click(/Experimentar no circuito/);
 click('Encaixe do primeiro qubit');expect(screen.getByText(/Selecione uma peça/)).toBeVisible();
 const piece=screen.getByRole('button',{name:/Qubit/});const setData=jest.fn();fireEvent.dragStart(piece,{dataTransfer:{setData}});expect(setData).toHaveBeenCalledWith('text/plain','qubit');
 const target=screen.getByRole('button',{name:'Encaixe do primeiro qubit'});fireEvent.drop(target,{dataTransfer:{getData:()=> 'qubit'}});fireEvent.drop(target,{dataTransfer:{getData:()=> 'qubit'}});
 click(/Qubit/);click('Encaixe do segundo qubit');expect(p.onComplete).toHaveBeenCalledWith(6);
});
test.each([2,3])('arrastar porta e rejeitar peça estranha no bloco %s',index=>{
 const p=props(index);render(<Lesson {...p} level="Ensino Médio" motion/>);quiz(index);click(/Experimentar no circuito/);
 const piece=screen.getByRole('button',{name:index===2?/Hadamard/:/CNOT$/});const setData=jest.fn();fireEvent.dragStart(piece,{dataTransfer:{setData}});
 const target=screen.getByRole('button',{name:index===2?'Primeira posição do qubit de cima':/CNOT depois/});fireEvent.drop(target,{dataTransfer:{getData:()=> 'invasor'}});expect(p.onComplete).not.toHaveBeenCalled();
 fireEvent.drop(target,{dataTransfer:{getData:()=>index===2?'H':'CNOT'}});expect(p.onComplete).toHaveBeenCalledWith(10);
});


test.each([false,true])('rolagem da confirmação respeita movimento %s',motion=>{
 jest.useFakeTimers();const p=props(2);render(<Lesson {...p} motion={motion}/>);quiz(2);
 act(()=>jest.advanceTimersByTime(30));
 expect(screen.queryByLabelText('Resultado do teste')).toBeNull();
 click(/Experimentar no circuito/);const target=screen.getByRole('button',{name:'Primeira posição do qubit de cima'});
 fireEvent.drop(target,{dataTransfer:{getData:()=> 'H'}});act(()=>jest.advanceTimersByTime(30));
 fireEvent.drop(target,{dataTransfer:{getData:()=> 'H'}});expect(p.onComplete).toHaveBeenCalledTimes(1);
 jest.useRealTimers();
});
test('checkpoint de página antiga permanece dentro das páginas válidas',()=>{
 render(<Lesson {...props(0)} saved={{page:999,quizIndex:999}}/>);
 expect(screen.queryByRole('radio')).toBeNull();
});

test('retoma fase, descontos e montagem sem repetir a medição concluída',()=>{
 const onCheckpoint=jest.fn();
 const saved={phase:'practice',page:1,choice:0,correct:true,errors:2,hint:true,slots:[],measured:'00',finished:true};
 render(<Lesson {...props(4)} saved={saved} onCheckpoint={onCheckpoint}/>);
 expect(onCheckpoint).toHaveBeenCalledWith({...saved,quizIndex:0,questionHint:false,contentRevision:CONTENT_REVISION});
});

test('revisão mantém erros, dica e pergunta atual; prática só aparece após três acertos',()=>{
 const p=props(0);render(<Lesson {...p}/>);
 while(screen.queryByRole('button',{name:/Próximo/}))click(/Próximo/);click(/Iniciar teste/);
 click(/Ver dica/);click('Rever explicação sem apagar esta tentativa');
 expect(screen.getByRole('heading',{name:'Uma informação de cada vez'})).toHaveFocus();
 while(screen.queryByRole('button',{name:/Próximo/}))click(/Próximo/);click(/Iniciar teste/);
 expect(screen.getByRole('button',{name:/Ver dica/})).toBeDisabled();
 fireEvent.click(screen.getByRole('radio',{name:'Dois qubits',exact:true}));click('Conferir resposta');expect(screen.queryByRole('button',{name:/Experimentar no circuito/})).toBeNull();click('Próxima pergunta');
 expect(screen.getByText('Pergunta 2 de 3')).toBeVisible();expect(screen.getByRole('button',{name:/Ver dica/})).toHaveTextContent('sem novo desconto');
});
test('checkpoint retoma segunda pergunta e retorno específico depois do acerto',()=>{
 render(<Lesson {...props(0)} saved={{phase:'quiz',quizIndex:1,correct:true,choice:0,errors:1,hint:true,questionHint:true}}/>);
 expect(screen.getByText('Pergunta 2 de 3')).toBeVisible();expect(screen.getByText(/As duas preparações em 0/)).toBeVisible();click('Próxima pergunta');
 expect(screen.getByText('Pergunta 3 de 3')).toBeVisible();
});


test('botão confirma, celebra e permite avançar no mesmo lugar após o intervalo',()=>{
 const p=props(0);render(<Lesson {...p} saved={{phase:'quiz'}}/>);
 const button=screen.getByRole('button',{name:'Conferir resposta'});
 fireEvent.click(screen.getByRole('radio',{name:'Dois qubits',exact:true}));fireEvent.click(button);
 expect(button).toHaveTextContent('Resposta correta!');expect(button).toBeDisabled();
 expect(screen.queryByLabelText('Resultado do teste')).toBeNull();
 act(()=>jest.advanceTimersByTime(QUIZ_SUCCESS_DELAY_MS-1));expect(button).toHaveTextContent('Resposta correta!');
 act(()=>jest.advanceTimersByTime(1));expect(button).toHaveTextContent('Próxima pergunta');expect(button).not.toBeDisabled();
 fireEvent.click(button);expect(screen.getByText('Pergunta 2 de 3')).toBeVisible();expect(button).toHaveTextContent('Conferir resposta');
});


test('fecha e reabre a conquista sem creditar a prática outra vez',()=>{
 const p=props(0);render(<Lesson {...p} saved={{phase:'practice',finished:true}}/>);
 expect(screen.getByRole('dialog')).toBeVisible();click('Continuar explorando');expect(screen.queryByRole('dialog')).toBeNull();
 click('Ver missão concluída');expect(screen.getByRole('dialog')).toBeVisible();expect(p.onComplete).not.toHaveBeenCalled();
});
