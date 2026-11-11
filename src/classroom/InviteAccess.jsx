import React, { useState } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../infrastructure/firebase/auth";
import { classroom } from "../infrastructure/firebase/classroom";
import Mascot from "../shared/ui/Mascot";
import Icon from "../shared/ui/Icon";
import "../app/tokens.css";
import "./classroom.css";
export default function InviteAccess({ id, secret, invalid=false }) {
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
        <div className="invite-host">
          <Mascot
            failed={invalid || Boolean(error)}
            motion={
              !window.matchMedia("(prefers-reduced-motion: reduce)").matches
            }
          />
        </div>
        <section className="invite-speech">
          <h1 role={invalid || error ? "alert" : undefined}>{invalid || error ? "Este link não está mais ativo" : "Seu professor preparou um acesso para você!"}</h1>
          {invalid || error ? <><p>Não foi possível entrar por este link. Ele pode ter sido desativado ou apagado. Peça um novo acesso ao seu professor.</p><a className="primary" href="#/entrar">Entrar com minha conta <Icon name="arrow"/></a>{!invalid && <button className="secondary" onClick={()=>setError("")}>Tentar o link novamente</button>}</> : <>
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
          </>}
          <p>
            <a href="#/">Voltar ao início</a>
          </p>
        </section>
      </main>
      <footer className="invite-footer">
        <span>Feito por João Campos</span>
        <br />
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
