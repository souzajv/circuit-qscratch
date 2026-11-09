import React from 'react';
import {render, screen, fireEvent, cleanup, within} from '@testing-library/react';
import Lesson from '../../src/learning/Lesson';
import LearningExample from '../../src/learning/LearningExample';
import {blocks, getQuestions, CONTENT_REVISION} from '../../src/learning/content';

jest.mock('../../src/shared/ui/Mascot', () => () => <div/>);
const props = index => ({block: blocks[index], index, level: 'Fundamental Anos Finais',
  motion: false, transition: action => action(), onComplete: jest.fn(), onBack: jest.fn(),
  onCertificate: jest.fn(), play: jest.fn()});
const click = name => fireEvent.click(screen.getByRole('button', {name, exact: true}));
const tab = name => fireEvent.click(screen.getByRole('tab', {name, exact: true}));
afterEach(cleanup);

test('a comparação pedida na fala da moeda permite escolher duas H', () => {
  const page = blocks[2].pages.find(page => page.title.includes('moeda'));
  render(<LearningExample visual={page.visual} title={page.title}/>);
  click('H duas vezes');
  expect(screen.getByRole('img')).toHaveAccessibleName(/H → H/);
  expect(screen.getByText(/Chances previstas:/)).toHaveTextContent('00: 100%');
});

test('a posição do gabarito é equilibrada e a ordem é estável entre leituras', () => {
  const positions = blocks.flatMap(block => getQuestions(block, 'Fundamental Anos Finais').map(q => q.answer));
  expect([0, 1, 2].map(position => positions.filter(value => value === position).length)).toEqual([5, 5, 5]);
  expect(getQuestions(blocks[0], 'Fundamental Anos Finais')).toEqual(getQuestions(blocks[0], 'Fundamental Anos Finais'));
});

test('o laboratório anterior à apresentação de H usa nomes de preparo em todas as abas', () => {
  render(<LearningExample visual="qubit" title="Primeiro qubit"/>);
  expect(screen.getByRole('button', {name: 'Preparar em 0'})).toBeVisible();
  click('Superposição com chances iguais');
  tab('Experimentar');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Superposição com chances iguais');
  expect(screen.getByRole('tabpanel')).not.toHaveTextContent(/H uma vez|Sem H/);
});

test('o treino de um qubit desenha uma única linha', () => {
  render(<LearningExample visual="measurement" title="Uma medição"/>);
  expect(screen.getByRole('img')).toHaveAccessibleName(/início 0,/);
  expect(within(screen.getByRole('img')).queryByText('q₂')).toBeNull();
});

test('medir oferece acesso direto à contagem e repetir o mesmo preparo preserva amostras', () => {
  render(<LearningExample visual="measurement" title="Uma medição"/>);
  tab('Experimentar'); click('Fazer 20 rodadas'); click('Ver resultados');
  expect(screen.getByRole('tab', {name: 'Resultados'})).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Observado: 20 de 20 rodadas');
  tab('Preparar'); click('Preparar em 0'); tab('Resultados');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Observado: 20 de 20 rodadas');
});

test('foco e hover não medem nem concluem a prática', () => {
  const p = props(1);
  render(<Lesson {...p} saved={{phase: 'practice', reflection: {choice: 1, confirmed: true}}}/>);
  const meter = screen.getByRole('button', {name: 'Medir circuito preparado'});
  fireEvent.focus(meter); fireEvent.mouseEnter(meter);
  expect(p.onComplete).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog')).toBeNull();
  fireEvent.click(meter);
  expect(p.onComplete).toHaveBeenCalledTimes(1);
});

