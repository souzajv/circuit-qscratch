# language: pt
@RF30 @NC10 @NC11 @NC12 @NC13 @NC14 @NC15 @NC16 @NC22 @NC23 @NC24 @NC25 @NC27 @NC29 @NC30 @RNF07 @RNF16 @RNF17 @UC06 @UC07 @UC09 @UC14 @UC16 @UC17 @UC18 @UC20
Funcionalidade: Pontuação e retomada do progresso
  Para continuar aprendendo sem perder o que já conquistei
  O estudante recebe retorno claro e pode refazer atividades

  Esquema do Cenário: Calcular a pontuação única do bloco
    Dado que o estudante inicia um bloco de três perguntas que vale até 10 pontos
    E comete <erros> erros e usa a dica <dica>
    Quando responde corretamente às três perguntas
    Então a pontuação possível da tentativa fica em <pontos>
    E o total ainda não aumenta
    Quando conclui a prática do mesmo bloco
    Então sua melhor nota é atualizada com <pontos> pontos
    E o total aumenta somente pela diferença positiva sobre a melhor nota anterior

    Exemplos:
      | erros | dica | pontos |
      | 0     | não  | 10     |
      | 1     | não  | 8      |
      | 0     | sim  | 8      |
      | 1     | sim  | 6      |
      | 9     | sim  | 2      |

  Cenário: Avisar sobre pontos antes de usar a dica
    Dado que o estudante ainda não usou nenhuma dica no bloco
    Quando consulta o botão de dica antes de ativá-lo
    Então vê o aviso de desconto de 2 pontos
    E pode decidir se ativa a dica

  Cenário: Rever a mesma dica não gera novo desconto
    Dado que o estudante já usou a dica da pergunta
    Quando abre a mesma dica novamente
    Então nenhum desconto adicional é aplicado

  Cenário: Melhorar a pontuação de uma atividade
    Dado que a melhor pontuação anterior da atividade é 6 pontos
    Quando o estudante refaz a atividade e obtém 8 pontos
    Então sua melhor pontuação da atividade passa a 8 pontos
    E seu total aumenta em apenas 2 pontos

  Cenário: Refazer com nota menor preserva o resultado anterior
    Dado que a melhor pontuação anterior da atividade é 8 pontos
    Quando o estudante refaz a atividade e obtém 4 pontos
    Então sua melhor pontuação continua em 8 pontos
    E seu total não diminui

  @planejado
  Cenário: Retomar tentativa após erro e dica
    Dado que o estudante cometeu um erro e usou uma dica registrados pelo servidor
    Quando fecha e reabre a atividade na mesma conta
    Então retoma a tentativa com o erro e a dica contabilizados

  @planejado
  Cenário: Evitar duplicidade após reenvio
    Dado que uma resposta correta foi registrada pelo servidor
    Quando a mesma operação é reenviada com o mesmo identificador
    Então o resultado anterior é recuperado
    E os pontos não são somados novamente

  @planejado
  Cenário: Dica e resposta simultâneas
    Dado que duas abas enviam uma dica e uma resposta para a mesma pergunta
    Quando o servidor processa as operações
    Então aplica a ordem confirmada das operações
    E revalida a operação posterior sem duplicar pontuação

  @planejado
  Cenário: Não aceitar pontos enviados diretamente pelo navegador
    Dado que o estudante está em uma atividade
    Quando um cliente tenta definir sua própria pontuação sem validação da resposta
    Então o servidor rejeita a alteração
    E preserva a pontuação confirmada

  @planejado
  Cenário: Avisar quando o avanço não foi confirmado
    Dado que o estudante realizou uma ação e a conexão falhou antes da confirmação
    Quando a plataforma apresenta o estado da ação
    Então informa que o avanço está pendente de salvamento
    E oferece tentar novamente

  @planejado
  Cenário: Sair com um rascunho pendente
    Dado que existe uma alteração ainda não confirmada pelo servidor
    Quando o estudante tenta sair
    Então a plataforma oferece tentar salvar ou descartar o rascunho
    E explica que o avanço pendente pode ser perdido

  @planejado
  Cenário: Rascunhos de contas diferentes não se misturam
    Dado que "Sol" e "Lua" têm contas e rascunhos pendentes separados
    Quando "Lua" entra em sua conta
    Então a plataforma não apresenta nem envia o rascunho de "Sol" como se fosse de "Lua"

  @planejado
  Cenário: Retomar em outro aparelho
    Dado que o progresso de "Sol" foi confirmado pelo servidor
    Quando "Sol" acessa sua conta em outro aparelho
    Então a plataforma recupera as peças e o último passo confirmado
    E não apresenta rascunhos não enviados do aparelho anterior como salvos

  @planejado
  Cenário: Uma atualização atrasada não recria conta excluída
    Dado que uma conta foi excluída e o servidor confirmou sua exclusão
    Quando uma aba antiga tenta enviar uma atualização dessa conta
    Então o servidor recusa a atualização
    E a conta permanece excluída

  @pendente_politica_versao
  Cenário: Conteúdo muda durante uma tentativa
    Dado que uma tentativa está associada à versão 1 de uma atividade
    Quando a versão 2 altera uma pergunta
    Então as notas históricas não são alteradas silenciosamente
    E a plataforma segue a política de continuidade ou migração a definir
