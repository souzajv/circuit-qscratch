# Circuit QScratch

Plataforma web educacional que apresenta computação quântica a quem está começando. O usuário aprende uma ideia, responde a uma pergunta e usa o que descobriu para montar, aos poucos, um circuito de Bell com as portas Hadamard e CNOT.

O projeto foi criado para uma optativa de computação quântica, inspirado no [QScratch](https://github.com/marcosrv-ULL/QScratch). A proposta combina uma trilha gamificada, um mascote animado e atividades curtas para despertar curiosidade e interesse pela área. As explicações são adaptadas ao **Ensino Fundamental Anos Finais, do 6º ao 9º ano, e ao Ensino Médio**. O conteúdo está sujeito à revisão do professor e ainda não foi validado com estudantes.

## Experiência de aprendizagem

Cada bloco separa três momentos:

1. **Ensinar:** o mascote apresenta o conceito em páginas curtas, com navegação para avançar ou reler.
2. **Perguntar:** o usuário responde a um quiz, com dicas e tentativas ilimitadas. É preciso acertar para seguir.
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

- Cadastro individual com nome ou apelido, e-mail, senha e confirmação; login, saída e recuperação de senha por e-mail via Firebase Authentication.
- Escolha de escolaridade e explicações correspondentes aos dois públicos definidos.
- Mapa da trilha, desbloqueio de blocos, quizzes, dicas, feedback e montagem interativa.
- Pontos por acerto: até 10 por atividade, desconto de 2 por erro e de 2 pelo uso de dica, com mínimo de 2. Uma repetição só acrescenta a diferença quando supera a melhor pontuação anterior.
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

Cada conta acessa somente `progress/{seu UID}`. São persistidos nome ou apelido, escolaridade, preferências, bloco atual, blocos concluídos, melhores pontuações, dados da primeira conclusão e checkpoint de cada atividade.

O salvamento agrupa mudanças próximas por 300 ms e confirma o sucesso após resposta do servidor. Aguarde **“Progresso salvo na conta”** antes de fechar a página. A saída pela interface fica indisponível quando há salvamento ou falha pendente.

Limites atuais:

- Não há funcionamento offline nem cópia local durável das alterações ainda não confirmadas.
- Alterações simultâneas na mesma atividade em dispositivos diferentes seguem a última gravação. Blocos concluídos e melhores notas são preservados por transação.
- Gabaritos e cálculo de pontos ficam no cliente. As regras isolam contas e verificam a estrutura básica; não constituem proteção antifraude da pontuação.
- A emissão de certificado ocorre somente na tela, sem validação por servidor.

Nunca coloque service accounts, chaves privadas ou tokens administrativos no frontend ou no repositório.

## Requisitos e especificações

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

## Origem, licença e créditos

O projeto foi inspirado no [QScratch, de marcosrv-ULL](https://github.com/marcosrv-ULL/QScratch), apresentado no [artigo-base](https://doi.org/10.1140/epjqt/s40507-025-00314-9). A aplicação atual usa nossa interface React e o modelo de Bell desenvolvido neste projeto. O editor herdado foi arquivado no workspace acadêmico e não faz parte do código ativo deste repositório.

A [licença AGPL-3.0](LICENSE), a [referência original](CITATION.cff) e o [aviso de marca](TRADEMARK) foram preservados. O código desta versão está disponível em [souzajv/circuit-qscratch](https://github.com/souzajv/circuit-qscratch).

Animações por [Christine Somkunwar](https://lottiefiles.com/user/a29ccdc8-ab0a-49fc-b263-32073008b985), sob [Lottie Simple License](https://lottiefiles.com/page/license), carregadas remotamente. Desenvolvimento por [João Campos](https://www.linkedin.com/in/joao-souza-campos/).
