const { createClassroomService } = require("./service.cjs");
function createClassroomHandler(backend) {
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Referrer-Policy", "no-referrer");
    if (req.method !== "POST")
      return res.status(405).json({ error: "Use POST." });
    let body;
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({error:'Solicitação inválida.'});
    }
    try {
      if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body) ||
        Buffer.byteLength(JSON.stringify(body)) > 16384
      )
        return res.status(400).json({ error: "Solicitação inválida." });
      const { repo, auth, tokens } = backend(),
        service = createClassroomService({ repo, tokens });
      if (body.action === "redeem")
        return res.json({ token: await service.redeem(body.id, body.secret) });
      const bearer = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
      if (!bearer)
        return res.status(401).json({ error: "Entre na sua conta." });
      const identity = await auth.verifyIdToken(bearer, true);
      if (identity.linkedStudent) {
        const student = await repo.get("students", identity.uid);
        if (
          !student?.active ||
          student.deleting ||
          student.accessVersion !== identity.accessVersion
        )
          return res
            .status(403)
            .json({ error: "Acesso revogado pelo professor." });
        if (body.action !== "me")
          return res.status(403).json({ error: "Sem permissão." });
        return res.json({
          role: "linkedStudent",
          name: student.name,
          surveys: {before:student.surveys.before!==false&&student.surveys.after!==false,after:student.surveys.before!==false&&student.surveys.after!==false},
        });
      }
      let profile = await repo.get("profiles", identity.uid);
      if (!profile) {
        const role =
          body.action === "profile" && body.role === "teacher"
            ? "teacher"
            : "student";
        await repo.ensureProfile(identity.uid, role);
        profile = await repo.get("profiles", identity.uid);
      }
      if (["me", "profile"].includes(body.action))
        return res.json({ role: profile.role });
      return res.json(
        await service.run(
          { uid: identity.uid, role: profile.role },
          body.action,
          body,
        ),
      );
    } catch (error) {
      const status =
        error.status ||
        ((error.code || "").startsWith("auth/")
            ? 401
            : 500);
      return res.status(status).json({
        error:
          status === 500
            ? "Não foi possível concluir. Tente novamente."
            : error.message,
      });
    }
  };
}
module.exports = { createClassroomHandler };
