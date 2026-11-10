import React from 'react';
import {render, screen, fireEvent, act, cleanup} from '@testing-library/react';
import PublicRouter from '../../src/public/PublicRouter';
import {blocks} from '../../src/learning/content';

jest.mock('../../src/infrastructure/firebase/auth', () => ({login:jest.fn(),register:jest.fn(),resetPassword:jest.fn(),accessError:()=> 'Falha no acesso'}));
jest.mock('../../src/public/AccountTrail', () => () => <main>Trilha interna</main>);
jest.mock('../../src/app/App', () => () => <main>Trilha interna</main>);

beforeEach(() => {window.history.replaceState(null, '', '/');});
afterEach(cleanup);

test('rota de convite reconhece identificador e segredo válidos',()=>{
 window.history.replaceState(null,'','/#/convite/linked_abc/'+ 'a'.repeat(64));render(<PublicRouter/>);expect(screen.getByRole('button',{name:'Entrar pelo meu link'})).toBeVisible();
});

const navigate = hash => act(() => {
    window.history.replaceState(null, '', hash);
    window.dispatchEvent(new Event('hashchange'));
});

test('apresentação tem duas seções, imagem real e caminhos explícitos para acesso', () => {
    const {container} = render(<PublicRouter/>);
    expect(container.querySelectorAll('main>section')).toHaveLength(2);
    expect(screen.getByRole('heading', {level:1})).toHaveTextContent('Descubra aquântica.');
    expect(screen.getByRole('img')).toHaveAttribute('src', 'preview.jpg');
    expect(screen.queryByRole('link', {name:'Fazer login'})).toBeNull();
    expect(screen.getAllByRole('link', {name:'Entrar'})[0]).toHaveAttribute('href', '#/entrar');
    expect(screen.getByRole('link', {name:'Conhecer a demonstração'})).toHaveAttribute('href', '#/demo');
    navigate('#como-aprendemos');
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', {level:2, name:'Cada ideia vira uma peça.'})).toHaveTextContent('Cada ideia vira uma peça.');
});

test('prévia usa conteúdo da trilha, aceita tentativa errada e confirma o acerto', () => {
    render(<PublicRouter/>);
    fireEvent.click(screen.getByRole('button', {name:'Perguntar'}));
    const block = blocks[2];
    expect(screen.getByText(block.question)).toBeVisible();
    fireEvent.click(screen.getByRole('button', {name:block.options[(block.answer + 1) % block.options.length]}));
    expect(screen.getByText(/Tente outra vez/)).toBeVisible();
    fireEvent.click(screen.getByRole('button', {name:block.options[block.answer]}));
    expect(screen.getByText(block.feedback)).toBeVisible();
    expect(screen.getByRole('button', {name:block.options[block.answer]})).toHaveAttribute('aria-pressed','true');
    fireEvent.click(screen.getByRole('button', {name:'Praticar'}));
    expect(screen.getByRole('link', {name:/Experimentar a trilha completa/})).toHaveAttribute('href','#/trilha');
    expect(screen.getByText(/A porta H entra no primeiro qubit/)).toBeVisible();
    fireEvent.click(screen.getByRole('button', {name:'Ensinar'}));
    expect(screen.getByRole('heading', {name:'Conheça uma ideia'})).toBeVisible();
});

test('rotas de acesso informam a integração pendente e oferecem a demonstração', () => {
    window.history.replaceState(null, '', '#/entrar');
    render(<PublicRouter/>);
    expect(screen.getByRole('heading', {name:'Bom ter você aqui!'})).toBeVisible();
    expect(screen.getByRole('dialog')).toBeVisible();
    navigate('#/criar-conta');
    fireEvent.click(screen.getByRole('button', {name:'Criar conta',exact:true}));
    expect(screen.getByLabelText('Nome ou apelido')).toBeVisible();
    expect(window.scrollTo).toHaveBeenCalledWith(0,0);
    navigate('#/demo');
    expect(screen.getByText('Trilha interna')).toBeVisible();
    navigate('#/trilha');
    expect(screen.getByText('Trilha interna')).toBeVisible();
    navigate('#/');
    expect(screen.getByRole('heading', {level:1})).toBeVisible();
});
