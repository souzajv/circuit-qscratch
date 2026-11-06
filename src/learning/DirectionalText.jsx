import React from 'react';

// A mesma media query do layout escolhe a palavra visível, inclusive para leitores de tela.
// O texto-base permanece independente do tamanho do dispositivo.
export default function DirectionalText({text}) {
    return text.split('abaixo').map((part,index)=><React.Fragment key={index}>{index>0 && <span className="example-location"><span className="example-location-side">ao lado</span><span className="example-location-below">abaixo</span></span>}{part}</React.Fragment>);
}
