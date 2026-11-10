# Design system do Circuit QScratch

Atualização de gestão em 10/11/2026: [DESIGN.md](DESIGN.md) registra a composição dos painéis, consulta dedicada com foco, busca entre registros carregados e convite com mascote e balão responsivo. A identidade visual abaixo permanece a referência.

Proposta inicial para a plataforma web desktop, baseada no CSS e nos créditos dos slides em `../apresentacao/`. O escopo atual é conta individual, Fundamental Anos Finais e Ensino Médio; referências a perfis múltiplos devem ser entendidas como conta e preferências individuais. Valores de interface são ponto de partida, sujeitos a revisão visual e testes.

## Identidade

Um espaço de descobertas com o gato professor como guia. Usar superfícies claras, laranja quente, traços escuros, formas arredondadas, contorno evidente e sombra sólida. A composição deve valorizar a missão atual e o circuito, com poucos elementos animados ao mesmo tempo. O mascote acompanha o usuário; as demais poses representam o mesmo personagem, não personagens novos.

## Cores

Valores extraídos das regras finais de `apresentacao/apresentacao.css`, não de regras anteriores sobrescritas.

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#4B483F` | texto principal, contorno, ícones e sombras |
| `--color-paper` | `#FFFDF7` | fundo e superfícies principais |
| `--color-accent` | `#FEAC3C` | ação principal, porta H e destaque |
| `--color-warm` | `#FFF2D8` | fundo alternativo de seção |
| `--color-peach` | `#FFE1A9` | destaque suave, progresso e áreas de conteúdo |
| `--color-white` | `#FFFFFF` | superfícies e campos |

O texto escuro sobre `paper`, `accent` e `warm` apresenta aproximadamente 8,98:1, 4,87:1 e 8,24:1, respectivamente, calculados a partir dos valores hexadecimais. Verificar contraste de todas as combinações reais, incluindo foco, erro, desabilitado e ícones. Não usar texto branco sobre laranja como padrão. Estados de acerto e erro precisam de texto e símbolo; paleta semântica adicional será definida e testada, não apenas por cor.

## Tipografia

Os slides declaram `Arial Rounded MT Bold`, `Trebuchet MS` e `Arial` como alternativas. Proposta: títulos `"Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif`; textos e controles `"Trebuchet MS", Arial, sans-serif`. A aparência depende da disponibilidade local; antes de publicar, decidir uma fonte web com licença e suporte a português, testando legibilidade e fallback. Não presumir que uma fonte esteja instalada em todos os computadores.

Escala inicial: corpo 18px/1,5; apoio 16px/1,5; título de bloco 32px/1,2; título de página 40px/1,15; botão 18px/1,2 e peso 700. Não usar caixa alta prolongada em explicações. Permitir zoom de 200% sem ocultar ações e evitar texto sobre ilustrações movimentadas.

## Formas e componentes

- Base de espaçamento 4px; passos comuns 8, 12, 16, 24, 32 e 48px.
- Contorno principal 3px sólido `ink`; raio de cartões 16px e de botões 12px. Referência dos slides: contorno 4px, raio entre 14 e 20px.
- Sombra sólida de botões e cartões de destaque: `0 4px 0 #4B483F`. Usar menos sombra em elementos repetidos ou no editor de circuito para preservar clareza.
- Botão primário laranja com texto escuro; secundário claro com contorno; ação perigosa com rótulo explícito e confirmação. Estados normal, hover quando disponível, pressionado, foco visível, carregando e desabilitado.
- Foco por teclado deve ter contorno externo visível e não depender da sombra. Controles devem ter área confortável, proposta mínima 44 × 44px.
- Campos possuem rótulo permanente, instruções, erro em texto e foco visível. Senhas e informações privadas não aparecem em ilustrações ou notificações.
- Cartão didático mostra uma ideia de cada vez, com fala do mascote, ação clara e ajuda acessível. Uma resposta errada recebe orientação, sem expressão de reprovação do mascote.
- Mapa: cinco blocos identificáveis por nome, posição e estado, com rótulos de disponível, concluído e bloqueado. O progresso deve ter descrição textual.
- Circuito: duas linhas identificadas, leitura esquerda para direita, peças H e CNOT com marcação de controle e alvo. Permitir selecionar peça e posição por clique ou teclado, além de eventual arraste. Mostrar visualmente treino separado e nova preparação.
- Estados de sistema: carregando, vazio, erro, salvando, salvo e pendente, com texto claro. Não apresentar como salvo enquanto o servidor não confirmar.

