# Revisão adversarial do percurso de aprendizagem

> Correções autorizadas e aplicadas em 09/11/2026. Os achados abaixo registram o estado anterior. O acompanhamento da implementação e a validação atual estão na seção Correções aplicadas, ao final. A validação pedagógica com estudantes continua pendente.

Data: 09/11/2026. Base de código: commit `93fa23b`, sem alterações de aplicação durante a revisão.

**Parecer: CONCERNS, com ajustes necessários.** O percurso contém explicações e comparações úteis, mas ainda permite concluir atividades sem demonstrar a compreensão que o projeto pretende desenvolver. Também há uma instrução impossível de cumprir no exemplo correspondente e uma medição que conclui a missão apenas ao receber foco.

## Escopo e método

Foram examinadas as 29 páginas introdutórias, seus exemplos, as 15 perguntas dos quizzes, as cinco práticas, as conclusões, a prévia da landing page, a ajuda e os documentos de conteúdo pertinentes. A revisão considera o conteúdo realmente selecionado por `App.jsx`: uma versão introdutória comum. Os textos `advanced` são material legado e não foram tratados como falas exibidas atualmente aos iniciantes.

A análise percorreu, nesta ordem, as três perspectivas da skill adversarial-reviewer:

1. **Sabotador:** tentar avançar sem realizar a ação pretendida e procurar diferenças entre as instruções e o comportamento da atividade.
2. **Recém-chegado:** ler sem pressupor conhecimentos de qubits, símbolos, circuitos ou organização dos laboratórios.
3. **Auditor de integridade:** conferir o que respostas, pontos e conclusão realmente demonstram. Neste recorte didático, isso não equivale a uma auditoria de autenticação ou segurança do Firebase.

Os achados repetidos foram reunidos. O achado A3 apareceu como uma ressalva nas perspectivas de execução e integridade e foi promovido de NOTE para WARNING. Não foram identificados problemas classificados como CRITICAL neste recorte. Os demais alertas têm uma perspectiva principal indicada.

Foram executados 50 testes das suítes de conteúdo, exemplos, aula e prática, mais sete do modelo quântico: **57 passaram em cinco suítes**. Uma navegação na demonstração local confirmou o pré obrigatório e o retorno após respostas erradas no primeiro bloco. Essa navegação usou respostas fictícias de sessão, sem contas ou gravações no Firebase. Não foi um teste completo da interface dos cinco blocos, uma validação de acessibilidade com tecnologia assistiva ou uma avaliação com adolescentes.

O [inventário reproduzível](verificacoes/revisao-didatica-2026-11-09/inventario.json) registra páginas, exemplos, posições dos gabaritos e hashes dos arquivos. A [captura do quiz](verificacoes/revisao-didatica-2026-11-09/quiz-erro.png) documenta o retorno observado.

## Alertas

### A1. A explicação da moeda pede uma comparação que seu exemplo não oferece

**WARNING. Perspectiva: recém-chegado. Prioridade alta.**

Local: `src/learning/lessonContent.js:55`, `src/learning/LearningExample.jsx:42`.

Na terceira página do bloco H, a fala pede comparar uma H com duas H. Porém, essa página seleciona o exemplo `hadamard`, que oferece apenas `zero` e `hadamard`. A opção `doubleH` existe somente no exemplo `double-h`, utilizado na página seguinte. O estudante não consegue fazer o que o professor acabou de pedir naquela página.

**Correção proposta:** usar o exemplo com uma e duas H nessa fala ou anunciar explicitamente que a comparação virá na próxima página. A primeira alternativa conecta melhor a analogia ao contraste que explica seu limite.

**Aceitação:** a página que pede duas H deve oferecer esse preparo; o diagrama deve mostrar duas portas, sem medição entre elas, e a previsão deve ser 100% para 00. Acrescentar teste que associe a instrução da página às opções oferecidas, além de testar o cálculo isolado.

### A2. Navegar até o medidor já executa a medição e abre a conquista

**WARNING. Perspectiva: sabotador. Prioridade alta.**

Local: `src/learning/Lesson.jsx:92`, `src/learning/Lesson.jsx:156`, `src/learning/MissionDialog.jsx:10`.

O medidor chama `sample` tanto em `onFocus` quanto em `onMouseEnter` e `onClick`. `sample` chama `complete`, que registra a conclusão e abre o modal. Portanto, chegar ao medidor com Tab já realiza e conclui a missão, embora a instrução diga usar Tab para focar e Enter para medir. Passar o mouse também conclui a atividade imediatamente.

