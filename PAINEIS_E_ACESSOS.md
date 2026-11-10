# Painéis e acessos

Refinamento de interface em 10/11/2026: Consultar conta e Ver progresso abrem uma consulta dedicada no lugar da lista, com foco no título e retorno por Fechar detalhes. A busca por nome/e-mail considera os registros já carregados e os mantém ao voltar. Criar acesso ocupa uma área própria; Novo acesso conduz ao campo de nome e um link criado recebe foco. A entrada por convite usa o gato com prancheta e balão responsivo, com alternativa visual local enquanto a animação carrega. Essas mudanças não alteram as permissões nem o armazenamento.

Decisão de 10/11/2026. O cadastro comum permite escolher Aluno ou Professor. Professor tem a mesma trilha e a opção Meus alunos. Administrador tem Administração, com consulta global. Contas antigas recebem o papel de aluno na primeira consulta autenticada, preservando seu progresso. A conta indicada pelo proprietário recebe o papel de administrador por operação confiável, sem senha nova e sem regra por e-mail no frontend.

## Alunos criados pelo professor

Cada acesso contém nome ou apelido e duas opções independentes: mostrar o formulário inicial e mostrar o final. Não cria e-mail/senha. O link é reutilizável em outros aparelhos até a revogação. Qualquer pessoa que o possua pode acessar aquele aluno; o professor vê esse aviso ao copiá-lo e o aluno é avisado de que a entrada substitui a conta atual do navegador.

O segredo aparece somente na criação ou substituição do link. O banco guarda seu SHA-256. Ele fica no fragmento da URL, fora da requisição HTTP inicial. Após a entrada, o endereço é substituído por `/#/trilha`. Isso não protege contra quem vê o link no aparelho ou contra compartilhamento. Não registrar o link em ferramentas de análise, logs ou capturas de tela de produção.

Revogar mantém os dados para consulta e impede entrada e acesso ao progresso pelas sessões anteriores. Gerar outro link mantém aluno/progresso e incrementa a versão de acesso, invalidando o link e as sessões antigos. Excluir pede confirmação com aviso de perda: primeiro desativa o acesso, depois apaga o usuário de autenticação e os documentos do aluno. Falha deixa a exclusão pendente e o acesso bloqueado, permitindo repetir a operação.

Formulário inicial desativado permite iniciar diretamente; não cria respostas nem status de recusa. Formulário final desativado não aparece na conclusão. Ativar/desativar não apaga respostas já coletadas. A política é carregada ao entrar na trilha; uma sessão já aberta pode precisar ser reaberta para atualizar a interface. As regras do banco bloqueiam novas alterações em questionários desativados, mesmo com interface antiga. Para contas comuns, pré obrigatório e pós opcional continuam vigentes.

## Dados e permissões

| Caminho | Conteúdo e acesso |
|---|---|
| `profiles/{uid}` | Papel da conta. Leitura do próprio usuário; escrita apenas no servidor. |
| `students/{uid}` | Professor proprietário, nome, opções de formulários, situação, hash e versão do acesso. Sem leitura/escrita direta pelo navegador. |
| `progress/{uid}` | Progresso e questionários existentes; inclui histórico de confirmações do quiz. O aluno lê/grava apenas o seu. |

O UID do aluno por link é estável, com prefixo `linked_`. O professor só consulta/gerencia alunos cujo `ownerUid` é o seu. Administrador consulta todos os professores, alunos comuns e vinculados. O navegador não escolhe permissões: a API verifica o ID token e consulta o papel protegido. Claims de aluno por link também são verificadas contra a situação e versão atuais do registro.

A API `POST /api/classroom` implementa `profile`, `me`, `create`, `list`, `detail`, `settings`, `rotate`, `revoke`, `delete`, `accounts`, `account` e `redeem`. Somente `redeem` não exige sessão; exige o segredo. Respostas usam `no-store`. Listas são paginadas em grupos de 50. O hash nunca é retornado. O servidor normaliza os dados de progresso antes de entregá-los ao painel, pois o cliente do aluno não é uma fonte confiável.

O histórico registra identificador de resposta, bloco, revisão, pergunta, alternativa escolhida, correta e resultado. Tentativas anteriores à implementação não têm esses registros e não podem ser reconstruídas como se tivessem. Novas gravações preservam respostas confirmadas por outra sessão. Pontos e horários da tentativa ainda vêm do cliente: o painel serve para acompanhamento, sem promessa de antifraude ou auditoria acadêmica.

## Estrutura e execução

`src/classroom` apresenta os fluxos; `src/infrastructure/firebase/classroom.js` adapta a API. `api/classroom.js` autentica requisições, `server/classroom` aplica permissões e casos de uso, e `server/firebase.cjs` implementa o acesso ao SDK Admin. Regras de domínio recebem dependências, sem importar componentes React. O adaptador privado não entra no bundle web.

Produção exige `FIREBASE_SERVICE_ACCOUNT_JSON` como Secret na Vercel, apenas no ambiente aprovado. Não cadastrar prefixos públicos nem copiar o valor para arquivos versionados. As funções Node da pasta `api` são publicadas junto do build, mas as regras Firestore exigem publicação separada. Passos em [PUBLICACAO.md](PUBLICACAO.md).

Local com serviço real: configurar `.env.local` privado e executar `npm run start:api` e `npm start` em terminais separados. Local sem dados reais: iniciar `npm run emulators` (Java 21), configurar hosts do exemplo e usar o projeto `demo-circuit-qscratch`; iniciar o front com `FIREBASE_EMULATORS=true`. Não usar essa variável na Vercel.

## Testes

- `npm test` e `npm run test:coverage`: componentes, adaptadores e regressões da trilha; Firebase e animações simulados.
- `npm run test:server`: permissões, rotação, remoção e tratamento de dados inválidos com dependências controladas.
- `npm run test:rules`: regras reais no emulador, incluindo acesso indevido e revogação de sessão.
- `npm run test:e2e`: Chromium, aplicação, API e Auth/Firestore emulados. Faz cadastro, link, resposta errada, consulta, revogação, exclusão, autorização administrativa e formulário inicial. Não grava participantes em produção.

Esses testes verificam software e permissões, não a aprendizagem ou a validade do instrumento de pesquisa. A ativação remota e a conferência no domínio publicado devem ser registradas separadamente.

## Ajuste de questionários e acesso por link
A interface oferece uma única opção para aplicar os questionários pré e pós juntos. Novos acessos e alterações enviam o mesmo valor nos dois campos do contrato existente. Registros históricos não são apagados. Aluno por link não tem controle de saída nem edição de apelido; sons e animações continuam disponíveis. Copiar link confirma com Copiado! por três segundos e mantém a largura do botão. O painel usa a tela de loading existente durante consultas, e accordions nativos têm transição progressiva com respeito a movimento reduzido.

## Consulta protegida do link
Novos links guardam, além do hash de validação, uma cópia cifrada com AES-256-GCM e associação ao UID. A chave é derivada da credencial privada do servidor, nunca do código web. O segredo só é retornado por detail/account após autorização, para acesso ativo; listagens não retornam hash nem cifra. Trocar a credencial privada pode impedir recuperar cifras antigas, mas não invalida o hash de acesso; gerar outro link resolve a consulta com invalidação explícita do anterior. Links antigos sem cifra não são reconstruídos. O painel permite gerar outro mantendo o progresso. Nenhuma credencial administrativa é enviada ao navegador.

Na retomada de links legados com opções diferentes, a interface trata a coleta como desligada para os dois momentos. Ao salvar a opção conjunta, ambos os campos passam a ter o mesmo valor. Respostas antigas continuam preservadas.
