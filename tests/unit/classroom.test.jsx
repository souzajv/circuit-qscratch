import React from 'react';
import {render,screen,fireEvent,waitFor,cleanup,act} from '@testing-library/react';
import ClassroomPanel from '../../src/classroom/ClassroomPanel';
import DeleteStudentDialog from '../../src/classroom/DeleteStudentDialog';
import InviteAccess from '../../src/classroom/InviteAccess';
import {classroom} from '../../src/infrastructure/firebase/classroom';
import {signInWithCustomToken} from 'firebase/auth';
jest.mock('../../src/infrastructure/firebase/classroom',()=>({classroom:jest.fn()}));
jest.mock('../../src/infrastructure/firebase/auth',()=>({auth:()=>({app:{}})}));
jest.mock('firebase/auth',()=>({signInWithCustomToken:jest.fn()}));
const student={id:'linked_abc',name:'Sol',ownerUid:'teacher',active:true,surveys:{before:true,after:true}};
const click=name=>fireEvent.click(screen.getByRole('button',{name,exact:true}));
let response;
beforeEach(()=>{
 response={list:{items:[student],cursor:null},accounts:{items:[{id:'teacher',name:'Professora',email:'teacher@example.test',role:'teacher'}],cursor:null},create:{id:'linked_abc',secret:'token'},rotate:{id:'linked_abc',secret:'novo'},settings:{},revoke:{},delete:{},detail:{student,progress:{}},account:{student:{},progress:null},redeem:{token:'custom'}};
 classroom.mockImplementation(async action=>response[action]);Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:jest.fn().mockResolvedValue()}});
});
afterEach(cleanup);
test('consulta substitui listagem, recebe foco e permite voltar; busca filtra sem perder dados',async()=>{
 render(<ClassroomPanel role="admin"/>);await screen.findByText('Professora');
 const search=screen.getByLabelText('Buscar por nome ou e-mail');fireEvent.change(search,{target:{value:'inexistente'}});expect(screen.getByText(/Nenhum resultado para esta busca/)).toBeVisible();
 fireEvent.change(search,{target:{value:'teacher@example'}});expect(screen.getByText('Professora')).toBeVisible();expect(screen.queryByText('Sol')).toBeNull();
 click('Consultar conta');await screen.findByRole('heading',{name:'Consulta de conta'});expect(screen.getByRole('heading',{name:'Consulta de conta'})).toHaveFocus();expect(screen.queryByRole('heading',{name:'Contas da plataforma'})).toBeNull();
 click('Fechar detalhes');expect(screen.getByRole('heading',{name:'Administração'})).toHaveFocus();expect(screen.getByText('Professora')).toBeVisible();
 fireEvent.change(screen.getByLabelText('Buscar por nome ou e-mail'),{target:{value:'Sol'}});expect(screen.getByText('Sol')).toBeVisible();click('Novo acesso');expect(screen.getByLabelText('Nome ou apelido')).toHaveFocus();
});
test('professor cria acesso, copia somente o link retornado e pode ocultá-lo',async()=>{
 render(<ClassroomPanel role="teacher"/>);await screen.findByText('Sol');
 fireEvent.change(screen.getByLabelText('Nome ou apelido'),{target:{value:'Lua'}});fireEvent.click(screen.getByLabelText(/Mostrar formulário antes/));fireEvent.click(screen.getByLabelText(/Mostrar formulário depois/));click('Criar acesso');
 await screen.findByLabelText('Link do aluno');expect(classroom).toHaveBeenCalledWith('create',{name:'Lua',surveys:{before:false,after:false}});
 click('Copiar link');await waitFor(()=>expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('/convite/linked_abc/token')));click('Ocultar link');expect(screen.queryByLabelText('Link do aluno')).toBeNull();
});
test('troca políticas separadamente, renova e revoga link com atualização da lista',async()=>{
 render(<ClassroomPanel role="teacher"/>);await screen.findByText('Sol');
 fireEvent.click(screen.getByLabelText('Formulário pré'));await waitFor(()=>expect(classroom).toHaveBeenCalledWith('settings',{id:student.id,surveys:{before:false,after:true}}));await waitFor(()=>expect(screen.queryByRole('status')).toBeNull());
 fireEvent.click(screen.getByLabelText('Formulário pós'));await waitFor(()=>expect(classroom).toHaveBeenCalledWith('settings',{id:student.id,surveys:{before:true,after:false}}));await waitFor(()=>expect(screen.queryByRole('status')).toBeNull());
 click('Gerar novo link');await screen.findByLabelText('Link do aluno');await waitFor(()=>expect(screen.queryByRole('status')).toBeNull());click('Revogar link');await waitFor(()=>expect(classroom).toHaveBeenCalledWith('revoke',{id:student.id}));await waitFor(()=>expect(screen.queryByLabelText('Link do aluno')).toBeNull());
});
test('detalha erros por bloco e distingue ausência de respostas antigas',async()=>{
 response.detail={student,progress:{current:2,completed:[0],best:{0:8},answerHistory:{a:{id:'a',block:0,question:'Quantos?',selected:'Um',expected:'Dois',correct:false,revision:3},b:{id:'b',block:0,correct:true}},surveys:{before:{status:'completed',answers:{heardBefore:true,firstStudy:false,interest:'Muito'}}}}};
 render(<ClassroomPanel role="teacher"/>);await screen.findByText('Sol');click('Ver progresso');await screen.findByText(/1 de 5 blocos/);expect(screen.getByText(/Resposta: Um/)).toBeInTheDocument();expect(screen.getByText('Sim')).toBeInTheDocument();expect(screen.getByText('Não')).toBeInTheDocument();expect(screen.getByText('Muito')).toBeInTheDocument();click('Fechar detalhes');expect(screen.queryByText(/1 de 5 blocos/)).toBeNull();
});
test('falha não remove aluno, cancelamento preserva, confirmação remove e limpa detalhes',async()=>{
 render(<ClassroomPanel role="teacher"/>);await screen.findByText('Sol');click('Excluir aluno');expect(screen.getByRole('dialog')).toBeVisible();click('Cancelar');expect(screen.queryByRole('dialog')).toBeNull();
 click('Excluir aluno');classroom.mockRejectedValueOnce(Error('Falha de exclusão'));click('Confirmar exclusão');await screen.findAllByText(/Falha de exclusão/);expect(screen.getByRole('dialog')).toBeVisible();
 response.list={items:[],cursor:null};click('Confirmar exclusão');await screen.findByText('Nenhum aluno criado.');expect(screen.queryByRole('dialog')).toBeNull();
});
test('admin pagina contas e alunos, consulta conta sem progresso e identifica vínculo',async()=>{
 response.list={items:[{...student,deleting:true}],cursor:'next'};response.accounts.cursor='accounts-next';
 render(<ClassroomPanel role="admin"/>);await screen.findByText('Professora');expect(screen.getByText('Exclusão pendente')).toBeVisible();
 response.list={items:[],cursor:null};response.accounts={items:[],cursor:null};click('Carregar mais alunos');await waitFor(()=>expect(classroom).toHaveBeenCalledWith('list',{cursor:'next'}));await waitFor(()=>expect(screen.queryByRole('status')).toBeNull());click('Carregar mais contas');await waitFor(()=>expect(classroom).toHaveBeenCalledWith('accounts',{cursor:'accounts-next'}));await waitFor(()=>expect(screen.queryByRole('status')).toBeNull());
 click('Consultar conta');await screen.findByRole('heading',{name:'Aluno',exact:true});expect(screen.getByText(/0 de 5 blocos/)).toBeVisible();
});
test('admin indica vínculo desconhecido e link revogado; falha de carga permite recuperação',async()=>{
 response.list={items:[{...student,ownerUid:'sem-nome',active:false}],cursor:null};response.accounts={items:[{id:'a',name:'Link',role:'linkedStudent'}],cursor:null};classroom.mockRejectedValueOnce(Error('Sem conexão'));
 render(<ClassroomPanel role="admin"/>);await screen.findByRole('alert');click('Tentar carregar novamente');await screen.findByText('Link revogado');expect(screen.getByRole('button',{name:'Revogar link'})).toBeDisabled();
});

