> Atualização do instrumento: versão 3, com oito perguntas no pré obrigatório e sete etapas no pós opcional. Interesse e confiança usam escalas pareadas; clareza e uso são separados; duas questões de conteúdo sem pontos nem correção e comentário final opcional. Ver QUESTIONARIOS_PESQUISA.md. Descrições anteriores de Sim/Não referem-se às versões antigas.

> Decisões mais recentes: formulário inicial obrigatório com escolaridade autodeclarada em quatro categorias; pós-formulário opcional. Cada pergunta do quiz aceita uma confirmação por tentativa do bloco. Erros mostram X, a resposta correta e retorno pedagógico, e permitem seguir após a animação de erro. A prática exige três respostas confirmadas, não três acertos. A pontuação mantém descontos e piso anteriores. Estas decisões substituem requisitos anteriores de tentativas ilimitadas, acerto obrigatório e pré-formulário opcional.

> Decisão mais recente: versão introdutória única, sem seleção de escolaridade, com pré obrigatório e pós opcional vinculados à conta. As referências anteriores à adaptação por nível são históricas. Fluxos e dados atuais: [Questionários](QUESTIONARIOS_PESQUISA.md). RF50: oferecer pré antes da primeira explicação para contas sem progresso; RF51: oferecer pós após Bell antes de concluir/sair; RF52: salvar por UID, separar rascunho/envio/recusa, aguardar confirmação e permitir reenvio após falha; RF53: mostrar uma pergunta por etapa, com opções adequadas, progresso, revisão, comentário opcional e nenhum efeito nos pontos.

# Requisitos e casos de uso da plataforma

Atualização de 10/11/2026: contas individuais podem ser de aluno ou professor. Professores criam alunos por link, sem gestão familiar nem senha de responsável. Administrador consulta contas de toda a plataforma. O percurso introdutório continua comum; escolaridade é autodeclarada no pré e não altera o conteúdo. Para alunos vinculados, o professor pode desligar pré e pós separadamente. Condições institucionais para dados reais de menores permanecem pendentes. A implementação local dos painéis não equivale à ativação em produção; conferir [Painéis e acessos](PAINEIS_E_ACESSOS.md).

Decisão de 05/11/2026: Firebase Authentication passa a cuidar de cadastro individual, login e recuperação de senha. O projeto `circuit-qscratch` foi criado no plano Spark e o provedor de e-mail/senha está habilitado. O rascunho Supabase permanece histórico, sem integração nem migração automática; o progresso usa o Firestore conforme a atualização de integração registrada neste documento. Os requisitos abaixo são comportamentos desejados, não funcionalidades prontas. A trilha usa Bell: |00⟩, H no primeiro qubit, CNOT com controle no primeiro e alvo no segundo, medição ideal com 00 ou 11 e 50% para cada. A experiência é simulação clássica. O usuário escolheu pontuação de até 10 por bloco, menos 2 por erro e 2 pela primeira dica, piso 2; ao refazer uma atividade só se acrescenta a melhora da melhor pontuação. A escolaridade não altera o conteúdo ou o gabarito.

## Fluxo de aprendizagem vigente

Cada bloco segue ensinar, responder três perguntas, conferir uma previsão sem pontos, montar ou medir e concluir. O quiz aceita uma confirmação por pergunta, inclusive no erro. A previsão aceita novas tentativas com explicação até o acerto e então libera a bancada, sem alterar a nota. Os pontos entram após a ação prática. Conclusões anteriores permanecem válidas.

