import React from 'react';
import Icon from '../../shared/ui/Icon';
export default function HelpScreen({
  heading,
  backToMap
}) {
  return <section className="settings"><h1 ref={heading} tabIndex="-1">Aprenda, teste, monte.</h1><p>Abra o primeiro bloco da trilha. Leia a explicação, responda à pergunta e confirme a ação para continuar. Você pode tentar quantas vezes quiser.</p><p>Cada bloco começa valendo até 10 pontos. Os erros nas três perguntas e a primeira dica usada no bloco reduzem 2 pontos cada, até o mínimo de 2. Ao refazer, você recebe apenas a diferença se melhorar sua melhor nota.</p><p>Use <kbd>Tab</kbd> para navegar e <kbd>Enter</kbd> ou <kbd>Espaço</kbd> para escolher. Você pode mudar sua escolaridade e desligar sons e animações em Preferências.</p><button className="primary" onClick={backToMap}>Ir para a trilha <Icon name="arrow" /></button><p>Créditos e licença: <a href="https://github.com/souzajv/circuit-qscratch">Código-fonte do Circuit QScratch</a>, disponível sob AGPL-3.0.</p></section>;
}
