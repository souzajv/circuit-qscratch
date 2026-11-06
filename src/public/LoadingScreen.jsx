import React from 'react';
import Mascot from '../shared/ui/Mascot';
import '../app/tokens.css';
import './loading.css';

// Sem porcentagem fictícia: a tela acompanha a autenticação e a leitura reais.
export default function LoadingScreen() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return <div className="account-loading"><section className="account-loading-card" role="status" aria-live="polite" aria-busy="true"><span className="account-loading-brand">Circuit QScratch</span><Mascot loading motion={!reduced}/><h1>Preparando suas descobertas</h1><p>Carregando sua conta e progresso...</p><div className="account-loading-track" aria-hidden="true"><span/></div></section></div>;
}
