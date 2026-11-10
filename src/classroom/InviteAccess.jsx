import React, { useState } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../infrastructure/firebase/auth";
import { classroom } from "../infrastructure/firebase/classroom";
import "./classroom.css";
export default function InviteAccess({ id, secret }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <main className="classroom">
      <h1>Sua descoberta começa aqui</h1>
      <p>
        Este é um acesso criado pelo seu professor. Você não precisa informar
        e-mail ou senha. Não compartilhe seu link.
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
        {busy ? "Preparando seu acesso..." : "Entrar pelo meu link"}
      </button>
      {error && <p role="alert">{error}</p>}
      <p>
        <a href="#/">Voltar ao início</a>
      </p>
    </main>
  );
}
