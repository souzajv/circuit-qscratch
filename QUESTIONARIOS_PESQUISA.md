> Atualização mais recente: o questionário inicial é obrigatório antes do primeiro bloco. A versão 2 acrescenta a pergunta education, com Ensino Fundamental, Ensino Médio, Ensino Superior incompleto e Ensino Superior completo. Essas categorias são autodeclaradas e não alteram o conteúdo. Só o formulário final continua podendo ser pulado. Contas sem blocos concluídos com pré-formulário antigo/incompleto precisam responder à nova versão. Registros de versões anteriores são preservados em state.surveyArchive ao serem substituídos por versão mais nova.

# Questionários de percepção da trilha de Bell

## Decisão de 06/11/2026

Após conversa do usuário com o orientador, a plataforma passa a oferecer uma única versão introdutória. A escolaridade deixa de ser uma escolha nas Preferências e não determina explicações ou perguntas. Os textos mais formais permanecem no código como material histórico, mas a navegação ativa usa a versão acessível de introdução.

Os questionários são exploratórios, criados para este projeto. Não são instrumentos validados nem provas de aprendizagem. As perguntas usam Sim/Não, uma por etapa, com participação opcional e sem efeito em pontos, desbloqueios ou certificado.

## Antes da primeira explicação

O formulário abre quando o usuário inicia o primeiro bloco e ainda não concluiu nenhum bloco. Contas com progresso anterior não recebem uma coleta retrospectiva apresentada como se tivesse acontecido antes do contato com o conteúdo.

| Identificador | Pergunta | Uso na análise |
|---|---|---|
| heardBefore | Antes desta trilha, você já tinha ouvido falar em computação quântica? | Familiaridade declarada |
| firstStudy | Esta é sua primeira tentativa de aprender computação quântica? | Experiência anterior declarada |
| priorCircuit | Antes desta trilha, você já conhecia a ideia de circuito quântico? | Familiaridade com o tema específico |
| interest | Você tem interesse em aprender mais sobre computação quântica? | Interesse inicial |

## Após a missão de Bell

No fluxo normal, depois da conquista da última prática, o botão Ver minha conclusão abre o formulário antes do certificado. Se o usuário optar por explorar mais e voltar ao mapa, o formulário final é oferecido ao sair da missão. Não são abertos dois modais ao mesmo tempo.

| Identificador | Pergunta | Uso na análise |
|---|---|---|
| understanding | Depois da trilha, você sente que entende melhor o que é um circuito quântico? | Compreensão percebida |
| interest | Você tem interesse em aprender mais sobre computação quântica? | Interesse final, com redação igual à inicial |
| difficulty | Você achou difícil acompanhar as explicações dos conceitos? | Dificuldade percebida; Sim representa dificuldade |
| intuitive | Você achou fácil descobrir como usar os botões e montar o circuito? | Facilidade de uso percebida |
| confidence | Você se sente capaz de explicar com suas palavras o papel de pelo menos uma porta do circuito? | Confiança declarada |

A pergunta de interesse é repetida para permitir comparação pareada. Os itens de compreensão, dificuldade, uso e confiança medem dimensões diferentes e não devem ser somados como uma única nota.

## Fluxo e participação

O modal explica o propósito, a vinculação à conta e o caráter opcional. Quero responder inicia as etapas. Nenhuma resposta vem selecionada. Sim e Não são igualmente válidos; é preciso escolher uma alternativa para avançar, mas Pular questionário e continuar permanece disponível. Anterior permite revisar antes de enviar. O botão final envia as respostas e só continua após confirmação da gravação.

Em caso de erro, o formulário mantém as respostas e oferece nova tentativa. Os rascunhos de perguntas já respondidas acompanham o salvamento do progresso. Uma falha de rede não deve ser apresentada como envio confirmado. Pular registra status separado e respostas vazias, sem converter ausência de participação em Não. No modo demonstração, a interface informa que as respostas ficam somente na sessão.

Depois de um envio ou de uma recusa, o modal não se repete ao refazer a trilha. O adaptador preserva o primeiro registro final de cada fase nas transações normais da aplicação. Isso evita sobrescrita por estados de abas antigas. Não é uma garantia antifraude contra manipulação direta da API pelo titular da conta.

## Dados e armazenamento

