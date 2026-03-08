"use client";

import { C } from "@/lib/utils";

interface BadgeProps {
  value: number | null | undefined;
  invert?: boolean;
}

export function Badge({ value, invert = false }: BadgeProps) {
  if (value == null) return null;

  const isGood = invert ? value <= 0 : value >= 0;
  const color = value === 0 ? C.textDim : isGood ? C.green : C.red;
  const arrow = value >= 0 ? "▲" : "▼";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 600,
        color,
        background: `${color}26`,
        fontFamily: "'JetBrains Mono', monospace",
        whiteSpace: "nowrap",
      }}
    >
      {arrow} {(Math.abs(value) * 100).toFixed(2)}%
    </span>
  );
}
