import React from "react";
import { blocks } from "../learning/content";
import { surveyQuestions } from "../learning/surveys";
const surveyStatuses = {
  completed: "Respondido",
  skipped: "Não quis responder",
  in_progress: "Em andamento",
  unanswered: "Não respondido",
};

export default function ProgressDetail({ detail }) {
  const state = detail.progress || {},
    history = Object.values(state.answerHistory || {});
  return (
    <section className="classroom-detail">
      <h2>{detail.student.name || "Aluno"}</h2>
      <p>
        {state.completed?.length || 0} de {blocks.length} blocos concluídos ·{" "}
        {Object.values(state.best || {}).reduce((a, b) => a + b, 0)} pontos
      </p>
      <p>Bloco atual: {blocks[state.current || 0].title}</p>
      {blocks.map((block, index) => (
        <details key={block.title}>
          <summary>
            {block.title} · {state.best?.[index] || 0} pontos
          </summary>
          {history.filter((a) => a.block === index && !a.correct).length ? (
            history
              .filter((a) => a.block === index && !a.correct)
              .map((a) => (
                <div key={a.id}>
                  <strong>{a.question}</strong>
                  <p>
                    Resposta: {a.selected} · Correta: {a.expected}
                  </p>
                  <small>Conteúdo revisão {a.revision}</small>
                </div>
              ))
          ) : (
            <p>
              Nenhum erro registrado neste bloco. Tentativas anteriores ao
              painel não possuem histórico detalhado.
            </p>
          )}
        </details>
      ))}
      <h3>Questionários</h3>
      {["before", "after"].map((kind) => (
        <details key={kind}>
          <summary>
            {kind === "before" ? "Antes" : "Depois"} da trilha ·{" "}
            {surveyStatuses[state.surveys?.[kind]?.status] || "Não respondido"}
          </summary>
          {surveyQuestions[kind].map((q) => (
            <p key={q.id}>
              <strong>{q.text}</strong>
              <br />
              <span>
                {typeof state.surveys?.[kind]?.answers?.[q.id] === "boolean"
                  ? state.surveys[kind].answers[q.id]
                    ? "Sim"
                    : "Não"
                  : (state.surveys?.[kind]?.answers?.[q.id] ?? "Sem resposta")}
              </span>
            </p>
          ))}
        </details>
      ))}
    </section>
  );
}
