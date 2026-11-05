# Cenários de aceitação em Gherkin

Atualizados em 05/11/2026. O fluxo de cada bloco é ensinar, perguntar, praticar e concluir. Acertar libera a prática; terminar a prática registra a melhor nota e libera o próximo bloco. Os arquivos descrevem aceitação e orientam BDD/TDD, mas não têm executor ou definições de passos. Nenhum cenário foi executado como teste automatizado nesta atualização.

| Arquivo | Responsabilidade | Referências principais |
|---|---|---|
| fluxo_ensinar_perguntar_praticar.feature | Fases, cortina, contagem, falas, quiz, prática, mascotes, mapa, pontos e responsividade | RF32 a RF43; UC05, UC06, UC08, UC10, UC11, UC16; RNF02 e RNF20 |
| trilha_e_aprendizagem.feature | Objetivo didático, escolaridade, bloqueio e revisão | RF04 a RF10; UC05 e UC06 |
| circuito_bell.feature | Encaixes, prévia progressiva, operações e medição | RF11 a RF20, RF38; UC05 e UC08; planejamento NC16 e NC30 |
| pontos_e_progresso.feature | Cálculo, crédito após prática, melhor nota e retomada desejada | RF30; NC10 a NC16, NC22 a NC25, NC27, NC29, NC30 |
| conclusao_e_acessibilidade.feature | Conclusão, certificado desejado e acesso por teclado | RF20, RF21, RF31; NC17 a NC20 e NC26; RNF02, RNF03 e RNF11 |
| contas_e_perfis.feature | Conta individual; o nome do arquivo é histórico, não indica perfis vinculados | NC01 a NC04, NC08, NC09, NC19, NC26 e RF02 |

Tags novas estão próximas dos cenários a que se referem. Tags coletivas antigas indicam o escopo de um arquivo e não comprovam cobertura individual. A ausência de um requisito na tabela não prova sua exclusão do escopo.

- @fluxo_atual: decisão atual de experiência; não significa cenário automatizado ou comportamento integralmente validado.
- @especificacao_nao_automatizada: descrição sem executor ou passos de teste.
- @planejado: função ainda pendente, como autenticação, persistência, revisão sem refazer e treino ampliado. Cenários com servidor dependem de integração, mesmo quando a tag não estiver presente.
- @validacao_institucional, @pendente_politica_exclusao, @pendente_politica_versao, @pendente_pesquisa e @proposta_recompensas: condições ou decisões ainda abertas.

## Limites conhecidos

A prévia guarda estado apenas na sessão. Reabrir um bloco reinicia o quiz, por isso NC11 e NC22 ainda não são atendidos. Cadastro, Supabase, políticas, concorrência e emissão confiável de certificado não foram implementados. O tutorial pulável dedicado, a revisão distinta de refazer e os treinos ampliados de H e CNOT permanecem planejados.

Sons e animações começam ligados por decisão do usuário; controles independentes existem. A rolagem considera movimento reduzido do dispositivo, mas a aplicação automática dessa preferência a todas as animações ainda é uma pendência de RNF11. Os cenários de acessibilidade especificam o resultado esperado, sem declarar conformidade validada.

Os 36 testes Jest existentes cobrem regras, modelo matemático e componentes, mas não executam os arquivos feature. Use npm test ou npm run test:coverage; detalhes em ../tests/README.md. A próxima automação deve escolher cenários prioritários, implementar passos ou testes de interface, observar falha significativa e só então implementar e confirmar o resultado. Revisão docente e observação de estudantes são verificações separadas.
