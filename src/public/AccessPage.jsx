import React, { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { LANDING_MOTION as timing } from "./motionConfig";
import Mascot from "../shared/ui/Mascot";
import LoadingScreen from "./LoadingScreen";
import Icon from "../shared/ui/Icon";
import { classroom } from "../infrastructure/firebase/classroom";
import {
  login,
  register,
  resetPassword,
  accessError,
} from "../infrastructure/firebase/auth";
import "./landing.css";
import "./access.css";

export default function AccessPage() {
  const [signup, setSignup] = useState(false);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("student");
  const createdAccount = useRef(false);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const previousHeight = useRef(null);
  // O teclado acompanha a etapa sem provocar rolagem durante a transição.
  useLayoutEffect(()=>{
    if(!signup)return;
    panelRef.current.querySelector(step===0?'input[autocomplete="nickname"]':'input[autocomplete="new-password"]').focus({preventScroll:true});
  },[signup,step]);
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        rootRef.current.querySelectorAll(".auth-header, .auth-host > *"),
        { autoAlpha: 0, y: timing.revealDistance },
        {
          autoAlpha: 1,
          y: 0,
          duration: timing.revealDuration,
          stagger: timing.stagger,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }, rootRef);
    return () => context.revert();
  }, []);
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const height = panel.getBoundingClientRect().height;
    // Mede o conteúdo novo e interpola a altura a partir do tamanho visível anterior.
    const context = gsap.context(() => {
      gsap.fromTo(
        panel,
        { height: previousHeight.current ?? height, overflow: "hidden" },
        {
          height,
          duration: timing.accessSwitchDuration,
          ease: "power2.inOut",
          clearProps: "height,overflow",
        },
      );
      gsap.fromTo(
        panel.querySelectorAll(".auth-body > *"),
        { autoAlpha: 0, y: timing.slideDistance },
        {
          autoAlpha: 1,
          y: 0,
          duration: timing.slideDuration,
          stagger: timing.accessStagger,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }, panelRef);
    return () => context.revert();
  }, [signup, step]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const toggle = () => {
    previousHeight.current = panelRef.current.getBoundingClientRect().height;
    setSignup(!signup);
    setStep(0);
    setMessage("");
    setPassword("");
    setConfirm("");
    setShowPassword(false);
  };
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (signup && !name.trim()) {
      setMessage("Informe seu nome ou apelido.");
      return;
    }
    if (signup && step === 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage("Preencha um e-mail válido.");
        return;
      }
      previousHeight.current = panelRef.current.getBoundingClientRect().height;
      setMessage("");
      setStep(1);
      return;
    }
    if (signup && password !== confirm) {
      setMessage("As senhas precisam ser iguais.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      if (signup) {
        if (createdAccount.current !== email.trim()) {
          await register(name, email, password);
          createdAccount.current = email.trim();
        }
        await classroom("profile", { role });
      } else await login(email, password);
      setPassword("");
      setConfirm("");
      window.location.hash = "/trilha";
    } catch (error) {
      setMessage(accessError(error));
    } finally {
      setBusy(false);
    }
  };
  const recover = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Preencha um e-mail válido para recuperar a senha.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await resetPassword(email);
      setMessage(
        "Se houver uma conta com esse e-mail, você receberá um link para redefinir a senha.",
      );
    } catch (error) {
      setMessage(accessError(error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="public-site auth-page" data-signup={signup} ref={rootRef}>
      {busy && <LoadingScreen />}
      <header className="auth-header">
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
      <main className="auth-layout">
        <div className="auth-host">
          <Mascot access motion />
          <h1>Seu próximo passo começa aqui.</h1>
          <p>Entre para começar suas descobertas com o Circuit QScratch.</p>
        </div>
        <section
          className="auth-modal"
          ref={panelRef}
          role="dialog"
          aria-labelledby="access-title"
        >
          <div className="auth-tabs" role="group" aria-label="Tipo de acesso">
            <button
              type="button"
              aria-pressed={!signup}
              disabled={busy}
              onClick={() => {
                if (signup) toggle();
              }}
            >
              Entrar
            </button>
            <button
              type="button"
              aria-pressed={signup}
              disabled={busy}
              onClick={() => {
                if (!signup) toggle();
              }}
            >
              Criar conta
            </button>
          </div>
          <div className="auth-body">
            <h2 id="access-title">
              {signup
                ? step === 0
                  ? "Vamos começar?"
                  : "Proteja sua conta"
                : "Bom ter você aqui!"}
            </h2>
            <p>
              {signup
                ? "Crie sua conta para acessar a trilha."
                : "Use seu e-mail e sua senha para entrar."}
            </p>
            {signup && (
              <div
                className="auth-step-markers"
                aria-label={`Etapa ${step + 1} de 2`}
              >
                <span className="active" />
                <span className={step === 1 ? "active" : ""} />
                <small>{step + 1} de 2</small>
              </div>
            )}
            <form onSubmit={submit}>
              <fieldset disabled={busy}>
                {signup && step === 0 && (
                  <>
                    <div
                      role="group"
                      aria-label="Perfil da conta"
                      className="auth-tabs"
                    >
                      <button
                        type="button"
                        aria-pressed={role === "student"}
                        onClick={() => setRole("student")}
                      >
                        Sou aluno
                      </button>
                      <button
                        type="button"
                        aria-pressed={role === "teacher"}
                        onClick={() => setRole("teacher")}
                      >
                        Sou professor
                      </button>
                    </div>
                    <p>
                      {role === "teacher"
                        ? "Professor: acompanhe sua trilha e crie acessos por link para seus alunos."
                        : "Aluno: acesse a trilha e salve suas descobertas na sua conta."}
                    </p>
                    <label>
                      Nome ou apelido
                      <input
                        required
                        maxLength={60}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="nickname"
                      />
                    </label>
                  </>
                )}
                {(!signup || step === 0) && (
                  <label>
                    E-mail
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </label>
                )}
                {(!signup || step === 1) && (
                  <>
                    <label>
                      Senha
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        minLength={signup ? 8 : 1}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={
                          signup ? "new-password" : "current-password"
                        }
                        aria-describedby={signup ? "password-help" : undefined}
                      />
                    </label>
                    {signup && (
                      <>
                        <p id="password-help" className="auth-hint">
                          Use pelo menos 8 caracteres.
                        </p>
                        <label>
                          Confirmar senha
                          <input
                            required
                            type={showPassword ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            autoComplete="new-password"
                          />
                        </label>
                      </>
                    )}
                    <button
                      className="auth-password-toggle"
                      type="button"
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? "Ocultar senha" : "Mostrar senha"}
                    </button>
                  </>
                )}
                {signup && step === 1 && (
                  <button
                    type="button"
                    className="auth-recover"
                    onClick={() => {
                      previousHeight.current =
                        panelRef.current.getBoundingClientRect().height;
                      setMessage("");
                      setStep(0);
                    }}
                  >
                    <Icon name="back" /> Voltar aos seus dados
                  </button>
                )}
                <button className="lp-button auth-submit" type="submit">
                  {busy
                    ? "Aguarde..."
                    : signup
                      ? step === 0
                        ? "Avançar"
                        : "Criar minha conta"
                      : "Entrar na trilha"}
                  {signup && step === 0 && <Icon name="arrow" />}
                </button>
              </fieldset>
            </form>
            {!signup && (
              <button
                type="button"
                className="auth-recover"
                disabled={busy}
                onClick={recover}
              >
                Esqueci minha senha
              </button>
            )}
            {message && (
              <p role="status" className="auth-message">
                {message}
              </p>
            )}
            <p className="auth-hint">
              Seu progresso fica vinculado à sua conta.
            </p>
          </div>
        </section>
      </main>
      <footer className="public-footer auth-footer">
        <span>
          Feito por{" "}
          <a href="https://www.linkedin.com/in/joao-souza-campos/">
            João Campos <Icon name="linkedin" />
          </a>
        </span>
        <span>
          Inspirado no{" "}
          <a href="https://github.com/marcosrv-ULL/QScratch">QScratch</a>.
          Mascote por{" "}
          <a href="https://lottiefiles.com/user/a29ccdc8-ab0a-49fc-b263-32073008b985">
            Christine Somkunwar
          </a>
          , sob{" "}
          <a href="https://lottiefiles.com/page/license">
            Lottie Simple License
          </a>
          .
        </span>
      </footer>
    </div>
  );
}
