import { MASCOT_REFRESH_MS, MASCOT_LAYOUT } from '../config/experience.cjs';
import React, { useRef, useEffect } from 'react';
const CAT = 'https://assets-v2.lottiefiles.com/a/6c0548ba-e4ee-46f4-9ff6-d21142e6cdfb/OMSGkVND6g.lottie';
const THINKING = 'https://assets-v2.lottiefiles.com/a/12900a72-1ed5-4bbd-8d70-5a27e2fa2879/0aSrmcIdAc.lottie';
const CELEBRATE = 'https://assets-v2.lottiefiles.com/a/fc4b7c54-7046-4e9e-bbc7-b13a9f7dd02c/R68WyUB8Sp.lottie';
const EXPLORE = 'https://assets-v2.lottiefiles.com/a/add71288-2455-4e77-8f3e-a6a14dc15485/DnJFyG2gZm.lottie';
const TROPHY = 'https://assets-v2.lottiefiles.com/a/d4938d0e-2d32-499d-a479-0295cf13cd0f/B2LfBuUniU.lottie';
const TREASURE = 'https://assets-v2.lottiefiles.com/a/e3bd1c14-a3c7-427a-8468-82693dc1ae76/dqC1EegeXs.lottie';
const LOADING = 'https://assets-v2.lottiefiles.com/a/dba6432f-476c-4ac5-bf32-73f4bc03d0f2/CZ5vmNGwmU.lottie';
const CHESS = 'https://assets-v2.lottiefiles.com/a/ccb39769-7c2b-416b-b4f7-c6a36159e369/CzxO6d9fNA.lottie';
const ACCESS = 'https://assets-v2.lottiefiles.com/a/1d4af2b2-8b7f-4938-a834-187efdc6f4f0/M7Mcvmydsg.lottie';
export default function Mascot({
  motion,
  thinking = false,
  celebrating = false,
  exploring = false,
  trophy = false,
  treasure = false,
  access = false,
  chess = false,
  failed = false,
  rating = false,
  loading = false
}) {
  const pose = failed ? 'failed' : rating ? 'rating' : access ? 'access' : chess ? 'chess' : loading ? 'loading' : treasure ? 'treasure' : trophy ? 'trophy' : celebrating ? 'celebrate' : exploring ? 'explore' : thinking ? 'thinking' : 'teaching';
  const src = {
    failed:'https://assets-v2.lottiefiles.com/a/24b28f7d-ea84-47ca-9295-4902d6382677/n69xPj3Lgr.lottie',
    rating:'https://assets-v2.lottiefiles.com/a/4cced8f7-fa9d-42b3-96ff-e0f53df23073/wApLF0JTol.lottie',
    access: ACCESS,
    chess: CHESS,
    loading: LOADING,
    treasure: TREASURE,
    trophy: TROPHY,
    celebrate: CELEBRATE,
    explore: EXPLORE,
    thinking: THINKING,
    teaching: CAT
  }[pose];
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    let configured = false;
    const update = () => {
      const player = el?.dotLottie;
      if (player) {
        if(!configured){el.layout=MASCOT_LAYOUT;configured=true;}
        motion ? player.play() : player.pause();
      }
    };
    update();
    el?.addEventListener('load', update);
    const timer = setInterval(update, MASCOT_REFRESH_MS);
    return () => {
      clearInterval(timer);
      el?.removeEventListener('load', update);
    };
  }, [motion, pose]);
  return <div className={trophy ? 'mascot mascot-trophy' : 'mascot'}><span className="mascot-fallback">{trophy || treasure ? 'Trilha concluída!' : 'Seu gato professor'}</span><dotlottie-wc key={pose} ref={ref} src={src} autoplay={motion ? '' : undefined} loop="" aria-label={`${failed ? 'Gato reagindo ao erro' : rating ? 'Gato celebrando sua conquista' : access ? 'Gato com prancheta' : chess ? 'Gato jogando xadrez' : loading ? 'Gato brincando' : treasure ? 'Gato com baú de tesouro' : trophy ? 'Gato celebrando a conclusão' : celebrating ? 'Gato comemorando' : exploring ? 'Gato com lupa' : thinking ? 'Gato pensando' : 'Gato professor'} de Christine Somkunwar`} /></div>;
}
