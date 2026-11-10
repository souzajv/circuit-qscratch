# Testes unitários e cobertura

Atualização de 10/11/2026: as novas suítes do painel cobrem criação/gestão de alunos, links, consultas, permissões visuais, erros e adaptador HTTP. Testes Node em `tests/server` verificam domínio e autorização da API com dependências injetadas; `test:rules` verifica Firestore no emulador. A bateria Playwright em `tests/e2e` agora exercita três jornadas com frontend, API e emuladores oficiais. As referências abaixo a E2E ainda futuro são históricas. O limiar de 100% continua aplicado ao JavaScript de `src`; não representa cobertura medida de 100% do servidor, CSS ou serviços externos.

A suíte usa Jest, Testing Library e jsdom. Execute `npm test` ou `npm run test:coverage` na raiz. O relatório navegável fica em `coverage/index.html`; o resumo legível por ferramentas fica em `coverage/coverage-summary.json`. O comando de cobertura exige 100% de instruções, ramificações, funções e linhas para todo JavaScript, JSX e CJS em src/, inclusive a entrada. Não há exclusões de arquivos de aplicação nem comentários para ignorar cobertura.

Em 05/11/2026, após os ajustes da landing page, 57 testes em treze suítes passaram com as quatro métricas em 100%. A compilação de produção também passou, com aviso de tamanho do pacote JavaScript, de aproximadamente 765 KiB antes da compressão HTTP. Os relatórios são gerados localmente e ignorados no Git.

## Responsabilidades verificadas

| Suíte | O que verifica |
|---|---|
| model.test.cjs | CNOT nas quatro entradas, H duas vezes, fase complexa, amplitudes e probabilidades de Bell, colapso e arredondamento |
| learning.test.cjs | Pontuação, piso, melhor nota e ordem de portas |
| practice.test.cjs | Encaixes e resultado único por preparação |
| lesson.test.jsx | Falas, quiz, dica, erro, liberação da prática, cada missão, teclado/clique e eventos de arraste, conclusão e rolagem |
| ui.test.jsx | Pontos, ícones, estados do circuito, mascotes, traçado, áudio e cortina |
| app.test.jsx | Navegação, preferências, desbloqueio, soma de melhores notas e primeira conclusão; atividade substituída por um componente controlado |
| entry.test.jsx | Conexão da aplicação ao elemento HTML de entrada |
| public.test.jsx | Apresentação, conteúdo da prévia, respostas e navegação pública |
| landing-motion.test.jsx | Troca automática, pausa, foco, aba oculta, movimento reduzido e limpeza dos contratos GSAP/Lenis |

## Limites

Cobertura mede execução de trechos, não prova ausência de defeitos. Os testes usam navegador simulado e substituem APIs de áudio, animação e geometria. Não baixam arquivos Lottie nem confirmam a execução deles em navegador real. CSS, layout responsivo, efeitos visuais e serviços Firebase exigem verificações próprias. Os arquivos Gherkin continuam especificações sem executor. Estes testes não comprovam aprendizagem.

A suíte observa comportamentos, como exigir a previsão antes da bancada e impedir pontos extras por repetir uma medição. O teste da composição usa uma atividade controlada para isolar a navegação, enquanto Lesson é verificado separadamente. Isso não equivale a uma jornada E2E.

GSAP, ScrollTrigger e Lenis são substituídos por implementações controladas no teste unitário. As expectativas verificam chamadas, sincronização, desmontagem e comportamento do carrossel; a cobertura não comprova fluidez ou animação real. A inspeção visual complementar fica em `../verificacoes/landing-2026-11-05/`.

## Próximas mudanças com TDD

Escolher o requisito e o cenário, escrever uma expectativa que falhe pelo comportamento ausente, observar a falha, implementar o mínimo e refatorar com a suíte verde. Manter os quatro limiares de cobertura. Não excluir código ou adicionar testes sem afirmações úteis para satisfazer a métrica. A implementação anterior foi consolidada com testes de regressão; não alegar que todo o histórico foi desenvolvido com teste antes do código.



As suítes access.test.jsx e firebase.test.jsx verificam login, cadastro, confirmação, falhas, requisições duplicadas, recuperação de senha e o adaptador do SDK. O SDK Firebase é simulado nos testes unitários. Uma verificação separada com conta fictícia confirmou cadastro, updateProfile, signOut e novo login no projeto real; a conta foi removida ao final. O roteiro manual está em tests/integration/firebase-smoke.mjs e exige rede, cria uma conta fictícia e a apaga. Não envia e-mails nem testa o recebimento do link de recuperação.

Persistência: account-trail.test.jsx cobre carga da conta, falhas, nova tentativa, troca de conta, salvamento serial e respostas tardias. progress-storage.test.jsx verifica fusão transacional de blocos, melhores notas e primeira conclusão. O roteiro manual versionado tests/integration/progress-smoke.mjs usa contas fictícias no Firebase real e remove registros/contas ao final. A inspeção visual progress-browser.mjs permanece local, pois depende de ferramentas instaladas nesta máquina. Esses roteiros não são executados por npm test.

Conteúdo ampliado: didactic-content.test.jsx verifica versões por público, perguntas e previsões do modelo; examples.test.jsx verifica controles dos laboratórios, histórico, troca/limpeza de preparos, diagrama/tabela, movimento reduzido e configurações inválidas. lesson.test.jsx verifica as três respostas e a previsão antes da prática, retorno à explicação sem apagar a tentativa e retomada da pergunta. Os gráficos mostram probabilidade teórica e contagem real, sem teste que exija 50% exatos nas amostras. O roteiro local de navegador percorreu os cinco blocos em demonstração e registrou larguras de 1440, 768 e 390px; ele não é um executor dos arquivos Gherkin nem avaliação pedagógica com estudantes.

Questionários: survey.test.jsx e survey-flow.test.jsx cobrem etapas, respostas Sim/Não, retorno, recusa, rascunho, erro/reenvio e encaixe no percurso. account-trail/progress-storage cobrem fila, confirmação e preservação do primeiro registro final. O roteiro survey-smoke.mjs confirmou no Firebase real a gravação por UID e o bloqueio anônimo/segunda conta. O navegador confirmou o formulário inicial em 1440/768/390px, gravação pela interface e ausência de repetição; conta fictícia e dados removidos ao final. Não são testes de eficácia pedagógica ou validação do instrumento.

Revisão posterior: formulário inicial versão 2 com escolaridade obrigatória; erro do quiz encerra a pergunta, com answered salvo no checkpoint. Testes cobrem três erros permitindo prática com nota reduzida, retomada de erro sem nova chance e preservação da versão anterior do questionário no arquivo histórico.

## Correções didáticas de 09/11/2026

A suíte didactic-regressions.test.jsx foi iniciada antes da implementação: sete expectativas falharam pelos comportamentos ausentes e uma já passou pela compatibilidade existente. Depois foram acrescentadas verificações de releitura, correção do erro, retomada de versões e preservação da rodada. O quiz tem uma confirmação; a previsão prática permite novas tentativas sem pontos até o acerto. As suítes antigas foram atualizadas para percorrer esse reforço. A validação final e suas evidências estão em REVISAO_DIDATICA_2026-11-09.md, na raiz do repositório.
