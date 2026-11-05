# Requisitos e casos de uso da plataforma

Atualização de escopo: uma conta individual e duas opções de escolaridade, Fundamental Anos Finais e Ensino Médio. O objetivo é apresentar computação quântica a quem ainda não conhece a área. Não há conta de responsável, perfis de crianças vinculados ou senha de troca de perfil. Não foi definida idade mínima para a conta. Como os dois públicos podem incluir menores, as condições de cadastro, participação e tratamento de dados reais devem ser definidas com a instituição antes de uso real; nenhuma idade mínima ou consentimento foi presumido.

Decisão de 05/11/2026: Firebase Authentication passa a cuidar de cadastro individual, login e recuperação de senha. O projeto `circuit-qscratch` foi criado no plano Spark e o provedor de e-mail/senha está habilitado. O rascunho Supabase permanece histórico, sem integração nem migração automática; o armazenamento remoto do progresso ainda não foi implementado. Os requisitos abaixo são comportamentos desejados, não funcionalidades prontas. A trilha usa Bell: |00⟩, H no primeiro qubit, CNOT com controle no primeiro e alvo no segundo, medição ideal com 00 ou 11 e 50% para cada. A experiência é simulação clássica. O usuário escolheu pontuação de 10 por acerto, menos 2 por erro e 2 pela primeira dica, piso 2; ao refazer uma atividade só se acrescenta a melhora da melhor pontuação. A explicação por nível não muda gabarito ou física.

## Fluxo de aprendizagem vigente

Atualização de 05/11/2026: cada bloco segue **ensinar → perguntar → praticar → concluir**. O acerto libera a prática, e a prática concluída libera o próximo bloco. Na prévia, cada bloco tem uma pergunta e uma missão prática; ler as falas ou acertar sozinho não conclui o bloco. Pontos são calculados com base no quiz, mas só entram no total ao concluir a prática. Uma nova medição de treino ou de Bell não é uma nova tentativa pontuada.

| ID | Comportamento esperado |
|---|---|
| RF32 | Separar as fases de explicação, quiz e prática, sem apresentar as três como atividades simultâneas. |
| RF33 | Ensinar com falas curtas em balão, nome do estudante e texto da escolaridade selecionada; Próximo e Anterior percorrem as falas, e Iniciar teste aparece ao final. |
| RF34 | Com animações ligadas, fechar a cortina, contar 5 a 1 sobre ela e abri-la com a pergunta e o mascote já preparados. Sem animações, abrir diretamente a próxima fase. Não pontuar por velocidade. |
| RF35 | Desabilitar conferência sem alternativa; aceitar tentativas ilimitadas e uma dica com custo anunciado. Erro orienta nova tentativa e não libera a prática. |
| RF36 | No acerto, bloquear novos envios, marcar a alternativa com check, usar Cool cat e animar o botão conforme preferência. Exibir explicação e Experimentar no circuito fora do balão, centralizados na tela. |
| RF37 | Oferecer encaixes por arraste e por seleção seguida de clique ou teclado; mostrar só destinos permitidos pela missão. Na prática de H, somente a primeira linha recebe encaixe. |
| RF38 | Concluir o bloco somente após a ação prática obrigatória. Antes do primeiro bloco concluído, a prévia principal mostra apenas duas linhas, sem rótulos de qubits ou estados. |
| RF39 | Ao concluir a prática, usar Treasurebox, recapitular a ação no balão e mostrar confirmação e avanço fora da bancada, centralizados. Conclusão de todos os blocos troca o card do mapa por mensagem de conquista, Treasurebox e Revisar a trilha. |
| RF40 | Ocultar o menu lateral dentro dos blocos e acompanhar o avanço com rolagem que revele a confirmação ou o próximo bloco no mapa, sem encobrir a ação pelo rodapé. |
| RF41 | No desktop, manter painel lateral da trilha parado e rolagem interna sem barra visual. Em tela estreita, usar uma coluna e rolagem vertical da página. Conectar os blocos com curva tracejada contínua. |
| RF42 | Iniciar a sessão com sons e animações ligados, com controles separados. O conteúdo e as ações devem funcionar com ambos desligados. |
| RF43 | Destacar o total de pontos com ícone e ajuda por hover, foco ou toque, explicando descontos, piso, melhor nota e crédito somente após a prática. |

| Bloco | Ação que conclui a prática |
|---|---|
| Conheça os qubits | Encaixar um qubit em cada linha. Um único encaixe não basta. |
| Observe uma medição | Medir o qubit de treino preparado em zero, sem modificar o circuito principal. |
| Experimente a porta H | Encaixar H na primeira posição do qubit de cima. |
| Conecte com CNOT | Encaixar CNOT após H com controle superior e alvo inferior. |
| Descubra o estado de Bell | Preparar o circuito e medir uma rodada, sem exigir resultados diferentes. |

