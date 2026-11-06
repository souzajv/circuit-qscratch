# Publicar no GitHub e na Vercel

A pasta deste repositório é `circuit-qscratch/`. O material acadêmico e as entregas do workspace ficam fora dele. O repositório remoto definido é https://github.com/souzajv/circuit-qscratch. O deploy na Vercel é uma etapa separada.

## Verificar antes de enviar

Use Node.js 22 e execute:

```powershell
npm ci
npm run check
```

`check` roda a cobertura e o build. Os testes de integração em `tests/integration/` usam Firebase real e contas fictícias; não são executados no CI nem no build da Vercel. `dist/`, `coverage/`, `node_modules/`, `.env*`, chaves privadas e `.vercel/` ficam fora do Git. Preserve `package-lock.json`, licenças, créditos e `firebase/firestore.rules`.

## Enviar para GitHub

O Git local já foi inicializado na branch `main`. O repositório remoto foi criado sem arquivos iniciais. Na raiz desta pasta:

```powershell
git add .
git commit -m "Prepara Circuit QScratch para publicação"
git remote add origin https://github.com/souzajv/circuit-qscratch.git
git push -u origin main
```

O comando `git remote add` só é necessário se `origin` ainda não estiver configurado. O Git usa a identidade configurada pelo próprio usuário. O workflow `.github/workflows/ci.yml` verifica pushes na main e pull requests, com acesso somente de leitura ao código. Nenhum token Firebase administrativo é necessário para o CI.

## Importar na Vercel

Importe o repositório na Vercel. Se o repositório contiver somente esta pasta, use a raiz como Root Directory; se tiver o workspace inteiro, selecione `circuit-qscratch`.

| Configuração | Valor |
|---|---|
| Framework Preset | Other |
| Node.js | 22.x |
| Install Command | npm ci |
| Build Command | npm run build |
| Output Directory | dist |

Esses valores já estão em `vercel.json` e `package.json`. Não use `npm start` como comando de produção: ele é o servidor de desenvolvimento. Não há servidor Node ou API hospedada pela Vercel nesta versão.

As rotas usam fragmentos (`/#/entrar`, `/#/trilha`, `/#/demo`), portanto não precisam de rewrite genérico. O Webpack gera JavaScript com hash no nome para atualizar assets sem reaproveitar uma versão antiga.

## Firebase e domínio publicado

O ambiente usa o projeto Firebase `circuit-qscratch`. `src/infrastructure/firebase/config.js` contém a configuração pública do SDK web. Esses identificadores e a API key web fazem parte do bundle do navegador; não são credenciais administrativas. Não incluir chaves de service account, tokens de CLI ou segredos no frontend.

Depois de conhecer o domínio final, confira-o em Firebase Console → Authentication → Configurações → Domínios autorizados. Cadastre o hostname exato que será usado, sem presumir curingas para previews. Revise também os links e os modelos de recuperação de senha antes de usar um domínio próprio.

A Vercel não publica regras do Firestore. As regras atuais já foram publicadas manualmente no projeto Firebase; `firebase/firestore.rules` é a cópia versionada. Mudanças nesse arquivo exigem publicação separada e validação do isolamento de contas.

Após o deploy, testar cadastro, login, restauração, saída e recuperação de senha no domínio final. O teste local não substitui a verificação em HTTPS no domínio publicado. Gatos e player Lottie ainda dependem de serviços externos.

## Fonte, créditos e limites atuais

Preserve os créditos de inspiração no QScratch e as atribuições e licenças dos assets e das dependências utilizadas. A aplicação não exibe um link para seu próprio repositório. O código próprio ainda não recebeu uma licença aberta; os metadados npm indicam UNLICENSED.

O progresso confirmado é privado por UID. Pontuação ainda é calculada pelo cliente, e dados ainda marcados como salvando não têm backup local durável. O build pode avisar sobre o tamanho do pacote; isso não impede a compilação, mas deve ser acompanhado após a publicação.
