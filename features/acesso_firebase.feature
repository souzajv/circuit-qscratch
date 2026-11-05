# language: pt
Funcionalidade: Acesso individual pelo Firebase
  O visitante encontra login e cadastro na mesma tela de acesso.

  Cenário: Abrir o acesso pela landing
    Dado que estou na landing page
    Quando seleciono "Entrar"
    Então vejo o formulário de login
    E posso alternar para "Criar conta" no mesmo painel
    E não vejo um segundo link separado para login na landing

  Cenário: Alternar de login para cadastro preservando o e-mail
    Dado que preenchi e-mail e senha no login
    Quando seleciono "Criar conta"
    Então o e-mail continua preenchido
    E as senhas ficam vazias e ocultas
    E são solicitados nome ou apelido e confirmação de senha

  Cenário: Cadastro com confirmação diferente
    Dado que preenchi os campos de cadastro
    Mas a confirmação é diferente da senha
    Quando solicito criar minha conta
    Então vejo que as senhas precisam ser iguais
    E nenhuma conta é criada no Firebase

  Cenário: Aguardar resposta do provedor
    Dado que enviei dados válidos de acesso
    Enquanto o Firebase não responde
    Então não posso enviar o formulário novamente
    E o acesso à trilha não é apresentado como concluído

  Cenário: Firebase confirma o acesso
    Dado que enviei dados válidos de cadastro ou login
    Quando o Firebase confirma a autenticação
    Então a trilha é aberta
    Mas o progresso ainda não é apresentado como salvo na conta

  Cenário: Recuperar a senha
    Dado que informei um e-mail válido
    Quando seleciono "Esqueci minha senha"
    E o provedor confirma o recebimento da solicitação
    Então vejo uma mensagem genérica sobre o envio do link
    E a mensagem não confirma se o e-mail possui uma conta
