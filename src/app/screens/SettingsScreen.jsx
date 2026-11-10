import React from "react";
export default function SettingsScreen({
  canEditName = true,
  persistent,
  heading,
  name,
  setName,
  sound,
  setSound,
  motion,
  setMotion,
}) {
  return (
    <section className="settings">
      <h1 ref={heading} tabIndex="-1">
        Do seu jeito
      </h1>
      <p>
        A trilha começa do básico para todos. Ajuste suas preferências de som e
        animação.
      </p>
      {canEditName && (
        <label>
          Como posso te chamar?
          <input
            maxLength="40"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      )}
      <label className="toggle">
        <input
          type="checkbox"
          checked={sound}
          onChange={(e) => setSound(e.target.checked)}
        />{" "}
        Sons de acerto
      </label>
      <label className="toggle">
        <input
          type="checkbox"
          checked={motion}
          onChange={(e) => setMotion(e.target.checked)}
        />{" "}
        Animações do mascote
      </label>
      <p>
        {persistent
          ? "As preferências são salvas na sua conta. Confira o estado do salvamento junto ao seu nome."
          : "Essas preferências valem para esta sessão."}
      </p>
    </section>
  );
}
