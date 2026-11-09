// A ordem é fixa por revisão. Checkpoints antigos continuam com o gabarito original.
// As alternativas incorretas representam dúvidas sobre a regra, sem pegadinhas.
export const revisedOptions = [
  [null,
    {options: ['Medir agora dará 01', 'Medir agora dará 10', 'Medir agora dará 00'], answer: 2},
    {options: ['Da esquerda para a direita', 'De baixo para cima', 'Primeiro as portas, depois a preparação'], answer: 0}],
  [null,
    {options: ['0, porque o primeiro resultado é sempre 0', 'O resultado seria 1', '0 ou 1 com a mesma chance'], answer: 1},
    {options: ['Mede várias vezes sem preparar de novo', 'Alterna os resultados entre 0 e 1', 'Prepara de novo antes de cada medição'], answer: 2}],
  [null,
    {options: ['Não. As contagens podem variar', 'Sim. É sempre exatamente metade', 'Sim. Os resultados precisam se alternar'], answer: 0},
    {options: ['Mantemos as chances de uma única H', 'Voltamos a medir 0 com certeza', 'Medimos 1 com certeza'], answer: 1}],
  [null,
    {options: ['11', '01', '10'], answer: 2},
    {options: ['Não. A ordem muda a preparação final', 'Sim. Basta usar as mesmas duas portas', 'Sim. A CNOT mede o controle antes de agir'], answer: 0}],
  [null,
    {options: ['Sim. Os pares precisam se alternar', 'Não. Repetições são possíveis', 'Sim. As próximas rodadas precisam compensar'], answer: 1},
    {options: ['Sim. Qualquer igualdade prova', 'Sim. Basta cada par ter 50% de chance', 'Não. Pares clássicos também podem dar essa igualdade'], answer: 2}]
];
