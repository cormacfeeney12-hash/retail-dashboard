"use client";

import { C } from "@/lib/utils";

interface BreadcrumbProps {
  items: string[];
  onNavigate: (index: number) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {i < items.length - 1 ? (
            <>
              <button
                onClick={() => onNavigate(i)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.accent,
                  padding: 0,
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {item}
              </button>
              <span style={{ color: C.textDim }}>›</span>
            </>
          ) : (
            <span style={{ color: C.text, fontWeight: 500 }}>{item}</span>
          )}
        </span>
      ))}
    </div>
  );
}
