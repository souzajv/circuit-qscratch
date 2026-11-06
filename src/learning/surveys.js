export const SURVEY_VERSION = 2;
export const EDUCATION_OPTIONS=['Ensino Fundamental','Ensino Médio','Ensino Superior incompleto','Ensino Superior completo'];
export const surveyQuestions = {
 before:[
  {id:"education",text:"Qual é a sua escolaridade?",options:EDUCATION_OPTIONS},
  {id:'heardBefore',text:'Antes desta trilha, você já tinha ouvido falar em computação quântica?'},
  {id:'firstStudy',text:'Esta é sua primeira tentativa de aprender computação quântica?'},
  {id:'priorCircuit',text:'Antes desta trilha, você já conhecia a ideia de circuito quântico?'},
  {id:'interest',text:'Você tem interesse em aprender mais sobre computação quântica?'}
 ],
 after:[
  {id:'understanding',text:'Depois da trilha, você sente que entende melhor o que é um circuito quântico?'},
  {id:'interest',text:'Você tem interesse em aprender mais sobre computação quântica?'},
  {id:'difficulty',text:'Você achou difícil acompanhar as explicações dos conceitos?'},
  {id:'intuitive',text:'Você achou fácil descobrir como usar os botões e montar o circuito?'},
  {id:'confidence',text:'Você se sente capaz de explicar com suas palavras o papel de pelo menos uma porta do circuito?'}
 ]
};