test('a previsão prática exige compreender o par, sem alterar a nota do quiz', () => {
  const p = props(0), checkpoint = jest.fn();
  render(<Lesson {...p} saved={{phase: 'practice', errors: 3}} onCheckpoint={checkpoint}/>);
  expect(screen.getByText('|0⟩ Qubit', {selector:'button'})).toBeDisabled();
  click('10'); click('Conferir previsão');
  expect(screen.getByText('|0⟩ Qubit', {selector:'button'})).toBeDisabled();
  expect(screen.getByRole('status', {name: 'Retorno da previsão'})).toHaveTextContent('primeiro');
  click('01'); click('Conferir previsão');
  expect(screen.getByRole('button', {name: '|0⟩ Qubit'})).toBeEnabled();
  expect(screen.getByRole('button', {name: '|0⟩ Qubit'})).toHaveFocus();
  click('|0⟩ Qubit'); click('Encaixe do primeiro qubit'); click('|0⟩ Qubit'); click('Encaixe do segundo qubit');
  expect(p.onComplete).toHaveBeenCalledWith(4);
  expect(checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({errors: 3, contentRevision: CONTENT_REVISION,
    reflection: {choice: 0, confirmed: true}}));
});

test('uma tentativa salva na revisão anterior mantém suas alternativas e sua escolha', () => {
  render(<Lesson {...props(0)} saved={{phase: 'quiz', quizIndex: 1, choice: 0, correct: true,
    answered: true, contentRevision: 2}}/>);
  expect(screen.getByRole('radio', {name: /^Medir agora dará 00/})).toBeChecked();
  expect(screen.getByText(/As duas preparações em 0/)).toBeVisible();
});

test('reler a página preserva o preparo, a aba e as amostras da experiência', () => {
  render(<Lesson {...props(0)} saved={{page: 1}}/>);
  tab('Experimentar'); click('Fazer 20 rodadas');
  click('Próximo'); click('Anterior');
  expect(screen.getByRole('tab', {name: 'Experimentar'})).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('status')).toHaveTextContent('20 rodadas realizadas');
});

test('um drop programático não contorna a previsão e confirmação inválida não libera a bancada', () => {
  const p = props(0);
  render(<Lesson {...p} saved={{phase: 'practice', reflection: {choice: 1, confirmed: true}}}/>);
  const slot = screen.getByLabelText('Encaixe do primeiro qubit');
  expect(slot).toBeDisabled();
  fireEvent.drop(slot, {dataTransfer: {getData: () => 'qubit'}});
  expect(p.onComplete).not.toHaveBeenCalled();
  expect(slot).not.toHaveTextContent('|0⟩');
});

test('o retorno de erro usa a correção e mantém a pergunta encerrada', () => {
  const question = getQuestions(blocks[2], 'Fundamental Anos Finais')[2];
  render(<Lesson {...props(2)} saved={{phase: 'quiz', quizIndex: 2}}/>);
  fireEvent.click(screen.getByRole('radio', {name: question.options[0], exact: true}));
  click('Conferir resposta');
  expect(screen.getByRole('status')).toHaveTextContent(question.retry);
  expect(screen.getByRole('status')).not.toHaveTextContent('Correto.');
  expect(screen.getByRole('radio', {name: new RegExp(question.options[0])})).toBeDisabled();
});

test('a revisão antiga não muda ao voltar para as explicações', () => {
  const checkpoint = jest.fn();
  render(<Lesson {...props(0)} saved={{phase:'quiz',quizIndex:1,choice:0,answered:true,
    correct:true,errors:1,contentRevision:2}} onCheckpoint={checkpoint}/>);
  click('Rever explicação sem apagar esta tentativa');
  expect(checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({contentRevision:2,choice:0,errors:1,answered:true}));
});

test('a rodada salva não sorteia novamente nem ganha pontos ao reativar o medidor', () => {
  const p=props(4);
  render(<Lesson {...p} saved={{phase:'practice',finished:true,measured:'11'}}/>);
  click('Continuar explorando');
  click('Medir circuito preparado');
  expect(screen.getByRole('button',{name:'Medir circuito preparado'})).toHaveTextContent('11');
  expect(p.onComplete).not.toHaveBeenCalled();
});
