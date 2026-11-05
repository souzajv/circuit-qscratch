# Implementação atual

Após a limpeza de 03/11/2026, a aplicação usa src/, tests/ e webpack.config.cjs diretamente na raiz. Comandos: npm start, npm test e npm run build. O servidor usa http://127.0.0.1:8610/ e o build gera dist/. O catálogo de requisitos permanece em REQUISITOS-E-CASOS-DE-USO.md.

A interface tem cinco blocos com falas, quiz e prática separados, cortina e contagem antes do teste, encaixes por arraste ou seleção, modelo ideal de Bell, marcadores, pontos de demonstração e mascotes conforme a atividade. Não há autenticação ou persistência online; Supabase permanece pendente. A documentação de planejamento anterior não equivale a implementação completa.

Na limpeza, 12 testes de unidade e modelo passaram, e a compilação passou. Os cenários Gherkin continuam sem executor. Isso não comprova aprendizagem ou integração Supabase. A revisão visual dos refinamentos foi feita em etapas anteriores; o novo arranjo de arquivos requer acompanhamento nos próximos testes de interface.

O histórico da primeira implementação está em ../arquivo-repositorio-2026-11-03/IMPLEMENTACAO_INICIAL-ANTES-DA-LIMPEZA.md. O código herdado foi arquivado fora deste repositório. Material acadêmico e Sprint 1 preservados.
