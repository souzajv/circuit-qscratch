// O progresso vem do navegador do aluno. O painel nunca deve renderizar objetos
// inesperados nem interpretar uma estrutura inválida como dado de aprendizagem.
const object = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};
const text = (value) => (typeof value === "string" ? value : "");
function readableProgress(value) {
  const state = object(value),
    best = {},
    answerHistory = {},
    surveys = {};
  for (const [key, score] of Object.entries(object(state.best))) {
    if (
      /^[0-4]$/.test(key) &&
      Number.isFinite(score) &&
      score >= 0 &&
      score <= 10
    )
      best[key] = score;
  }
  for (const [id, entry] of Object.entries(object(state.answerHistory))) {
    const row = object(entry);
    if (
      !Number.isInteger(row.block) ||
      row.block < 0 ||
      row.block > 4 ||
      typeof row.correct !== "boolean"
    )
      continue;
    answerHistory[id] = {
      id,
      block: row.block,
      correct: row.correct,
      question: text(row.question),
      selected: text(row.selected),
      expected: text(row.expected),
      revision: Number.isInteger(row.revision) ? row.revision : 0,
    };
  }
  for (const kind of ["before", "after"]) {
    const record = object(object(state.surveys)[kind]),
      answers = {};
    for (const [id, answer] of Object.entries(object(record.answers))) {
      if (typeof answer === "boolean" || typeof answer === "string")
        answers[id] = answer;
    }
    surveys[kind] = {
      status: ["completed", "skipped", "in_progress"].includes(record.status)
        ? record.status
        : "unanswered",
      answers,
    };
  }
  return {
    current:
      Number.isInteger(state.current) &&
      state.current >= 0 &&
      state.current <= 4
        ? state.current
        : 0,
    completed: Array.isArray(state.completed)
      ? [
          ...new Set(
            state.completed.filter(
              (n) => Number.isInteger(n) && n >= 0 && n <= 4,
            ),
          ),
        ]
      : [],
    best,
    answerHistory,
    surveys,
  };
}
module.exports = { readableProgress };