## Movimento e interação

Orientações da [skill emil-design-eng](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md), consultada para este planejamento: movimento precisa explicar, orientar ou dar retorno; interações frequentes devem ser rápidas; ações por teclado não dependem de animação. Preferir propriedades `transform` e `opacity`, testar desempenho real e evitar assumir aceleração em todo navegador.

Tokens propostos: pressão 120ms; pequenas transições 160ms; entrada de painel 200ms; curva `cubic-bezier(0.23, 1, 0.32, 1)`. Celebração pode durar mais sem bloquear o próximo passo. Sem `transition: all`; não atrasar gabarito ou navegação. Efeitos de hover só para dispositivos com hover. Preferência de movimento reduzido e controle do usuário devem pausar animações decorativas, inclusive Lottie, mantendo quadro estático e todo o conteúdo; som tem controle separado. Não usar lampejos ou movimentos contínuos que desviem a atenção da leitura.

## Catálogo de animações da Christine Somkunwar

O perfil exibe 26 itens. Os nomes abaixo derivam dos identificadores visíveis nos links; itens de nome genérico ou repetido devem ser identificados pelo ID. Os usos são hipóteses para avaliar junto aos vídeos, não descrição garantida do movimento. Antes de integrar, conferir cada arquivo, transparência, duração, licenças e termos vigentes. O [arquivo de créditos dos slides](../apresentacao/CREDITOS.md) registra a Lottie Simple License; não presumir que a confirmação de um item cubra todos os demais. Não foi feito download ou incorporação nesta etapa.

