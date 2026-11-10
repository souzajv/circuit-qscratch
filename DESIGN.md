# Interface do Circuit QScratch

O sistema visual existente é registrado em [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), com cores, tipografia, componentes e créditos. Este arquivo complementa essa referência para as telas de gestão e acesso por link, sem substituir a identidade da plataforma.

## Gestão de contas

Modo Operate: localizar uma conta, consultar seu percurso e voltar à lista. Preservar papel creme, laranja, contornos escuros, cantos arredondados e sombras sólidas nas ações. Linhas de contas usam separadores, evitando transformar cada registro em um cartão com sombra. Controles e dados usam a mesma fonte da plataforma.

Listagem com título, busca rotulada por nome/e-mail, contagem dos registros carregados e paginação explícita. A busca é local aos registros carregados; não apresentar os números como total global do banco. Contas comuns e professores aparecem antes dos alunos vinculados no painel administrativo. Criar acesso fica em coluna própria no desktop e abaixo da lista em telas estreitas. Novo acesso conduz ao formulário e posiciona o foco no nome.

Consultar conta e Ver progresso substituem a listagem por uma consulta dedicada, com foco e rolagem no início. Fechar detalhes volta à listagem, preservando busca e registros carregados. Os questionários e erros continuam separados por bloco e momento da coleta. Nenhum dado é escrito por abrir uma consulta. Criar um link conduz o foco até o campo correspondente, sem deixar a confirmação escondida no início da página.

## Entrada pelo link do professor

Logo da plataforma, gato com prancheta, balão com instruções, ação principal e aviso sobre substituir a sessão do navegador. Desktop coloca mascote e balão lado a lado; celular empilha e reposiciona a ponta do balão. O mascote mantém proporção quadrada. Enquanto o player externo carrega ou se estiver indisponível, o gatinho vetorial local da marca ocupa seu lugar; o evento de carregamento dá lugar à animação. Movimento reduzido mantém o mascote pausado. Créditos dos assets permanecem acessíveis.

## Validação e limites

Revisão visual por capturas de navegador a 1280px e 390px, além de testes de foco, busca, consulta, retorno, criação de acesso e erros. A skill Impeccable orientou a revisão; seu inicializador não executou por falta de acesso ao cache, e o contexto foi lido diretamente. Não houve substituição de fontes, paleta, mascote, autenticação, pontuação ou instrumentos de pesquisa.
