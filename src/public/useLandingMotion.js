import {useEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {LANDING_MOTION as timing} from './motionConfig';

gsap.registerPlugin(ScrollTrigger);

export default function useLandingMotion(rootRef) {
    useEffect(() => {

        // O mesmo relógio sincroniza a rolagem e as entradas sem alterar a trilha interna.
        const lenis = new Lenis({
            autoRaf: false,
            lerp: timing.scrollLerp,
            smoothWheel: true,
            syncTouch: false,
            anchors: false,
            respectReducedMotion: false
        });
        const tick = time => lenis.raf(time * timing.millisecondsPerSecond);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        // Impede o salto nativo da âncora antes de iniciar a rolagem animada.
        const anchor = rootRef.current.querySelector('a[href="#como-aprendemos"]');
        const navigate = event => {
            event.preventDefault();
            window.history.replaceState(null, '', '#como-aprendemos');
            lenis.scrollTo('#como-aprendemos', {duration: timing.anchorDuration, lerp: 0, force: true});
        };
        anchor.addEventListener('click', navigate);

        const context = gsap.context(() => {
            rootRef.current.querySelectorAll('[data-reveal-group]').forEach(group => {
                gsap.fromTo(group.querySelectorAll('[data-reveal]'),
                    {autoAlpha: 0, y: timing.revealDistance},
                    {
                        autoAlpha: 1, y: 0, duration: timing.revealDuration,
                        stagger: timing.stagger, ease: 'power2.out', clearProps: 'all',
                        scrollTrigger: {trigger: group, start: 'top 90%', once: true}
                    });
            });
        }, rootRef);

        return () => {
            // Retira os estilos e observadores ao mudar de rota ou reduzir movimentos.
            context.revert();
            anchor.removeEventListener('click', navigate);
            gsap.ticker.remove(tick);
            lenis.destroy();
        };
    }, [rootRef]);
}
