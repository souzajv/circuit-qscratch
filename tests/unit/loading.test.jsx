import React from 'react';
import {render,screen,cleanup} from '@testing-library/react';
import LoadingScreen from '../../src/public/LoadingScreen';
afterEach(cleanup);
test.each([false,true])('carregamento anuncia estado e respeita movimento reduzido: %s', reduced=>{
 window.matchMedia.mockReturnValue({matches:reduced});
 const {container}=render(<LoadingScreen/>);
 expect(screen.getByRole('status')).toHaveAttribute('aria-busy','true');
 expect(screen.getByText(/Carregando sua conta/)).toBeVisible();
 expect(container.querySelector('dotlottie-wc').getAttribute('src')).toContain('CZ5vmNGwmU');
 expect(container.querySelector('dotlottie-wc').hasAttribute('autoplay')).toBe(!reduced);
 window.matchMedia.mockReturnValue({matches:false});
});
