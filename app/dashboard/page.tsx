"use client";

import { useState } from "react";
import { SAMPLE_DATA } from "@/lib/sample-data";
import { KpiCard } from "@/components/ui/KpiCard";
import { PeriodTabs } from "@/components/ui/PeriodTabs";
import { WeeklyTrendChart } from "@/components/charts/WeeklyTrendChart";
import { DeptBarChart } from "@/components/charts/DeptBarChart";
import { AiChat } from "@/components/AiChat";
import { CpuAlerts } from "@/components/CpuAlerts";
import { C, fmt, fmtK, fmtPct } from "@/lib/utils";
import type { Period } from "@/lib/types";

const { summary, footfall, weeklyTrend, departments } = SAMPLE_DATA;

export default function OverviewPage() {
  const [period, setPeriod] = useState<Period>("daily");

  const d = summary[period];
  const ff = footfall[period];

  const isYtd = period === "ytd";
  const salesValue = isYtd ? fmtK(d.retailSales) : fmt(d.retailSales);

  return (
    <>
      {/* Period toggle */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <PeriodTabs active={period} onChange={setPeriod} />
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
        <KpiCard
          label="Retail Sales"
          value={salesValue}
          variancePct={d.retailSalesVarPct}
          subtitle={`LY: ${isYtd ? fmtK(d.retailSalesLY) : fmt(d.retailSalesLY)}`}
          accent={C.accent}
        />
        <KpiCard
          label="Scan Margin %"
          value={`${(d.scanMargin * 100).toFixed(2)}%`}
          variancePct={d.scanMarginVar}
          subtitle={`LY: ${(d.scanMarginLY * 100).toFixed(2)}%`}
          accent={C.accent}
        />
        <KpiCard
          label="Waste"
          value={fmt(d.waste)}
          variancePct={d.wasteVarPct}
          invert
          subtitle={`LY: ${fmt(d.wasteLY)}`}
          accent={C.accent}
        />
        <KpiCard
          label="Transactions"
          value="—"
          variancePct={ff.transVar}
          subtitle={`vs LY: ${fmtPct(ff.transVar)}`}
          accent={C.accent}
        />
        <KpiCard
          label="Avg Spend"
          value="—"
          variancePct={ff.avgSpendVar}
          subtitle={`vs LY: ${fmtPct(ff.avgSpendVar)}`}
          accent={C.accent}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "20px",
            border: `1px solid ${C.border}`,
          }}
        >
          <h3
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: C.textDim,
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Weekly Sales Trend — Last 4 Weeks
          </h3>
          <WeeklyTrendChart data={weeklyTrend} />
        </div>

        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "20px",
            border: `1px solid ${C.border}`,
          }}
        >
          <h3
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: C.textDim,
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Top 8 Departments — Weekly Sales
          </h3>
          <DeptBarChart data={departments} />
        </div>
      </div>

      {/* CPU Price Alerts */}
      <CpuAlerts />

      {/* Footer */}
      <div
        style={{
          marginTop: "40px",
          fontSize: "12px",
          color: C.textMuted,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Source: Pyramid Analytics</span>
        <span>Retail Dashboard v1 — AI Powered</span>
      </div>

      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
