# language: pt
@fluxo_atual @especificacao_nao_automatizada
Funcionalidade: Aprender antes de responder e experimentar
  Para descobrir computação quântica aos poucos
  O estudante percorre explicação, quiz e prática nesta ordem

  @RF32 @RF33 @UC06
  Cenário: Entrar em um bloco pela explicação
    Dado que o primeiro bloco está disponível no mapa
    Quando o estudante abre o bloco
    Então vê o mascote professor e o primeiro trecho da explicação em um balão
    E não vê a pergunta nem a bancada prática
    E o menu lateral fica oculto

  @RF33 @UC06
  Cenário: Percorrer falas sem antecipar o teste
    Dado que o estudante está no primeiro trecho da explicação
    Então não pode usar Anterior
    Quando escolhe Próximo
    Então vê o trecho seguinte
    E pode usar Anterior para reler o trecho anterior
    E Iniciar teste só é oferecido no último trecho

  @RF10 @RF33 @NC08 @UC06
  Esquema do Cenário: Adaptar as falas sem mudar a missão
    Dado que a escolaridade selecionada é "<escolaridade>"
    Quando o estudante percorre as falas do bloco de Hadamard
    Então recebe as explicações previstas para "<escolaridade>"
    E o gabarito e o encaixe correto continuam iguais

    Exemplos:
      | escolaridade             |
      | Fundamental Anos Finais  |
      | Ensino Médio             |

  @RF34 @UC06
  Cenário: Revelar o teste depois da contagem
    Dado que o estudante chegou à última fala
    E as animações estão ligadas
    Quando escolhe Iniciar teste
    Então a cortina fecha completamente
    E a contagem 5, 4, 3, 2, 1 aparece sobre a cortina fechada
    E a pergunta é preparada atrás da cortina
    E a cortina abre já mostrando a pergunta e o gato pensando
    E o tempo da contagem não altera os pontos

  @RF34 @RF31 @UC11
  Cenário: Iniciar teste sem animações
    Dado que as animações estão desligadas
    Quando o estudante escolhe Iniciar teste
    Então acessa a pergunta diretamente sem cortina nem contagem animada
    E nenhuma informação didática é omitida

  @RF35 @UC06
  Cenário: Não conferir sem escolher uma alternativa
    Dado que o quiz foi aberto sem alternativa selecionada
    Então Conferir resposta permanece desabilitado
    E a prática não está disponível

  @RF35 @NC25 @UC16
  Cenário: Pedir dica com o custo visível
    Dado que o quiz informa Ver dica com desconto de 2 pontos
    Quando o estudante usa a dica pela primeira vez
    Então vê uma orientação para aquela pergunta
    E a primeira dica reduz em 2 a pontuação possível até o piso de 2
    E a dica continua visível sem novos descontos

  @RF35 @UC06
  Cenário: Errar e tentar novamente
    Dado que o estudante selecionou uma alternativa incorreta
    Quando escolhe Conferir resposta
    Então recebe orientação textual sem repreensão
    E pode escolher outra alternativa sem limite de tentativas
    E a prática permanece indisponível
    E cada envio incorreto reduz os pontos possíveis até o piso de 2
    E nenhum ponto já conquistado é retirado

  @RF36 @UC06
  Cenário: Acertar libera a prática sem concluir o bloco
    Dado que o estudante selecionou a alternativa correta
    Quando escolhe Conferir resposta
    Então a alternativa recebe um check e destaque visual
    E o gato muda para Cool cat
    E o botão de conferência pula se as animações estão ligadas
    E a confirmação e Experimentar no circuito aparecem fora do balão e centralizados na tela
    E as alternativas ficam bloqueadas para novos envios
    E o total de pontos e o estado de conclusão ainda não mudam

  @RF32 @RF37 @UC08
  Cenário: Abrir a prática depois de acertar
    Dado que o estudante acertou o quiz
    Quando escolhe Experimentar no circuito
    Então a plataforma mostra as instruções e a bancada prática
    E não mostra o quiz como atividade ativa
    E no desktop o mascote e o balão ficam ao lado do circuito

  @RF37 @RF38 @UC08
  Esquema do Cenário: Concluir a ação exigida pelo bloco
    Dado que o estudante acertou o quiz de "<bloco>"
    E abriu a prática correspondente
    Quando realiza "<acao>"
    Então o bloco pode ser marcado como concluído

    Exemplos:
      | bloco                      | acao                                                      |
      | Conheça os qubits           | encaixar um qubit em cada uma das duas linhas               |
      | Observe uma medição         | medir o qubit de treino preparado em zero                   |
      | Experimente a porta H       | encaixar H na primeira posição do qubit de cima             |
      | Conecte com CNOT            | encaixar CNOT após H com controle em cima e alvo embaixo     |
      | Descubra o estado de Bell   | preparar e medir uma rodada do circuito ideal de Bell       |

  @RF38 @RF39 @UC06 @UC08
  Cenário: Celebrar apenas após concluir a prática
    Dado que o estudante acertou o quiz e ainda não concluiu a ação prática
    Então o próximo bloco permanece bloqueado
    Quando conclui a ação prática obrigatória
    Então vê Treasurebox no lugar do gato professor
    E o balão apresenta parabéns com uma recapitulação da ação feita
    E Missão concluída e o botão de avanço ficam fora da bancada e centralizados na tela
    E os pontos da tentativa são incorporados à melhor nota do bloco
    E repetir a mesma confirmação não soma pontos novamente

  @RF39 @RF40 @UC05
  Cenário: Voltar ao mapa depois de concluir
    Dado que o estudante concluiu a prática do primeiro bloco
    Quando escolhe Voltar à trilha
    Então a cortina marca a transição se as animações estão ligadas
    E o primeiro bloco aparece concluído com check
    E o segundo aparece disponível
    E a trilha rola para trazer o segundo bloco à área visível
    E os blocos posteriores continuam bloqueados

  @RF39 @UC10
  Cenário: Concluir toda a trilha
    Dado que os quatro primeiros blocos estão concluídos
    Quando o estudante conclui a prática de Bell
    Então pode abrir a tela de conclusão da demonstração
    E ao retornar ao mapa vê 5 de 5 blocos
    E o card principal usa Treasurebox e o título Você concluiu a trilha
    E a ação principal passa a ser Revisar a trilha

  @RF40 @RF41 @RNF20 @UC05
  Cenário: Usar o mapa no desktop
    Dado que a tela possui espaço para as duas colunas
    Quando o estudante rola a trilha por mouse ou teclado
    Então os blocos se movem sem exibir a barra de rolagem
    E os indicadores, o mascote e a prévia do circuito permanecem parados
    E o traçado curvo e tracejado continua ligando os blocos
    E o rodapé permanece visível sem cobrir ações essenciais

  @RF41 @RNF20 @UC05
  Cenário: Usar o mapa em tela estreita
    Dado que a tela tem 390 pixels de largura
    Quando o estudante consulta o mapa
    Então a trilha e os painéis são organizados em uma coluna
    E o menu não exige rolagem horizontal
    E a página permite rolagem vertical até todos os painéis
    E o rodapé não impede alcançar o último conteúdo

  @RF40 @RNF02 @RNF20 @UC06
  Cenário: Trazer a próxima ação para a área visível
    Dado que a confirmação do quiz ou da prática fica abaixo da área visível
    Quando o estudante acerta ou conclui a prática
    Então a tela rola o necessário para mostrar a confirmação e o botão de avanço
    E o rodapé não encobre o botão
    E a rolagem não é animada se as animações estão desligadas ou o dispositivo pede movimento reduzido

  @RF42 @UC11
  Cenário: Preferências de som e animação são independentes
    Dado que uma nova sessão começa com sons e animações ligados
    Quando o estudante desliga apenas os sons
    Então os sons deixam de tocar
    E as animações continuam ligadas
    Quando também desliga as animações
    Então o conteúdo e os controles permanecem utilizáveis

  @RF43 @RF30 @UC16
  Cenário: Entender a pontuação antes de fazer a atividade
    Dado que o estudante consulta o total de pontos no mapa
    Quando passa o mouse, foca ou toca no botão de ajuda da pontuação
    Então vê a regra de 10 pontos, descontos de 2 por erro e primeira dica e piso de 2
    E é informado de que não perde pontos já conquistados
    E é informado de que refazer só acrescenta a melhora sobre sua melhor nota
    E é informado de que os pontos entram após concluir a prática

  @planejado @NC11 @NC22 @UC07
  Cenário: Retomar sem apagar erros nem dicas
    Dado que o estudante está em uma tentativa com erro e dica registrados
    Quando sai do bloco e o abre novamente
    Então retoma a fase e o passo com os mesmos erros e a mesma dica
    E não recupera pontos possíveis apenas por reabrir a atividade
