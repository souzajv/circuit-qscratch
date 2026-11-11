import { auth } from "./auth";
export async function classroom(action, data = {}) {
  const headers = { "Content-Type": "application/json" };
  if (action !== "redeem") {
    const user = auth().currentUser;
    if (!user) throw Error("Entre na sua conta.");
    headers.Authorization = `Bearer ${await user.getIdToken()}`;
  }
  const response = await fetch("/api/classroom", {
    method: "POST",
    headers,
    body: JSON.stringify({ ...data, action }),
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw Error(
      "O serviço de turmas não está disponível. Tente novamente em instantes.",
    );
  }
  if (!response.ok) { const error=Error(payload.error || "Não foi possível concluir."); error.status=response.status; throw error; }
  return payload;
}
