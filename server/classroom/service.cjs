const {
  randomBytes,
  randomUUID,
  createHash,
  timingSafeEqual,
} = require("node:crypto");
const { readableProgress } = require("./progress.cjs");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const fail = (message, status = 403) => {
  throw Object.assign(new Error(message), { status });
};
const publicStudent = ({ linkHash, encryptedSecret, ...student }) => student;
const policy = (value) => ({
  before: value?.before !== false,
  after: value?.after !== false,
});
function createClassroomService({ repo, tokens }) {
  const owned = async (actor, id) => {
    const student = await repo.get("students", id);
    if (!student) fail("Aluno não encontrado.", 404);
    if (actor.role !== "admin" && student.ownerUid !== actor.uid)
      fail("Sem permissão para este aluno.");
    return student;
  };
  const linkInfo = (student, id) => ({
    linkSecret:
      student.active && !student.deleting && student.encryptedSecret
        ? tokens.open(id, student.encryptedSecret)
        : null,
  });
  const staff = (actor) => {
    if (!["teacher", "admin"].includes(actor.role))
      fail("Sem permissão para gerenciar alunos.");
  };
  return {
    async redeem(id, secret) {
      if (
        typeof id !== "string" ||
        typeof secret !== "string" ||
        secret.length !== 64
      )
        fail("Link inválido ou revogado.", 401);
      const student = await repo.get("students", id);
      if (
        !student?.active ||
        student.deleting ||
        !student.linkHash ||
        !timingSafeEqual(
          Buffer.from(hash(secret), "hex"),
          Buffer.from(student.linkHash, "hex"),
        )
      )
        fail("Link inválido ou revogado.", 401);
      return tokens.create(id, {
        linkedStudent: true,
        accessVersion: student.accessVersion,
      });
    },
    async run(actor, action, data = {}) {
      staff(actor);
      if (action === "list") {
        const owner = actor.role === "admin" ? data.ownerUid : actor.uid;
        const rows = await repo.list("students", owner, data.cursor);
        return {
          items: rows.map(publicStudent),
          cursor: rows.length === 50 ? rows.at(-1).id : null,
        };
      }
      if (action === "accounts") {
        if (actor.role !== "admin") fail("Sem permissão para listar contas.");
        return repo.accounts(data.cursor);
      }
      if (action === "account") {
        if (actor.role !== "admin")
          fail("Sem permissão para consultar contas.");
        return {
          student: await repo.account(data.id),
          ...((data.id || "").startsWith("linked_")
            ? linkInfo(await owned(actor, data.id), data.id)
            : {}),
          progress: readableProgress(
            (await repo.get("progress", data.id))?.state,
          ),
        };
      }
      if (action === "create") {
        const name = typeof data.name === "string" ? data.name.trim() : "";
        if (!name || name.length > 60)
          fail("Informe um nome ou apelido de até 60 caracteres.", 400);
        const id = "linked_" + randomUUID(),
          secret = randomBytes(32).toString("hex");
        const student = {
          name,
          ownerUid: actor.uid,
          surveys: policy(data.surveys),
          active: true,
          accessVersion: 1,
          linkHash: hash(secret),
          encryptedSecret: tokens.seal(id, secret),
          createdAt: new Date().toISOString(),
        };
        await repo.set("students", id, student);
        return { id, secret, student: publicStudent(student) };
      }
      if (typeof data.id !== "string" || !/^linked_[a-z0-9-]+$/.test(data.id))
        fail("Aluno inválido.", 400);
      const student = await owned(actor, data.id);
      if (action === "detail")
        return {
          student: { id: data.id, ...publicStudent(student) },
          ...linkInfo(student, data.id),
          progress: readableProgress(
            (await repo.get("progress", data.id))?.state,
          ),
        };
      if (action === "delete") {
        await repo.mutate(data.id, (current) => ({
          ...current,
          active: false,
          deleting: true,
          accessVersion: current.accessVersion + 1,
        }));
        await tokens.deleteUser(data.id);
        await repo.removeStudent(data.id);
        return { deleted: true };
      }
      if (student.deleting)
        fail("Exclusão pendente. Tente excluir novamente.", 409);
      if (action === "revoke") {
        await repo.mutate(data.id, (current) => ({
          ...current,
          active: false,
          accessVersion: current.accessVersion + 1,
        }));
        return { revoked: true };
      }
      if (action === "settings") {
        await repo.mutate(data.id, (current) => ({
          ...current,
          surveys: policy(data.surveys),
        }));
        return { updated: true };
      }
      if (action === "rotate") {
        const secret = randomBytes(32).toString("hex");
        await repo.mutate(data.id, (current) => {
          if (current.deleting) fail("Exclusão em andamento.", 409);
          return {
            ...current,
            active: true,
            accessVersion: current.accessVersion + 1,
            linkHash: hash(secret),
            encryptedSecret: tokens.seal(data.id, secret),
          };
        });
        return { id: data.id, secret };
      }
      fail("Operação desconhecida.", 400);
    },
  };
}
module.exports = { createClassroomService };
