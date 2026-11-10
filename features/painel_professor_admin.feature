# language: pt
Funcionalidade: Professores, alunos por link e administração
  O professor acompanha somente seus alunos e o administrador consulta a plataforma.

  Esquema do Cenário: Selecionar papel no cadastro
    Dado que preenchi dados válidos de uma nova conta
    Quando escolho "<papel>" e concluo o cadastro
    Então o papel é confirmado pelo servidor
    E vejo "<opção>" na navegação
    Exemplos:
      | papel        | opção       |
      | Sou aluno    | Trilhas     |
      | Sou professor| Meus alunos |

  Cenário: Impedir elevação de privilégio
    Dado que tenho uma conta de aluno
    Quando envio diretamente um pedido de papel administrador
    Então não recebo acesso administrativo
    E não posso consultar contas globais nem alunos de professores

  Cenário: Cadastro interrompido após autenticação
    Dado que o Firebase criou minha conta de professor
    Mas houve falha ao salvar o papel no servidor
    Quando tento concluir novamente com o mesmo e-mail
    Então o sistema conclui o papel sem criar outra conta
    E só abre a trilha após confirmação

  Cenário: Criar acesso sem e-mail e senha
    Dado que sou professor autenticado
    Quando crio um aluno com apelido e opções independentes de pré e pós
    Então recebo um link exclusivo para aquele aluno
    E sou avisado de que qualquer portador pode usá-lo até revogação
    E a lista não expõe o segredo nem seu hash

  Cenário: Reutilizar o link em outro aparelho
    Dado que um professor criou um link ativo
    Quando confirmo a entrada pelo link em outro aparelho
    Então acesso o mesmo aluno e progresso sem e-mail ou senha
    E o segredo deixa de aparecer no endereço após a entrada
    E não recebo opções de professor ou administrador

  Esquema do Cenário: Aplicar as opções de coleta
    Dado que o professor configurou o formulário "<momento>" como "<situação>"
    Quando alcanço o momento correspondente na trilha
    Então o formulário "<comportamento>"
    E desativar não cria respostas nem apaga respostas anteriores
    Exemplos:
      | momento | situação   | comportamento                     |
      | pré     | ativado    | aparece e exige preenchimento     |
      | pré     | desativado | não aparece e não impede início   |
      | pós     | ativado    | aparece com opção de não responder|
      | pós     | desativado | não aparece na conclusão          |

  Cenário: Acompanhar erros e pesquisas
    Dado que um aluno meu respondeu uma pergunta errada e enviou o pré
    Quando consulto seu progresso
    Então vejo o bloco atual, blocos concluídos e melhor pontuação
    E vejo a pergunta errada, escolha, correta e revisão no bloco correspondente
    E vejo as respostas pré e pós com a situação de preenchimento
    E registros anteriores sem histórico não são inventados

  Cenário: Isolar professores mesmo por acesso direto
    Dado que um aluno pertence a outro professor
    Quando tento consultar, alterar, revogar ou excluir esse aluno pela API
    Então a operação é negada
    E seus dados permanecem inalterados

  Cenário: Substituir ou revogar link
    Dado que um aluno tem sessão aberta por link
    Quando seu professor substitui ou revoga o acesso
    Então o link e a sessão antigos não podem ler ou gravar progresso
    E o progresso permanece disponível para o professor
    E somente o novo link, se gerado, permite retomar o mesmo aluno

  Cenário: Confirmar exclusão e recuperar falha
    Dado que selecionei excluir um aluno meu
    Então vejo aviso de perda de perfil, progresso e respostas
    Quando confirmo a exclusão e ocorre uma falha de remoção
    Então o acesso permanece revogado com exclusão pendente
    E posso repetir a exclusão sem reativar o aluno

  Cenário: Consultar todas as contas como administrador
    Dado que minha conta recebeu o papel administrador por operação confiável
    Quando abro Administração
    Então consulto professores, alunos comuns e alunos vinculados
    E identifico o professor proprietário de cada aluno vinculado
    E posso carregar páginas seguintes das listas

  Cenário: Usar painel em tela estreita ou pelo teclado
    Dado que acesso o painel em largura de 390 pixels ou pelo teclado
    Então os controles permanecem acessíveis sem corte horizontal
    E o diálogo de exclusão mantém foco e permite cancelar antes da confirmação
