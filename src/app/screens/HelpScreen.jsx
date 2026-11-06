import React from 'react';
import Icon from '../../shared/ui/Icon';
export default function HelpScreen({
  heading,
  backToMap
}) {
  return <section className="settings"><h1 ref={heading} tabIndex="-1">Aprenda, teste, monte.</h1><p>Abra o primeiro bloco da trilha. Leia a explicação, responda à pergunta e confirme a ação para continuar. Cada pergunta aceita uma resposta por tentativa do bloco. Se errar, veja a correção e siga para a próxima. Você pode refazer o bloco completo depois.</p><p>Cada bloco começa valendo até 10 pontos. Os erros nas três perguntas e a primeira dica usada no bloco reduzem 2 pontos cada, até o mínimo de 2. Ao refazer, você recebe apenas a diferença se melhorar sua melhor nota.</p><p>Use <kbd>Tab</kbd> para navegar e <kbd>Enter</kbd> ou <kbd>Espaço</kbd> para escolher. Você pode desligar sons e animações em Preferências. A trilha começa do básico para todos.</p><button className="primary" onClick={backToMap}>Ir para a trilha <Icon name="arrow" /></button></section>;
}