Esse comportamento foi solicitado anteriormente para tornar a interação explorável. O conflito atual está em tratar uma ação de navegação como execução e conclusão. O modal ainda desloca o foco para seu título, caracterizando mudança de contexto ao focar. A orientação de acessibilidade recomenda que o foco, sozinho, não provoque essa mudança. [W3C, On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html).

**Correção proposta:** usar hover e foco para destacar o medidor e explicar sua função. Medir por clique, Enter ou Espaço. Se for mantido um resultado de prévia no hover, separá-lo da medição que confirma a missão e explicar essa distinção.

**Aceitação:** Tab permite inspecionar o controle sem medir, pontuar ou abrir modal. A ativação explícita mede uma vez e conclui uma vez. O texto deve corresponder ao comportamento. Os testes atuais exercitam foco, hover e clique juntos; precisam distinguir esses eventos e suas consequências.

### A3. A conclusão verifica os encaixes, mas não a compreensão das peças

**WARNING, promovido de NOTE por recorrência. Perspectivas: sabotador e auditor de integridade. Prioridade alta.**

Local: `src/learning/Lesson.jsx:69`, `src/learning/Lesson.jsx:72`, `src/circuit/practice.cjs:1`, `tests/unit/lesson.test.jsx:102`, `src/learning/lessonContent.js:110`.

O estudante pode errar as três perguntas e concluir o bloco seguindo os encaixes indicados. O teste existente confirma três erros seguidos e conclusão com quatro pontos. H e CNOT têm uma peça e um destino válido; na medição, basta acionar o controle. A retomada final pede explicar o caminho com as próprias palavras, mas não recebe uma resposta nem verifica essa explicação.

Isso segue a decisão de tentativa única e avanço após a correção. O problema é usar apenas esses sinais para julgar se o objetivo de compreender cada parte foi atendido. Eles demonstram participação e montagem guiada, sem distinguir quem compreendeu de quem seguiu as indicações. O certificado atual se apresenta como conclusão, e essa distinção deve ser preservada.

**Correção proposta:** manter a primeira resposta pontuada e acrescentar um pequeno reforço sem pontos. Antes de encaixar ou medir, pedir uma previsão e depois comparar com o resultado. Após um erro, mostrar o motivo da correção e oferecer uma variação guiada do mesmo conceito. Essa variação não altera a nota original nem precisa exigir texto livre ou correção por IA.

Exemplos: no preparo, identificar qual número do par pertence a cada linha; em H, prever o que muda e o que continua em 0; em CNOT, testar 01 ou 11 e explicar qual posição mudou; em Bell, comparar o circuito com e sem CNOT. No encerramento, relacionar preparar, H, CNOT e medir às suas funções.

**Aceitação:** cada bloco inclui ao menos uma previsão e uma explicação do que foi observado, sem novo desconto. A conclusão registra o percurso realizado, sem afirmar domínio. Qualquer nova condição obrigatória de desbloqueio deve ser explicitada nos requisitos, pois ainda é proposta.

### A4. O gabarito é previsível pela posição e algumas alternativas quase não exigem reflexão

**WARNING. Perspectiva: auditor de integridade. Prioridade alta.**

Local: `src/learning/content.js:71`, `src/learning/lessonContent.js:46`, `src/learning/lessonContent.js:69`. Contagem: `verificacoes/revisao-didatica-2026-11-09/inventario.json`.

Em 12 das 15 perguntas, a alternativa correta ocupa a primeira posição. Não há reorganização na renderização. Marcar sempre a primeira opção rende 12 acertos, independentemente da leitura. Isso é uma propriedade do questionário, não uma observação de comportamento de participantes.

Alternativas como “O qubit desaparece” ou “Mede uma vez e inventa o restante” também podem ser descartadas sem entender a regra ensinada. Há bons contrapontos no material, como confundir mesma chance com alternância ou CNOT com cópia; convém usá-los com maior consistência.

**Correção proposta:** distribuir as respostas corretas entre as posições e revisar alternativas a partir de dúvidas plausíveis. Se houver embaralhamento, manter a ordem estável durante a tentativa e usar identificadores de alternativa no checkpoint. Não reordenar escolhas ao recarregar uma pergunta respondida.

**Aceitação:** revisar os 15 itens, conferir gabarito e justificativa de todas as opções e verificar restauração da alternativa escolhida. O item deve exigir a ideia ensinada, sem depender de pegadinhas ou palavras difíceis.

