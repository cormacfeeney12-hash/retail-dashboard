"use client";

import { Badge } from "./Badge";
import { C, good } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  variancePct?: number | null;
  invert?: boolean;
  accent?: string;
  subtitle?: string;
}

export function KpiCard({ label, value, variancePct, invert, accent, subtitle }: KpiCardProps) {
  let borderColor = accent ?? C.accent;
  if (!accent && variancePct != null) {
    const g = good(variancePct, invert);
    if (g === true) borderColor = C.green;
    else if (g === false) borderColor = C.red;
  }

  return (
    <div
      style={{
        background: C.card,
        borderRadius: "10px",
        padding: "18px 20px",
        borderTop: `2px solid ${borderColor}`,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: C.textDim,
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: C.text,
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: "12px", color: C.textDim, marginTop: "4px" }}>{subtitle}</div>
      )}
      {variancePct != null && (
        <div style={{ marginTop: "8px" }}>
          <Badge value={variancePct} invert={invert} />
        </div>
      )}
    </div>
  );
}