| ID | Comportamento esperado |
|---|---|
| RF32 | Separar as fases de explicação, quiz e prática, sem apresentar as três como atividades simultâneas. |
| RF33 | Ensinar com falas em balão, nome do estudante e versão introdutória comum. Apresentar termos e símbolos e preservar repetições úteis. Próximo e Anterior percorrem as falas; Iniciar teste aparece ao final. |
| RF34 | Com animações ligadas, fechar a cortina, contar 5 a 1 sobre ela e abri-la com a pergunta e o mascote já preparados. Sem animações, abrir diretamente a próxima fase. Não pontuar por velocidade. |
| RF35 | Desabilitar conferência sem alternativa e aceitar uma confirmação por pergunta do quiz. No erro, mostrar X na escolha, destacar a correta e explicar a correção; bloquear novo envio e permitir avanço. A primeira dica do bloco desconta 2 pontos, com aviso prévio. |
| RF36 | Mostrar check e Cool cat no acerto; X, gato de erro e correção no erro. Respeitar animações. O botão mostra o resultado por 2 segundos, depois Próxima pergunta ou Experimentar no circuito na terceira resposta. Avanço exige clique, sem exigir três acertos. |
| RF37 | Oferecer encaixes por arraste e por seleção seguida de clique ou teclado; mostrar só destinos permitidos pela missão. Na prática de H, somente a primeira linha recebe encaixe. |
| RF38 | Concluir após previsão prática conferida e ação obrigatória. Foco e hover não medem nem concluem; clique, Enter ou Espaço ativam o medidor. Antes da primeira conclusão, a prévia mostra só duas linhas, sem rótulos de qubits ou estados. |
| RF39 | Ao concluir a prática, abrir um modal brutalista com Cat rating, explicação da conquista e avanço. Manter a bancada e suas instruções no lugar. Permitir fechar, continuar explorando e reabrir sem pontuar outra vez. Conclusão de todos os blocos troca o card do mapa por mensagem de conquista, Treasurebox e Revisar a trilha. |
| RF40 | Ocultar o menu lateral dentro dos blocos e acompanhar o avanço com rolagem que revele a confirmação ou o próximo bloco no mapa, sem encobrir a ação pelo rodapé. |
| RF41 | No desktop, manter painel lateral da trilha parado e rolagem interna sem barra visual. Em tela estreita, usar uma coluna e rolagem vertical da página. Conectar os blocos com curva tracejada contínua. |
| RF42 | Iniciar a sessão com sons e animações ligados, com controles separados. O conteúdo e as ações devem funcionar com ambos desligados. |
| RF43 | Destacar o total de pontos com ícone e ajuda por hover, foco ou toque, explicando descontos, piso, melhor nota e crédito somente após a prática. |

### Enriquecimento didático em 06/11/2026

| ID | Comportamento esperado |
|---|---|
| RF44 | Oferecer 29 páginas introdutórias comuns, com exemplo ao lado a partir de 1200px e abaixo nas menores. A fala corresponde aos símbolos, linhas e controles disponíveis; referências de posição acompanham o layout. |
| RF45 | Permitir comparar preparo em 0/1, sem H/com H/H duas vezes, quatro entradas de CNOT, ordem das portas e circuito de Bell, usando o modelo matemático da aplicação. |
| RF46 | Separar chance prevista de frequência observada; cada rodada deve preparar o estado novamente. Não exigir contagens iguais nem obtenção de todos os resultados. |
| RF47 | Exigir três respostas confirmadas antes da prática. Erros e primeira dica afetam a nota única entre 2 e 10. Distribuir gabaritos entre posições e usar alternativas plausíveis, com ordem estável por revisão. Preservar perguntas e escolhas de tentativas antigas. |
| RF48 | Permitir rever a explicação durante o quiz sem apagar pergunta, erros, dica ou acerto. Retomar o checkpoint da pergunta atual. |
| RF49 | Explicar a conquista e oferecer comparações sem pontos ou alteração da montagem. Abas manuais Preparar, Experimentar e Resultados preservam dados e têm instruções pelos nomes; oferecer Ver resultados após medir. Reler a página na mesma sessão do bloco preserva amostras. Trocar preparo reinicia com aviso; escolher o mesmo não limpa. |
| RF54 | Antes da bancada, pedir uma previsão sobre o conceito do bloco, com explicação e novas tentativas sem efeito na nota até o acerto. Salvar escolha e confirmação no checkpoint da conta. Não reaplicar a blocos já concluídos. |
| RF55 | Explicar o propósito do circuito, estado, preparação e símbolos básicos; apresentar cada peça e indicar próximo estudo com idioma informado após a conclusão. |

| Bloco | Ação que conclui a prática |
|---|---|
| Conheça os qubits | Encaixar um qubit em cada linha. Um único encaixe não basta. |
| Observe uma medição | Medir o qubit de treino preparado em zero, sem modificar o circuito principal. |
| Experimente a porta H | Encaixar H na primeira posição do qubit de cima. |
| Conecte com CNOT | Encaixar CNOT após H com controle superior e alvo inferior. |
| Descubra o estado de Bell | Preparar o circuito e medir uma rodada, sem exigir resultados diferentes. |

