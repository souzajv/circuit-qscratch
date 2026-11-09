// Previsões formativas: não entram na nota nem nas respostas do instrumento de pesquisa.
export const practiceReflections = [
  {
    question: 'Em outro preparo, a linha de cima começa em 0 e a de baixo em 1. Qual par representa esse começo?',
    options: ['01', '10', '00'], answer: 0,
    explanation: 'O primeiro número pertence à linha de cima e o segundo à de baixo: 0 e 1 formam 01. Na sua montagem principal, vamos preparar as duas linhas em 0, formando 00.'
  },
  {
    question: 'Antes de medir: se o qubit de treino fosse preparado em 1, qual resultado você esperaria?',
    options: ['0', '1', '0 ou 1 com a mesma chance'], answer: 1,
    explanation: 'Preparar em 1 dá resultado 1 nesta medição ideal. Preparar em 0 dá 0. Agora vamos medir o treino preparado em 0, sem mudar seu circuito principal.'
  },
  {
    question: 'Vamos prever: com os dois qubits em 0 e uma H só na linha de cima, quais pares podem aparecer ao medir?',
    options: ['00 e 11', 'Apenas 00', '00 e 10'], answer: 2,
    explanation: 'H permite 0 ou 1 na linha de cima, com a mesma chance. A linha de baixo continua em 0. Por isso, os pares possíveis são 00 e 10. Vamos acrescentar essa porta sem medir agora.'
  },
  {
    question: 'Em um treino separado, a entrada da CNOT é 11. O controle fica em cima. Qual será a saída?',
    options: ['11', '10', '01'], answer: 1,
    explanation: 'O controle continua 1. Como ele é 1, o alvo troca de 1 para 0: 11 vira 10. Depois de H no circuito principal, a CNOT transforma as possibilidades 00 e 10 em 00 e 11, sem medir o controle.'
  },
  {
    question: 'Antes da medição final, compare: se retirássemos a CNOT e deixássemos apenas H na linha de cima, quais pares seriam possíveis?',
    options: ['Apenas 00', '00 e 11', '00 e 10'], answer: 2,
    explanation: 'Sem CNOT, a linha de baixo permanece em 0 e os pares são 00 e 10. No circuito completo, CNOT vem depois de H e muda essas possibilidades para 00 e 11. É esse circuito completo que vamos medir.'
  }
];

export const reflectionIsReady = (index, value) => value.confirmed === true && value.choice === practiceReflections[index].answer;
