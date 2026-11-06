import React from 'react';
import {render,screen} from '@testing-library/react';
import DirectionalText from '../../src/learning/DirectionalText';
test('mantém o sentido da explicação e marca todas as referências de posição',()=>{
 const {container,rerender}=render(<DirectionalText text="Veja o exemplo abaixo. Compare abaixo as chances."/>);
 expect(container.querySelectorAll('.example-location-side')).toHaveLength(2);
 expect(container.querySelectorAll('.example-location-below')).toHaveLength(2);
 expect(container).toHaveTextContent('Veja o exemplo');
 rerender(<DirectionalText text="A linha de cima continua preparada em 0."/>);
 expect(container.querySelector('.example-location')).toBeNull();
 expect(screen.getByText('A linha de cima continua preparada em 0.')).toBeVisible();
});
