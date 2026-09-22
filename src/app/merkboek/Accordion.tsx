"use client";

import { useState } from "react";

export default function Accordion({
  eyebrow,
  title,
  children,
  defaultOpen = false,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ border: "1px solid rgba(11,60,93,0.15)", borderRadius: 2, background: "#fff" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem 1.5rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <span>
          <span className="mb-sans" style={{ display: "block", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2E86AB", marginBottom: "0.4rem" }}>
            {eyebrow}
          </span>
          <span className="mb-display" style={{ fontSize: "clamp(1.2rem,3vw,1.5rem)", fontWeight: 700, color: "#0B3C5D" }}>
            {title}
          </span>
        </span>
        <span
          style={{
            flexShrink: 0,
            color: "#2E86AB",
            fontSize: "1.1rem",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          ⌄
        </span>
      </button>
      {open && <div style={{ padding: "0 1.5rem 1.75rem" }}>{children}</div>}
    </div>
  );
}
