# Arquitetura atual

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