Hover e foco apenas destacam o medidor. Clique, Enter ou Espaço revelam uma amostra por rodada; novas ativações mantêm o resultado até Preparar outra rodada, sem pontuar novamente. Em Bell, cada novo preparo inicializa 00 e aplica H e CNOT.

### Estado da prévia e pendências

As fases, os encaixes, a pontuação em memória e os mascotes estão no código atual. Atualização posterior: autenticação e retomada do último checkpoint confirmado estão integradas ao Firebase Auth/Firestore. O rascunho Supabase não está integrado. Reabrir bloco em andamento preserva os erros e dicas salvos; dados ainda não confirmados podem ser perdidos ao fechar a página. A revisão das explicações durante o quiz preserva a tentativa. Os laboratórios ampliados de H e das quatro entradas da CNOT estão implementados. A tela de conclusão da sessão não equivale a certificado emitido pelo servidor.

RNF11 permanece um critério alvo: a rolagem já considera movimento reduzido do dispositivo; a aplicação automática dessa preferência a todas as animações decorativas ainda deve ser ajustada e verificada. Os controles manuais existem. A documentação não declara acessibilidade validada ou aprendizagem comprovada.

## Requisitos funcionais

### Professores, alunos por link e administração

Estas regras prevalecem sobre referências anteriores que tratam todas as contas como individuais por e-mail ou o pré como obrigatório sem exceção. Não reintroduzem os perfis familiares antigos.

| ID | Comportamento esperado |
|---|---|
| RF56 | Oferecer Aluno e Professor no cadastro, explicar a diferença e concluir o papel no servidor antes da entrada. Falha permite reenvio sem duplicar a conta criada. Não permitir autocadastro como administrador. |
| RF57 | Mostrar Meus alunos somente para professor e Administração para administrador, sem retirar a trilha de aprendizagem desses papéis. |
| RF58 | Professor cria aluno com nome/apelido e opção conjunta de pré/pós. Retornar link de segredo forte uma única vez; informar que qualquer portador pode usá-lo em outros aparelhos até revogação. |
| RF59 | Entrar pelo link sem e-mail/senha, avisar da substituição da sessão atual e usar sempre o mesmo UID/progresso. Remover segredo do endereço após autenticação. Link inválido/revogado informa falha sem abrir a trilha. |
| RF60 | Professor lista e consulta somente os próprios alunos. Mostrar blocos concluídos, bloco atual, melhor pontuação e respostas erradas separadas por bloco, com pergunta, escolha, correta e revisão. Não inventar histórico para tentativas antigas. |
| RF61 | Consultar respostas pré/pós e distinguir não respondido, rascunho, enviado e recusa no pós. Desativar coleta não apaga respostas nem registra recusa. Contas comuns mantêm pré obrigatório e pós opcional. |
| RF62 | Gerar novo link invalida segredo e sessões anteriores, preservando aluno e progresso. Revogar impede novo acesso e operações de progresso por sessões antigas, mantendo os dados para consulta. |
| RF63 | Excluir aluno somente após confirmação com aviso de perda de perfil/progresso/respostas. Bloquear acesso antes da remoção; falha deixa exclusão pendente e permite nova tentativa sem reativá-lo. |
| RF64 | Administrador consulta todos os alunos vinculados, seus professores proprietários e contas comuns, incluindo o progresso e questionários individuais. Listas paginadas não omitem registros como se a primeira página fosse o total. |
| RF65 | Registrar cada confirmação do quiz com identificador, bloco, revisão, texto da pergunta, escolha e resultado. Preservar registros anteriores ao repetir um bloco e ao salvar de outra sessão. |

