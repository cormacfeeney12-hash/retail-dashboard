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
import type { HourlySalesPoint } from "@/lib/types";
import { C } from "@/lib/utils";

interface Props {
  data: HourlySalesPoint[];
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
      <div style={{ color: C.textDim, marginBottom: "4px" }}>{label}</div>
      <div style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
        €{(payload[0].value as number).toLocaleString("en-IE", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}

export function HourlySalesChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.v), 1);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis
          dataKey="h"
          tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: `${C.cyan}11` }} />
        <Bar dataKey="v" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => {
            const intensity = entry.v / max;
            return (
              <Cell
                key={i}
                fill={`rgba(6, 182, 212, ${0.25 + intensity * 0.75})`}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
