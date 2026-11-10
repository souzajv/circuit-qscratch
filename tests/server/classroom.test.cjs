const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  createClassroomService,
} = require("../../server/classroom/service.cjs");
const store = new Map();
const repo = {
  get: async (c, id) => store.get(c + "/" + id),
  set: async (c, id, v) => store.set(c + "/" + id, v),
  list: async (c, owner) =>
    [...store]
      .filter(
        ([k, v]) => k.startsWith(c + "/") && (!owner || v.ownerUid === owner),
      )
      .map(([k, v]) => ({ id: k.split("/")[1], ...v })),
  removeStudent: async (id) => {
    for (const c of ["students", "profiles", "progress"])
      store.delete(c + "/" + id);
  },
};
repo.mutate = async (id, update) =>
  repo.set("students", id, update(await repo.get("students", id)));
const service = createClassroomService({
  repo,
  tokens: {seal:(id,s)=>s,open:(id,s)=>s,
    create: async (uid, claims) => ({ uid, claims }),
    deleteUser: async () => {},
  },
});
test("professor não lê alunos de outro professor e aluno não cria convites", async () => {
  await assert.rejects(
    service.run({ uid: "s", role: "student" }, "create", { name: "Aluno" }),
    /permissão/,
  );
  const created = await service.run({ uid: "p1", role: "teacher" }, "create", {
    name: "Aluno",
    surveys: { before: false, after: true },
  });
  await assert.rejects(
    service.run({ uid: "p2", role: "teacher" }, "detail", { id: created.id }),
    /permissão/,
  );
  assert.equal(
    (
      await service.run({ uid: "p1", role: "teacher" }, "detail", {
        id: created.id,
      })
    ).student.name,
    "Aluno",
  );
});
test("link reutiliza o perfil, não expõe hash e revogação impede reentrada", async () => {
  const actor = { uid: "p", role: "teacher" };
  const link = await service.run(actor, "create", { name: "Sol" });
  assert.equal((await service.redeem(link.id, link.secret)).uid, link.id);
  assert.equal((await service.redeem(link.id, link.secret)).uid, link.id);
  const data = await service.run(actor, "list", {});
  assert.equal(data.items[0].linkHash, undefined);
  await service.run(actor, "revoke", { id: link.id });
  await assert.rejects(service.redeem(link.id, link.secret), /inválido/);
});
test("somente admin lista contas e a exclusão remove progresso", async () => {
  await assert.rejects(
    service.run({ uid: "p", role: "teacher" }, "accounts", {}),
    /permissão/,
  );
  const actor = { uid: "p", role: "teacher" };
  const link = await service.run(actor, "create", { name: "Sol" });
  await repo.set("progress", link.id, { state: { best: { 0: 8 } } });
  await service.run(actor, "delete", { id: link.id });
  assert.equal(await repo.get("progress", link.id), undefined);
  await assert.rejects(service.redeem(link.id, link.secret), /inválido/);
});

test("trocar link conserva aluno e progresso, invalida segredo anterior e incrementa versão", async () => {
  const actor = { uid: "teacher", role: "teacher" },
    link = await service.run(actor, "create", { name: "Lua" });
  await repo.set("progress", link.id, {
    state: { completed: [0], best: { 0: 8 } },
  });
  await service.run(actor, "settings", {
    id: link.id,
    surveys: { before: false, after: true },
  });
  const next = await service.run(actor, "rotate", { id: link.id });
  await assert.rejects(service.redeem(link.id, link.secret), /inválido/);
  assert.equal(
    (await service.redeem(link.id, next.secret)).claims.accessVersion,
    2,
  );
  const detail = await service.run(actor, "detail", { id: link.id });
  assert.equal(detail.progress.best[0], 8);
  assert.deepEqual(detail.student.surveys, { before: false, after: true });
});

test("falha na remoção da autenticação deixa acesso revogado e permite concluir exclusão depois", async () => {
  const actor = { uid: "teacher", role: "teacher" },
    link = await service.run(actor, "create", { name: "Lua" });
  const failing = createClassroomService({
    repo,
    tokens: {
      deleteUser: async () => {
        throw Error("Falha transitória");
      },
    },
  });
  await assert.rejects(
    failing.run(actor, "delete", { id: link.id }),
    /transitória/,
  );
  assert.equal((await repo.get("students", link.id)).deleting, true);
  await assert.rejects(
    service.run(actor, "rotate", { id: link.id }),
    /pendente/,
  );
  await assert.rejects(service.redeem(link.id, link.secret), /inválido/);
  await service.run(actor, "delete", { id: link.id });
  assert.equal(await repo.get("students", link.id), undefined);
});

test("painel trata progresso malformado como dados ausentes, sem renderizar objetos do aluno", () => {
  const { readableProgress } = require("../../server/classroom/progress.cjs");
  assert.equal(readableProgress(null).current, 0);
  const result = readableProgress({
    current: 99,
    completed: [0, 0, 99, "1"],
    best: { 0: 8, 1: { bad: true }, 2: 99 },
    answerHistory: {
      invalid: { block: 0, correct: "false" },
      a: {
        block: 0,
        correct: false,
        question: { bad: true },
        selected: "Um",
        expected: "Dois",
        revision: 3,
      },
    },
    surveys: {
      before: {
        status: "completed",
        answers: { education: "Ensino Médio", heardBefore: false, bad: {} },
      },
    },
  });
  assert.deepEqual(result.completed, [0]);
  assert.deepEqual(result.best, { 0: 8 });
  assert.equal(result.answerHistory.a.question, "");
  assert.equal(result.surveys.before.answers.bad, undefined);
  assert.equal(result.surveys.before.answers.heardBefore, false);
});

test('segredo cifrado só abre com a chave e o aluno correspondentes',()=>{const {createLinkVault}=require('../../server/classroom/link-vault.cjs');const vault=createLinkVault('teste-unitario'),sealed=vault.seal('linked_a','segredo');assert.notEqual(sealed,'segredo');assert.equal(vault.open('linked_a',sealed),'segredo');assert.equal(vault.open('linked_b',sealed),null);assert.equal(createLinkVault('outra-chave').open('linked_a',sealed),null);assert.equal(vault.open('linked_a','invalido'),null);assert.throws(()=>createLinkVault(null));});