| ID | Requisito não funcional adicional |
|---|---|
| RNF22 | Autenticar e autorizar no servidor cada operação administrativa; impedir leitura entre professores mesmo por chamada direta. Aluno e link não podem elevar seu papel. |
| RNF23 | Usar SDK Admin somente no servidor, credencial privada em Secret, hash do segredo no banco e respostas não armazenáveis em cache. Não registrar segredo ou token em logs. |
| RNF24 | Firestore impede leitura direta de alunos/convites e escrita de papéis pelo cliente; acesso ao progresso vinculado verifica situação e versão atuais do acesso. |
| RNF25 | Painéis permitem teclado, foco visível, confirmação acessível de exclusão e uso a 390px sem rolagem horizontal. Erros permitem nova tentativa sem afirmar sucesso. |
| RNF26 | Tratar dados do aluno como entrada não confiável ao exibir o painel. Ausência ou formato inválido não deve derrubar a tela nem virar conclusão pedagógica. |

| Caso de uso | Fluxo e exceções |
|---|---|
| UC21 | Professor cria aluno, escolhe pré/pós e copia o link. Falha mantém os campos; segredo antigo não pode ser recuperado pela lista. |
| UC22 | Aluno abre link e confirma entrada. Acesso válido restaura o mesmo progresso; acesso revogado impede leitura/gravação, inclusive em sessão anterior. |
| UC23 | Professor consulta progresso, erros por bloco e formulários. Dados antigos sem histórico são identificados; chamadas para alunos alheios são negadas. |
| UC24 | Professor altera pré/pós, revoga ou substitui link sem apagar progresso; exclusão usa confirmação explícita e pode ser retomada após falha. |
| UC25 | Administrador consulta as contas e alunos de todos os professores. Papel concedido por operação administrativa confiável, nunca pela escolha de cadastro. |

Aceitação: `features/painel_professor_admin.feature`. Validação executável: `tests/e2e/classroom.spec.cjs`, `tests/server/classroom.test.cjs`, `tests/integration/classroom-rules.mjs` e suítes unitárias do painel. Gherkin continua especificação, não é executado como se fosse o teste Playwright.

| ID | Comportamento esperado |
|---|---|
| NC01 | Criar uma conta individual com nome, e-mail, senha e confirmação; indicar campos inválidos sem perda desnecessária do preenchimento. |
| NC02 | Não estabelecer idade mínima enquanto não decidida; avaliar com instituição as condições para estudantes menores antes da coleta de dados reais. |
| NC03 | Entrar e sair da conta; rejeitar credenciais inválidas e proteger a sessão em computador compartilhado. |
| NC04 | Redefinir senha por link de e-mail; mensagens de solicitação não revelam existência de conta e links inválidos ou expirados permitem nova solicitação. |
| NC08 | Registrar escolaridade autodeclarada no pré obrigatório em quatro categorias, sem inferir idade ou experiência nem adaptar o conteúdo a partir desse dado. |
| NC09 | Informar finalidade, dados solicitados, contato e como solicitar exclusão; política institucional e retenção estão pendentes. |
| RF02 | Usar conteúdo introdutório comum, sem escolaridade nas Preferências. Escolaridade integra o formulário de pesquisa e não modifica o progresso. |
| RF04 a RF08 | Oferecer tutorial pulável e revisável, mapa de cinco blocos, mascote, passos curtos, ajuda e revisão. |
| RF09 e RF10 | Oferecer explicação, três respostas únicas com retorno, previsão sem pontos e ação prática. A previsão aceita novas tentativas guiadas; não reabrir o quiz pontuado. Usar linguagem introdutória comum. |
| RF11 a RF17 | Confirmar duas linhas, treinar medição, H e CNOT em exemplos separados e posicionar H e CNOT na ordem, controle e alvo corretos; orientar correções. |
| RF18 a RF20 | Validar circuito, preparar, executar, medir uma amostra e apresentar explicação final. Cada repetição recomeça pela preparação; não exigir observar ambos os resultados. |
| NC10 e RF30 | Identificar perguntas e atividades; calcular pontos pelos acertos e creditá-los ao concluir a prática, manter melhor nota e somar apenas sua melhora ao refazer. Rever conteúdo não gera pontos. |
| NC11 e NC22 | Retomar uma tentativa ativa com erros e dicas confirmados; não reiniciar silenciosamente desconto ao recarregar. |
| NC12 e NC30 | Salvar cada avanço confirmado no Firestore por conta individual e reconstruir montagem e passo confirmado, sem guardar um estado medido como estado novo. |
| NC13, NC14 e NC23 | Usar armazenamento local apenas como apoio temporário por conta e informar pendências; ao sair oferecer tentar salvar ou descartar, sem afirmar que dado não confirmado está salvo. |
| NC15 e NC29 | Validar resposta e pontos em serviço confiável; operações repetidas ou concorrentes devem ser tratadas de forma consistente e sem pontos duplicados. |
| NC16 | Ao editar uma montagem confirmada, informar impacto e pedir confirmação; cancelar preserva progresso. Preservar os melhores pontos; regras detalhadas de invalidação devem ser testadas. |
| RF21 e NC17 | Mostrar comprovante na tela com nome, Percurso introdutório e data da primeira conclusão. Preservar snapshots antigos. Não afirmar domínio comprovado ou emissão institucional. Correção de nome e fuso permanecem pendentes. |
| RF31 | Oferecer controles independentes para sons e animações, sem ocultar informação essencial. |
| NC18 | Oferecer recompensas; distintivos por bloco e trilha são proposta, com detalhes visuais a validar. |
| NC19 e NC26 | Permitir pedir exclusão da própria conta após confirmação e reautenticação, com aviso sobre perda de progresso. Processamento, retenção e tratamento de falhas aguardam política institucional. |
| NC20 | Se houver pesquisa, seu instrumento é separado dos quizzes e depende de protocolo institucional. |
| NC24 | Novos quizzes usam revisão de conteúdo 3; checkpoints revisão 2 mantêm perguntas, posições e escolhas ao retomar, inclusive após rever explicações. Não recalcular notas ou conclusões passadas. Futuras migrações exigem política própria. |
| NC25 | Informar efeito da dica na pontuação antes de seu uso, sem impedir ajuda ou tentativas. |
| NC27 | Utilizar Firebase Authentication e Firestore. O rascunho Supabase é histórico; validação de pontos no servidor permanece pendente. |

