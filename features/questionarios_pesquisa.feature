# language: pt
@questionarios @especificacao_nao_automatizada
Funcionalidade: Coletar percepções de forma opcional e vinculada à conta
  @RF50 @RF53
  Cenário: Antes da primeira explicação
    Dado que a conta ainda não concluiu blocos nem finalizou o questionário inicial
    Quando inicia Conheça os qubits
    Então vê um modal com propósito e participação opcional
    E pode responder ou pular sem efeito em pontos
    E cada etapa apresenta uma pergunta, Sim, Não e um marcador de avanço
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
    Quando pula o questionário
    Então o registro tem status skipped e respostas vazias
    E rascunhos usam status in_progress
    E registros completed e skipped são preservados nas transações da aplicação
    E refazer a trilha não repete uma coleta finalizada

  @RF53
  Cenário: Conteúdo introdutório comum
    Dado que está em Preferências
    Então não vê seleção de escolaridade
    E a trilha apresenta a mesma versão introdutória para todos
