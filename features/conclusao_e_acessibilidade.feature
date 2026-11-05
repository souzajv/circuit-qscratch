# language: pt
@RF20 @RF21 @RF31 @NC17 @NC18 @NC19 @NC20 @NC26 @RNF02 @RNF03 @RNF11 @UC08 @UC10 @UC11 @UC13
Funcionalidade: Conclusão acessível da experiência
  Para celebrar o percurso e continuar explorando
  O estudante recebe um resumo e controla as preferências

  Cenário: Revisar o que foi construído
    Dado que o estudante concluiu a montagem e a medição do circuito
    Quando abre a explicação final
    Então revê o papel de H, CNOT e medição
    E é informado de que a experiência é uma simulação clássica

  @planejado
  Cenário: Exibir certificado da primeira conclusão
    Dado que "Sol" concluiu a trilha pela primeira vez com escolaridade "anos finais"
    Quando o servidor confirma a conclusão em 6 de novembro de 2026
    Então o certificado mostra "Sol", a trilha, "anos finais" e 6 de novembro de 2026

  @planejado
  Cenário: Preservar dados da primeira conclusão
    Dado que o certificado registra "Sol" e "anos finais" na primeira conclusão
    Quando o perfil muda de nome ou escolaridade e conclui a trilha novamente
    Então o certificado mantém o nome, a escolaridade e a data registrados na primeira conclusão

  @planejado
  Cenário: Não emitir certificado sem confirmação
    Dado que a conexão falhou antes da confirmação da primeira conclusão
    Quando o estudante solicita o certificado
    Então a plataforma informa que a conclusão ainda não foi confirmada
    E não apresenta o certificado como emitido

  @proposta_recompensas
  Cenário: Receber distintivo ao concluir bloco
    Dado que o estudante completou os passos obrigatórios de um bloco
    Quando o servidor confirma a conclusão
    Então a plataforma apresenta o distintivo previsto para aquele bloco

  Cenário: Desligar som sem desligar animações
    Dado que som e animações estão ativados
    Quando o estudante desliga o som
    Então as animações permanecem disponíveis
    E nenhuma informação essencial depende do som

  Cenário: Desligar animações sem desligar som
    Dado que som e animações estão ativados
    Quando o estudante desliga as animações
    Então o som permanece disponível
    E as informações das animações continuam acessíveis de forma estática ou textual

  Cenário: Montar circuito pelo teclado
    Dado que o estudante navega somente pelo teclado
    Quando seleciona H e a primeira posição do circuito
    Então consegue confirmar a peça sem arrastá-la
    E identifica visualmente o foco atual

  @planejado
  Cenário: Movimento reduzido não bloqueia a trilha
    Dado que o dispositivo solicita movimento reduzido
    Quando o estudante percorre a trilha
    Então o conteúdo e os controles continuam disponíveis sem animações decorativas obrigatórias

  @pendente_pesquisa
  Cenário: Avaliação de pesquisa é separada do quiz
    Dado que uma avaliação de pesquisa foi autorizada pela instituição
    Quando o participante responde ao instrumento de avaliação
    Então o instrumento é apresentado separadamente das dicas e perguntas de treino
    E a plataforma segue o protocolo de coleta definido
