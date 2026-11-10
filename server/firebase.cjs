// Credenciais administrativas existem somente no servidor, nunca no bundle web.
const {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
} = require("firebase-admin/app");
const { getFirestore, FieldPath } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
function backend() {
  if (!getApps().length) {
    const config = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    initializeApp(
      config
        ? { credential: cert(JSON.parse(config)) }
        : process.env.FIREBASE_AUTH_EMULATOR_HOST
          ? { projectId: process.env.GCLOUD_PROJECT }
          : {
              projectId: process.env.GCLOUD_PROJECT || "circuit-qscratch",
              credential: applicationDefault(),
            },
    );
  }
  const db = getFirestore(),
    auth = getAuth();
  const repo = {
    get: async (c, id) => {
      const s = await db.collection(c).doc(id).get();
      return s.exists ? s.data() : undefined;
    },
    set: (c, id, data) => db.collection(c).doc(id).set(data),
    // Cadastros simultâneos não podem trocar um papel já existente.
    ensureProfile: (uid, role) =>
      db.runTransaction(async (tx) => {
        const ref = db.collection("profiles").doc(uid),
          snapshot = await tx.get(ref);
        if (!snapshot.exists)
          tx.set(ref, { role, createdAt: new Date().toISOString() });
      }),
    mutate: (id, update) =>
      db.runTransaction(async (tx) => {
        const ref = db.collection("students").doc(id),
          snapshot = await tx.get(ref);
        if (!snapshot.exists)
          throw Object.assign(Error("Aluno não encontrado."), { status: 404 });
        tx.set(ref, update(snapshot.data()));
      }),
    list: async (c, owner, cursor) => {
      let q = db.collection(c);
      if (owner) q = q.where("ownerUid", "==", owner);
      q = q.orderBy(FieldPath.documentId()).limit(50);
      if (cursor) q = q.startAfter(cursor);
      return (await q.get()).docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    removeStudent: async (id) => {
      const batch = db.batch();
      for (const c of ["students", "progress", "profiles"])
        batch.delete(db.collection(c).doc(id));
      await batch.commit();
    },
    account: async (id) => {
      const u = await auth.getUser(id),
        student = id.startsWith("linked_")
          ? await repo.get("students", id)
          : null;
      return {
        id: u.uid,
        name: student?.name || u.displayName || "Sem nome",
        email: u.email || "",
        role:
          (await repo.get("profiles", id))?.role ||
          (id.startsWith("linked_") ? "linkedStudent" : "student"),
      };
    },
    accounts: async (cursor) => {
      const page = await auth.listUsers(50, cursor);
      const items = await Promise.all(
        page.users.map((u) => repo.account(u.uid)),
      );
      return { items, cursor: page.pageToken || null };
    },
  };
  return {
    repo,
    auth,
    tokens: {
      create: (uid, claims) => auth.createCustomToken(uid, claims),
      deleteUser: async (uid) => {
        try {
          await auth.deleteUser(uid);
        } catch (e) {
          if (e.code !== "auth/user-not-found") throw e;
        }
      },
    },
  };
}
module.exports = { backend };
