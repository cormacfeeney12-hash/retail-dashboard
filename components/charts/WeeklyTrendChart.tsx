"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { WeeklyTrendPoint } from "@/lib/types";
import { C } from "@/lib/utils";

interface Props {
  data: WeeklyTrendPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "13px",
      }}
    >
      <div style={{ color: C.textDim, marginBottom: "6px", fontWeight: 600 }}>{label}</div>
      {payload.map((p: { color: string; name: string; value: number }, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: C.textDim }}>{p.name}:</span>
          <span style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
            €{p.value.toLocaleString("en-IE", { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
}

export function WeeklyTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fill: C.textDim, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
          tick={{ fill: C.textDim, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: C.textDim, paddingTop: "8px" }}
        />
        <Line
          type="monotone"
          dataKey="ty"
          name="This Year"
          stroke={C.accent}
          strokeWidth={2.5}
          dot={{ r: 4, fill: C.accent, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="ly"
          name="Last Year"
          stroke={C.textMuted}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 3, fill: C.textMuted, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
