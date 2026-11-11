import React from 'react';
import {render, screen, fireEvent, act, cleanup} from '@testing-library/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import LandingPage from '../../src/public/LandingPage';
import LearningPreview from '../../src/public/LearningPreview';
import {LANDING_MOTION as timing} from '../../src/public/motionConfig';

const advance = () => act(() => jest.advanceTimersByTime(timing.carouselIntervalMs));
const active = name => expect(screen.getByRole('button', {name, exact:true})).toHaveAttribute('aria-pressed', 'true');

beforeEach(() => jest.useFakeTimers());
afterEach(() => {cleanup(); jest.useRealTimers();});

test('carrossel percorre as três fases e volta ao começo sem botão de pausa', () => {
    render(<LearningPreview/>);
    active('Ensinar');
    advance(); active('Perguntar');
    advance(); active('Praticar');
    advance(); active('Ensinar');
    expect(screen.queryByRole('button', {name:/Pausar|Retomar/})).toBeNull();
});

test('mouse, teclado e aba oculta suspendem o relógio e preservam a leitura', () => {
    render(<LearningPreview/>);
    const region = screen.getByRole('region', {name:'Como você aprende'});
    fireEvent.mouseEnter(region); advance(); active('Ensinar');
    expect(document.getElementById('preview-slide')).toHaveAttribute('aria-live', 'polite');
    fireEvent.mouseLeave(region); advance(); active('Perguntar');
    const question = screen.getByRole('button', {name:'Perguntar', exact:true});
    const practice = screen.getByRole('button', {name:'Praticar', exact:true});
    fireEvent.focus(question); advance(); active('Perguntar');
    fireEvent.blur(question, {relatedTarget:practice}); advance(); active('Perguntar');
    fireEvent.blur(practice, {relatedTarget:null}); advance(); active('Praticar');
    const hidden = jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange')); advance(); active('Praticar');
    hidden.mockReturnValue(false);
    fireEvent(document, new Event('visibilitychange')); advance(); active('Ensinar');
    hidden.mockRestore();
    expect(document.getElementById('preview-slide')).toHaveAttribute('aria-live', 'off');
});

test('movimento reduzido mantém a prévia manual e a animação opcional pode ser reativada', () => {
    const view = render(<LearningPreview motion={false}/>);
    advance(); active('Ensinar');
    expect(screen.getByText('Explore as etapas acima')).toBeVisible();
    expect(screen.queryByRole('button', {name:'Pausar carrossel'})).toBeNull();
    fireEvent.click(screen.getByRole('button', {name:'Praticar', exact:true}));
    active('Praticar');
    view.rerender(<LearningPreview motion/>);
    advance(); active('Ensinar');
});

test('animações começam ligadas mesmo com movimento reduzido no sistema, e o controle da página pausa todos os efeitos', () => {
    const media = {matches:true, addEventListener:jest.fn(), removeEventListener:jest.fn()};
    window.matchMedia.mockReturnValue(media);
    const view = render(<LandingPage/>);
    const lenis = Lenis.mock.results.at(-1).value;
    expect(Lenis).toHaveBeenLastCalledWith(expect.objectContaining({smoothWheel:true, syncTouch:false, anchors:false, respectReducedMotion:false}));
    expect(lenis.on).toHaveBeenCalledWith('scroll', ScrollTrigger.update);
    const tick = gsap.ticker.add.mock.calls.at(-1)[0];
    tick(2);
    expect(lenis.raf).toHaveBeenCalledWith(2000);
    expect(gsap.fromTo).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({autoAlpha:0}), expect.objectContaining({scrollTrigger:expect.objectContaining({once:true})}));
    expect(view.container.querySelector('.method-guide dotlottie-wc')).toHaveAttribute('src', expect.stringContaining('CzxO6d9fNA.lottie'));
    expect(screen.queryByRole('switch', {name:'Animações'})).toBeNull();
    advance(); active('Perguntar');
    fireEvent.click(screen.getByRole('link', {name:'Como aprendemos'}));
    expect(lenis.scrollTo).toHaveBeenCalledWith('#como-aprendemos', expect.objectContaining({duration:timing.anchorDuration}));
    view.unmount();
    expect(lenis.destroy).toHaveBeenCalledTimes(1);
    expect(gsap.ticker.remove).toHaveBeenCalledWith(tick);
    window.matchMedia.mockReturnValue({matches:false, addEventListener:jest.fn(), removeEventListener:jest.fn()});
});

test('barra preenche, pausa junto com a leitura e reinicia ao trocar a etapa', () => {
    const view = render(<LearningPreview/>);
    const bar = () => view.container.querySelector('.preview-timer span');
    act(() => jest.advanceTimersByTime(timing.carouselIntervalMs / 2));
    expect(bar().style.transform).toBe('scaleX(0.5)');
    const region = screen.getByRole('region', {name:'Como você aprende'});
    fireEvent.mouseEnter(region);
    advance();
    expect(bar().style.transform).toBe('scaleX(0.5)');
    fireEvent.click(screen.getByRole('button', {name:'Praticar', exact:true}));
    expect(bar().style.transform).toBe('scaleX(0)');
    fireEvent.mouseLeave(region);
    advance();
    active('Ensinar');
    expect(bar().style.transform).toBe('scaleX(0)');
});

test('carrossel móvel desativa ações e reage a mudança de largura',()=>{const media={matches:true,addEventListener:jest.fn(),removeEventListener:jest.fn()};window.matchMedia.mockReturnValue(media);const {unmount}=render(<LearningPreview/>);expect(screen.getByRole('button',{name:'Ensinar',exact:true})).toBeDisabled();fireEvent.mouseEnter(screen.getByRole('region'));advance();expect(screen.getByRole('button',{name:'Perguntar',exact:true})).toHaveAttribute('aria-pressed','true');act(()=>{media.matches=false;media.addEventListener.mock.calls.find(c=>c[0]==='change')[1]();});expect(screen.getByRole('button',{name:'Ensinar',exact:true})).not.toBeDisabled();unmount();expect(media.removeEventListener).toHaveBeenCalled();window.matchMedia.mockReturnValue({matches:false,addEventListener:jest.fn(),removeEventListener:jest.fn()});});