test('conta por link é identificada sem endereço de e-mail na administração',async()=>{
 response.accounts={items:[{id:'a',name:'Conta por link',role:'linkedStudent'}],cursor:null};render(<ClassroomPanel role="admin"/>);await screen.findByText('Conta por link');expect(screen.getByText(/Acesso por link/)).toBeVisible();
});
test('cancelamento pelo teclado respeita operação em andamento e restaura foco seguro',()=>{
 const cancel=jest.fn(),confirm=jest.fn();const {rerender,unmount}=render(<DeleteStudentDialog student={student} busy onCancel={cancel} onConfirm={confirm}/>);
 fireEvent(screen.getByRole('dialog'),new Event('cancel',{cancelable:true}));expect(cancel).not.toHaveBeenCalled();
 rerender(<DeleteStudentDialog student={student} busy={false} onCancel={cancel} onConfirm={confirm}/>);fireEvent(screen.getByRole('dialog'),new Event('cancel',{cancelable:true}));expect(cancel).toHaveBeenCalled();unmount();
 const detached=document.createElement('button');document.body.append(detached);detached.focus();const next=render(<DeleteStudentDialog student={student} onCancel={cancel} onConfirm={confirm}/>);detached.remove();next.unmount();
});
test('convite avisa sobre troca de conta e permite tentar novamente após erro',async()=>{
 render(<InviteAccess id="linked_abc" secret="secret"/>);classroom.mockRejectedValueOnce(Error('Link revogado'));click('Entrar pelo meu link');await screen.findByRole('alert');expect(signInWithCustomToken).not.toHaveBeenCalled();
 act(()=>document.querySelector('dotlottie-wc').dispatchEvent(new Event('load')));expect(document.querySelector('.invite-poster')).toBeNull();
 signInWithCustomToken.mockRejectedValueOnce(Error('Falha no provedor'));click('Entrar pelo meu link');await screen.findByText('Falha no provedor');
 // JSDOM não navega; a função real de substituição é conferida no E2E.
 const original=window.location;delete window.location;window.location={replace:jest.fn()};click('Entrar pelo meu link');await waitFor(()=>expect(window.location.replace).toHaveBeenCalledWith('/#/trilha'));window.location=original;
});