Hover, foco ou clique no medidor revelam uma única amostra por rodada. Repetir esses eventos mantém o resultado; Preparar outra rodada permite uma amostra nova, sem pontuar novamente. No bloco de Bell, preparar novamente significa inicializar em |00⟩ e aplicar H e CNOT antes da medição.

### Estado da prévia e pendências

As fases, os encaixes, a pontuação em memória e os mascotes estão no código atual. Atualização posterior: autenticação e retomada do último checkpoint confirmado estão integradas ao Firebase Auth/Firestore. O rascunho Supabase não está integrado. Reabrir bloco em andamento preserva os erros e dicas salvos; dados ainda não confirmados podem ser perdidos ao fechar a página. A revisão sem refazer e a expansão dos treinos de H e das quatro entradas da CNOT também continuam planejadas. A tela de conclusão da sessão não equivale a certificado emitido pelo servidor.

RNF11 permanece um critério alvo: a rolagem já considera movimento reduzido do dispositivo; a aplicação automática dessa preferência a todas as animações decorativas ainda deve ser ajustada e verificada. Os controles manuais existem. A documentação não declara acessibilidade validada ou aprendizagem comprovada.

## Requisitos funcionais

| ID | Comportamento esperado |
|---|---|
| NC01 | Criar uma conta individual com nome, e-mail, senha e confirmação; indicar campos inválidos sem perda desnecessária do preenchimento. |
| NC02 | Não estabelecer idade mínima enquanto não decidida; avaliar com instituição as condições para estudantes menores antes da coleta de dados reais. |
| NC03 | Entrar e sair da conta; rejeitar credenciais inválidas e proteger a sessão em computador compartilhado. |
| NC04 | Redefinir senha por link de e-mail; mensagens de solicitação não revelam existência de conta e links inválidos ou expirados permitem nova solicitação. |
| NC08 | Permitir seleção de Fundamental Anos Finais ou Ensino Médio; não inferir experiência ou idade a partir da escolaridade. |
| NC09 | Informar finalidade, dados solicitados, contato e como solicitar exclusão; política institucional e retenção estão pendentes. |
| RF02 | Permitir alterar escolaridade, atualizar a explicação atual e preservar progresso, peças e pontuação. |
| RF04 a RF08 | Oferecer tutorial pulável e revisável, mapa de cinco blocos, mascote, passos curtos, ajuda e revisão. |
| RF09 e RF10 | Exigir acerto para liberar a prática, e prática concluída para liberar o próximo bloco, com dicas e tentativas ilimitadas; fornecer retorno explicativo e adaptar linguagem aos dois níveis sem alterar conceitos ou gabaritos. |
| RF11 a RF17 | Confirmar duas linhas, treinar medição, H e CNOT em exemplos separados e posicionar H e CNOT na ordem, controle e alvo corretos; orientar correções. |
| RF18 a RF20 | Validar circuito, preparar, executar, medir uma amostra e apresentar explicação final. Cada repetição recomeça pela preparação; não exigir observar ambos os resultados. |
| NC10 e RF30 | Identificar perguntas e atividades; calcular pontos pelos acertos e creditá-los ao concluir a prática, manter melhor nota e somar apenas sua melhora ao refazer. Rever conteúdo não gera pontos. |
| NC11 e NC22 | Retomar uma tentativa ativa com erros e dicas confirmados; não reiniciar silenciosamente desconto ao recarregar. |
| NC12 e NC30 | Salvar cada avanço confirmado no Firestore por conta individual e reconstruir montagem e passo confirmado, sem guardar um estado medido como estado novo. |
| NC13, NC14 e NC23 | Usar armazenamento local apenas como apoio temporário por conta e informar pendências; ao sair oferecer tentar salvar ou descartar, sem afirmar que dado não confirmado está salvo. |
| NC15 e NC29 | Validar resposta e pontos em serviço confiável; operações repetidas ou concorrentes devem ser tratadas de forma consistente e sem pontos duplicados. |
| NC16 | Ao editar uma montagem confirmada, informar impacto e pedir confirmação; cancelar preserva progresso. Preservar os melhores pontos; regras detalhadas de invalidação devem ser testadas. |
| RF21 e NC17 | Mostrar certificado na tela com nome, escolaridade e data da primeira conclusão. Repetir a trilha não altera esses dados. Correção de nome e fuso permanecem pendentes. |
| RF31 | Oferecer controles independentes para sons e animações, sem ocultar informação essencial. |
| NC18 | Oferecer recompensas; distintivos por bloco e trilha são proposta, com detalhes visuais a validar. |
| NC19 e NC26 | Permitir pedir exclusão da própria conta após confirmação e reautenticação, com aviso sobre perda de progresso. Processamento, retenção e tratamento de falhas aguardam política institucional. |
| NC20 | Se houver pesquisa, seu instrumento é separado dos quizzes e depende de protocolo institucional. |
| NC24 | Versionar atividade e tentativa; não alterar notas históricas silenciosamente. Política de migração de conteúdo permanece pendente. |
| NC25 | Informar efeito da dica na pontuação antes de seu uso, sem impedir ajuda ou tentativas. |
| NC27 | Utilizar Supabase Auth e Postgres; proteger dados e validar operações antes de uso real. |

