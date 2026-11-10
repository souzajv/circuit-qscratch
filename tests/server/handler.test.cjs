const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  createClassroomHandler,
} = require("../../server/classroom/handler.cjs");
function setup() {
  const store = new Map(),
    identity = { uid: "account" };
  const repo = {
    get: async (c, id) => store.get(c + "/" + id),
    ensureProfile: async (uid, role) => {
      if (!store.has("profiles/" + uid)) store.set("profiles/" + uid, { role });
    },
    list: async () => [],
  };
  const auth = {
    verifyIdToken: async (token) => {
      if (token === "invalid")
        throw Object.assign(Error("Inválido"), {
          code: "auth/invalid-id-token",
        });
      return identity;
    },
  };
  const handler = createClassroomHandler(() => ({ repo, auth, tokens: {} }));
  const call = async (body, token = "valid", method = "POST") => {
    const result = {
      code: 200,
      headers: {},
      setHeader(k, v) {
        this.headers[k] = v;
      },
      status(code) {
        this.code = code;
        return this;
      },
      json(data) {
        this.data = data;
        return this;
      },
    };
    await handler(
      {
        method,
        body,
        headers: token ? { authorization: "Bearer " + token } : {},
      },
      result,
    );
    return result;
  };
  return { store, identity, repo, call };
}
test("API exige método, objeto pequeno e sessão válida nas operações protegidas", async () => {
  const { call } = setup();
  assert.equal((await call({}, "valid", "GET")).code, 405);
  for (const body of [null, [], { name: "x".repeat(17000) }, "{"])
    assert.equal((await call(body)).code, 400);
  assert.equal((await call({ action: "me" }, null)).code, 401);
  assert.equal((await call({ action: "me" }, "invalid")).code, 401);
});
test("papel inicial limita-se a aluno ou professor e não altera papel previamente concedido", async () => {
  const { call, store } = setup();
  assert.equal(
    (await call({ action: "profile", role: "admin" })).data.role,
    "student",
  );
  assert.equal(
    (await call({ action: "profile", role: "teacher" })).data.role,
    "student",
  );
  store.clear();
  assert.equal(
    (await call(JSON.stringify({ action: "profile", role: "teacher" }))).data
      .role,
    "teacher",
  );
  store.set("profiles/account", { role: "admin" });
  assert.equal((await call({ action: "me" })).data.role, "admin");
});
test("sessão de link exige registro ativo e versão vigente e não pode gerenciar alunos", async () => {
  const { call, store, identity } = setup();
  Object.assign(identity, {
    uid: "linked_a",
    linkedStudent: true,
    accessVersion: 1,
  });
  assert.equal((await call({ action: "me" })).code, 403);
  store.set("students/linked_a", {
    name: "Sol",
    active: true,
    accessVersion: 1,
    surveys: { before: false, after: true },
  });
  assert.equal((await call({ action: "me" })).data.role, "linkedStudent");
  assert.equal((await call({ action: "list" })).code, 403);
  identity.accessVersion = 0;
  assert.equal((await call({ action: "me" })).code, 403);
  identity.accessVersion = 1;
  store.get("students/linked_a").deleting = true;
  assert.equal((await call({ action: "me" })).code, 403);
});
test("API não expõe detalhes administrativos em erro interno e usa respostas sem cache", async () => {
  const { call, repo, store } = setup();
  store.set("profiles/account", { role: "teacher" });
  const listed = await call({ action: "list" });
  assert.deepEqual(listed.data.items, []);
  assert.equal(listed.headers["Cache-Control"], "no-store");
  repo.list = async () => {
    throw Error("segredo interno");
  };
  const failed = await call({ action: "list" });
  assert.equal(failed.code, 500);
  assert.doesNotMatch(failed.data.error, /segredo/);
});