### A5. Alguns exemplos introduzem símbolos, portas ou linhas sem acompanhar o recorte da fala

**WARNING. Perspectiva: recém-chegado. Prioridade média.**

Locais: `src/learning/lessonContent.js:10`, `src/learning/experiments.cjs:6`, `src/learning/ExperimentPanel.jsx:37`, `src/learning/MiniCircuit.jsx:9`, `src/learning/LearningExample.jsx:43`.

Há três problemas distintos de orientação dentro dos exemplos:

- O exemplo inicial de qubit já usa o rótulo “Sem H” antes de H ser apresentada. A superposição recebe um nome acessível em Preparar, mas em Experimentar o mesmo caso volta a se chamar “H uma vez”.
- O laboratório de medição fala em um qubit de treino, mas seu `MiniCircuit` sempre desenha dois. A prática principal desse bloco, por sua vez, mostra uma linha. As probabilidades estão corretas para o primeiro qubit; falta coerência na representação apresentada ao iniciante.
- O exemplo da CNOT se chama “Troque controle e alvo”, mas os botões trocam seus valores 0/1. Os papéis das linhas permanecem fixos. O título pode sugerir uma operação que o exemplo não realiza.

Também falta, no texto introdutório ativo, uma apresentação direta do símbolo isolado `|0⟩` antes de seu uso nos desenhos. A versão formal possui essa apresentação, mas não é selecionada pela aplicação. O par `|00⟩` recebe explicação posteriormente.

**Correção proposta:** usar “Preparar em 0” e “Superposição com chances iguais” de forma consistente antes do bloco H; desenhar somente o qubit utilizado no treino de medição; renomear o exemplo da CNOT para “Mude os valores de entrada”; apresentar `|0⟩` como o desenho usado para indicar um qubit preparado em 0. Na primeira aparição, explicar “preparação” como a forma de deixar o qubit pronto antes das operações e “estado” como a descrição dessa condição.

**Aceitação:** uma revisão da primeira aparição de cada termo e símbolo não deve depender de textos formais ocultos. O número de linhas e os títulos devem corresponder ao que o estudante pode manipular.

### A6. As instruções não acompanham toda a navegação necessária entre abas

**WARNING. Perspectiva: recém-chegado. Prioridade média.**

Local: `src/learning/lessonContent.js:36`, `src/learning/lessonContent.js:53`, `src/learning/ExperimentPanel.jsx:37`, `src/learning/ExperimentPanel.jsx:44`.

As abas reduziram o excesso de conteúdo em tela, mas as falas ainda pedem “clique em fazer 20 rodadas” e “observe a contagem” como se controles e gráfico estivessem juntos. A abertura padrão é Preparar; a ação fica em Experimentar; a contagem detalhada fica em Resultados. Há uma orientação de Preparar para Experimentar, porém a aba de execução não indica consultar Resultados após medir.

O aluno precisa descobrir a sequência de navegação ao mesmo tempo que aprende probabilidade. Esse risco de confusão é uma avaliação de interface; ainda não foi medido com adolescentes.

**Correção proposta:** orientar pelos nomes visíveis: “Em Preparar, escolha H uma vez. Abra Experimentar e faça 20 rodadas. Depois, veja a contagem em Resultados”. Acrescentar uma ligação direta para Resultados após a execução e explicar que escolher outro preparo inicia uma nova contagem.

**Aceitação:** executar cada instrução literalmente, desde a aba inicial, deve levar ao controle e à informação mencionados. Preservar a organização manual em abas e os dados ao navegar entre elas.

### A7. Documentos e mensagens ainda descrevem regras anteriores

**WARNING. Perspectiva: recém-chegado. Prioridade média.**

Locais: `REQUISITOS-E-CASOS-DE-USO.md:22`, `REQUISITOS-E-CASOS-DE-USO.md:36`, `REQUISITOS-E-CASOS-DE-USO.md:39`, `REQUISITOS-E-CASOS-DE-USO.md:117`, `features/conteudo_e_experimentos.feature:8`, `features/conteudo_e_experimentos.feature:63`, `CONTEUDO_E_EXPERIMENTOS.md:3`, `src/app/App.jsx:92`, `src/public/LandingPage.jsx:47`.

