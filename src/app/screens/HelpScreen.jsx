import React from 'react';
import Icon from '../../shared/ui/Icon';
export default function HelpScreen({
  heading,
  backToMap
}) {
  return <section className="settings"><h1 ref={heading} tabIndex="-1">Aprenda, teste, monte.</h1><p>Abra o primeiro bloco da trilha. Leia a explicação, responda à pergunta e confirme a ação para continuar. Você pode tentar quantas vezes quiser.</p><p>Um acerto começa valendo 10 pontos. Cada erro e a primeira dica reduzem 2 pontos, até o mínimo de 2. Ao refazer, você recebe apenas a diferença se melhorar sua melhor nota.</p><p>Use Tab para navegar e Enter ou espaço para escolher. Você pode mudar sua escolaridade e desligar sons e animações em Preferências.</p><button className="primary" onClick={backToMap}>Ir para a trilha <Icon name="arrow" /></button></section>;
}
