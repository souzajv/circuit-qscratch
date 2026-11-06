import React from 'react';
import {render,screen,fireEvent,cleanup,within} from '@testing-library/react';
import {gsap} from 'gsap';
import LearningExample from '../../src/learning/LearningExample';
import ExperimentPanel from '../../src/learning/ExperimentPanel';
import {runExperiment} from '../../src/learning/experiments.cjs';
afterEach(()=>{cleanup();jest.restoreAllMocks();window.matchMedia.mockReturnValue({matches:false,addEventListener:jest.fn(),removeEventListener:jest.fn()});});
const example=(visual,level='Fundamental Anos Finais',motion=false)=>render(<LearningExample visual={visual} title="Minha descoberta" motion={motion} level={level}/>);
const click=name=>fireEvent.click(screen.getByRole('button',{name}));
test('interruptor liga e desliga com descrição textual',()=>{
 example('bit');click('Ligar interruptor');expect(screen.getByText('1')).toBeVisible();click('Desligar interruptor');expect(screen.getByText('0')).toBeVisible();
});
test.each(['lines','preparation'])('%s identifica duas linhas sem mudar o circuito',visual=>{
 example(visual);click('Linha de baixo: q₂');expect(screen.getByRole('img')).toHaveAccessibleName(/início 00/);expect(screen.getByRole('status')).toHaveTextContent('q₂');
});
test.each(['Fundamental Anos Finais','Ensino Médio'])('sequência e termos respeitam %s',level=>{
 const {unmount}=example('order',level);for(const label of ['1. Preparar','2. Aplicar H','3. Conectar CNOT','4. Medir']){click(label);expect(screen.getByRole('button',{name:label})).toHaveAttribute('aria-pressed','true');expect(screen.getByRole('status')).not.toBeEmptyDOMElement();}unmount();
 example('branches',level);click('Depois da CNOT');expect(screen.getByText('|10⟩ → |11⟩')).toBeVisible();click('Antes da CNOT');expect(screen.getByText('|10⟩ → |10⟩')).toBeVisible();
});
test('CNOT responde a controle e alvo e destaca sua tabela de verdade',()=>{
 example('cnot');click('Controle: 0 · trocar');expect(screen.getByText('Controle 1: o alvo troca. O controle permanece 1.')).toBeVisible();click('Alvo: 0 · trocar');expect(screen.getByText('11',{selector:'.cnot-transformation b'})).toBeVisible();click('Alvo: 1 · trocar');click('Controle: 1 · trocar');expect(screen.getByText('Controle 0: o alvo fica igual. O controle permanece 0.')).toBeVisible();expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(5);
});
test.each(['qubit','measurement','hadamard','double-h','order-compare','bell','bell-compare','correlation','recap'])('exemplo %s apresenta representação acessível',visual=>{
 example(visual);expect(screen.getByRole('region',{name:'Exemplo: Minha descoberta'})).toBeVisible();expect(screen.getByRole('heading')).not.toBeEmptyDOMElement();
});
test.each([false,true])('laboratório %s conta amostras reais, troca preparo e limpa',pairs=>{
 jest.spyOn(Math,'random').mockReturnValue(.8);
 render(<ExperimentPanel cases={['zero','one','hadamard','bell']} pairs={pairs}/>);
 click('H uma vez');click('Preparar e medir uma vez');expect(screen.getByRole('status')).toHaveTextContent(pairs?'Último resultado: 10':'Último resultado: 1');
 click('Fazer 20 rodadas');expect(screen.getByRole('status')).toHaveTextContent('21 rodadas realizadas');
 expect(screen.getByLabelText('Últimos 20 resultados').children).toHaveLength(20);
 click('H e depois CNOT');expect(screen.getByRole('status')).toHaveTextContent('Antes de medir');click('Preparar e medir uma vez');expect(screen.getByRole('status')).toHaveTextContent(pairs?'Último resultado: 11':'Último resultado: 1');
 click('Limpar resultados');expect(screen.getByRole('button',{name:'Limpar resultados'})).toBeDisabled();
});
test('entrada GSAP é limpa e movimento reduzido mantém conteúdo visível',()=>{
 const first=example('bit','Ensino Médio',true);expect(gsap.fromTo).toHaveBeenCalled();first.unmount();
 gsap.fromTo.mockClear();window.matchMedia.mockReturnValue({matches:true});example('measurement','Ensino Médio',true);expect(gsap.fromTo).not.toHaveBeenCalled();
});
test('modelo rejeita configurações inválidas e usa a fonte aleatória fornecida',()=>{
 const {prepareExperiment,truthRow}=require('../../src/learning/experiments.cjs');
 expect(()=>prepareExperiment('inexistente')).toThrow();expect(()=>truthRow('22')).toThrow();
 for(const rounds of [0,21,1.5])expect(()=>runExperiment('zero',rounds)).toThrow();
 expect(runExperiment('bell',1).history).toHaveLength(1);
});

test('valores padrão do laboratório e do diagrama continuam acessíveis',()=>{
 const MiniCircuit=require('../../src/learning/MiniCircuit').default;
 const view=render(<MiniCircuit/>);expect(screen.getByRole('img')).toHaveAccessibleName(/H → CNOT/);view.unmount();
 render(<ExperimentPanel cases={['bell']}/>);click('Preparar e medir uma vez');expect(screen.getByRole('status')).toHaveTextContent('1 rodada realizada');
});
