export const SURVEY_VERSION = 3;
export const EDUCATION_OPTIONS=['Ensino Fundamental','Ensino Médio','Ensino Superior incompleto','Ensino Superior completo'];
export const INTENSITY_OPTIONS=['Nada','Pouco','Mais ou menos','Bastante','Muito'];
const pairedQuestions=[
 {id:'interest',text:'Quanto você tem vontade de aprender mais sobre computação quântica?',options:INTENSITY_OPTIONS},
 {id:'confidence',text:'Quanto você se sente capaz de começar a estudar computação quântica?',options:INTENSITY_OPTIONS}
];
const knowledgeQuestions=[
 {id:'measurementResult',type:'knowledge',text:'Ao medir um qubit, qual resultado aparece em uma única medição?',options:['Um resultado: 0 ou 1','Os resultados 0 e 1 juntos','Sempre o resultado 1','Não sei ainda']},
 {id:'hadamardRole',type:'knowledge',text:'Neste circuito, o que a porta H faz quando é aplicada uma vez a um qubit preparado em 0?',options:['Prepara chances iguais de medir 0 ou 1','Garante que toda medição dará 1','Mede o qubit imediatamente','Não sei ainda']}
];
export const surveyQuestions = {
 before:[
  {id:'education',text:'Qual é a sua escolaridade?',options:EDUCATION_OPTIONS},
  {id:'heardBefore',text:'Antes desta trilha, você já tinha ouvido falar em computação quântica?'},
  {id:'firstStudy',text:'Esta é sua primeira tentativa de aprender computação quântica?'},
  {id:'priorCircuit',text:'Antes desta trilha, você já conhecia a ideia de circuito quântico?'},
  ...pairedQuestions,...knowledgeQuestions
 ],
 after:[
  ...pairedQuestions,
  {id:'clarity',text:'Foi fácil entender as explicações?',options:INTENSITY_OPTIONS},
  {id:'usability',text:'Foi fácil descobrir o que fazer em cada etapa?',options:INTENSITY_OPTIONS},
  ...knowledgeQuestions,
  {id:'improvement',type:'text',optional:true,text:'O que poderíamos explicar melhor?'}
 ]
};
export const SURVEY_COMMENT_LIMIT=600;
export const getSurveyOptions=question=>question.options?question.options.map(value=>[value,value]):[[true,'Sim'],[false,'Não']];
export const isSurveyAnswerValid=(question,value)=>question.type==='text'?typeof value==='string'&&value.length<=SURVEY_COMMENT_LIMIT:question.options?question.options.includes(value):typeof value==='boolean';
