# Revisão adversarial dos cenários, requisitos e casos de uso

Data: 03/11/2026. Escopo: os cinco arquivos `.feature`, `features/README.md`, `REQUISITOS-E-CASOS-DE-USO.md`, `ARQUITETURA_E_CRITERIOS_MVP.md`, roteiro da trilha e decisões do projeto. Revisão pelas perspectivas de falha operacional, clareza para implementação e segurança. A pasta é cópia sem histórico Git próprio; a revisão foi de arquivos completos, não de diff. Resultados são sobre especificações, não defeitos comprovados em sistema implantado.

**Veredito: BLOCK para considerar os cenários prontos para automatização integral e uso com dados reais de menores.** Pode-se implementar e testar fatias independentes com dados fictícios. Itens compartilhados por mais de uma perspectiva foram promovidos conforme a skill; prioridades não devem ser confundidas com incidentes já ocorridos.

## Achados críticos

### C1. Excluir um perfil não prova que os dados foram excluídos

**Referências:** `contas_e_perfis.feature`, cenário “Confirmar exclusão de perfil”; NC07, NC26 e UC22. O cenário só exige que o perfil deixe de aparecer. Uma implementação que apenas o esconda, mantendo dados acessíveis, passaria no teste. Também não verifica senha incorreta, reautenticação expirada, exclusão de dados vinculados, operações antigas ou que os demais perfis continuem íntegros em falhas parciais.

**Correção recomendada:** especificar resultados observáveis no servidor conforme política de retenção acordada, com testes de acesso e exclusão parcial, sem prometer apagar backups ou dados sujeitos a retenção ainda não definida. Testar autorização, isolamento, falhas e atualização atrasada. A política de conta completa permanece pendente e não deve ser inventada.

### C2. Isolamento infantil é afirmado, mas o ciclo de autorização não é testado

**Referências:** `contas_e_perfis.feature`, “Perfil infantil não acessa outro perfil diretamente”; NC06, NC21, RNF15, UC15 e UC21. O cenário começa assumindo uma sessão limitada. Ele não verifica se a seleção do perfil revoga ou restringe os privilégios anteriores da conta responsável, nem a tentativa de retornar à gestão, trocar perfil, editar dados ou usar sessão antiga sem reautenticação. A presença do responsável é uma condição de uso, não um controle técnico.

**Correção recomendada:** testar abertura com senha válida, entrada e saída com senha incorreta, acesso direto à gestão e a outros perfis, repetição e expiração de sessão, em várias abas e contas. Definir o mecanismo de sessão limitada antes de declarar esse fluxo pronto. Senha deve ser validada pelo provedor, sem armazenamento em texto puro.

### C3. Testes de pontuação não fecham a janela de falha entre ação e confirmação

**Referências:** `pontos_e_progresso.feature`, cenários de retomada, reenvio e concorrência; NC11 a NC15, NC22, NC29. Retomada considera apenas erro e dica já confirmados; o reenvio considera sucesso previamente registrado. Não há exemplo para resposta aceita pelo servidor com confirmação perdida, ou para o mesmo ID reutilizado com conteúdo diferente. A ordem de dica e resposta simultâneas não apresenta resultado esperado concreto. Uma implementação pode perder desconto ou duplicar pontos mesmo passando nos cenários atuais.

**Correção recomendada:** exemplificar as duas ordens possíveis, perda de resposta de rede, reenvio idêntico e reenvio com mesmo identificador e conteúdo divergente; verificar estado, melhor nota e total após recarga. Não confiar em `localStorage` para validação. Exigir operação transacional e autorização por perfil nos testes de integração, além do comportamento visível.

### C4. Conta individual para adolescentes aparece como elegível sem decisão de aferição

**Referências:** `contas_e_perfis.feature`, cenário marcado `@validacao_institucional`; NC02, NC08, UC01. A tabela indica 14 anos como “elegível”, mas sua pré-condição apenas diz que a política permite avaliar a elegibilidade. Isso pode ser interpretado como autorização para uso real com base na idade informada, embora a regra esteja condicionada à avaliação institucional e o método não exista.