Os antigos requisitos NC05, NC06, NC07, NC21 e NC28 sobre gestão de perfis infantis e senha de responsável foram retirados do escopo. A exclusão da própria conta está coberta em NC19 e NC26.

## Requisitos não funcionais

| ID | Critério e verificação planejada |
|---|---|
| RNF01 | Priorizar Chrome, Edge e Firefox em computadores; definir versões e resolução e testar os fluxos. |
| RNF02 e RNF03 | Permitir teclado, foco visível, alternativa ao arraste, texto legível, contraste e zoom; testar interface real. |
| RNF04 | Explicar para iniciantes, principalmente adolescentes, apresentando símbolos e conectando exemplos e variações formativas. Revisão docente e testes técnicos não substituem avaliação com estudantes. |
| RNF05 e RNF06 | Testar H, CNOT, amplitudes, fase e probabilidades ideais contra referência independente; amostra pequena não precisa resultar em 50% exatos. |
| RNF07 | Evitar duplicidade e conflitos entre abas ou dispositivos; testar reenvios e falhas. |
| RNF08, RNF15 e RNF19 | Restringir dados a sua conta e testar acesso direto negado entre contas; remover apenas os dados autorizados. |
| RNF09, RNF10 e RNF18 | Provedor processa senhas; não guardar senhas ou chaves privilegiadas no navegador ou logs; testar autorização e funções no servidor. |
| RNF11 | Permitir desligar som e animações separadamente e respeitar movimento reduzido sem perder conteúdo. |
| RNF20 | Layout utilizável em desktop e telas estreitas, sem cortes horizontais ou ações cobertas pelo rodapé; rolagem manual e automática acessíveis, com foco visível. Verificação visual e de teclado pendente de ampliação. |
| RNF12 | Definir e medir desempenho em equipamentos e rede de referência. |
| RNF13 | Preservar créditos e licenças do QScratch, dependências e recursos. |
| RNF14 | Avaliar com instituição privacidade, idade e participação de estudantes menores; ausência de perfil infantil não elimina essas questões. |
| RNF16 e RNF17 | Validar pontuação no servidor e segregar dados temporários; testar tentativas forjadas, saída e exclusão. |

## Casos de uso

