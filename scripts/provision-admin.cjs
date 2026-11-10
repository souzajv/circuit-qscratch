const { backend } = require("../server/firebase.cjs");
// Executar em ambiente confiável com ADC ou FIREBASE_SERVICE_ACCOUNT_JSON.
async function main() {
  const email = process.env.ADMIN_EMAIL;
  if (!email) throw Error("Defina ADMIN_EMAIL para a conta aprovada.");
  const { auth, repo } = backend(),
    user = await auth.getUserByEmail(email);
  await repo.set("profiles", user.uid, {
    role: "admin",
    grantedAt: new Date().toISOString(),
  });
  console.log(
    "Permissão administrativa concedida à conta existente. Nenhuma senha foi alterada.",
  );
}
main().catch(() => {
  console.error(
    "Não foi possível conceder acesso. Verifique credencial administrativa e existência da conta.",
  );
  process.exitCode = 1;
});
