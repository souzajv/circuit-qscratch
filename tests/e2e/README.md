# Jornadas de professor, aluno por link e administrador

Agora há três testes Playwright em `classroom.spec.cjs`. Usam Chromium real, a aplicação React, a API Node e os emuladores oficiais de Authentication e Firestore. Não simulam o SDK nesses testes e não usam participantes ou dados de produção.

Instalar o navegador uma vez com `npx playwright install chromium`. Iniciar `npm run emulators` em outro terminal, com Java 21 disponível, e executar `npm run test:e2e`. Playwright inicia API em 8611 e frontend em 8620, com projeto `demo-circuit-qscratch`. Não pode haver outro servidor ocupando essas portas. A bateria limpa apenas os dados desse projeto descartável no emulador antes de começar.

Jornadas: cadastro de professor, aluno por link sem formulário, resposta errada salva/consultada, revogação e exclusão; isolamento entre professores, rejeição de autoelevação e acesso global do administrador; pré obrigatório quando habilitado, respostas salvas e consultadas pelo professor, largura de 390px sem transbordamento. A concessão de admin do segundo teste usa exclusivamente o SDK Admin do emulador como preparação controlada.

Capturas e rastros de falhas ficam em `test-results/`, ignorado no Git. Isso não executa diretamente os arquivos Gherkin, não comprova aprendizagem e não substitui o teste da configuração Firebase/Vercel no domínio de produção.