**Correção recomendada:** distinguir resultado da regra de produto pretendida da liberação efetiva de conta para menores; registrar teste para condição institucional ainda não atendida sem presumir uma solução de verificação. Avaliar com a instituição o tratamento de idade, autorização e supervisão. Não tratar idade informada ou escolaridade como prova de idade.

## Alertas

### A1. Tags de funcionalidade inflacionam a rastreabilidade

**Referências:** linha 2 de cada `.feature` e matriz `features/README.md`. Tags de requisitos e casos de uso estão no nível da funcionalidade e, em Cucumber, são herdadas por todos os cenários. Por exemplo, a tag UC02 em `trilha_e_aprendizagem.feature` aponta para “titular entra e sai” no documento vigente, embora o arquivo descreva tutorial. Também há tags de exclusão em `conclusao_e_acessibilidade.feature` sem teste efetivo de exclusão. Uma execução filtrada poderia sugerir cobertura indevida.

**Correção recomendada:** associar IDs aos cenários pertinentes e manter matriz requisito → cenário → cobertura completa, parcial, pendente ou não automatizável. Não usar tags coletivas como evidência de cobertura. IDs RF04–RF08 e RF11–RF20 são agrupados no documento, exigindo desmembrar critérios antes de declarar cobertura por ID.

### A2. Fluxos básicos de conta estão incompletos

**Referências:** `contas_e_perfis.feature` e NC01, NC03, NC04, NC05, NC08. Faltam exemplos de cadastro e entrada bem-sucedidos da conta individual, logout e acesso após logout, e-mail inválido ou já registrado, falha de rede e criação, edição e validação de campos do perfil. A confirmação de e-mail aparece como obrigatória no cenário, mas UC01 diz que ainda é proposta; definir antes de automatizar. O SMTP de recuperação precisa ser testado no ambiente real.

### A3. Cenários abertos não são critérios de aceite executáveis

**Referências:** cenários `@pendente_politica_exclusao`, `@pendente_politica_versao`, `@pendente_pesquisa` e `@proposta_recompensas`. Expressões como “política a definir” e “protocolo definido” não determinam um resultado testável, e uma tag não impede execução por padrão. Separar exemplos aprovados de hipóteses; configurar exclusão explícita no executor quando existir e documentar pendências sem simular que passaram.

### A4. Retomada e dados pendentes estão cobertos só parcialmente

**Referências:** `pontos_e_progresso.feature`, NC12 a NC14 e NC23. Falta mostrar o estado confirmado após restauração de rede, tratar falha do `localStorage`, escolher entre tentar salvar e descartar e provar que o descarte de um rascunho não desfaz um evento já confirmado. Falta também limpar exclusivamente o rascunho correto após conclusão e proteção de outra conta no mesmo navegador.

### A5. Circuito pode parecer correto sem validação científica suficiente

**Referências:** `circuito_bell.feature`, RNF05 e RNF06. Exigir resultado 00 ou 11 não verifica probabilidades iguais, amplitudes ou fase: um programa que sempre retorna 00 passaria. O cenário sobre H verifica que a plataforma informa as chances, não que as calcula. Existem testes isolados anteriores do modelo, mas não cobrem a integração visual ponta a ponta.

**Correção recomendada:** manter testes determinísticos independentes para amplitudes, H duas vezes e quatro entradas de CNOT; testar a ponte da UI ao modelo e preparação por rodada. Se houver teste estatístico, definir amostra e tolerância antecipadamente, sem esperar 50% exatos. Não usar Gherkin de interface como única prova matemática.

### A6. Fluxo de avanço e revisão não testa todos os efeitos

