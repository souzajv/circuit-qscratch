import React, { useState, useEffect } from "react";
import { classroom } from "../infrastructure/firebase/classroom";
import { blocks } from "../learning/content";
import { surveyQuestions } from "../learning/surveys";
import DeleteStudentDialog from "./DeleteStudentDialog";
import "./classroom.css";
const roleNames = {
  student: "Aluno",
  teacher: "Professor",
  admin: "Administrador",
  linkedStudent: "Aluno por link",
};
const surveyStatuses = {
  completed: "Respondido",
  skipped: "Não quis responder",
  in_progress: "Em andamento",
  unanswered: "Não respondido",
};

function ProgressDetail({ detail }) {
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
export default function ClassroomPanel({ role }) {
  const [items, setItems] = useState([]),
    [accounts, setAccounts] = useState([]),
    [name, setName] = useState(""),
    [before, setBefore] = useState(true),
    [after, setAfter] = useState(true);
  const [detail, setDetail] = useState(null),
    [link, setLink] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [cursor, setCursor] = useState(null),
    [accountCursor, setAccountCursor] = useState(null),
    [deleting, setDeleting] = useState(null);
  const load = async (next) => {
    const result = await classroom("list", next ? { cursor: next } : {});
    setItems((previous) =>
      next ? [...previous, ...result.items] : result.items,
    );
    setCursor(result.cursor);
  };
  const loadAccounts = async (next) => {
    const result = await classroom("accounts", next ? { cursor: next } : {});
    setAccounts((previous) =>
      next ? [...previous, ...result.items] : result.items,
    );
    setAccountCursor(result.cursor);
  };
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    run(async () => {
      await load();
      if (role === "admin") await loadAccounts();
    });
  }, [role]);
  const showLink = (result) =>
    setLink(
      `${window.location.origin}/#/convite/${result.id}/${result.secret}`,
    );
  return (
    <section className="classroom">
      <h1>{role === "admin" ? "Administração" : "Meus alunos"}</h1>
      <p>
        {role === "admin"
          ? "Acompanhe contas e alunos vinculados de toda a plataforma."
          : "Crie um acesso para cada aluno e acompanhe suas descobertas."}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(async () => {
            showLink(
              await classroom("create", { name, surveys: { before, after } }),
            );
            setName("");
            await load();
          });
        }}
      >
        <fieldset disabled={busy}>
          <legend>Novo aluno por link</legend>
          <label>
            Nome ou apelido
            <input
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={before}
              onChange={(e) => setBefore(e.target.checked)}
            />{" "}
            Mostrar formulário antes da trilha
          </label>
          <label>
            <input
              type="checkbox"
              checked={after}
              onChange={(e) => setAfter(e.target.checked)}
            />{" "}
            Mostrar formulário depois da trilha
          </label>
          <button className="primary">Criar acesso</button>
        </fieldset>
      </form>
      {link && (
        <section className="classroom-link">
          <h2>Link de acesso</h2>
          <p>
            Qualquer pessoa com este link pode acessar o perfil. Ele pode ser
            reutilizado até ser revogado. Guarde-o agora; depois será necessário
            gerar outro.
          </p>
          <input aria-label="Link do aluno" readOnly value={link} />
          <button
            className="secondary"
            onClick={() => run(() => navigator.clipboard.writeText(link))}
          >
            Copiar link
          </button>
          <button className="text-button" onClick={() => setLink("")}>
            Ocultar link
          </button>
        </section>
      )}
      {error && (
        <p role="alert">
          {error}{" "}
          <button onClick={() => run(() => load())}>
            Tentar carregar novamente
          </button>
        </p>
      )}
      {busy && <p role="status">Aguarde...</p>}
      <h2>Alunos por link</h2>
      {!items.length && !busy && <p>Nenhum aluno criado.</p>}
      <div className="classroom-list">
        {items.map((student) => (
          <article key={student.id}>
            <h3>{student.name}</h3>
            <p>
              {student.deleting
                ? "Exclusão pendente"
                : student.active
                  ? "Link ativo"
                  : "Link revogado"}
            </p>
            {role === "admin" && (
              <small>
                Professor:{" "}
                {accounts.find((account) => account.id === student.ownerUid)
                  ?.name || student.ownerUid}
              </small>
            )}
            <div className="classroom-actions">
              <button
                disabled={busy}
                onClick={() =>
                  run(async () =>
                    setDetail(await classroom("detail", { id: student.id })),
                  )
                }
              >
                Ver progresso
              </button>
              <button
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    showLink(await classroom("rotate", { id: student.id }));
                    await load();
                  })
                }
              >
                Gerar novo link
              </button>
              <button
                disabled={busy || !student.active}
                onClick={() =>
                  run(async () => {
                    await classroom("revoke", { id: student.id });
                    setLink("");
                    await load();
                  })
                }
              >
                Revogar link
              </button>
              <button disabled={busy} onClick={() => setDeleting(student)}>
                Excluir aluno
              </button>
            </div>
            <label>
              <input
                type="checkbox"
                disabled={busy}
                checked={student.surveys.before}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  run(async () => {
                    await classroom("settings", {
                      id: student.id,
                      surveys: { ...student.surveys, before: enabled },
                    });
                    await load();
                  });
                }}
              />{" "}
              Formulário pré
            </label>
            <label>
              <input
                type="checkbox"
                disabled={busy}
                checked={student.surveys.after}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  run(async () => {
                    await classroom("settings", {
                      id: student.id,
                      surveys: { ...student.surveys, after: enabled },
                    });
                    await load();
                  });
                }}
              />{" "}
              Formulário pós
            </label>
          </article>
        ))}
      </div>
      {cursor && (
        <button disabled={busy} onClick={() => run(() => load(cursor))}>
          Carregar mais alunos
        </button>
      )}
      {deleting && (
        <DeleteStudentDialog
          student={deleting}
          busy={busy}
          error={error}
          onCancel={() => setDeleting(null)}
          onConfirm={() =>
            run(async () => {
              await classroom("delete", { id: deleting.id });
              setDeleting(null);
              setDetail(null);
              setLink("");
              await load();
            })
          }
        />
      )}
      {role === "admin" && (
        <section>
          <h2>Contas da plataforma</h2>
          {accounts.map((account) => (
            <article key={account.id}>
              <strong>{account.name}</strong>
              <p>
                {account.email || "Acesso por link"} · {roleNames[account.role]}
              </p>
              <button
                disabled={busy}
                onClick={() =>
                  run(async () =>
                    setDetail(await classroom("account", { id: account.id })),
                  )
                }
              >
                Consultar conta
              </button>
            </article>
          ))}
          {accountCursor && (
            <button
              disabled={busy}
              onClick={() => run(() => loadAccounts(accountCursor))}
            >
              Carregar mais contas
            </button>
          )}
        </section>
      )}
      {detail && (
        <>
          <button className="secondary" onClick={() => setDetail(null)}>
            Fechar detalhes
          </button>
          <ProgressDetail detail={detail} />
        </>
      )}
    </section>
  );
}