| ID | Fluxo e exceções |
|---|---|
| UC01 | Criar conta individual; validar campos e orientar confirmação de e-mail conforme configuração adotada. |
| UC02 | Entrar e sair; senha inválida impede entrada e saída não deve expor progresso a outra conta. |
| UC03 | Recuperar senha por e-mail; tratar link inválido, expirado e já usado. |
| UC05 | Responder ao pré obrigatório, acessar mapa e iniciar percurso comum, sem exigir conhecimento prévio ou seleção de escolaridade nas Preferências. |
| UC06 | Percorrer falas e exemplos, responder uma vez a cada pergunta e ler o retorno. Após três respostas, conferir a previsão sem pontos e concluir a ação prática para registrar pontos e liberar o próximo bloco. |
| UC07 | Interromper e retomar tentativa com os erros e dicas confirmados; explicar ações pendentes. |
| UC08 | Conferir uma previsão guiada sem pontos antes de confirmar peças ou ativar o medidor; realizar a ação e receber a explicação da montagem. |
| UC09 | Refazer atividade e receber apenas a diferença se superar sua melhor nota. |
| UC10 | Consultar a primeira conclusão e um próximo estudo identificado, preservando snapshots históricos. Escolaridade não altera o percurso. |
| UC11 | Alterar som e animações independentemente. |
| UC13 | Excluir a própria conta com reautenticação, aviso e confirmação; informar falha ou operação pendente. |
| UC14 | Tratar alterações concorrentes sem duplicar pontos e sem restaurar dados excluídos. |
| UC16 | Consultar aviso e decidir se usa dica; registrar uso confirmado. |
| UC17 | Sair com dados pendentes, tentando salvar ou descartando-os de forma explícita. |
| UC18 | Retomar revisão 2 sem reordenar alternativas; novos quizzes usam revisão 3. Preservar notas e conclusões anteriores. |
| UC20 | Retomar progresso confirmado em outro aparelho, após autenticação. |

Os antigos UC04, UC12, UC15, UC19, UC21 e UC22, específicos de gestão de perfis vinculados e senha de responsável, saíram do escopo. Alterações de idade mínima, aprovação por e-mail e política de exclusão devem ser decididas antes de transformar suas hipóteses em testes definitivos.

## Relação com os cenários de aceitação

O fluxo detalhado de UC05, UC06, UC08, UC11 e UC16 está em [ensinar, perguntar e praticar](features/fluxo_ensinar_perguntar_praticar.feature), com tags por cenário para RF32 a RF43. As comparações didáticas e os três quizzes são detalhados em [conteúdo e experimentos](features/conteudo_e_experimentos.feature), RF44 a RF49. Os cenários de circuito, pontuação e conclusão complementam essa sequência. Tags e cenários são especificações; não equivalem a execução automatizada.

## Fontes e documentos

Os cenários Gherkin estão em [features](features/README.md). O design visual está em [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). A documentação anterior e as revisões são registros históricos e podem conter quatro níveis e perfis vinculados. A Sprint 1 foi preservada. O percurso comum ainda depende de revisão docente e avaliação com participantes; não foi comprovada aprendizagem.


## Acesso implementado com Firebase

A landing oferece “Entrar”, sem link separado de login. A tela de acesso começa no login e permite alternar para criação de conta no mesmo painel, mantendo e-mail e nome ao alternar e limpando senhas. Cadastro pede nome ou apelido, e-mail, senha de no mínimo oito caracteres e confirmação. Ações ficam bloqueadas durante a requisição; falha não simula sucesso. Após confirmação do provedor, abre-se a trilha. Recuperação solicita e-mail e usa resposta genérica. O SDK gerencia a sessão, sem salvar senhas no código da aplicação. Persistência e restauração dos checkpoints confirmados e saída de conta pela interface foram integradas. Exclusão e gestão completa do perfil continuam pendentes, assim como os demais requisitos não entregues.

## Persistência implementada

O carregamento do estado deve terminar antes de apresentar a trilha da conta. Erro de leitura oferece nova tentativa e não escreve dados vazios. O UID determina o documento privado progress/{uid}. Estado da atividade, preferências, melhores notas, blocos e primeira conclusão são persistidos; saída fica bloqueada até confirmar salvamento. Uma atividade concluída é refeita explicitamente ao abri-la de novo; atividade em andamento retoma seu checkpoint. Demonstração é separada em #/demo. Permanecem pendentes cache local durável, reconciliação de tentativa ativa simultânea em dispositivos diferentes e validação de pontuação no servidor; não considerar NC13 e NC15 integralmente entregues.