Os antigos requisitos NC05, NC06, NC07, NC21 e NC28 sobre gestão de perfis infantis e senha de responsável foram retirados do escopo. A exclusão da própria conta está coberta em NC19 e NC26.

## Requisitos não funcionais

| ID | Critério e verificação planejada |
|---|---|
| RNF01 | Priorizar Chrome, Edge e Firefox em computadores; definir versões e resolução e testar os fluxos. |
| RNF02 e RNF03 | Permitir teclado, foco visível, alternativa ao arraste, texto legível, contraste e zoom; testar interface real. |
| RNF04 | Explicações para iniciantes nos dois níveis; revisão do professor não substitui teste com estudantes. |
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
| UC05 | Escolher uma das duas escolaridades, acessar tutorial e mapa; o usuário é iniciante, sem exigir conhecimento prévio. |
| UC06 | Abrir bloco, percorrer falas, iniciar teste, responder e receber retorno; acerto libera a prática. Concluir a ação prática para registrar pontos e liberar o próximo bloco. |
| UC07 | Interromper e retomar tentativa com os erros e dicas confirmados; explicar ações pendentes. |
| UC08 | Treinar separadamente, montar H e CNOT, executar e medir. |
| UC09 | Refazer atividade e receber apenas a diferença se superar sua melhor nota. |
| UC10 | Alterar escolaridade sem perder progresso e consultar certificado da primeira conclusão. |
| UC11 | Alterar som e animações independentemente. |
| UC13 | Excluir a própria conta com reautenticação, aviso e confirmação; informar falha ou operação pendente. |
| UC14 | Tratar alterações concorrentes sem duplicar pontos e sem restaurar dados excluídos. |
| UC16 | Consultar aviso e decidir se usa dica; registrar uso confirmado. |
| UC17 | Sair com dados pendentes, tentando salvar ou descartando-os de forma explícita. |
| UC18 | Tratar alteração de conteúdo durante tentativa sem alterar notas silenciosamente; migração ainda a definir. |
| UC20 | Retomar progresso confirmado em outro aparelho, após autenticação. |

Os antigos UC04, UC12, UC15, UC19, UC21 e UC22, específicos de gestão de perfis vinculados e senha de responsável, saíram do escopo. Alterações de idade mínima, aprovação por e-mail e política de exclusão devem ser decididas antes de transformar suas hipóteses em testes definitivos.

## Relação com os cenários de aceitação

O fluxo detalhado de UC05, UC06, UC08, UC11 e UC16 está em [ensinar, perguntar e praticar](features/fluxo_ensinar_perguntar_praticar.feature), com tags por cenário para RF32 a RF43. Os cenários de circuito, pontuação e conclusão complementam essa sequência. Tags e cenários são especificações; não equivalem a execução automatizada.

## Fontes e documentos

Os cenários Gherkin estão em [features](features/README.md). O design visual está em [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). A documentação anterior e as revisões são registros históricos e podem conter quatro níveis e perfis vinculados. A Sprint 1 foi preservada. Textos existentes de anos finais e médio precisam de revisão docente e de adaptação explícita para quem não tem conhecimento prévio; não foi comprovada aprendizagem.


## Acesso implementado com Firebase

A landing oferece “Entrar”, sem link separado de login. A tela de acesso começa no login e permite alternar para criação de conta no mesmo painel, mantendo e-mail e nome ao alternar e limpando senhas. Cadastro pede nome ou apelido, e-mail, senha de no mínimo oito caracteres e confirmação. Ações ficam bloqueadas durante a requisição; falha não simula sucesso. Após confirmação do provedor, abre-se a trilha. Recuperação solicita e-mail e usa resposta genérica. O SDK gerencia a sessão, sem salvar senhas no código da aplicação. Persistência e restauração dos checkpoints confirmados e saída de conta pela interface foram integradas. Exclusão e gestão completa do perfil continuam pendentes, assim como os demais requisitos não entregues.

## Persistência implementada

O carregamento do estado deve terminar antes de apresentar a trilha da conta. Erro de leitura oferece nova tentativa e não escreve dados vazios. O UID determina o documento privado progress/{uid}. Estado da atividade, preferências, melhores notas, blocos e primeira conclusão são persistidos; saída fica bloqueada até confirmar salvamento. Uma atividade concluída é refeita explicitamente ao abri-la de novo; atividade em andamento retoma seu checkpoint. Demonstração é separada em #/demo. Permanecem pendentes cache local durável, reconciliação de tentativa ativa simultânea em dispositivos diferentes e validação de pontuação no servidor; não considerar NC13 e NC15 integralmente entregues.
