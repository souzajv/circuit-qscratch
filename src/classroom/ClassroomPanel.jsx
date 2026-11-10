import React, { useState, useEffect, useRef } from "react";
import { classroom } from "../infrastructure/firebase/classroom";
import ProgressDetail from "./ProgressDetail";
import Icon from "../shared/ui/Icon";

import DeleteStudentDialog from "./DeleteStudentDialog";
import "./classroom.css";
const roleNames = {
  student: "Aluno",
  teacher: "Professor",
  admin: "Administrador",
  linkedStudent: "Aluno por link",
};
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
  const [search, setSearch] = useState("");
  const detailHeading = useRef(null),
    linkField = useRef(null);
  useEffect(() => {
    detailHeading.current.focus();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [detail]);
  useEffect(() => {
    if (link) {
      linkField.current.focus();
      linkField.current.scrollIntoView({ block: "center", behavior: "auto" });
    }
  }, [link]);
  const matches = (value) =>
    value
      .toLocaleLowerCase("pt-BR")
      .includes(search.trim().toLocaleLowerCase("pt-BR"));
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
  const renderStudent = (student) => (
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
          {accounts.find((account) => account.id === student.ownerUid)?.name ||
            student.ownerUid}
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
  );
  if (detail)
    return (
      <section className="classroom classroom-record">
        <button
          className="secondary record-back"
          onClick={() => setDetail(null)}
        >
          <Icon name="back" /> Fechar detalhes
        </button>
        <header className="classroom-heading">
          <div>
            <h1 ref={detailHeading} tabIndex={-1}>
              Consulta de conta
            </h1>
            <p>
              {detail.student.email ||
                "Acompanhe o percurso e as respostas deste aluno."}
            </p>
          </div>
        </header>
        <ProgressDetail detail={detail} />
      </section>
    );
  return (
    <section className="classroom">
      <header className="classroom-heading">
        <div>
          <h1 ref={detailHeading} tabIndex={-1}>
            {role === "admin" ? "Administração" : "Meus alunos"}
          </h1>
          <p>
            {role === "admin"
              ? "Acompanhe contas e alunos vinculados de toda a plataforma."
              : "Crie um acesso para cada aluno e acompanhe suas descobertas."}
          </p>
        </div>
        <button
          className="classroom-create-link"
          onClick={() => {
            const form = document.getElementById("novo-acesso");
            form.scrollIntoView({ block: "center", behavior: "smooth" });
            form.querySelector("input").focus({ preventScroll: true });
          }}
        >
          <Icon name="qubit" /> Novo acesso
        </button>
      </header>
      <label className="classroom-search">
        Buscar por nome ou e-mail
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Quem você quer acompanhar?"
        />
      </label>
      <p className="classroom-search-help">
        A busca considera os registros já carregados. Use “Carregar mais” para
        consultar as próximas páginas.
      </p>
      <div className="classroom-overview">
        <span>
          Contas carregadas <strong>{accounts.length}</strong>
        </span>
        <span>
          Alunos por link carregados <strong>{items.length}</strong>
        </span>
      </div>
      <div className="classroom-columns">
        <div className="classroom-roster">
          {link && (
            <section className="classroom-link">
              <h2>Link de acesso</h2>
              <p>
                Qualquer pessoa com este link pode acessar o perfil. Ele pode
                ser reutilizado até ser revogado. Guarde-o agora; depois será
                necessário gerar outro.
              </p>
              <input
                ref={linkField}
                aria-label="Link do aluno"
                readOnly
                value={link}
              />
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
          {role === "admin" && (
            <section className="classroom-accounts">
              <h2>Contas da plataforma</h2>
              {accounts
                .filter((account) =>
                  matches(account.name + " " + account.email),
                )
                .map((account) => (
                  <article className="account-row" key={account.id}>
                    <strong>{account.name}</strong>
                    <p>
                      {account.email || "Acesso por link"} ·{" "}
                      {roleNames[account.role]}
                    </p>
                    <button
                      disabled={busy}
                      onClick={() =>
                        run(async () =>
                          setDetail(
                            await classroom("account", { id: account.id }),
                          ),
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

          <h2>Alunos por link</h2>
          {!items.length && !busy && <p>Nenhum aluno criado.</p>}
          <div className="classroom-list">
            {items
              .filter((student) => matches(student.name))
              .map(renderStudent)}
          </div>
          {search &&
            !items.some((student) => matches(student.name)) &&
            !accounts.some((account) =>
              matches(account.name + " " + account.email),
            ) && (
              <p className="classroom-empty">
                Nenhum resultado para esta busca. Tente outro nome ou e-mail.
              </p>
            )}
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
        </div>
        <aside className="classroom-create">
          {" "}
          <form
            id="novo-acesso"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                showLink(
                  await classroom("create", {
                    name,
                    surveys: { before, after },
                  }),
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
        </aside>
      </div>
    </section>
  );
}