O cabeçalho dos requisitos registra a tentativa única e a introdução comum, mas RF35/RF44/RF47/UC06 ainda descrevem tentativas ilimitadas, três acertos ou conteúdo por escolaridade. Há cenários Gherkin com as mesmas regras antigas. `CONTEUDO_E_EXPERIMENTOS.md` contém principalmente uma descrição antiga dos questionários, inclusive referência à versão 2, em vez do mapa de conteúdo indicado pelo nome.

Na interface, a contagem regressiva diz “Você pode tentar de novo”, sem explicar que isso depende de refazer o bloco. A landing ainda associa o acerto à liberação da prática. A ajuda interna já explica a tentativa única corretamente.

**Correção proposta:** atualizar os itens e cenários vigentes diretamente, mantendo o histórico em seção própria; reconstruir o documento de conteúdo com objetivos, exemplos e critérios de cada bloco; alinhar landing e contagem regressiva à tentativa única. Não restaurar regras antigas apenas para corresponder aos cenários desatualizados.

**Aceitação:** requisitos, Gherkin, ajuda e interface devem responder da mesma forma a “o que acontece se eu errar?” e “a escolaridade muda o conteúdo?”. Manter o questionário de pesquisa separado do quiz de aprendizagem.

## Notas de melhoria

### N1. Dar um retorno próprio para o erro

Local: `src/learning/Lesson.jsx:139`, `src/learning/lessonContent.js:3`.

O erro recebe o gabarito seguido do mesmo `feedback` usado no acerto. Isso pode produzir “A resposta correta é [...]. Isso!” ou “Correto!”. Os textos `retry` já elaborados não são utilizados nesse retorno. A resposta correta e sua explicação aparecem, portanto não há gabarito trocado. O ajuste é usar uma explicação acolhedora do erro, sem frases de acerto deslocadas. Essa revisão complementa A3.

Exemplo: “Nesta figura há duas linhas. Cada linha representa um qubit, então usamos dois. Vamos conferir onde cada um aparece?” Não acrescentar punição, ridicularização ou novos descontos.

### N2. Evitar apagar amostras ao clicar novamente no preparo já selecionado

Local: `src/learning/ExperimentPanel.jsx:23`, `src/learning/Lesson.jsx:145`.

O botão de preparo chama `reset` mesmo quando o preparo escolhido não mudou. Avançar a explicação e voltar também recria o exemplo, apagando suas amostras. As trocas de abas, corretamente, preservam os dados.

Trocar de preparo com reinício de contagem já é uma decisão vigente. A melhoria é não limpar ao selecionar o mesmo caso, avisar antes do reinício e avaliar manter os resultados por página durante a sessão. Isso facilita voltar à explicação e comparar com o que foi medido, sem prometer salvamento desses laboratórios na conta.

### N3. Apresentar o propósito e uma continuação concreta

Locais: `src/learning/lessonContent.js:6`, `src/learning/lessonContent.js:104`, `src/learning/lessonContent.js:110`, `src/app/screens/CertificateScreen.jsx:8`.

O percurso começa no bit e encerra recomendando investigar outros circuitos. Falta uma fala inicial que conecte a montagem à computação quântica e uma indicação concreta de próximo estudo. “Emaranhamento” aparece na versão introdutória sobretudo em um aviso sobre o que não basta para prová-lo; cabe uma apresentação positiva curta após a CNOT, sem exigir fórmulas.

Sugestão inicial: “Um circuito é uma sequência de operações sobre qubits. Aqui vamos preparar duas dessas unidades de informação, mudar seu estado com duas portas e medir o resultado. Vamos usar um simulador no computador para acompanhar cada passo”. Ao chegar a Bell, explicar que é uma preparação conjunta dos dois qubits, ligada ao conceito de emaranhamento, preservando a ressalva sobre resultados iguais.

No final, oferecer um próximo estudo introdutório identificado, como outras portas ou o uso de Bell em protocolos de comunicação quântica. Não apresentar este circuito como uma aplicação completa ou como prova de vantagem sobre computadores comuns. Isso amplia a orientação sem aumentar o escopo de implementação para teleportação.

## Conferência por bloco

