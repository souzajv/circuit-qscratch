# language: pt
@conteudo_ampliado @especificacao_nao_automatizada
Funcionalidade: Compreender circuitos por explicações e comparações
  O estudante relaciona cada ideia a um exemplo manipulável
  Sem confundir simulação, probabilidade e resultado observado

  @RF44 @UC06
  Cenário: Texto introdutório conectado ao exemplo disponível
    Dado que o estudante começa sem conhecimento prévio
    Quando o estudante abre uma página de explicação
    Então lê a versão introdutória comum
    E encontra o exemplo referido pelo texto ao lado ou abaixo, conforme a largura disponível
    E pode usar os controles por teclado
    E não precisa acompanhar uma animação para compreender a informação

  @RF45 @RF46
  Cenário: Comparar uma H com duas H
    Dado um laboratório separado começando em 00
    Quando escolhe H uma vez
    Então a previsão mostra 00 e 10 com 50 por cento cada
    Quando escolhe H duas vezes
    Então a previsão mostra 00 com 100 por cento
    E informa que não há medição entre as portas
    E a montagem principal permanece igual

  @RF45
  Esquema do Cenário: Verificar controle e alvo da CNOT
    Dado que o laboratório está na entrada "<entrada>"
    Então o diagrama identifica controle e alvo em linhas diferentes
    E a saída é "<saida>"
    E a tabela destaca a transformação escolhida
    Exemplos:
      | entrada | saida |
      | 00      | 00    |
      | 01      | 01    |
      | 10      | 11    |
      | 11      | 10    |

  @RF45
  Cenário: Comparar a ordem das portas
    Dado o preparo inicial 00
    Quando compara H seguida de CNOT com CNOT seguida de H
    Então vê 00 e 11 no primeiro circuito
    E vê 00 e 10 no segundo circuito
    E as duas distribuições têm chances iguais entre seus resultados possíveis

  @RF46
  Cenário: Repetir medições sem forçar os resultados
    Dado o laboratório do estado de Bell
    Quando escolhe Fazer 20 rodadas
    Então cada rodada reconstrói 00 e aplica H e CNOT antes de medir
    E a contagem total aumenta em 20
    E somente 00 ou 11 podem aparecer no modelo ideal
    E a previsão de chance aparece separada da contagem observada
    E não é obrigatório obter dez resultados de cada tipo
    E trocar o preparo limpa as contagens do laboratório

  @RF47 @RF36 @UC06
  Cenário: Três respostas antes da prática
    Dado que o quiz de um bloco contém três perguntas
    Quando o estudante acerta a primeira
    Então vê retorno específico dentro do balão
    E o botão de conferência mostra Resposta correta! por 2 segundos
    E depois esse mesmo botão mostra Próxima pergunta
    E a prática ainda está fechada
    Quando confirma a segunda e a terceira, mesmo com erros
    Então pode escolher Experimentar no circuito
    E a conclusão do bloco ainda depende da montagem ou medição da missão
    E a bancada só é liberada após conferir uma previsão sem pontos

  @RF47 @RF48
  Cenário: Rever conteúdo sem apagar a tentativa
    Dado que o estudante está na segunda pergunta e já usou uma dica
    Quando escolhe Rever explicação sem apagar esta tentativa
    Então pode percorrer as páginas do bloco novamente
    Quando inicia o teste
    Então retoma a segunda pergunta e os descontos já registrados
    E uma dica em outra pergunta informa que não gera novo desconto
    E o máximo do bloco continua sendo 10 pontos, e não 30

  @RF48
  Cenário: Retomar a pergunta confirmada no banco
    Dado que o checkpoint da segunda pergunta está salvo
    Quando a conta abre novamente o bloco em andamento
    Então retoma a segunda pergunta com sua alternativa e dica registradas
    E não apaga os erros anteriores
    E não acrescenta pontos antes de concluir a prática

  @RF49
  Cenário: Continuar explorando após a montagem
    Dado que a prática foi concluída
    Então o retorno explica a preparação que foi construída
    Quando abre Compare e experimente mais
    Então pode mudar preparações e repetir medições
    E esses testes não alteram peças, pontuação ou certificado

  @RF44 @RF46
  Cenário: Distinguir correlação de prova de emaranhamento
    Dado o bloco de Bell
    Quando compara os resultados com pares de cartões comuns
    Então lê que observar 00 e 11 nessa base não prova emaranhamento sozinho
    E não recebe promessa de transmitir mensagens instantâneas

  @RF42 @RNF11
  Cenário: Aprender sem animações
    Dado que as animações estão desligadas ou o sistema pede movimento reduzido
    Quando o estudante opera os exemplos
    Então as figuras, números, textos e ações continuam disponíveis
    E as respostas dos laboratórios não dependem da animação

  @RF44
  Esquema do Cenário: Posição do exemplo e frase acompanham a largura
    Dado que a área disponível tem largura de <largura> pixels
    Quando o estudante lê uma explicação com referência à posição do exemplo
    Então o exemplo fica "<posicao>" do balão
    E a fala usa "<frase>"
    E redimensionar a janela atualiza a frase e a posição sem perder a página
    Exemplos:
      | largura | posicao | frase   |
      | 1920    | ao lado | ao lado |
      | 1440    | ao lado | ao lado |
      | 1200    | ao lado | ao lado |
      | 1199    | abaixo  | abaixo  |
      | 768     | abaixo  | abaixo  |
      | 390     | abaixo  | abaixo  |

  @RF44 @RF49
  Cenário: Explorar conteúdos extensos em abas na mesma explicação
    Dado um laboratório de preparo e medição na explicação ou após a prática
    Quando o estudante navega entre Preparar, Experimentar e Resultados
    Então apenas o conteúdo da aba escolhida aparece
    E o preparo, as contagens e o histórico permanecem intactos
    E a troca não ocorre automaticamente nem altera pontos ou montagem
    E trocar a preparação reinicia as medições como antes

  @RF44 @RF49
  Cenário: Consultar comparações sem acumular conteúdo na tela
    Dado o exemplo da CNOT ou a comparação de Bell com cartões comuns
    Quando o estudante abre a aba de comparação
    Então consulta a tabela de entradas ou os cartões em um painel separado
    E pode voltar ao experimento sem perder suas escolhas

  @RF42 @RF44
  Cenário: Navegar pelas abas com teclado e em telas pequenas
    Dado um painel com abas
    Quando usa as setas ou Home e End
    Então o foco percorre as abas sem trocar o painel automaticamente
    E Enter ou Espaço ativa a aba focada
    E painéis ocultos não oferecem controles na navegação por Tab
    E no celular as abas se reorganizam sem rolagem horizontal da página
    E movimento reduzido mantém a troca disponível sem animação
