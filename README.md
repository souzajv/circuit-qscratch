> Atualização do instrumento: versão 3, com oito perguntas no pré obrigatório e sete etapas no pós opcional. Interesse e confiança usam escalas pareadas; clareza e uso são separados; duas questões de conteúdo sem pontos nem correção e comentário final opcional. Ver QUESTIONARIOS_PESQUISA.md. Descrições anteriores de Sim/Não referem-se às versões antigas.

# Circuit QScratch

Atualização didática de 09/11/2026: percurso introdutório comum com 29 páginas, 15 perguntas de confirmação única e uma previsão guiada sem pontos antes de cada prática. Conferir a previsão libera a bancada; montar ou medir conclui o bloco. Foco e hover não medem. Novas tentativas usam conteúdo revisão 3; quizzes em andamento na revisão 2 mantêm as perguntas e escolhas anteriores. Explicações, exemplos, critérios e fontes: [Conteúdo e experimentos](CONTEUDO_E_EXPERIMENTOS.md).

Plataforma web educacional que apresenta computação quântica a quem está começando. O usuário aprende uma ideia, responde a perguntas e usa o que descobriu para montar, aos poucos, um circuito de Bell com as portas Hadamard e CNOT.

O projeto foi criado para uma optativa de computação quântica, inspirado no [QScratch](https://github.com/marcosrv-ULL/QScratch). A proposta combina uma trilha gamificada, um mascote animado e atividades curtas para despertar curiosidade e interesse pela área. A experiência atual oferece uma única versão introdutória para quem está começando, sem seleção de escolaridade.

## Experiência de aprendizagem

Cada bloco separa três momentos:

1. **Ensinar:** o mascote apresenta o conceito em páginas curtas, com navegação para avançar ou reler.
2. **Perguntar:** o usuário responde a três perguntas, com dicas e uma confirmação por pergunta. Depois de responder às três, o usuário segue para a prática, com retorno para acertos e erros.
3. **Praticar:** o usuário interage com o circuito, arrastando peças ou selecionando e clicando nos encaixes indicados.

| Bloco | Tema |
|---|---|
| Conheça os qubits | Preparação inicial e duas linhas do circuito |
| Observe uma medição | Resultado de uma medição e relação com a preparação |
| Experimente a porta H | Hadamard e possibilidades de medição |
| Conecte com CNOT | Controle, alvo e construção do estado conjunto |
| Descubra o estado de Bell | Circuito completo e resultados correlacionados |

A simulação é clássica e ideal. A plataforma não executa em um computador quântico, nem usa a correlação dos resultados como prova experimental de emaranhamento.

## Funcionalidades implementadas

Em 10/11/2026 foram acrescentados os papéis de aluno e professor, alunos por link e administração. A API exige credencial privada no servidor e as regras de acesso correspondentes no Firestore. Consulte [Painéis e acessos](PAINEIS_E_ACESSOS.md) para contratos, limites e validações.

- No cadastro, o usuário escolhe Aluno ou Professor. O professor também pode percorrer a trilha.
- Em Meus alunos, o professor cria um acesso por link sem e-mail/senha, define separadamente os formulários pré/pós, consulta progresso e erros por bloco, substitui/revoga o link e exclui o aluno após confirmação.
- O administrador consulta contas e alunos vinculados de toda a plataforma. Esse papel é concedido somente por operação administrativa.

- Cadastro individual com nome ou apelido, e-mail, senha e confirmação; login, saída e recuperação de senha por e-mail via Firebase Authentication.
- Versão introdutória comum a todos e questionário inicial obrigatório com escolaridade e questionário final opcional de percepção.
- Mapa da trilha, desbloqueio de blocos, quizzes, dicas, feedback e montagem interativa.
- Pontos por acerto: até 10 por bloco, desconto de 2 por erro e de 2 pelo uso de dicas, cobrado uma única vez por bloco, com mínimo de 2. Uma repetição só acrescenta a diferença quando supera a melhor pontuação anterior.
- Preferências separadas de som e animação, ligados inicialmente.
- Retomada do progresso da conta pelo Firestore, com indicação de salvamento e opção de tentar novamente em caso de falha.
- Revisão e repetição de blocos e certificado de conclusão exibido na tela, preservando os dados da primeira conclusão.
- Landing page com apresentação da experiência e carrossel de Ensinar, Perguntar e Praticar.

O visual usa cores quentes, contornos fortes e sombras sólidas. GSAP controla transições e animações; Lenis suaviza a rolagem da landing page. Os mascotes usam Lottie. O foco é o uso em computadores, com adaptações responsivas.

## Executar localmente

Use **Node.js 22.x** e npm. Depois de clonar:

```bash
git clone https://github.com/souzajv/circuit-qscratch.git
cd circuit-qscratch
npm ci
npm start
```

Para contas e painéis, inicie também a API em outro terminal com `npm run start:api`. Ela precisa de credenciais administrativas em ambiente privado ou dos emuladores locais. `npm start` sozinho continua permitindo conhecer a demonstração. A configuração completa está em [Painéis e acessos](PAINEIS_E_ACESSOS.md).

Abra [http://127.0.0.1:8610/](http://127.0.0.1:8610/) e mantenha o terminal aberto. Para encerrar, pressione `Ctrl + C`.

| Rota | Uso |
|---|---|
| `/#/` | Landing page |
| `/#/entrar` | Login, criação de conta e recuperação de senha |
| `/#/trilha` | Trilha vinculada à conta |
| `/#/demo` | Demonstração sem conta, com progresso apenas em memória |

A demonstração não é transferida automaticamente para uma conta. Autenticação, progresso remoto e animações externas precisam de internet.

## Testes e build

```bash
npm test
npm run test:coverage
npm run build
# Cobertura e build em sequência:
npm run check
```

O build gera `dist/`. A suíte Jest e Testing Library exige 100% de cobertura em instruções, ramificações, funções e linhas do JavaScript em `src/`. Essa medida não cobre CSS, fluidez das animações ou serviços externos. Os cenários Gherkin são especificações de aceitação e ainda não têm executor automatizado.

O GitHub Actions executa `npm ci` e `npm run check` em pushes na `main` e pull requests. Os roteiros manuais em `tests/integration/` usam contas fictícias no Firebase real e removem seus dados ao final; não fazem parte do CI. Veja o [guia de testes](tests/README.md).

## Arquitetura e organização

Aplicação React 18 com Webpack 5 e módulos separados por responsabilidade. As regras de circuito e pontuação ficam fora dos componentes visuais; adaptadores isolam serviços externos. SOLID orienta essa separação sem exigir classes ou abstrações para cada função.

| Pasta | Responsabilidade |
|---|---|
| `src/public/` | Landing page, acesso, rotas e integração da trilha com a conta |
| `src/app/` | Composição da plataforma, telas, estilos e transições |
| `src/learning/` | Conteúdo, etapas da atividade e mapa da trilha |
| `src/circuit/` | Montagem interativa e modelo matemático de dois qubits |
| `src/progress/` | Regras de pontuação e melhoria de resultados |
| `src/infrastructure/` | Adaptadores de Firebase e áudio |
| `src/shared/` | Componentes reutilizados e configurações da experiência |
| `features/` | Requisitos em cenários Gherkin |
| `firebase/` | Regras versionadas do Firestore |
| `tests/` | Testes unitários e roteiros de integração |
| `supabase/` | Rascunho histórico, sem uso na aplicação atual |

Os diretórios `account`, `completion` e `settings` marcam fronteiras planejadas; suas responsabilidades ainda não foram extraídas por completo. Os tokens visuais ficam em `src/app/tokens.css`; pontuação, escolaridades e tempos compartilhados ficam em `src/shared/config/experience.cjs`; tempos da landing page ficam em `src/public/motionConfig.js`.

## Firebase e persistência

A configuração pública do SDK web fica em `src/infrastructure/firebase/config.js` e aponta para o projeto Firebase `circuit-qscratch`. Ela não contém credenciais administrativas. Para usar outro ambiente, substitua essa configuração, habilite o provedor E-mail/Senha, crie o Firestore e publique as regras de `firebase/firestore.rules` no seu projeto.

Cada conta acessa somente `progress/{seu UID}`. São persistidos nome ou apelido, preferências, bloco atual, blocos concluídos, melhores pontuações, dados da primeira conclusão e checkpoint de cada atividade.

O salvamento agrupa mudanças próximas por 300 ms e confirma o sucesso após resposta do servidor. Aguarde **“Progresso salvo na conta”** antes de fechar a página. A saída pela interface fica indisponível quando há salvamento ou falha pendente.

Limites atuais:

- Não há funcionamento offline nem cópia local durável das alterações ainda não confirmadas.
- Alterações simultâneas na mesma atividade em dispositivos diferentes seguem a última gravação. Blocos concluídos e melhores notas são preservados por transação.
- Gabaritos e cálculo de pontos ficam no cliente. As regras isolam contas e verificam a estrutura básica; não constituem proteção antifraude da pontuação.
- A emissão de certificado ocorre somente na tela, sem validação por servidor.

Nunca coloque service accounts, chaves privadas ou tokens administrativos no frontend ou no repositório.

## Requisitos e especificações

- [Questionários de percepção e limites da análise](QUESTIONARIOS_PESQUISA.md)
- [Conteúdo, comparações e fontes didáticas](CONTEUDO_E_EXPERIMENTOS.md)
- [Requisitos funcionais, não funcionais e casos de uso](REQUISITOS-E-CASOS-DE-USO.md)
- [Cenários de aceitação em Gherkin](features/README.md)
- [Design system](DESIGN_SYSTEM.md)
- [Arquitetura do repositório](ARQUITETURA_REPOSITORIO.md)
- [Testes e seus limites](tests/README.md)
- [Publicação no GitHub e na Vercel](PUBLICACAO.md)

As especificações descrevem também comportamentos planejados. A existência de um requisito ou cenário não significa que ele já esteja implementado ou validado.

## Deploy na Vercel

Importe este repositório usando a raiz como **Root Directory**. A configuração já está em `vercel.json`:

| Opção | Valor |
|---|---|
| Framework Preset | Other |
| Node.js | 22.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

As rotas usam hash e dispensam rewrite genérico. A Vercel não publica as regras do Firestore. Depois de definir o domínio, confira os domínios autorizados do Firebase Authentication e teste cadastro, login, recuperação de senha e restauração do progresso no endereço publicado. O [guia de publicação](PUBLICACAO.md) detalha esses passos.

## Inspiração e créditos

O projeto foi inspirado no [QScratch, de marcosrv-ULL](https://github.com/marcosrv-ULL/QScratch), apresentado no [artigo-base](https://doi.org/10.1140/epjqt/s40507-025-00314-9). A aplicação atual usa nossa interface React e o modelo de Bell desenvolvido neste projeto. O editor herdado foi arquivado no workspace acadêmico e não faz parte do código ativo deste repositório.

O Circuit QScratch é uma implementação própria, inspirada na proposta educacional do QScratch. Os arquivos de licença, citação e marca herdados foram removidos desta aplicação. Nenhuma licença aberta foi escolhida para o código próprio nesta etapa; as dependências e os assets mantêm suas respectivas licenças.

Animações por [Christine Somkunwar](https://lottiefiles.com/user/a29ccdc8-ab0a-49fc-b263-32073008b985), sob [Lottie Simple License](https://lottiefiles.com/page/license), carregadas remotamente. Desenvolvimento por [João Campos](https://www.linkedin.com/in/joao-souza-campos/).

## Carregamento e entrada da trilha

O login exibe uma tela de carregamento brutalista durante a autenticação e a restauração do progresso, com o mascote Cat loading animation (CZ5vmNGwmU). O indicador comunica atividade, sem simular porcentagem ou duração mínima. Após a leitura, GSAP apresenta a navegação, os blocos, o painel lateral e o rodapé. Preferência de animação desativada na conta e movimento reduzido do sistema impedem essa entrada animada.
