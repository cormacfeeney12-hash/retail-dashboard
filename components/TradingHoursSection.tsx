"use client";

import type {
  TradingKpis,
  HourlySalesPoint,
  WeeklyTrend16Point,
  TradingDay,
  TradingHour,
  TradingDept,
  TradingSlot,
  Period,
} from "@/lib/types";
import { C, fmt } from "@/lib/utils";
import { KpiCard } from "./ui/KpiCard";
import { HourlySalesChart } from "./charts/HourlySalesChart";
import { WeeklyTrend16Chart } from "./charts/WeeklyTrend16Chart";

interface Props {
  period: Period;
  tradingKpis: TradingKpis;
  hourlySales: HourlySalesPoint[];
  weeklyTrend16: WeeklyTrend16Point[];
  top3Days: TradingDay[];
  bottom3Days: TradingDay[];
  top3Hours: TradingHour[];
  bottom3Hours: TradingHour[];
  top3Depts: TradingDept[];
  bottom3Depts: TradingDept[];
  busiestSlots: TradingSlot[];
  quietestSlots: TradingSlot[];
}

function SlotCard({
  title,
  items,
  color,
}: {
  title: string;
  items: { label: string; sub?: string; value: string }[];
  color: string;
}) {
  return (
    <div
      style={{
        background: C.card,
        borderRadius: "10px",
        padding: "16px",
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${color}`,
        flex: 1,
      }}
    >
      <div style={{ fontSize: "11px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
        {title}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: i < items.length - 1 ? `1px solid ${C.border}44` : undefined,
          }}
        >
          <div>
            <div style={{ fontSize: "13px", color: C.text, fontWeight: 500 }}>{item.label}</div>
            {item.sub && <div style={{ fontSize: "11px", color: C.textDim }}>{item.sub}</div>}
          </div>
          <div style={{ fontSize: "13px", color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TradingHoursSection({
  period,
  tradingKpis,
  hourlySales,
  weeklyTrend16,
  top3Days,
  bottom3Days,
  top3Hours,
  bottom3Hours,
  top3Depts,
  bottom3Depts,
  busiestSlots,
  quietestSlots,
}: Props) {
  // "daily" maps to "ty" (today) in the trading KPIs shape from prototype
  const k = period === "daily" ? "ty" : period as "wtd" | "ytd";
  const trans = tradingKpis.transactions[k];
  const avg = tradingKpis.avgSpend[k];
  const hourly = tradingKpis.hourlySales[k];
  const peakHour = hourlySales.reduce((a, b) => (b.v > a.v ? b : a), hourlySales[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: "8px" }}>
          <span>⏰</span> Trading Hours
        </h2>
        <p style={{ fontSize: "13px", color: C.textDim, marginTop: "4px" }}>
          Hourly performance, trends, and peak trading analysis
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        <KpiCard label="Transactions" value={trans.toLocaleString()} accent={C.cyan} />
        <KpiCard label="Avg Spend" value={`€${avg.toFixed(2)}`} accent={C.cyan} />
        <KpiCard label="Hourly Sales" value={fmt(hourly)} accent={C.cyan} />
        <KpiCard label="Peak Hour YTD" value={peakHour?.h ?? "—"} subtitle={peakHour ? fmt(peakHour.v) : undefined} accent={C.cyan} />
      </div>

      {/* Hourly bar chart */}
      <div style={{ background: C.card, borderRadius: "10px", padding: "20px", border: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Hourly Sales YTD
        </h3>
        <HourlySalesChart data={hourlySales} />
      </div>

      {/* 16-week trend */}
      <div style={{ background: C.card, borderRadius: "10px", padding: "20px", border: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          16-Week Avg Spend &amp; Transactions
        </h3>
        <WeeklyTrend16Chart data={weeklyTrend16} />
      </div>

      {/* Best/Worst days */}
      <div style={{ display: "flex", gap: "16px" }}>
        <SlotCard
          title="Best Trading Days"
          color={C.green}
          items={top3Days.map((d) => ({ label: d.day, sub: d.d, value: fmt(d.v) }))}
        />
        <SlotCard
          title="Worst Trading Days"
          color={C.red}
          items={bottom3Days.map((d) => ({ label: d.day, sub: d.d, value: fmt(d.v) }))}
        />
      </div>

      {/* Best/Worst hours */}
      <div style={{ display: "flex", gap: "16px" }}>
        <SlotCard
          title="Best Trading Hours"
          color={C.green}
          items={top3Hours.map((h) => ({ label: h.h, sub: `${h.day} ${h.d}`, value: fmt(h.v) }))}
        />
        <SlotCard
          title="Worst Trading Hours"
          color={C.red}
          items={bottom3Hours.map((h) => ({ label: h.h, sub: `${h.day} ${h.d}`, value: fmt(h.v) }))}
        />
      </div>

      {/* Top/Bottom departments */}
      <div style={{ display: "flex", gap: "16px" }}>
        <SlotCard
          title="Top 3 Departments"
          color={C.cyan}
          items={top3Depts.map((d) => ({ label: d.n, value: fmt(d.v) }))}
        />
        <SlotCard
          title="Bottom 3 Departments"
          color={C.amber}
          items={bottom3Depts.map((d) => ({ label: d.n, value: fmt(d.v) }))}
        />
      </div>

      {/* Busiest / Quietest slots */}
      <div style={{ display: "flex", gap: "16px" }}>
        <SlotCard
          title="Busiest Slots"
          color={C.accent}
          items={busiestSlots.map((s) => ({ label: `${s.day} ${s.h}`, sub: s.d, value: fmt(s.v) }))}
        />
        <SlotCard
          title="Quietest Slots"
          color={C.textMuted}
          items={quietestSlots.map((s) => ({ label: `${s.day} ${s.h}`, sub: s.d, value: fmt(s.v) }))}
        />
      </div>
    </div>
  );
}
