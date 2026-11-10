import React from 'react';
jest.mock('../../src/infrastructure/firebase/classroom',()=>({classroom:jest.fn().mockResolvedValue({role:'student'})}));
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import AccessPage from '../../src/public/AccessPage';
import {login,register,resetPassword} from '../../src/infrastructure/firebase/auth';
jest.mock('../../src/infrastructure/firebase/auth',()=>({login:jest.fn(),register:jest.fn(),resetPassword:jest.fn(),accessError:()=> 'Falha no acesso'}));
afterEach(cleanup);

test('perfil professor é escolhido no cadastro e falha da API permite concluir sem duplicar conta',async()=>{
 const {classroom}=require('../../src/infrastructure/firebase/classroom');classroom.mockRejectedValueOnce(Error('Indisponível')).mockResolvedValue({role:'teacher'});register.mockClear();register.mockResolvedValue({});
 render(<AccessPage/>);fireEvent.click(screen.getByRole('button',{name:'Criar conta',exact:true}));fireEvent.click(screen.getByRole('button',{name:'Sou professor'}));fireEvent.click(screen.getByRole('button',{name:'Sou aluno'}));fireEvent.click(screen.getByRole('button',{name:'Sou professor'}));fill();fireEvent.change(screen.getByLabelText('Nome ou apelido'),{target:{value:'Professora'}});fireEvent.change(screen.getByLabelText('Confirmar senha'),{target:{value:'senha1234'}});
 fireEvent.click(screen.getByRole('button',{name:'Criar minha conta'}));await screen.findByText('Falha no acesso');fireEvent.click(screen.getByRole('button',{name:'Criar minha conta'}));await waitFor(()=>expect(classroom).toHaveBeenLastCalledWith('profile',{role:'teacher'}));await waitFor(()=>expect(screen.getByLabelText('Senha',{exact:true})).toHaveValue(''));expect(register).toHaveBeenCalledTimes(1);
});
const fill = () => {fireEvent.change(screen.getByLabelText('E-mail'),{target:{value:'teste@example.com'}});fireEvent.change(screen.getByLabelText('Senha',{exact:true}),{target:{value:'senha1234'}});};
test('login aguarda confirmação do provedor, trata erro e permite nova tentativa',async()=>{
 let finish;login.mockImplementationOnce(()=>new Promise(resolve=>{finish=resolve;}));
 render(<AccessPage/>);fill();const form=screen.getByRole('button',{name:'Entrar na trilha'}).closest('form');fireEvent.submit(form);fireEvent.submit(form);
 expect(login).toHaveBeenCalledTimes(1);expect(screen.getByText('Aguarde...')).toBeDisabled();finish({});await waitFor(()=>expect(window.location.hash).toBe('#/trilha'));
 login.mockRejectedValueOnce(Error());fill();fireEvent.submit(form);await screen.findByText('Falha no acesso');
});
test('cadastro verifica confirmação e alternância limpa senhas',async()=>{
 render(<AccessPage/>);fireEvent.click(screen.getByRole('button',{name:'Entrar',exact:true}));fireEvent.click(screen.getByRole('button',{name:'Criar conta',exact:true}));fireEvent.click(screen.getByRole('button',{name:'Criar conta',exact:true}));fill();fireEvent.change(screen.getByLabelText('Nome ou apelido'),{target:{value:'João'}});
 const form=screen.getByRole('button',{name:'Criar minha conta'}).closest('form');fireEvent.submit(form);expect(screen.getByText('As senhas precisam ser iguais.')).toBeVisible();
 fireEvent.change(screen.getByLabelText('Confirmar senha'),{target:{value:'senha1234'}});register.mockResolvedValueOnce({});fireEvent.submit(form);await waitFor(()=>expect(register).toHaveBeenCalledWith('João','teste@example.com','senha1234'));
 await waitFor(()=>expect(screen.getByLabelText('Senha',{exact:true})).toHaveValue(''));
 fireEvent.click(screen.getByRole('button',{name:'Entrar',exact:true}));
 expect(screen.queryByLabelText('Confirmar senha')).toBeNull();
});
test('recuperação valida e-mail, confirma solicitação e trata falha',async()=>{
 render(<AccessPage/>);const recover=screen.getByRole('button',{name:'Esqueci minha senha'});fireEvent.click(recover);expect(screen.getByText(/Preencha um e-mail válido/)).toBeVisible();
 fireEvent.change(screen.getByLabelText('E-mail'),{target:{value:'errado'}});fireEvent.click(recover);
 fill();resetPassword.mockResolvedValueOnce();fireEvent.click(recover);await screen.findByText(/Se houver uma conta/);
 resetPassword.mockRejectedValueOnce(Error());fireEvent.click(recover);await screen.findByText('Falha no acesso');
});

test('permite conferir a senha e volta a ocultá-la ao trocar de modo',()=>{
 render(<AccessPage/>);fill();
 fireEvent.click(screen.getByRole('button',{name:'Mostrar senha'}));
 expect(screen.getByLabelText('Senha',{exact:true})).toHaveAttribute('type','text');
 fireEvent.click(screen.getByRole('button',{name:'Ocultar senha'}));
 expect(screen.getByLabelText('Senha',{exact:true})).toHaveAttribute('type','password');
 fireEvent.click(screen.getByRole('button',{name:'Mostrar senha'}));
 fireEvent.click(screen.getByRole('button',{name:'Criar conta',exact:true}));
 expect(screen.getByLabelText('Senha',{exact:true})).toHaveAttribute('type','password');
 fireEvent.click(screen.getByRole('button',{name:'Mostrar senha'}));
 expect(screen.getByLabelText('Confirmar senha')).toHaveAttribute('type','text');
});

test('apelido aceita til e composição de acentos; espaços são validados somente no envio',()=>{
 render(<AccessPage/>);fireEvent.click(screen.getByRole('button',{name:'Criar conta',exact:true}));
 const input=screen.getByLabelText('Nome ou apelido');
 expect(input).not.toHaveAttribute('pattern');
 fireEvent.compositionStart(input);fireEvent.change(input,{target:{value:'~'}});fireEvent.compositionEnd(input,{data:'~'});
 expect(input).toHaveValue('~');
 fireEvent.compositionStart(input);fireEvent.change(input,{target:{value:'João ~ Ã õ'}});fireEvent.compositionEnd(input,{data:'õ'});
 expect(input).toHaveValue('João ~ Ã õ');
 fireEvent.change(input,{target:{value:'   '}});
 fireEvent.submit(screen.getByRole('button',{name:'Criar minha conta'}).closest('form'));
 expect(screen.getByText('Informe seu nome ou apelido.')).toBeVisible();
});