Local: `progress/{UID}/state.surveys`, com chaves `before` e `after`. É um mapa no documento de progresso, não uma coleção pública nem uma subcoleção. Cada registro contém:

- version: versão do instrumento, atualmente 2;
- status: in_progress, completed ou skipped;
- answers: mapa de identificadores estáveis: education é uma das quatro categorias textuais; os demais itens são booleanos;
- index: posição do rascunho, quando aplicável;
- submittedAtClient: data/hora do dispositivo ao finalizar, não um horário certificado pelo servidor.

O documento de progresso também recebe updatedAt do servidor, que representa sua última gravação geral. Não usar esse campo como se fosse o horário exato de envio do questionário.

As regras de acesso já publicadas permitem apenas leitura e escrita pelo próprio UID. Os novos campos usam o mapa de estado existente, aceito pelas regras atuais, sem exigir implantação de uma nova coleção. Não há listagem pública de respostas nem acesso de uma conta aos dados de outra. Os testes reais usaram contas fictícias e removeram seus dados ao final.

Por compatibilidade com as regras e os documentos existentes, state.level continua preenchido internamente com a chave do texto introdutório. Esse campo legado não é escolaridade declarada, não foi perguntado e não pode ser usado para inferir o nível acadêmico dos participantes. Certificados novos identificam o percurso introdutório; snapshots de certificados anteriores permanecem históricos.

Os dados ficam ligados à conta e não são anônimos na origem. A apresentação no artigo deve usar resultados agregados, sem nomes, e-mails ou UIDs. A extração administrativa e a produção de tabelas do artigo não foram implementadas nesta etapa. Não inserir credenciais administrativas no frontend.

## Como usar no artigo

1. Informar quantos usuários iniciaram a trilha, quantos responderam cada formulário e quantos têm um par completo.
2. Apresentar contagens e proporções com denominadores explícitos por pergunta. Não contar rascunhos ou formulários pulados como respostas negativas.
3. Comparar interesse antes/depois somente nos pares completos da mesma conta e versão do instrumento. Relatar separadamente Sim→Sim, Sim→Não, Não→Sim e Não→Não.
4. Apresentar compreensão e confiança como autorrelato. Os quizzes da trilha, com dicas e tentativas ilimitadas, são atividades formativas e não um pós-teste independente.
5. Não atribuir uma mudança de interesse especificamente à gamificação: não há grupo de comparação, alocação aleatória ou controle de experiências externas.
6. Relatar limitações: amostra de conveniência, participação opcional, respostas binárias sem intensidade ou opção neutra, possível influência do pesquisador presente, contato prévio com a landing page e ausência de validação do instrumento.

O aviso de participação da interface não substitui a definição com o orientador/instituição sobre o uso dos dados na pesquisa, especialmente se houver menores. A redação e o protocolo ainda devem ser revisados antes de apresentar resultados como pesquisa concluída. Esta implementação não altera a Sprint 1 nem produz resultados experimentais fictícios.

## Implementação e verificação

surveys.js mantém identificadores e redação. SurveyDialog controla etapas, retorno e envio. App posiciona os formulários no percurso. AccountTrail aguarda a gravação em fila e apresenta falhas. O adaptador progress.js preserva registros finais anteriores na transação. Aumentar a versão do instrumento ao alterar perguntas ou interpretação.

Testes unitários cobrem seleção de Não, retorno, rascunhos, recusas, falha/reenvio, encaixe no fluxo e preservação de registros. O roteiro manual tests/integration/survey-smoke.mjs valida no Firebase real a gravação e leitura por UID e a rejeição de acesso anônimo ou por segunda conta. A demonstração sem conta não constitui coleta persistida para o artigo.

## Obrigatoriedade e análise

O aviso inicial informa que é necessário responder para começar; ele não afirma que esse formulário é opcional. A ausência de resposta impede a entrada no primeiro bloco, sem inventar dados nem preencher uma escolaridade padrão. O envio precisa ser confirmado na conta. A escolaridade não é inferida pelo campo técnico legado state.level; usar exclusivamente surveys.before.answers.education. A vinculação obrigatória pode influenciar quem participa e como responde: descrever isso como limitação e revisar com o orientador as condições de uso dos dados na pesquisa. As descrições anteriores de pré-coleta opcional são históricas. O pós permanece opcional.
