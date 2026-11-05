# Verificações manuais de integração

`firebase-smoke.mjs` verifica autenticação. `progress-smoke.mjs` verifica persistência e isolamento de contas. Execute com Node 22 e rede disponível, somente quando necessário. Ambos usam contas fictícias e removem seus dados ao final; não fazem parte da CI nem de `npm test`.

A inspeção visual com `progress-browser.mjs` depende de uma ferramenta local e não é versionada.
