const {
  createHash,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} = require("node:crypto");
// O segredo recuperável fica cifrado; a chave só existe no ambiente servidor.
function createLinkVault(material) {
  if (!material) throw Error("Credencial para proteger os links ausente.");
  const key = createHash("sha256")
    .update("circuit-qscratch/link-vault/v1\0" + material)
    .digest();
  return {
    seal(id, secret) {
      const iv = randomBytes(12),
        cipher = createCipheriv("aes-256-gcm", key, iv);
      cipher.setAAD(Buffer.from(id));
      const data = Buffer.concat([
        cipher.update(secret, "utf8"),
        cipher.final(),
      ]);
      return [iv, cipher.getAuthTag(), data]
        .map((b) => b.toString("base64url"))
        .join(".");
    },
    open(id, value) {
      try {
        const [iv, tag, data] = value
          .split(".")
          .map((s) => Buffer.from(s, "base64url"));
        const decipher = createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAAD(Buffer.from(id));
        decipher.setAuthTag(tag);
        return Buffer.concat([
          decipher.update(data),
          decipher.final(),
        ]).toString("utf8");
      } catch {
        return null;
      }
    },
  };
}
module.exports = { createLinkVault };
