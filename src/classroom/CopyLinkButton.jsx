import React, { useEffect, useState } from "react";
import Icon from "../shared/ui/Icon";
const COPY_FEEDBACK_MS = 3000;
export default function CopyLinkButton({ value }) {
  const [copied, setCopied] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <>
      <button
        className="secondary copy-link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setError("");
            setCopied(true);
          } catch {
            setError(
              "Não foi possível copiar. Selecione o link e copie manualmente.",
            );
          }
        }}
      >
        <Icon name={copied ? "check" : "arrow"} />
        {copied ? "Copiado!" : "Copiar link"}
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
