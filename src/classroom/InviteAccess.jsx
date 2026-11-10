import React, { useState, useEffect, useRef } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../infrastructure/firebase/auth";
import { classroom } from "../infrastructure/firebase/classroom";
import Mascot from "../shared/ui/Mascot";
import Icon from "../shared/ui/Icon";
import "../app/tokens.css";
import "./classroom.css";
export default function InviteAccess({ id, secret }) {
  const host=useRef(null),[ready,setReady]=useState(false);
  useEffect(()=>{
    const player=host.current.querySelector('dotlottie-wc');
    const loaded=()=>setReady(true);
    player.addEventListener('load',loaded);
    return ()=>player.removeEventListener('load',loaded);
  },[]);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <div className="invite-page">
      <header className="invite-header">
        <a className="public-brand" href="#/">
          <span className="public-mark" aria-hidden="true">
            q<sup>+</sup>
          </span>
          <span>
            Circuit
            <br />
            QScratch
          </span>
        </a>
        <a href="#/">Voltar ao início</a>
      </header>
      <main className="classroom invite-layout">
        <div className="invite-host" ref={host} data-ready={ready}>
          {!ready&&<img className="invite-poster" src="/favicon.svg" alt="" aria-hidden="true"/>}
          <Mascot
            access
            motion={
              !window.matchMedia("(prefers-reduced-motion: reduce)").matches
            }
          />
        </div>
        <section className="invite-speech">
          <h1>Seu professor preparou um acesso para você!</h1>
          <p>
            Este é um acesso criado pelo seu professor. Você não precisa
            informar e-mail ou senha. Não compartilhe seu link.
          </p>
          <p>
            Entrar por este link substituirá a conta que estiver aberta neste
            navegador.
          </p>
          <button
            className="primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const result = await classroom("redeem", { id, secret });
                await signInWithCustomToken(auth(), result.token);
                window.location.replace("/#/trilha");
              } catch (e) {
                setError(e.message);
                setBusy(false);
              }
            }}
          >
            {busy ? "Preparando seu acesso..." : "Entrar pelo meu link"}{" "}
            <Icon name="arrow" />
          </button>
          {error && <p role="alert">{error}</p>}
          <p>
            <a href="#/">Voltar ao início</a>
          </p>
        </section>
      </main>
      <footer className="invite-footer">
        Mascote por{" "}
        <a href="https://lottiefiles.com/user/a29ccdc8-ab0a-49fc-b263-32073008b985">
          Christine Somkunwar
        </a>{" "}
        ·{" "}
        <a href="https://lottiefiles.com/page/license">Lottie Simple License</a>
      </footer>
    </div>
  );
}
