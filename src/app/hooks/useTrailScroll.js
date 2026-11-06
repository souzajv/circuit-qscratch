import {useEffect} from 'react';
import Lenis from 'lenis';
import {LANDING_MOTION as timing} from '../../public/motionConfig';
import 'lenis/dist/lenis.css';

export default function useTrailScroll(trailRef, motion) {
    useEffect(() => {
        const content = trailRef.current;
        const wrapper = content.parentElement;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        let lenis;
        const update = () => {
            const enabled = motion && !reduced.matches && getComputedStyle(wrapper).overflowY === 'auto';
            if (!enabled) {lenis?.destroy();lenis = null;return;}
            if (lenis) {lenis.resize();return;}
            // Relógio próprio: a rolagem não depende do ticker das animações da tela.
            lenis = new Lenis({wrapper, content, autoRaf:true, lerp:timing.scrollLerp,
                smoothWheel:true, syncTouch:false, anchors:false, overscroll:true});
        };
        const frame = requestAnimationFrame(update);
        window.addEventListener('resize', update);
        reduced.addEventListener?.('change', update);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', update);
            reduced.removeEventListener?.('change', update);
            lenis?.destroy();
        };
    }, [trailRef, motion]);
}
