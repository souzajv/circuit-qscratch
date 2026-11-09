'use strict';

// Inventário de revisão: lê o conteúdo publicado sem alterar a aplicação ou o banco.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const babel = require('@babel/core');
const root = path.resolve(__dirname, '../..');
const cache = new Map();

function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  if (file.endsWith('.cjs')) return require(file);
  const module = {exports: {}};
  cache.set(file, module);
  const compiled = babel.transformSync(fs.readFileSync(file, 'utf8'), {
    configFile: false,
    babelrc: false,
    presets: [['@babel/preset-env', {targets: {node: 'current'}}]]
  }).code;
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    require: specifier => {
      const target = path.resolve(path.dirname(file), specifier);
      return load(path.extname(target) ? target : `${target}.js`);
    }
  }, {filename: file});
  return module.exports;
}

// Extrai somente a tabela declarativa de variantes, sem carregar componentes React.
const component = path.join(root, 'src/learning/LearningExample.jsx');
const ast = babel.parseSync(fs.readFileSync(component, 'utf8'), {
  configFile: false, babelrc: false, parserOpts: {plugins: ['jsx']}
});
const declaration = ast.program.body.flatMap(node => node.declarations ?? [])
  .find(node => node.id.name === 'variants').init;
const variants = Object.fromEntries(declaration.properties.map(property => [
  property.key.name ?? property.key.value,
  property.value.elements.map(element => element.value)
]));
const {blocks, getLessons, getQuestions, CONTENT_REVISION} = load(path.join(root, 'src/learning/content.js'));
const {SCHOOL_LEVELS} = require(path.join(root, 'src/shared/config/experience.cjs'));
const inventory = blocks.map((block, index) => ({
  bloco: index + 1,
  titulo: block.title,
  paginas: getLessons(block, SCHOOL_LEVELS[0]).map((page, position) => ({
    pagina: position + 1,
    titulo: page.title,
    exemplo: page.visual,
    preparosDisponiveis: variants[page.visual] ?? null,
    pedeCompararUmaEDuasH: /uma vez.*duas vezes|uma H.*duas H/.test(page.text)
  })),
  questoes: getQuestions(block, SCHOOL_LEVELS[0]).map((question, position) => ({
    pergunta: position + 1,
    texto: question.question,
    posicaoCorreta: question.answer + 1
  }))
}));
const questions = inventory.flatMap(block => block.questoes);
const auditedFiles = [
  'src/learning/content.js', 'src/learning/lessonContent.js',
  'src/learning/LearningExample.jsx', 'src/learning/ExperimentPanel.jsx',
  'src/learning/MiniCircuit.jsx', 'src/learning/Lesson.jsx',
  'src/circuit/practice.cjs', 'src/circuit/model.cjs',
  'src/learning/quizRevision.js', 'src/learning/practiceReflections.js',
  'src/learning/PracticeReflection.jsx', 'src/learning/ExplorationTabs.jsx'
];
const report = {
  dataRevisao: '2026-11-09',
  revisaoConteudo: CONTENT_REVISION,
  tipo: 'Inventário estático do percurso introdutório. Não contém respostas de estudantes.',
  paginas: inventory.reduce((total, block) => total + block.paginas.length, 0),
  perguntas: questions.length,
  primeiraAlternativaCorreta: questions.filter(question => question.posicaoCorreta === 1).length,
  inventario: inventory,
  sha256: Object.fromEntries(auditedFiles.map(file => [file,
    crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')
  ]))
};
const outputName = process.argv[2] ?? 'inventario-aplicado.json';
if (!/^[a-z0-9-]+\.json$/.test(outputName)) throw new Error('Use um nome de arquivo JSON dentro desta pasta.');
fs.writeFileSync(path.join(__dirname, outputName), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({paginas: report.paginas, perguntas: report.perguntas,
  primeiraAlternativaCorreta: report.primeiraAlternativaCorreta}));