**Referências:** `trilha_e_aprendizagem.feature`, `circuito_bell.feature`, NC16. Há cancelamento de edição, mas não confirmação que invalida os marcos dependentes e preserve melhor pontuação e certificado histórico, conforme proposta vigente. Não há prova de que uma resposta errada bloqueia o avanço ou de que todos os passos necessários antecedem a conclusão do bloco. Criar exemplos concretos após confirmar essas regras.

### A7. O apoio à leitura e a experiência por escolaridade não estão validados

**Referências:** `trilha_e_aprendizagem.feature`, RNF04 e `TEXTOS_DIDATICOS_POR_ESCOLARIDADE.md`. O cenário só verifica que há versão de H, sem verificar os demais blocos, acesso à explicação após mudança de escolaridade e clareza de instruções. “O responsável pode ajudar” não comprova que uma criança entendeu. Planejar revisão docente dos quatro roteiros e avaliação com participantes autorizados quando possível; não medir compreensão apenas pela presença do texto.

### A8. Acessibilidade e estados visuais ainda têm lacunas

**Referências:** `conclusao_e_acessibilidade.feature`, RNF02, RNF03, RNF11 e design system. Um único cenário de teclado para H não cobre navegação, CNOT, login, perguntas, fechamento de diálogos ou foco em erros. O movimento reduzido não comprova que Lottie para; alternâncias não testam retomada das preferências. Contraste, zoom e leitor de tela requerem verificações adicionais com critérios mensuráveis.

### A9. Certificado não cobre data estável e mudanças de montagem

**Referências:** `conclusao_e_acessibilidade.feature`, RF21 e NC17. O caso usa uma data fixa sem esclarecer fuso ou relógio de referência. Também não testa reabertura após sair, alteração de montagem nem a decisão pendente sobre correção de nome. A preservação de nome e escolaridade da primeira conclusão já foi aprovada; a disponibilidade após invalidar montagem é proposta que precisa ser confirmada.

### A10. Requisitos e contexto contêm textos históricos contraditórios

**Referências:** `REQUISITOS-E-CASOS-DE-USO.md`, seção fontes e tabela de encaminhamento; `CONTEXTO.md`. A seção de fontes ainda descreve 18 anos como limite provisório e Supabase como candidato, enquanto a regra posterior aprovada é 14 anos completos e Supabase escolhido, com validação institucional pendente. O contexto mantém registros históricos conflitantes. Sinalizar trechos históricos e atualizar a referência vigente sem alterar a Sprint 1.

### A11. Ausência de executor e validação sintática automatizada

**Referências:** `features/README.md` e pasta `features/`. A documentação informa corretamente que não há definições de passos ou executor; nesta revisão também não foi encontrado parser Cucumber instalado no projeto. Portanto, não há evidência de que todos os arquivos tenham sido analisados por um parser ou que qualquer cenário esteja executando em vermelho. Adicionar parser e execução local quando o usuário autorizar início da automação; depois registrar testes pendentes e resultados reais.

### A12. Cenários podem ser aprovados sem evidência de funcionamento do projeto real

**Referências:** todos os `.feature`, `supabase/README.md` e arquitetura. Não há bindings nem isolamento de ambientes; sem estratégia, passos poderiam usar mocks para tudo e passar mesmo sem RLS, integração de VM ou salvamento real. Separar testes de domínio, integração Supabase local com identidades fictícias e jornadas de interface; declarar o que cada camada comprova e não usar dados reais em automação.

## Critérios para a próxima revisão

1. Corrigir a matriz e as tags para rastreabilidade por cenário, sem afirmar cobertura integral apenas por listar IDs.
2. Completar exemplos críticos de sessão, exclusão, falhas de confirmação e concorrência, preservando pendências institucionais como pendentes.
3. Acrescentar exemplos faltantes de conta, quatro níveis, passos e edição de circuito; definir o que será verificado por testes científicos, de acessibilidade e de integração.
4. Definir e executar o parser Gherkin e registrar a execução; depois criar definições de passos por fatia e observar falha antes da implementação.

Esta revisão não altera os cenários, os requisitos ou o código da plataforma. A Sprint 1 permanece preservada.
