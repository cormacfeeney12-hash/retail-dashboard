"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { WeeklyTrend16Point } from "@/lib/types";
import { C } from "@/lib/utils";

interface Props {
  data: WeeklyTrend16Point[];
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
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
              display: "inline-block",
            }}
          />
          <span style={{ color: C.textDim }}>{p.name}:</span>
          <span style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
            {p.name === "Avg Spend"
              ? `€${p.value.toFixed(2)}`
              : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function WeeklyTrend16Chart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis
          dataKey="w"
          tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={(v) => v.toLocaleString()}
          tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(v) => `€${v.toFixed(2)}`}
          tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "12px", color: C.textDim, paddingTop: "8px" }} />
        <Bar yAxisId="left" dataKey="trans" name="Transactions" fill={`${C.accent}66`} radius={[3, 3, 0, 0]} />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="avg"
          name="Avg Spend"
          stroke={C.cyan}
          strokeWidth={2.5}
          dot={{ r: 3, fill: C.cyan, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
