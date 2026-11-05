import { useState, useEffect, useRef } from 'react';
import { TRANSITION } from '../../shared/config/experience.cjs';
export default function useCurtain(motion, play) {
  const [curtain, setCurtain] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const busy = useRef(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const transition = (action, {
    countdown: withCountdown = false
  } = {}) => {
    if (busy.current) return;
    play('tick');
    if (!motion) {
      action();
      return;
    }
    busy.current = true;
    setCurtain('closing');
    timer.current = setTimeout(() => {
      // Prepara a próxima tela enquanto a cortina ainda está fechada.
      action();
      window.scrollTo(0, 0);
      setCurtain('closed');
      const reveal = () => {
        setCountdown(null);
        setCurtain('opening');
        timer.current = setTimeout(() => {
          setCurtain(null);
          busy.current = false;
        }, TRANSITION.openingMs);
      };
      if (withCountdown) {
        const tick = value => {
          setCountdown(value);
          play('tick');
          timer.current = setTimeout(() => value > 1 ? tick(value - 1) : reveal(), TRANSITION.countMs);
        };
        tick(TRANSITION.countFrom);
      } else reveal();
    }, TRANSITION.closingMs);
  };
  return {
    curtain,
    countdown,
    transition
  };
}
