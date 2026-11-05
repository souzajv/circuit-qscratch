# language: pt
Funcionalidade: Progresso da trilha vinculado à conta
  Cenário: Retomar uma atividade após entrar novamente
    Dado que estou autenticado e meu passo foi confirmado como salvo
    E usei uma dica e errei uma pergunta
    Quando recarrego a plataforma e abro a atividade
    Então retomo a fase, a pergunta, os erros, a dica e os encaixes salvos
    E os descontos não são zerados

  Cenário: Repetir um bloco concluído
    Dado que concluí um bloco com 8 pontos
    Quando escolho refazer esse bloco e obtenho 4 pontos
    Então a melhor nota continua em 8
    E a primeira conclusão da trilha não é substituída

  Cenário: Falha de leitura do banco
    Dado que entrei na minha conta
    Quando o servidor não permite carregar o progresso
    Então vejo uma opção para tentar novamente
    E nenhum progresso vazio substitui os dados existentes

  Cenário: Sair durante um salvamento
    Dado que existe uma alteração ainda não confirmada pelo servidor
    Então a saída da conta fica indisponível
    E em caso de falha posso tentar salvar novamente

  Cenário: Isolamento de contas
    Dado que o usuário A possui progresso salvo
    Quando um usuário anônimo ou o usuário B tenta ler ou alterar esse registro
    Então o Firestore rejeita a operação
