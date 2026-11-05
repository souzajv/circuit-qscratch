# language: pt
@planejado
Funcionalidade: Conta individual do estudante
  Para entrar na trilha e retomar meu progresso
  O estudante usa sua própria conta

  @NC01 @NC08 @UC01
  Cenário: Criar conta individual
    Dado que o estudante está criando uma conta individual
    Quando informa nome, e-mail válido e senhas iguais
    Então a plataforma apresenta as próximas orientações de acesso
    E permite escolher sua escolaridade conforme o fluxo de confirmação configurado

  @NC01 @UC01
  Cenário: Corrigir senhas diferentes
    Dado que o estudante está criando uma conta
    Quando informa senhas diferentes
    Então a conta não é criada
    E a plataforma explica como corrigir os campos

  @NC01 @UC01
  Cenário: Corrigir dado obrigatório ausente
    Dado que o estudante está criando uma conta
    Quando tenta continuar sem informar seu nome
    Então a plataforma indica o campo obrigatório
    E permite corrigir sem repetir desnecessariamente os demais campos

  @NC02 @RNF14 @pendente_instituicao
  Cenário: Política etária ainda não definida
    Dado que a idade mínima da conta ainda não foi definida
    Quando a instituição avalia o uso da plataforma por estudantes menores de idade
    Então os requisitos de participação e tratamento de dados são definidos antes do uso real
    E a escolaridade não é usada como prova da idade

  @NC03 @UC02
  Cenário: Entrar com conta válida
    Dado que o estudante possui uma conta apta a entrar
    Quando informa credenciais válidas
    Então acessa sua trilha e seu progresso confirmado

  @NC03 @UC02
  Cenário: Tratar credenciais incorretas
    Dado que o estudante está na tela de acesso
    Quando informa credenciais incorretas
    Então não entra na conta
    E recebe uma mensagem que não revela se o e-mail existe

  @NC03 @UC02
  Cenário: Sair da conta
    Dado que o estudante está conectado
    Quando sai da conta após resolver dados pendentes
    Então a sessão é encerrada
    E o progresso privado não fica disponível para outro usuário sem autenticação

  @NC04 @UC03
  Cenário: Solicitar recuperação de senha
    Dado que o estudante esqueceu a senha
    Quando solicita recuperação para um e-mail
    Então recebe uma mensagem neutra que não confirma a existência de conta

  @NC04 @UC03
  Esquema do Cenário: Tratar link de recuperação inválido
    Dado que o estudante possui um link de recuperação <estado>
    Quando tenta usá-lo
    Então a senha não é alterada
    E a plataforma oferece solicitar outro link

    Exemplos:
      | estado   |
      | expirado |
      | usado    |
      | inválido |

  @NC04 @UC03
  Cenário: Redefinir senha
    Dado que o estudante possui um link de recuperação válido
    Quando define e confirma uma nova senha válida
    Então pode entrar com a nova senha

  @RF02 @UC10
  Cenário: Alterar escolaridade sem perder progresso
    Dado que o estudante concluiu o primeiro bloco em "anos finais"
    Quando altera sua escolaridade para "ensino médio"
    Então o progresso e as peças confirmadas permanecem
    E o texto do passo atual é atualizado para "ensino médio"

  @NC09
  Cenário: Consultar informações de privacidade
    Dado que o estudante está criando sua conta
    Quando consulta as informações sobre dados
    Então encontra finalidade, dados solicitados, exclusão e contato responsável

  @NC19 @NC26 @UC13 @pendente_politica_exclusao
  Cenário: Solicitar exclusão da própria conta
    Dado que o estudante deseja excluir sua conta
    Quando confirma a ação com sua senha após o aviso de perda do progresso
    Então a plataforma inicia o procedimento de exclusão definido
    E informa se o processamento está pendente ou confirmado

  @NC19 @UC13
  Cenário: Cancelar exclusão da conta
    Dado que o estudante solicitou excluir sua conta e viu o aviso de perda
    Quando cancela a operação
    Então a conta e o progresso permanecem disponíveis

  @RNF08 @RNF15
  Cenário: Impedir acesso ao progresso de outra conta
    Dado que Ana e Bruno possuem contas individuais distintas
    Quando Bruno tenta acessar diretamente o progresso de Ana
    Então o acesso é negado
    E os dados de Ana não são apresentados nem alterados
