# language: pt
@fluxo_atual @especificacao_nao_automatizada
Funcionalidade: Relacionar cada peça ao que ela faz
  O iniciante faz uma previsão, pratica e recebe uma explicação
  Sem transformar a revisão em novos descontos de pontos

  @RF54 @RF38 @UC08
  Esquema do Cenário: Conferir uma previsão antes da ação
    Dado que o estudante confirmou as três respostas do quiz de "<bloco>"
    Quando entra na prática
    Então as peças ou o medidor estão bloqueados
    E encontra uma previsão sobre "<conceito>"
    Quando confirma uma previsão incorreta
    Então recebe explicação e pode tentar novamente sem desconto
    Quando confere a previsão correta
    Então a bancada é liberada
    E a missão ainda exige a ação prática do bloco
    Exemplos:
      | bloco                     | conceito                                  |
      | Conheça os qubits          | ordem do par quando as linhas começam 0 e 1 |
      | Observe uma medição        | resultado do preparo em 1                  |
      | Experimente a porta H      | possibilidades com H só em cima            |
      | Conecte com CNOT           | transformação da entrada 11 em 10          |
      | Descubra o estado de Bell  | circuito sem a CNOT                        |

  @RF54 @NC12
  Cenário: Retomar a previsão sem mudar a nota
    Dado que a conta salvou a previsão conferida e os erros do quiz
    Quando retoma o bloco
    Então a previsão permanece conferida e a bancada liberada
    E os pontos e erros anteriores permanecem

  @RF38 @RNF02
  Cenário: Navegar até o medidor não executa a experiência
    Dado que a previsão está conferida e o medidor ainda não foi ativado
    Quando o estudante usa Tab para focar o medidor ou passa o mouse sobre ele
    Então não aparece um resultado nem o modal de conquista
    E o bloco não é concluído
    Quando ativa com clique, Enter ou Espaço
    Então mede uma vez e recebe a explicação da conclusão

  @RF44 @RF45
  Cenário: A fala da moeda oferece uma e duas H
    Quando lê a comparação com a moeda no bloco de H
    Então encontra H uma vez e H duas vezes no mesmo exemplo
    E duas H sem medição entre elas preveem 00 com 100 por cento

  @RF44 @RF55
  Cenário: Introduzir símbolos e preparações antes das portas
    Quando explora o primeiro qubit
    Então os nomes dos preparos não dependem de saber o que é H
    E aprende o significado de estado, preparação e dos símbolos de 0 e 1
    E o treino de uma medição desenha um único qubit

  @RF49
  Cenário: Consultar e preservar uma experiência
    Dado que mediu 20 rodadas
    Quando usa Ver resultados
    Então a aba Resultados mostra a comparação da previsão com a contagem
    Quando escolhe novamente o mesmo preparo ou relê a página na sessão do bloco
    Então suas amostras permanecem
    Mas trocar o preparo inicia nova contagem conforme aviso visível

  @RF47 @NC24 @UC18
  Cenário: Preservar uma tentativa com o gabarito anterior
    Dado que um quiz iniciado na revisão de conteúdo 2 tem escolha salva
    Quando o estudante retorna após a revisão de conteúdo 3
    Então mantém as perguntas, a ordem das alternativas e a escolha da revisão 2
    E rever a explicação não troca seu gabarito
    E uma nova tentativa usa a revisão 3, com posições de gabarito equilibradas

  @RF55 @UC10
  Cenário: Encontrar um próximo estudo
    Quando conclui a trilha
    Então pode revisar as funções das peças
    E encontra um material introdutório identificado com idioma informado
    E o comprovante descreve conclusão, sem afirmar domínio comprovado
