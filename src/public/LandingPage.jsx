import React, {useRef} from 'react';
import Mascot from '../shared/ui/Mascot';
import Icon from '../shared/ui/Icon';
import LearningPreview from './LearningPreview';
import useLandingMotion from './useLandingMotion';
import './landing.css';
import trailImage from './assets/trilha-desktop.jpg';

export default function LandingPage() {
    const rootRef = useRef(null);
    const motion = true;
    useLandingMotion(rootRef);

    return <div className="public-site" ref={rootRef} data-motion="on">
        <a className="skip" href="#lp-main">Ir para o conteúdo</a>
        <header className="public-header" data-reveal-group>
            <a className="public-brand" href="#/" data-reveal><span className="public-mark" aria-hidden="true">q<sup>+</sup></span><span>Circuit<br/>QScratch</span></a>
            <nav aria-label="Navegação da apresentação">
                <a href="#como-aprendemos" data-reveal>Como aprendemos</a>
                <a className="lp-button lp-button-small" href="#/entrar" data-reveal>Entrar</a>
            </nav>
        </header>
        <main id="lp-main">
            <section className="lp-hero" aria-labelledby="hero-title">
                <div className="hero-copy" data-reveal-group>
                    <h1 id="hero-title" data-reveal>Descubra a<br/>quântica.</h1>
                    <p data-reveal>Aprenda as primeiras ideias da computação quântica e monte um circuito, peça por peça, com um gato professor ao seu lado.</p>
                    <a className="lp-button" href="#/entrar" data-reveal>Começar <Icon name="arrow"/></a>
                    <a className="lp-text-link" href="#/demo" data-reveal>Conhecer a demonstração</a>
                    <p className="hero-note" data-reveal>Para quem está começando. Do Fundamental Anos Finais ao Ensino Médio.</p>
                </div>
                <div className="hero-world" data-reveal-group>
                    <div className="professor-bubble" data-reveal><p>Você não precisa saber nada de quântica. A gente começa pelas primeiras peças.</p></div>
                    <div data-reveal><Mascot motion={motion}/></div>
                    <figure className="hero-platform" data-reveal><img src={trailImage} width="1440" height="900" alt="Mapa real do Circuit QScratch, com cinco blocos e o circuito sendo montado aos poucos"/><figcaption>Cinco blocos. Um circuito para descobrir.</figcaption></figure>
                </div>
            </section>
            <section className="lp-method" id="como-aprendemos" aria-labelledby="method-title">
                <div className="method-heading" data-reveal-group>
                    <h2 id="method-title" data-reveal>Cada ideia vira uma peça.</h2>
                    <p data-reveal>Aprenda uma ideia por vez e coloque em prática o que acabou de descobrir.</p>
                </div>
                <div className="method-copy" data-reveal-group>
                    <div className="method-guide" data-reveal><Mascot chess motion={motion}/></div>
                    <div className="method-dialogue" data-reveal>
                        <p>Aprender, testar e montar.</p>
                        <p>Primeiro, eu explico uma parte do circuito. Depois, você responde a uma pergunta para reforçar o que aprendeu. Acertou? É hora de encaixar a peça! Assim, você monta o circuito aos poucos, entendendo cada passo.</p>
                        <a className="lp-text-link" href="#/trilha">Quero montar meu circuito <Icon name="arrow"/></a>
                    </div>
                </div>
                <div className="preview-reveal" data-reveal-group><div data-reveal><LearningPreview motion={motion}/></div></div>
            </section>
        </main>
        <footer className="public-footer">
            <span>Feito por <a href="https://www.linkedin.com/in/joao-souza-campos/">João Campos <Icon name="linkedin"/></a></span>
            <span>Inspirado no <a href="https://github.com/marcosrv-ULL/QScratch">QScratch</a>. Mascote por <a href="https://lottiefiles.com/user/a29ccdc8-ab0a-49fc-b263-32073008b985">Christine Somkunwar</a>, sob <a href="https://lottiefiles.com/page/license">Lottie Simple License</a>.</span>
        <span> · <a href="https://github.com/souzajv/circuit-qscratch">Código-fonte</a></span></footer>
    </div>;
}
