# language: pt
@questionarios @especificacao_nao_automatizada
Funcionalidade: Coletar experiência e compreensão inicial vinculadas à conta
  @RF50 @RF53
  Cenário: Antes da primeira explicação
    Dado que a conta ainda não concluiu blocos nem finalizou o questionário inicial
    Quando inicia Conheça os qubits
    Então vê um modal com propósito e pré-questionário obrigatório
    E precisa responder as oito perguntas para iniciar, sem efeito em pontos
    E cada etapa apresenta uma pergunta, suas opções e um marcador de avanço
    E Anterior permite revisar respostas antes do envio

  @RF51
  Cenário: Questionário final após Bell
    Dado que a missão de Bell foi concluída
    Quando segue para o certificado ou volta ao mapa
    Então vê o questionário final se ainda não o enviou nem pulou
    E o modal da missão é fechado antes de abrir o formulário

  @RF52
  Cenário: Envio confirmado e falha recuperável
    Quando envia as respostas
    Então só continua após confirmação do banco na própria conta
    E em caso de falha mantém as respostas e pode tentar novamente
    E uma resposta Não é salva como falso, não como ausência de resposta
    E outras contas não conseguem consultar o documento

  @RF52
  Cenário: Recusa e rascunho não são respostas negativas
    Quando pula o questionário final
    Então o registro tem status skipped e respostas vazias
    E rascunhos usam status in_progress
    E registros completed e skipped são preservados nas transações da aplicação
    E refazer a trilha não repete uma coleta finalizada

  @RF53
  Cenário: Conteúdo introdutório comum
    Dado que está em Preferências
    Então não vê seleção de escolaridade
    E a trilha apresenta a mesma versão introdutória para todos

  Cenário: Comparar interesse e confiança sem mudar o sentido das opções
    Dado o instrumento na versão 3
    Quando o usuário responde ao pré e ao pós
    Então interesse e confiança têm as mesmas perguntas e cinco opções nos dois momentos
    E clareza das explicações e facilidade de uso são perguntas separadas

  Cenário: Responder compreensão sem receber ensino antecipado
    Dado uma das duas questões de conteúdo do formulário
    Quando escolhe uma alternativa ou Não sei ainda
    Então a resposta é salva sem correção, nota ou pontos
    E o usuário pode avançar independentemente de acertar

  Cenário: Enviar o pós sem comentário
    Dado que as seis respostas anteriores do pós foram preenchidas
    Quando deixa o comentário opcional em branco
    Então pode enviar o formulário
    E um comentário preenchido aceita no máximo 600 caracteres
