# language: pt
@RF11 @RF12 @RF13 @RF14 @RF15 @RF16 @RF17 @RF18 @RF19 @RF20 @NC16 @NC30 @RNF05 @RNF06 @UC05 @UC08 @UC10 @UC20
Funcionalidade: Construir e medir o circuito de Bell
  Para relacionar cada peça ao que ela faz
  O estudante treina, monta e mede uma simulação

  Cenário: Medir qubit de treino em zero
    Dado que um qubit de treino foi preparado em zero
    Quando o estudante o mede na base computacional ideal
    Então o resultado é zero
    E o circuito principal não é alterado

  @planejado
  Cenário: Conhecer H antes de encaixar
    Dado que um qubit de treino foi preparado em zero
    Quando o estudante aprende e aplica H nesse qubit
    Então é informado que zero e um são resultados possíveis com a mesma probabilidade ideal nessa base

  Cenário: Mostrar apenas o encaixe permitido para H
    Dado que o circuito principal possui duas linhas
    Quando o estudante consulta os encaixes para H
    Então apenas a primeira linha exibe o encaixe de H
    E a segunda linha permanece contínua, sem encaixe aparente

  Cenário: Confirmar H na primeira linha
    Dado que o circuito principal possui duas linhas sem portas
    Quando o estudante confirma H na primeira linha
    Então a montagem confirmada contém H
    E o progresso pode ser salvo

  @planejado
  Esquema do Cenário: Explorar a regra da CNOT em entradas de base
    Dado que o treino separado usa a entrada <entrada> com controle primeiro
    Quando o estudante aplica CNOT
    Então observa a saída <saida>
    E o circuito principal permanece inalterado

    Exemplos:
      | entrada | saida |
      | 00      | 00    |
      | 01      | 01    |
      | 10      | 11    |
      | 11      | 10    |

  @planejado
  Cenário: CNOT com controle e alvo invertidos
    Dado que H está confirmada na primeira linha
    Quando o estudante tenta confirmar CNOT com controle na segunda linha
    Então a plataforma orienta a colocar o controle na primeira linha e o alvo na segunda
    E não confirma a montagem incorreta

  Cenário: Montar a sequência da missão
    Dado que H está confirmada na primeira linha
    Quando o estudante confirma CNOT depois de H com controle no primeiro qubit
    Então o circuito está pronto para validação

  Cenário: Impedir execução de montagem incompleta
    Dado que o circuito principal não possui CNOT confirmada
    Quando o estudante solicita executar o circuito final
    Então a plataforma explica qual peça falta
    E permite voltar à montagem

  Cenário: Mostrar uma amostra da medição
    Dado que o circuito ideal de Bell está montado corretamente
    Quando o estudante executa e mede os dois qubits na base computacional
    Então observa um único par que é 00 ou 11
    E recebe a explicação dos dois resultados possíveis

  Cenário: Repetir medição começa com nova preparação
    Dado que o estudante já mediu o circuito final uma vez
    Quando solicita outra rodada
    Então a plataforma prepara novamente o circuito em 00 antes de aplicar H e CNOT
    E mostra uma nova amostra sem reaproveitar o estado medido anterior

  Cenário: Concluir sem exigir resultados diferentes
    Dado que o circuito correto foi executado e medido
    E o estudante viu a explicação final
    Quando as rodadas realizadas mostraram apenas 00
    Então a plataforma permite concluir a trilha

  @planejado
  Cenário: Avisar o impacto de editar uma montagem concluída
    Dado que o estudante concluiu a montagem de H e CNOT
    Quando solicita alterar uma peça confirmada
    Então a plataforma informa que etapas posteriores poderão precisar ser refeitas
    E permite cancelar sem perder progresso

  Cenário: Não confundir correlação com prova de emaranhamento
    Dado que o estudante acessa a explicação introdutória do estado de Bell
    Quando revê a explicação dos resultados 00 e 11
    Então é informado que essa distribuição sozinha não comprova emaranhamento

  @RF38 @UC05
  Cenário: Prévia antes de conhecer os qubits
    Dado que o estudante ainda não concluiu a prática do primeiro bloco
    Quando consulta a prévia no mapa
    Então vê somente duas linhas sem rótulos de qubits nem estados

  @RF38 @UC08
  Cenário: Um único qubit não conclui a preparação
    Dado que a prática do primeiro bloco exige dois qubits
    Quando o estudante encaixa somente o primeiro
    Então a missão continua em andamento
    E o segundo bloco permanece bloqueado

  @RF38 @UC08
  Cenário: Medir não sorteia novamente ao mover o mouse
    Dado que uma rodada de Bell já revelou 11
    Quando o medidor recebe novos eventos de hover, foco ou clique
    Então continua mostrando 11 até uma nova preparação explícita
    E nenhum ponto adicional é concedido
