import React, { useEffect, useRef } from "react";
export default function DeleteStudentDialog({
  student,
  busy,
  error,
  onCancel,
  onConfirm,
}) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement,
      node = ref.current;
    node.showModal();
    return () => {
      node.close();
      if (previous.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="delete-student-title"
      className="classroom-confirm"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
    >
      <h2 id="delete-student-title">Excluir {student.name}?</h2>
      <p>
        O link será revogado e o perfil, progresso e respostas serão apagados.
        Esta ação não pode ser desfeita.
      </p>
      {error && <p role="alert">{error}</p>}
      <button className="secondary" disabled={busy} onClick={onCancel}>
        Cancelar
      </button>
      <button className="primary" disabled={busy} onClick={onConfirm}>
        Confirmar exclusão
      </button>
    </dialog>
  );
}
