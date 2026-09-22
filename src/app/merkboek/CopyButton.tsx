"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="mb-sans"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "0.68rem",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#3FA7D6",
        background: "transparent",
        border: "1px solid rgba(63,167,214,0.3)",
        borderRadius: 2,
        padding: "0.3rem 0.6rem",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {state === "copied" ? "✓ Gekopieerd" : state === "failed" ? "Kopiëren mislukt" : "↷ Kopieer"}
    </button>
  );
}
