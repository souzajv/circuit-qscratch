import React, {useEffect, useState} from 'react';
import App from '../app/App';
import AccountTrail from './AccountTrail';
import LandingPage from './LandingPage';
import AccessPage from './AccessPage';
import InviteAccess from '../classroom/InviteAccess';

// Rotas públicas usam o histórico do navegador sem depender de um servidor de rotas.
export default function PublicRouter() {
    const [route, setRoute] = useState(window.location.hash);
    useEffect(() => {
        const update = () => {
            const hash = window.location.hash;
            setRoute(hash);
            // Âncoras de conteúdo mantêm a rolagem nativa; páginas começam no topo.
            if (hash.startsWith('#/')) window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', update);
        return () => window.removeEventListener('hashchange', update);
    }, []);
    const invite=route.match(/^#\/convite\/(linked_[a-z0-9-]+)\/([a-f0-9]{64})$/);
    if(invite)return <InviteAccess id={invite[1]} secret={invite[2]}/>;
    if(route.startsWith('#/convite/'))return <InviteAccess invalid/>;
    if (route === '#/trilha') return <AccountTrail/>;
    if (route === '#/demo') return <App demo/>;
    if (route === '#/entrar' || route === '#/criar-conta') return <AccessPage/>;
    return <LandingPage/>;
}
