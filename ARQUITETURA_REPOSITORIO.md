# Arquitetura atual

## Atualização vigente de 10/11/2026

Firebase Auth e Firestore estão integrados. A aplicação agora também possui uma API Node na Vercel: `api/classroom.js` verifica sessão e papel; `server/classroom` contém permissões e casos de uso com dependências injetadas; `server/firebase.cjs` implementa os contratos de dados/autenticação. O frontend usa `src/infrastructure/firebase/classroom.js`, e `src/classroom` apresenta painel, confirmação de exclusão e entrada por convite. A configuração administrativa é privada, fora do bundle do Webpack. Consulte PAINEIS_E_ACESSOS.md. Descrições abaixo de fronteiras reservadas, API inexistente e E2E futuro são registros anteriores a essa implementação.

O fluxo existente de aprendizagem continua em seus módulos. Respostas confirmadas entram em `answerHistory`; o adaptador transacional preserva registros já salvos. Papéis são protegidos em `profiles`, vínculos em `students`, progresso no caminho existente. Revogação usa uma versão de acesso conferida em cada operação pelas regras. A implementação local possui testes de navegador com API e emuladores; ativação de produção precisa de validação separada.

Atualizada em 03/11/2026 após a limpeza solicitada pelo usuário. O Circuit QScratch é uma aplicação React com Webpack, sem npm workspaces. O editor QScratch completo foi arquivado em ../arquivo-repositorio-2026-11-03/. Não há importações de pacotes Scratch no código ativo.

A aplicação parte de src/app/index.jsx. Conteúdo e componentes da trilha ficam em src/learning; regras de pontuação em src/progress; os encaixes e o modelo matemático em src/circuit. Componentes reutilizados ficam em src/shared/ui. Account, settings, completion e infrastructure são fronteiras reservadas, ainda sem implementação separada.

O modelo em src/circuit/model.cjs foi desenvolvido anteriormente como prova de Bell. Agora ele é parte da aplicação e seus testes estão em tests/unit/model.test.cjs. Preserva a ordem controle, alvo, amplitudes complexas, Hadamard, CNOT e nova preparação antes de cada rodada.

Aplicar SOLID conforme a necessidade: separar regras testáveis de componentes e serviços externos, evitar abstrações preventivas e definir contratos na próxima integração. O estado visual permanece centralizado na composição inicial; não declarar que todos os módulos planejados foram implementados.

Supabase, autenticação, autorização, pontuação confiável e persistência continuam pendentes. A migração histórica não deve ser aplicada como esquema final. Os cenários em features/ continuam especificações, sem executor.

Comandos e limites atuais estão em README.md. As descrições anteriores do monorepositório e das provas de integração com VM são históricas; não representam a execução atual. Licenças e atribuições foram preservadas. A Sprint 1 não foi alterada.

## Organização e qualidade em 05/11/2026

A entrada src/app/index.jsx apenas monta App. As telas de mapa, ajuda, preferências e certificado estão em src/app/screens. O hook useCurtain controla transições; o adaptador src/infrastructure/audio/playFeedback.js isola a API de áudio do navegador. O conteúdo permanece em learning e as regras matemáticas e de pontuação ficam separadas em circuit e progress.

Os valores compartilhados de pontuação, escolaridades e tempos estão em src/shared/config/experience.cjs. As cores, fontes de escala, espaçamentos, raios e valores compartilhados do visual estão em src/app/tokens.css. As folhas base, experiência e responsividade preservam a ordem de cascata existente; números locais de geometria e breakpoints ainda podem ser explícitos quando descrevem uma proporção ou limite específico. Consolidar esses pontos conforme novas necessidades, evitando abstrações apenas para reduzir números literais.

Comentários explicam decisões, recursos opcionais e limites em português. O conteúdo didático permanece PT-BR. A suíte Jest e Testing Library mede todos os arquivos JavaScript de src/, com limiar de 100% nas quatro métricas. Consulte tests/README.md. Testes de CSS em navegador real e E2E continuam separados e futuros. SOLID orienta as fronteiras sem exigir classes ou interfaces para cada função.

## Conteúdo e laboratórios em 06/11/2026

O conteúdo implementado está em lessonContent.js e content.js; as representações foram separadas em LearningExample, MiniCircuit, ExperimentPanel e experiments.cjs. O último reutiliza o modelo físico de circuit/model.cjs. Lesson compõe as páginas, as três perguntas e a prática. Laboratórios não escrevem no checkpoint da trilha; quizIndex, questionHint e contentRevision entram no checkpoint existente. Interface visual usa tokens, SVG e transições por interação, com apoio de texto e controles de teclado. Consulte CONTEUDO_E_EXPERIMENTOS.md para público, fontes e limites. O rascunho histórico Supabase continua sem uso; autenticação e persistência vigentes são Firebase Auth e Firestore.
