# language: pt
@escopo_atual @especificacao_nao_automatizada
Funcionalidade: Perfil inicial obrigatório e uma resposta por pergunta
  Cenário: Identificar escolaridade antes de começar
    Dado que a conta ainda não concluiu blocos
    Quando inicia Conheça os qubits sem formulário inicial versão 3 completo
    Então deve responder escolaridade e todas as perguntas iniciais
    E escolaridade tem Ensino Fundamental, Ensino Médio, Ensino Superior incompleto e Ensino Superior completo
    E o formulário inicial não oferece Pular
    E a escolaridade não altera o conteúdo

  Cenário: Uma confirmação encerra a pergunta mesmo no erro
    Quando confirma uma alternativa incorreta
    Então a alternativa escolhida recebe X
    E a correta é destacada com check
    E as alternativas ficam desabilitadas
    E aparece o gato de erro e a animação lateral do botão
    E após o retorno pode avançar sem responder novamente
    E reabrir a pergunta preserva o erro e a confirmação

  Cenário: Três erros permitem continuar com nota reduzida
    Dado que errou as três perguntas sem usar dicas
    E conferiu a previsão prática sem pontos, usando explicações e novas tentativas se necessário
    Quando termina a prática
    Então recebe 4 pontos segundo a regra de 10 menos 2 por erro
    E não precisa refazer as perguntas pontuadas para seguir

  Cenário: Versão nova não apaga respostas históricas
    Dado um formulário finalizado na versão 1
    Quando ele é substituído por dados da versão 2
    Então o registro anterior é preservado em surveyArchive
    E atualizações da mesma versão preservam a primeira resposta final
