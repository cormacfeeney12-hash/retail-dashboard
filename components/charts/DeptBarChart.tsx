"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Department } from "@/lib/types";
import { C } from "@/lib/utils";

interface Props {
  data: Department[];
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
      <div style={{ color: C.textDim, marginBottom: "6px", fontWeight: 600, maxWidth: 180 }}>{label}</div>
      <div style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
        €{(payload[0].value as number).toLocaleString("en-IE", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}

export function DeptBarChart({ data }: Props) {
  const chartData = [...data]
    .filter((d) => d.s != null && d.s > 0)
    .sort((a, b) => (b.s ?? 0) - (a.s ?? 0))
    .slice(0, 8)
    .map((d) => ({
      name: d.n.replace("Grocery -  ", "").replace("Grocery - ", ""),
      value: d.s ?? 0,
      positive: (d.sv ?? 0) >= 0,  // null sv treated as neutral (green)
    }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 55 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
          angle={-35}
          textAnchor="end"
          interval={0}
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: `${C.accent}11` }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.positive ? C.green : C.accent} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
