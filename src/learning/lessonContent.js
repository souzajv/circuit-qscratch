// Cada página tem uma ideia, um exemplo e duas formas de explicá-la.
const page = (title, visual, basic, advanced) => ({title,visual,basic,advanced});
const check = (question, options, answer, hint, feedback, retry, medium) => ({question,options,answer,hint,feedback,retry,medium});
export const learningUnits = [
 {pages:[
  page('Uma informação de cada vez','bit',
   'Imagine um interruptor: ele pode estar desligado ou ligado. Podemos usar 0 e 1 para representar essas duas situações. Um bit guarda um desses valores por vez. No exemplo abaixo, clique no interruptor e veja o número mudar.',
   'Um bit é uma unidade de informação clássica com valor 0 ou 1. Um interruptor ajuda a representar dois estados distinguíveis, como desligado e ligado. Clique no exemplo abaixo: o bit representa o estado escolhido, sem valores intermediários.'),
  page('O que muda com um qubit?','qubit',
   'O qubit guarda informação quântica. Podemos prepará-lo para obter 0, para obter 1 ou de uma forma que permita os dois resultados ao medir. Essa última preparação é uma superposição. Veja abaixo as chances de cada resultado. Elas não são duas respostas aparecendo juntas na tela.',
   'Os símbolos |0⟩ e |1⟩ representam os estados básicos de um qubit. Também podemos preparar uma superposição, como |+⟩ = (|0⟩ + |1⟩)/√2. Na medição que usaremos, ela dá 0 ou 1 com 50% de chance cada. Compare as preparações abaixo; as barras mostram probabilidades, não o estado quântico completo.'),
  page('Duas linhas, dois qubits','lines',
   'No circuito, cada linha acompanha um qubit. A linha de cima é q₁ e a de baixo é q₂. A linha não é um fio pelo qual o gatinho viaja. Ela nos ajuda a acompanhar as operações feitas em cada qubit. No exemplo abaixo, destaque uma linha por vez.',
   'Cada linha do diagrama identifica um qubit ao longo das operações. Usaremos q₁ em cima e q₂ embaixo. As posições no desenho não indicam a distância física entre eles. Selecione cada linha abaixo para acompanhar sua identificação.'),
  page('Como ler o começo do circuito','preparation',
   'Começamos com os dois qubits preparados em 0. Escrevemos esse começo como |00⟩. O primeiro número acompanha a linha de cima; o segundo, a de baixo. Veja no exemplo abaixo como os dois valores formam o par. Se medirmos agora, teremos 00.',
   'O estado inicial é |00⟩. Neste projeto, a ordem dos símbolos é sempre |q₁q₂⟩: controle primeiro, alvo depois. Medir esse estado na base computacional produz 00 com certeza no modelo ideal. Observe abaixo como a notação corresponde às duas linhas.'),
  page('Um circuito é uma sequência de ações','order',
   'Pense em uma receita: o que você faz primeiro pode mudar o resultado. Em um circuito, lemos as ações da esquerda para a direita. Vamos preparar os qubits, aplicar duas portas e depois medir. Acompanhe o exemplo abaixo por etapas. Ainda vamos descobrir o papel de cada porta.',
   'Um algoritmo organiza instruções para realizar uma tarefa. Nosso circuito descreve uma tarefa pequena: preparar um estado de Bell e observar suas medições. As operações são lidas da esquerda para a direita. Percorra a sequência abaixo; a ordem das portas será importante.'),
  page('Sua primeira montagem','lines',
   'Agora você sabe reconhecer as duas linhas e o estado inicial. No teste, vamos retomar essas ideias. Depois, você colocará um qubit preparado em 0 em cada linha. Você pode arrastar a peça ou selecionar a peça e clicar no encaixe. O exemplo abaixo continua disponível para revisar.',
   'Vamos conferir a relação entre qubits, linhas e preparação inicial antes da montagem. A primeira prática prepara |00⟩, sem portas nem medição. Revise o diagrama abaixo se precisar. Arrastar e selecionar seguido de clique são alternativas equivalentes.')
 ],checks:[
  check('O que significa começar com os dois qubits em 0?',['Medir agora dará 00','Medir agora dará sempre 11','Ainda não existe nenhuma preparação'],0,'Antes de qualquer porta, cada qubit foi preparado para dar 0.','Isso. As duas preparações em 0 produzem o par 00 ao medir agora.','O par tem dois lugares: um para cada qubit. Os dois começam em 0.','O que a medição de |00⟩ produz antes das portas?'),
  check('Em que sentido lemos as ações do circuito?',['Da esquerda para a direita','Da direita para a esquerda','A ordem nunca importa'],0,'O começo do circuito fica à esquerda.','Correto. Vamos acompanhar cada operação na ordem em que aparece.','Uma sequência tem começo e continuação. No nosso diagrama, começamos pela esquerda.')
 ],conclusion:{basic:'Você preparou as duas linhas em 0. Ainda não há portas: medir agora daria 00. No próximo bloco, vamos conhecer a medição em um treino separado.',advanced:'Sua montagem representa |00⟩. Ainda não aplicamos portas. A medição nessa base seria determinística: 00. A próxima atividade usa um qubit de treino independente.'}},
 {pages:[
  page('Medir transforma a informação em um resultado','measurement',
   'Medir um qubit faz aparecer um resultado que conseguimos registrar: 0 ou 1. Uma medição não mostra uma lista de todas as possibilidades de uma vez. No treino abaixo, escolha como preparar o qubit e clique em medir. Esse treino fica separado do seu circuito.',
   'A medição na base computacional fornece um bit clássico, 0 ou 1. A palavra base indica quais estados estamos distinguindo; aqui usamos |0⟩ e |1⟩. Escolha uma preparação e meça no exemplo abaixo. Ele usa um sistema de treino, sem alterar seu circuito.'),
  page('Compare duas preparações','measurement',
   'Um qubit preparado em 0 dará 0 neste modelo ideal. Preparado em 1, dará 1. Compare os dois casos abaixo. Não é verdade que toda medição quântica tem metade de chance para cada resultado: isso depende de como o qubit foi preparado.',
   'Para |0⟩, P(0) = 100%; para |1⟩, P(1) = 100%. Compare essas preparações no laboratório abaixo. Probabilidades de 50% não são uma regra para todo qubit. Elas dependem do estado e da base de medição.'),
  page('Uma rodada e várias rodadas','measurement',
   'Uma rodada dá um resultado. Para comparar várias rodadas, preparamos o qubit de novo antes de cada medição. Clique em fazer 20 rodadas abaixo. O gráfico conta os resultados observados e mostra também as chances previstas para essa preparação.',
   'O gráfico de frequência conta medições de preparações repetidas, chamadas de rodadas. Cada rodada abaixo começa com um novo preparo do mesmo estado. Compare a probabilidade teórica com a contagem observada. Para |0⟩ e |1⟩, os resultados ideais são certos.'),
  page('Medir pode mudar o estado','measurement',
   'Medir também afeta a preparação do qubit. Neste treino, ele já está preparado para um resultado certo, então não vemos uma mudança no resultado. No próximo bloco, vamos conhecer uma preparação com duas possibilidades. Em todos os testes abaixo, fazemos um novo preparo antes de medir.',
   'Uma medição pode alterar o estado. Se o qubit já está em |0⟩ ou |1⟩, medir nessa mesma base mantém esse estado. Não usaremos medições sucessivas de uma única preparação para estimar probabilidades. Cada rodada do exemplo abaixo começa de novo.'),
  page('Prever, experimentar e explicar','measurement',
   'Antes de clicar, faça uma previsão: se você escolher preparar 1, o que espera medir? Teste abaixo e compare com o caso 0. Depois vamos usar apenas a preparação em 0 na missão. O objetivo é entender a relação entre o preparo e o resultado.',
   'Compare a previsão para |1⟩ com a observação e depois volte a |0⟩. Esse contraste verifica a regra da medição determinística. A prática principal usa apenas |0⟩; as variações abaixo são experimentos independentes e não alteram seu progresso nem sua pontuação.')
 ],checks:[
  check('E se o qubit do treino estivesse preparado em 1?',['O resultado seria 1','O resultado seria sempre 0','Os dois números sairiam juntos'],0,'Troque mentalmente a preparação de 0 para 1.','Isso. Na medição usada aqui, preparar 1 dá resultado 1.','Preparar 1 não é o mesmo que preparar 0. Compare os dois casos do laboratório.','Qual resultado ideal corresponde à preparação |1⟩?'),
  check('Como o laboratório faz várias rodadas?',['Prepara de novo antes de cada medição','Mede uma vez e inventa o restante','Muda o circuito principal a cada clique'],0,'Cada rodada começa com um novo preparo.','Correto. Isso permite comparar medições de preparações iguais.','Repetir um experimento exige repetir também suas condições de preparo.')
 ],conclusion:{basic:'Você mediu um qubit preparado em 0 e observou 0. Esse treino não mudou o circuito principal. Compare também com preparar 1 no laboratório abaixo.',advanced:'A medição ideal de |0⟩ retornou 0. O treino usa um sistema separado. A comparação com |1⟩ mostra que a probabilidade depende da preparação.'}},
 {pages:[
  page('Uma porta muda a preparação','hadamard',
   'Uma porta quântica é uma operação que muda o estado dos qubits. Vamos usar a Hadamard, chamada H. Aplicada a um qubit preparado em 0, ela cria uma superposição com a mesma chance de medir 0 ou 1. Compare abaixo o preparo sem H e com H.',
   'Hadamard é uma operação reversível. Ela transforma |0⟩ em |+⟩ = (|0⟩ + |1⟩)/√2. Medindo na base computacional, as probabilidades são 50% para cada resultado. Compare abaixo o circuito sem H e com H no primeiro qubit.'),
  page('Chance não é uma promessa de alternância','hadamard',
   'Ter a mesma chance não significa que 0 e 1 precisam se alternar. Pode sair 0 várias vezes seguidas. Faça 20 rodadas no exemplo abaixo e observe a contagem. Não precisamos conseguir exatamente dez resultados de cada tipo.',
   'Probabilidade de 50% não obriga uma amostra de 20 rodadas a conter dez resultados de cada tipo. A frequência observada pode variar. Repita o lote abaixo; cada rodada começa em |00⟩ e reaplica H antes de medir.'),
  page('Uma moeda ajuda a falar de chance','hadamard',
   'Uma moeda equilibrada ajuda a imaginar dois resultados com a mesma chance. Essa comparação explica a chance, mas não explica o estado do qubit. A superposição permite efeitos que a moeda não representa. Veja abaixo a diferença entre usar H uma vez e duas vezes.',
   'Uma moeda equilibrada é uma analogia para probabilidades iguais, não para o estado quântico. As amplitudes são os números que acompanham |0⟩ e |1⟩ na escrita do estado. Seus sinais também importam e não aparecem nas barras de probabilidade. Compare uma e duas aplicações de H no exemplo abaixo.'),
  page('Duas portas H: de volta ao início','double-h',
   'Se começamos em 0, usamos H e depois usamos H de novo, antes de medir, voltamos a medir 0 com certeza. Compare abaixo H uma vez e H duas vezes. Não colocamos uma medição entre as duas portas. Essa diferença mostra o limite da comparação com a moeda.',
   'Sem medição entre as portas, H·H devolve |0⟩ a |0⟩. Isso acontece por interferência: as contribuições se somam para o resultado 0 e se cancelam para o resultado 1. Compare as probabilidades e as rodadas abaixo. Medir entre as duas portas criaria outro experimento, que não é o mostrado aqui.'),
  page('H entra somente na linha de cima','hadamard',
   'No nosso circuito de dois qubits, H vai atuar só na linha de cima. A linha de baixo continua preparada em 0. Por isso, medir agora permite os pares 00 ou 10. No exemplo abaixo, o primeiro número é o da linha de cima. Ainda não conectamos a CNOT.',
   'Depois de H em q₁, o estado conjunto é (|00⟩ + |10⟩)/√2, na ordem |q₁q₂⟩. O segundo qubit permanece em |0⟩. O exemplo abaixo mostra os pares de resultados antes da CNOT. Esse estado ainda é separável.'),
  page('O que sua próxima peça faz','double-h',
   'Vamos conferir o que H muda e o que ela não garante. Depois você vai encaixar H na primeira posição da linha de cima. Revise as comparações abaixo: sem H, uma H e duas H. Os testes não mudam as peças já confirmadas da sua trilha.',
   'Antes da montagem, compare os circuitos |00⟩, H(q₁) e H(q₁) seguida de H(q₁). As diferenças permitem explicar a operação e a interferência. Na prática da trilha, adicionaremos uma única H, sem medir nesse momento.')
 ],checks:[
  check('Em 20 rodadas com H, precisam sair dez resultados 0 e dez resultados 1?',['Não. As contagens podem variar','Sim. É sempre exatamente metade','Não. Só pode sair 0'],0,'Mesma chance não obriga quantidades iguais em poucas rodadas.','Isso. Uma sequência pode repetir resultados, mesmo com chances iguais.','Probabilidade descreve as chances de cada rodada, não uma contagem obrigatória.'),
  check('Começando em 0, o que acontece com H duas vezes, sem medir entre elas?',['Voltamos a medir 0 com certeza','Sempre medimos 1','O qubit desaparece'],0,'A segunda H desfaz o efeito da primeira neste experimento.','Correto. As duas H devolvem a preparação inicial.','Compare as barras de uma H e duas H. Não há medição entre as portas.','Qual o resultado de medir H·H|0⟩ na base computacional?')
 ],conclusion:{basic:'Você colocou H na linha de cima. Agora medir os dois qubits, antes da CNOT, pode dar 00 ou 10. A linha de baixo ainda está preparada em 0.',advanced:'H em q₁ preparou (|00⟩ + |10⟩)/√2. O alvo continua em |0⟩. A próxima porta vai atuar sobre o estado conjunto.'}},
 {pages:[
  page('Controle e alvo têm papéis diferentes','cnot',
   'A CNOT atua em dois qubits. Chamamos um de controle e o outro de alvo. No treino com 0 e 1, o controle continua igual. Se ele for 1, o alvo troca: 0 vira 1 e 1 vira 0. Se o controle for 0, o alvo fica igual. Experimente os botões abaixo.',
   'Para entradas da base computacional, CNOT mantém o controle e aplica NOT ao alvo quando o controle é 1. Nosso controle é q₁ e o alvo é q₂. Use o exemplo abaixo para escolher cada entrada e acompanhar a saída.'),
  page('Teste as quatro entradas','cnot',
   'Compare 00, 01, 10 e 11 abaixo. Em 10, o alvo troca de 0 para 1, formando 11. Em 11, o alvo troca de 1 para 0, formando 10. Por isso, CNOT não significa deixar os números sempre iguais.',
   'A tabela de CNOT é 00→00, 01→01, 10→11 e 11→10, na ordem controle, alvo. Experimente os quatro pares abaixo. O caso 11→10 mostra por que a porta não deve ser descrita apenas como uma cópia.'),
  page('No desenho, um ponto e um alvo','cnot',
   'O ponto na linha de cima marca o controle. O círculo com um sinal de mais na linha de baixo marca o alvo. A linha vertical une os dois símbolos porque eles fazem parte da mesma porta. Veja abaixo os papéis de cada linha antes de montar a peça.',
   'O ponto representa o controle; o símbolo ⊕ representa o alvo. A conexão vertical identifica uma operação de dois qubits. Observe abaixo como o desenho corresponde à regra de transformação da tabela.'),
  page('Depois de H, as possibilidades se conectam','branches',
   'Depois de H, tínhamos possibilidades 00 e 10. A CNOT leva 00 a 00 e 10 a 11. Veja no exemplo abaixo como o par inteiro muda. A porta faz isso sem medir o controle. Quando medirmos no final, veremos um único par.',
   'Pela linearidade, CNOT transforma (|00⟩ + |10⟩)/√2 em (|00⟩ + |11⟩)/√2. O exemplo abaixo destaca cada termo para ajudar a ler a transformação. Os termos pertencem a uma superposição; não são medições escondidas.'),
  page('Trocar a ordem muda o resultado','order-compare',
   'Compare abaixo H seguida de CNOT e CNOT seguida de H, sempre começando em 00. Na segunda sequência, a CNOT encontra o controle em 0 e não muda o alvo. Depois H muda só a linha de cima. As duas sequências não produzem as mesmas possibilidades.',
   'Aplicar CNOT a |00⟩ não altera o estado. Se H vier depois, teremos (|00⟩ + |10⟩)/√2, e não o estado de Bell desejado. Compare abaixo as duas ordens. H e CNOT não podem ser trocadas livremente neste circuito.'),
  page('Sua conexão no circuito','branches',
   'Agora vamos testar a regra e encaixar a CNOT depois de H. Ela não é uma máquina de copiar qualquer qubit. Neste circuito específico, com a preparação escolhida, H e CNOT criam o estado de Bell. Revise a transformação abaixo antes do teste.',
   'A CNOT após H cria o estado emaranhado desta trilha. Isso não é uma cópia de um estado quântico desconhecido. Revise abaixo a evolução das amplitudes e depois confira a ordem controle, alvo na montagem.')
 ],checks:[
  check('Se a entrada do treino for 11, o que a CNOT produz?',['10','11','00'],0,'O controle continua 1. O alvo, que era 1, troca para 0.','Isso. O caso 11→10 confirma a regra de inverter o alvo.','A CNOT inverte o alvo quando o controle é 1; não faz uma cópia em todos os casos.'),
  check('Começando em 00, podemos trocar H e CNOT e esperar o mesmo estado?',['Não. A ordem muda a preparação final','Sim. A ordem nunca importa','Sim. A CNOT mede o controle primeiro'],0,'Sem H antes, a CNOT encontra os dois qubits em 0.','Correto. Para preparar o estado desta trilha, usamos H e depois CNOT.','Compare as duas ordens do laboratório. A CNOT não faz uma medição.')
 ],conclusion:{basic:'Você ligou a CNOT depois de H. As possibilidades que eram 00 e 10 agora são 00 e 11. Falta medir o circuito e comparar várias rodadas.',advanced:'Sua sequência prepara |Φ+⟩ = (|00⟩ + |11⟩)/√2. A transformação foi feita sem medir entre H e CNOT. Agora vamos observar a distribuição de medições.'}},
 {pages:[
  page('Seu circuito de Bell está pronto','bell',
   'Você preparou os dois qubits em 0, colocou H em cima e depois CNOT. Essa sequência cria o estado de Bell desta trilha. Ao medir os dois qubits no modelo ideal, podemos obter 00 ou 11, com a mesma chance. Veja abaixo o circuito completo e suas previsões.',
   'A sequência |00⟩ → H(q₁) → CNOT(q₁,q₂) prepara |Φ+⟩ = (|00⟩ + |11⟩)/√2. Na base computacional, P(00) = P(11) = 50%. O exemplo abaixo conecta o circuito às probabilidades esperadas.'),
  page('O que a CNOT mudou?','bell-compare',
   'Sem CNOT, H na linha de cima permitia 00 e 10. Com CNOT, passamos a ter 00 e 11. Compare abaixo os dois circuitos. O par 10 deixa de aparecer no circuito de Bell ideal, enquanto 11 passa a ser possível.',
   'Compare H isolada em q₁ com H seguida de CNOT. As distribuições passam de {00,10} para {00,11}, ambas com chances iguais entre os resultados possíveis. A comparação abaixo ajuda a identificar a contribuição da porta de dois qubits.'),
  page('Resultados ligados, sem mensagens','correlation',
   'No estado de Bell usado aqui, os resultados são iguais quando medimos dessa forma. Cada resultado, sozinho, continua imprevisível. Um qubit não permite escolher o resultado do outro nem mandar uma mensagem instantânea. O exemplo abaixo destaca os pares de uma rodada por vez.',
   'Os resultados estão correlacionados na base computacional: cada resultado individual tem 50% de chance, mas o par é 00 ou 11. Isso não permite controlar o resultado local nem transmitir informação mais rápido que a luz. Observe os pares do exemplo abaixo.'),
  page('Uma igualdade não prova tudo','correlation',
   'Imagine pares de cartões preparados antes, alguns com 00 e outros com 11. Eles também mostrariam números iguais, sem serem qubits emaranhados. Por isso, só ver resultados iguais não prova emaranhamento. Conhecemos o estado do nosso modelo pelo preparo e pelo cálculo; testar isso em um aparelho real exige mais medições.',
   'Uma mistura clássica de 00 e 11 pode reproduzir essa mesma distribuição na base computacional. Portanto, esse histograma sozinho não certifica emaranhamento. No simulador, a descrição matemática do estado do circuito identifica |Φ+⟩. Uma verificação experimental exige outras configurações de medição.'),
  page('Repita e compare com a previsão','bell',
   'Faça uma rodada e depois um lote de 20 no exemplo abaixo. Cada rodada começa em 00 e reaplica H e CNOT. As contagens de 00 e 11 podem ser diferentes. Você não precisa esperar os dois resultados aparecerem para concluir a missão.',
   'Amostre o circuito ideal abaixo. Cada rodada reconstrói |00⟩, aplica H e CNOT e só então mede. A frequência observada pode se afastar de 50% em um lote pequeno. Não exigimos uma sequência específica de resultados para concluir.'),
  page('Explique o caminho que você construiu','recap',
   'Tente contar com suas palavras: o que preparamos, o que H faz, o que CNOT muda e o que aparece ao medir? Acompanhe a sequência abaixo se precisar. Você construiu um pequeno procedimento quântico e já tem uma base para investigar outros circuitos.',
   'Revise a sequência abaixo e relacione cada operação ao estado correspondente. O objetivo foi construir e interpretar uma preparação de Bell, não demonstrar vantagem computacional. Depois da trilha, você pode investigar outras portas, bases de medição e o protocolo de teleportação.')
 ],checks:[
  check('Em poucas rodadas, saiu 00 várias vezes. Isso significa que o circuito está errado?',['Não. Repetições são possíveis','Sim. Os pares precisam se alternar','Sim. Deveria aparecer 01'],0,'Cada rodada tem as mesmas chances, mas não depende da alternância.','Isso. Poucas repetições não precisam formar metades iguais.','Ter 50% de chance não obriga a próxima rodada a compensar a anterior.'),
  check('Só observar pares 00 e 11 já prova emaranhamento?',['Não. Pares clássicos também podem dar essa igualdade','Sim. Qualquer igualdade prova','Sim. Isso permite enviar mensagens instantâneas'],0,'Lembre dos pares de cartões preparados com números iguais.','Correto. Conhecer o preparo e comparar outras medições é diferente de apenas contar pares iguais.','Uma correlação nessa base também pode ter uma explicação clássica. O gráfico sozinho não prova emaranhamento.')
 ],conclusion:{basic:'Você construiu a sequência completa: preparar, aplicar H, conectar CNOT e medir. Os pares ideais são 00 e 11, sem promessa de alternância. Explique esse caminho a alguém e experimente outros preparos abaixo.',advanced:'Você preparou e mediu |Φ+⟩ no simulador ideal. Relacione operações, estado e probabilidades, lembrando que a correlação nessa base não é uma certificação experimental de emaranhamento.'}}
];