| Bloco | O que já está explicado | Ajuste prioritário | Pequena demonstração de compreensão proposta |
|---|---|---|---|
| Conheça os qubits | Bit, qubit, duas linhas, ordem do par e leitura do circuito | Apresentar símbolos e preparos sem antecipar H; revisar perguntas e retorno | Indicar a linha correspondente a cada posição de um par diferente de 00 |
| Observe uma medição | Um resultado por rodada; 0/1 preparados; repetir o preparo | Coerência de uma linha; ativação explícita do medidor; orientação entre abas | Prever 1 ao preparar 1 e comparar com 0, sem mudar o circuito principal |
| Experimente H | H em 0, probabilidades iguais, ausência de alternância, duas H | Corrigir o exemplo da moeda; ligar a porta à previsão e ao teste | Comparar sem H, uma H e duas H, explicando o que mudou |
| Conecte com CNOT | Controle, alvo, quatro entradas, desenho, ordem e atuação após H | Corrigir título e verificar regra além do encaixe indicado | Prever e testar 11 → 10, identificando controle preservado e alvo alterado |
| Descubra Bell | Preparação completa, 00/11, correlação, limites da evidência | Recuperar a função de cada peça e oferecer continuidade | Relacionar preparar/H/CNOT/medir às funções e comparar com o circuito sem CNOT |

As demonstrações propostas são reforços didáticos. Ainda não foram implementadas nem validadas como instrumentos de avaliação.

## Conteúdos que devem ser preservados

A revisão não recomenda encurtar as explicações só para reduzir o tempo de leitura. Repetir um conceito com previsão, comparação e ação pode atender melhor o iniciante. O material já acerta ao:

- diferenciar previsão de chance e contagem observada;
- preparar novamente o estado em cada rodada;
- explicar que 50% não exige alternância ou dez resultados de cada tipo em vinte;
- limitar a analogia da moeda e mostrar H duas vezes sem medição intermediária;
- apresentar as quatro entradas da CNOT e esclarecer que ela não copia qualquer qubit;
- comparar a ordem H/CNOT;
- separar resultados correlacionados de mensagens instantâneas e de prova isolada de emaranhamento;
- oferecer explicação textual, números e controles, além das animações.

