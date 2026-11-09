# language: pt
@RF04 @RF05 @RF06 @RF07 @RF08 @RF09 @RF10 @UC05 @UC06 @RNF02 @RNF04
Funcionalidade: Percorrer e compreender a trilha
  Para aprender aos poucos
  O estudante recebe explicações, pratica e revê o conteúdo

  Cenário: Conhecer o objetivo antes de montar
    Dado que o estudante iniciou a trilha
    Quando abre o primeiro bloco
    Então o mascote apresenta a missão de montar um circuito com dois qubits
    E informa que a experiência é uma simulação

  @planejado
  Cenário: Pular e rever o tutorial
    Dado que o tutorial está disponível antes da trilha
    Quando o estudante escolhe pulá-lo
    Então consegue acessar o mapa
    E pode abrir o tutorial novamente depois

  Cenário: Identificar o próximo bloco
    Dado que o estudante concluiu o primeiro bloco
    Quando consulta o mapa
    Então identifica o primeiro como concluído e o segundo como disponível
    E os estados não são diferenciados apenas por cor

  Cenário: Não abrir um bloco ainda bloqueado
    Dado que o estudante ainda não concluiu o primeiro bloco
    Quando tenta abrir o terceiro bloco
    Então a plataforma explica que existem etapas anteriores
    E mantém o terceiro bloco bloqueado

  Cenário: Identificar os qubits
    Dado que o primeiro bloco mostra duas linhas representando qubits
    Quando o estudante responde que há dois qubits
    Então recebe a explicação de que cada linha representa um qubit
    E pode confirmar as duas linhas do circuito

  Cenário: Errar sem perder progresso
    Dado que o estudante está respondendo uma pergunta
    Quando escolhe uma alternativa incorreta
    Então recebe uma orientação relacionada ao conteúdo
    E vê a resposta correta e a explicação
    E pode avançar sem confirmar outra resposta nessa pergunta
    E mantém o progresso anterior e os descontos da tentativa

  Cenário: Avançar depois do acerto
    Dado que o estudante está respondendo uma pergunta obrigatória
    Quando escolhe a alternativa correta
    Então recebe uma explicação do motivo do acerto
    E pode abrir a previsão prática após confirmar as três perguntas
    E o bloco só será concluído depois da ação prática obrigatória

  @planejado
  Cenário: Rever conteúdo concluído sem refazer atividade
    Dado que o estudante concluiu um bloco
    Quando abre suas explicações para revisão
    Então pode reler o conteúdo sem apagar as peças confirmadas
    E não recebe novos pontos apenas pela revisão

  Cenário: Explicação comum para quem começa
    Dado que o estudante informou escolaridade no questionário de pesquisa
    Quando abre a explicação de H aplicada ao qubit preparado em zero
    Então recebe o texto introdutório comum
    E aprende que zero ou um podem aparecer na medição deste exemplo
    E a resposta correta da atividade permanece a mesma

  @planejado
  Cenário: Oferecer ajuda sem substituir a explicação
    Dado que o estudante não entendeu a instrução atual
    Quando solicita ajuda
    Então recebe uma orientação relacionada ao passo
    E pode retornar à explicação sem perder seu lugar

  Cenário: Apresentar conceitos a quem está começando
    Dado que o estudante não possui conhecimento prévio de computação quântica
    Quando inicia uma explicação sobre qubits
    Então encontra uma introdução antes de termos mais avançados
    E pode rever a explicação durante a atividade