| Item e link | Uso proposto |
|---|---|
| [Cat loading animation](https://lottiefiles.com/free-animation/cat-loading-animation-CZ5vmNGwmU) | espera breve por carregamento |
| [Professor cat](https://lottiefiles.com/free-animation/professor-cat-OMSGkVND6g) | orientação, tutorial e explicações |
| [Orangecat 0aS](https://lottiefiles.com/free-animation/orangecat-0aSrmcIdAc) | pose de apoio a avaliar visualmente |
| [Tired and speaking cat](https://lottiefiles.com/free-animation/tired-and-speaking-cat-O9Fo59VQUQ) | possível orientação ou pausa, após verificar expressão |
| [Orangecat JAP](https://lottiefiles.com/free-animation/orangecat-JAPwEAUJng) | pose de apoio a avaliar |
| [Scholar cat Mf5](https://lottiefiles.com/free-animation/scholar-cat-Mf5ZxFYmr7) | apresentação de novo conceito, sujeito a inspeção |
| [Magnifying glasses](https://lottiefiles.com/free-animation/magnifying-glasses-DnJFyG2gZm) | investigar uma pista ou revisão, se útil |
| [Trophy fIc](https://lottiefiles.com/free-animation/trophy-fIcDFYDwUt) | conquista ao concluir bloco |
| [Trophy T0y](https://lottiefiles.com/free-animation/trophy-T0y2OHlrU6) | alternativa para conclusão de trilha |
| [Treasurebox](https://lottiefiles.com/free-animation/treasurebox-dqC1EegeXs) | recompensa visível e previsível, sem mecanismo de sorte |
| [Cool cat](https://lottiefiles.com/free-animation/cool-cat-R68WyUB8Sp) | celebração breve após conquista |
| [Chesscat](https://lottiefiles.com/free-animation/chesscat-CzxO6d9fNA) | convite a pensar antes de uma tentativa |
| [Scholarcat YV6](https://lottiefiles.com/free-animation/scholarcat-YV6b9XfcpC) | explicação ou aprofundamento, após inspeção |
| [Orangecat M7M](https://lottiefiles.com/free-animation/orangecat-M7Mcvmydsg) | pose a avaliar |
| [Funny cat YY7](https://lottiefiles.com/free-animation/funny-cat-YY7cxv8UOC) | interação lúdica eventual, após inspeção |
| [Celebration cat B2L](https://lottiefiles.com/free-animation/celebration-cat-B2LfBuUniU) | acerto ou conclusão de bloco |
| [Angry cat](https://lottiefiles.com/free-animation/angry-cat-fyKOfvtjtG) | não usar para erros do aluno; avaliar outro contexto sem repreensão |
| [Cat rating](https://lottiefiles.com/free-animation/cat-rating-wApLF0JTol) | avaliação opcional, somente se houver fluxo definido |
| [Cat loading](https://lottiefiles.com/free-animation/cat-loading-aFQYp5ng2M) | alternativa de espera curta |
| [Orange cat fq6](https://lottiefiles.com/free-animation/orange-cat-fq6VnXcE8R) | pose a avaliar |
| [Orangecat MP5](https://lottiefiles.com/free-animation/orangecat-MP51ziWh3f) | pose a avaliar |
| [Orange cat n69](https://lottiefiles.com/free-animation/orange-cat-n69xPj3Lgr) | pose a avaliar |
| [Funny cat d18](https://lottiefiles.com/free-animation/funny-cat-d184bQuDaM) | alternativa lúdica a avaliar |
| [Celebration cat iEx](https://lottiefiles.com/free-animation/celebration-cat-iEx2vVh33b) | alternativa de conclusão |
| [Scholar cat twR](https://lottiefiles.com/free-animation/scholar-cat-twRMD9GrcC) | alternativa para ensino |
| [Animated cat fQd](https://lottiefiles.com/free-animation/animated-cat-fQdt3zVKK2) | pose a avaliar |

## Aplicação e validação

Prioridade visual para o MVP: entrada e perfis, mapa, passo didático, quiz, montagem, resultado e certificado. Antes de implementar, desenhar estados reais e testar 100% e 200% de zoom, teclado, leitura inicial, rede lenta, contraste, movimento reduzido e falhas de salvamento. Avaliação com professor é revisão inicial, não prova de compreensão infantil. O layout e a seleção final dos assets ainda não foram validados.

## Landing page implementada em 05/11/2026

A apresentação mantém cores, fonte, contornos e sombras sólidas do projeto. O gato `CZ5vmNGwmU` acompanha o título “Cada ideia vira uma peça”. Não representa uma espera de sistema. Textos, imagens, links e painéis entram com GSAP/ScrollTrigger, usando deslocamento vertical de 24px, duração de 700ms e intervalo de 90ms entre itens do mesmo grupo. A rolagem usa Lenis somente na apresentação; o toque continua nativo.

A prévia das fases tem troca automática a cada seis segundos, seleção manual, indicação da etapa e botão de pausa. Ela pausa durante hover, foco ou aba oculta. A troca de conteúdo usa 350ms e deslocamento de 12px. Correção após validação do usuário: a landing começa com as animações ligadas, independentemente da preferência do sistema. O controle “Animações” no cabeçalho permite desligar todos esses efeitos; nesse estado, as fases continuam acessíveis manualmente, os gatos ficam parados e a rolagem é nativa. A escolha dura enquanto a apresentação estiver aberta. `src/public/motionConfig.js` centraliza esses valores. Esses tempos pertencem à apresentação; as interações da trilha mantêm suas próprias configurações.

Até 1000px, a seção do método ocupa uma coluna para não comprimir o título junto ao gato. A revisão visual desta alteração não substitui os testes gerais de acessibilidade, desempenho e aprendizagem ainda previstos.


## Refinamento do carrossel

A versão atual remove o controle global de animações. A barra superior acompanha o tempo restante da fase, incluindo pausas por interação ou aba oculta. A escolha manual reinicia o tempo. O carrossel tem altura fixa por breakpoint e rolagem interna para textos maiores, evitando deslocar a página entre as fases. A seção ganha título em toda a largura, gato e bancada com H/CNOT. São componentes específicos do produto, mantendo cores e sombras sólidas aprovadas. Nenhum asset novo foi adicionado.

Refinamento atual do anfitrião: Chesscat, ID CzxO6d9fNA. Balão com contorno 4px, raio 12px e sombra sólida 6px em ink. Texto em PT-BR descreve explicação, confirmação por pergunta e montagem gradual. Removido o controle manual de pausa do carrossel, preservadas pausas de leitura e barra sincronizada.
