const http = require("node:http");
const handler = require("../api/classroom.js");
// Servidor local da mesma API usada pela Vercel, sem credenciais no frontend.
http
  .createServer((req, res) => {
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => res.end(JSON.stringify(data));
    res.setHeader("Content-Type", "application/json");
    if (req.url !== "/api/classroom") {
      res.statusCode = 404;
      return res.end();
    }
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 16384) req.destroy();
    });
    req.on("end", async () => {
      try {
        req.body = JSON.parse(body || "{}");
        await handler(req, res);
      } catch {
        res.status(400).json({ error: "Solicitação inválida." });
      }
    });
  })
  .listen(8611, "127.0.0.1", () =>
    console.log("API local disponível na porta 8611."),
  );
