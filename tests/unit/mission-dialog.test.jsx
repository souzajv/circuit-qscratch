import React from 'react';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import MissionDialog from '../../src/learning/MissionDialog';
afterEach(cleanup);
test('modal anuncia conquista, oferece as ações e restaura scroll ao desmontar',()=>{
 const dismiss=jest.fn(),next=jest.fn(),repeat=jest.fn();
 const {unmount}=render(<MissionDialog motion conclusion="Agora temos Bell." last onContinue={next} onDismiss={dismiss} onRepeat={repeat}/>);
 expect(screen.getByRole('dialog')).toHaveAccessibleName('Missão concluída!');expect(document.body.style.overflow).toBe('hidden');
 fireEvent.click(screen.getByRole('button',{name:'Ver minha conclusão'}));expect(next).toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Preparar outra rodada'}));expect(repeat).toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Fechar conquista e continuar explorando'}));fireEvent(screen.getByRole('dialog'),new Event('cancel',{bubbles:true}));expect(dismiss).toHaveBeenCalledTimes(2);
 unmount();expect(document.body.style.overflow).toBe('');
});

test('conclusão da demonstração convida a criar conta sem impedir fechar',()=>{const dismiss=jest.fn(),next=jest.fn();render(<MissionDialog demo motion={false} conclusion="Duas linhas prontas." onDismiss={dismiss} onContinue={next}/>);expect(screen.getByText(/Você concluiu o bloco da demonstração/)).toBeVisible();fireEvent.click(screen.getByRole('button',{name:/Criar minha conta/}));expect(next).toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Continuar explorando'}));expect(dismiss).toHaveBeenCalled();});