Os sete testes do modelo passaram para as operações e preparações examinadas. A referência da IBM também descreve H e CNOT na preparação de Bell. Isso apoia a conferência conceitual, sem validar a compreensão de quem usa a interface. [IBM, Quantum mechanics basics](https://quantum.cloud.ibm.com/learning/en/courses/use-a-qc-today/quantum-mechanics-basics).

O guia do IES recomenda combinar representações visuais e explicações verbais, relacionar exemplos concretos às ideias e usar perguntas para recuperar o aprendido. As propostas de previsão, ação e explicação foram aplicadas como decisões deste projeto, sem afirmar que o guia valida esta plataforma. [IES, Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/20072004.pdf).

## Ordem de correção e limites do parecer

Primeiro, corrigir A1 e A2, que são desencontros verificáveis entre fala e comportamento. Depois, revisar os 15 itens e acrescentar reforços por bloco, mantendo a tentativa única pontuada. Em seguida, alinhar termos, desenhos, orientação das abas, documentação e mensagens.

Para revisar os textos, usar a sequência: apresentar a ideia em palavras comuns; mostrar um caso; pedir uma previsão; executar; explicar a diferença; relacionar a ação à peça do circuito. A mesma ideia pode aparecer novamente quando assumir outra função. A extensão deve acompanhar essa necessidade, com pausas e navegação controladas pelo estudante.

A avaliação com participantes deve conferir se conseguem explicar o que fizeram e aplicar a regra em uma pequena variação. As previsões de dificuldade deste relatório são hipóteses de revisão, não resultados de testes com adolescentes. A eventual aplicação com universitários também não valida automaticamente o público adolescente. Os questionários pré/pós medem apenas os itens previstos no instrumento, sem cobrir por si sós a compreensão de todas as peças.

No encerramento da revisão inicial, os itens ainda eram propostas. O usuário autorizou sua aplicação posteriormente, registrada abaixo. As entregas acadêmicas permaneceram preservadas.

## Reprodução da conferência técnica

Executar a partir da raiz do repositório:

```powershell
node verificacoes/revisao-didatica-2026-11-09/auditar-conteudo.cjs
node node_modules/jest/bin/jest.js --runInBand --runTestsByPath tests/unit/didactic-content.test.jsx tests/unit/examples.test.jsx tests/unit/lesson.test.jsx tests/unit/practice.test.cjs tests/unit/model.test.cjs
```

O inventário é derivado do conteúdo ativo e não contém respostas de pessoas. Cobertura de linhas e testes técnicos não certificam coerência pedagógica; na revisão inicial, as suítes ainda não verificavam a comparação pedida na página da moeda. Essa regressão passou a ser verificada na implementação registrada abaixo.

## Correções aplicadas em 09/11/2026

| Item | Aplicação e verificação |
|---|---|
| A1 | A página da moeda usa double-h e oferece zero, uma e duas H. O teste de regressão verifica a ligação da fala ao controle e à previsão. No navegador, duas H produziram 20 resultados 00 em 20 rodadas, coerentes com a previsão determinística. |
| A2 | Foco e hover não chamam sample; clique, Enter e Espaço ativam o medidor. A previsão conduz o foco para a ação recém-liberada, sem executá-la. Conferidos Tab e retorno ao medidor sem modal; Enter e Espaço concluíram suas respectivas medições. |
| A3 | Cada bloco tem uma previsão guiada sem pontos antes da bancada, com explicação e novas tentativas até o acerto. Conferir a previsão libera peças ou medidor; a ação efetiva ainda é obrigatória. O checkpoint guarda escolha e confirmação. Conclusões antigas continuam válidas. Isso reforça o conteúdo, sem comprovar aprendizagem. |
| A4 | Os 15 itens têm posições estáveis, com cinco gabaritos em cada posição. Distratores foram revisados. Novos quizzes usam CONTENT_REVISION 3; checkpoints revisão 2 mantêm perguntas e alternativas anteriores, inclusive ao rever explicações. Notas anteriores não foram recalculadas. |
| A5 | Preparos anteriores a H têm nomes cotidianos em todas as abas; medição de treino desenha uma linha; título de CNOT descreve a alteração de valores. Estado, preparação e símbolos foram apresentados no texto ativo. |
| A6 | Falas orientam pelas abas. Ver resultados abre o painel e move o foco para sua aba. O aviso explica o reinício ao trocar preparo. As conclusões indicam Continuar explorando e Compare e experimente mais para acessar o laboratório. |
| A7 | Requisitos, casos de uso, cenários Gherkin, ajuda, contagem e landing foram alinhados. O documento de conteúdo voltou a mapear ensino e experimentos. O instrumento pré/pós continua na versão 3 e não foi alterado. |
| N1 | Retorno do erro usa retry, junto ao gabarito, sem comemoração de acerto. |
| N2 | Selecionar o mesmo preparo preserva amostras. Exemplos ficam montados e ocultos ao reler a página ou voltar das perguntas dentro da sessão do bloco. Sair ou recarregar reinicia esses laboratórios, conforme documentação. |
| N3 | Abertura explica circuito e simulador; CNOT introduz a ideia de estado conjunto. A conclusão indica material da IBM, com aviso de idioma inglês. |

Foram aprovados **132 testes em 22 suítes**, com **100% de cobertura em instruções, ramificações, funções e linhas** de src. A compilação de produção passou com três avisos de tamanho de pacote, aproximadamente 866 KiB antes da compressão HTTP. Essa dívida de desempenho não foi resolvida nesta correção didática.

Na demonstração local, foi percorrido o fluxo dos cinco blocos, do pré obrigatório à conclusão e ao retorno ao mapa, com 50 pontos após 15 acertos. Uma previsão respondida incorretamente e corrigida não retirou pontos. Foi conferido o foco sem medição, a ativação por Enter e Espaço, a comparação de duas H e a preservação das amostras ao reler. Não houve erros registrados no console nesse percurso. Foram usados somente dados fictícios de sessão, sem contas ou gravações no Firebase.

As capturas e medidas incluem larguras solicitadas de 1440, 768 e 390px. O navegador aplicou sua escala e expôs larguras CSS diferentes, registradas em responsividade.json; os painéis medidos permaneceram dentro da área útil, sem transbordamento horizontal. A verificação funcional principal foi feita sem as transições longas na sessão de demonstração; a passagem anterior conferiu a cortina e a contagem com animações ligadas. Isso não é avaliação formal de acessibilidade ou de aprendizagem com adolescentes.

Evidências em verificacoes/revisao-didatica-2026-11-09/: inventario.json preserva o estado anterior; inventario-aplicado.json registra o conteúdo atual e seus hashes; validacao.json resume as verificações. As capturas previsao-1440.png, previsao-768.png, previsao-390.png, medidor-focado.png, duas-h-resultados.png e trilha-concluida.png documentam os estados conferidos. Algumas capturas antecedem os últimos ajustes de texto dos títulos e das conclusões, sem mudança no fluxo verificado.

As alterações são locais. A etapa não incluiu publicação, alteração de regras Firebase ou coleta com estudantes. As entregas da Sprint 1 e Sprint 2 foram preservadas.
