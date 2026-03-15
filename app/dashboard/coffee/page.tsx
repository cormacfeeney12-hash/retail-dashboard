"use client";

import { useEffect, useState, useMemo } from "react";
import { rds } from "@/lib/rds";
import { C, fmt } from "@/lib/utils";

/* ── Types ── */

interface CoffeeRow {
  name: string;
  lv_code: string;
  l7d_sales: number | null; l7d_qty: number | null; l7d_margin: number | null; l7d_margin_pct: number | null; l7d_waste_pct: number | null; l7d_waste_cups: number | null;
  ly_sales: number | null;  ly_qty: number | null;  ly_margin: number | null;  ly_margin_pct: number | null;  ly_waste_pct: number | null;  ly_waste_cups: number | null;
  ytd_sales: number | null; ytd_qty: number | null; ytd_margin: number | null; ytd_margin_pct: number | null; ytd_waste_pct: number | null; ytd_waste_cups: number | null;
  yd_sales: number | null;  yd_qty: number | null;  yd_margin: number | null;  yd_margin_pct: number | null;  yd_waste_pct: number | null;  yd_waste_cups: number | null;
}

type Period = "yd" | "l7d" | "ytd" | "ly";

const PERIODS: { key: Period; label: string }[] = [
  { key: "yd", label: "Yesterday" },
  { key: "l7d", label: "Last 7 Days" },
  { key: "ytd", label: "YTD" },
  { key: "ly", label: "LY" },
];

/* ── Helpers ── */

const num = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
  return 0;
};

const col = (period: Period, metric: string) => `${period}_${metric}` as keyof CoffeeRow;

/** Normalise margin_pct: stored as decimal 0.48 = 48%. Returns display % */
const normMarginPct = (v: unknown): number => {
  const n = num(v);
  // Stored as decimal (e.g. 0.48), multiply by 100 for display
  return Math.abs(n) <= 1 ? n * 100 : n;
};

/** Clean product name: strip leading article number and trailing pipe content */
const cleanName = (name: string): string =>
  name.replace(/^\d+\s*-\s*/, "").replace(/\|.*$/, "").trim();

const marginColor = (pct: number) => {
  if (pct >= 30) return C.green;
  if (pct >= 20) return C.amber;
  return C.red;
};

const wasteColor = (pct: number) => {
  if (pct <= 10) return C.green;
  if (pct <= 15) return C.amber;
  return C.red;
};

const rowBg = (pct: number): string => {
  if (pct >= 30) return "rgba(25, 135, 84, 0.08)";
  if (pct >= 20) return "rgba(255, 193, 7, 0.08)";
  return "rgba(220, 53, 69, 0.08)";
};

const pillBtn = (active: boolean): React.CSSProperties => {
  const c = active ? C.accent : undefined;
  return {
    padding: "5px 12px", borderRadius: "6px",
    border: `1px solid ${c ?? C.border}`,
    background: c ? `${c}22` : "transparent",
    color: c ?? C.textDim, cursor: "pointer",
    fontSize: "12px", fontWeight: active ? 600 : 400,
    transition: "all 0.15s",
  };
};

/* ── Component ── */

export default function CoffeePage() {
  const [data, setData] = useState<CoffeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("l7d");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: rows, error } = await rds.query<CoffeeRow>(
        "SELECT * FROM fh_coffee WHERE store_number = '2064' ORDER BY name"
      );
      if (error) console.error("F&H Coffee load error:", error);
      // Filter out header rows (name starting with "Article")
      const filtered = (rows || []).filter(
        (r) => r.name && !r.name.toLowerCase().startsWith("article")
      );
      setData(filtered);
      setLoading(false);
    }
    load();
  }, []);

  /* ── KPIs ── */
  const kpis = useMemo(() => {
    const salesKey = col(period, "sales");
    const qtyKey = col(period, "qty");
    const marginKey = col(period, "margin");
    const wasteCupsKey = col(period, "waste_cups");

    let totalSales = 0, totalQty = 0, totalMargin = 0, totalWasteCups = 0;

    for (const r of data) {
      totalSales += num(r[salesKey]);
      totalQty += num(r[qtyKey]);
      totalMargin += num(r[marginKey]);
      totalWasteCups += Math.abs(num(r[wasteCupsKey]));
    }

    // Weighted average margin %: sum(margin) / sum(sales) * 100
    const avgMarginPct = totalSales > 0 ? (totalMargin / totalSales) * 100 : 0;
    // Waste %: sum(abs(waste_cups)) / sum(qty) * 100
    const wastePct = totalQty > 0 ? (totalWasteCups / totalQty) * 100 : 0;

    return { totalSales, totalQty, totalMargin, avgMarginPct, wastePct };
  }, [data, period]);

  /* ── Waste chart data ── */
  const wasteData = useMemo(() => {
    const wasteCupsKey = col(period, "waste_cups");
    const wastePctKey = col(period, "waste_pct");
    return data
      .map((r) => ({
        name: cleanName(r.name),
        cups: Math.abs(num(r[wasteCupsKey])),
        pct: Math.abs(num(r[wastePctKey])) * 100,
      }))
      .filter((d) => d.cups > 0)
      .sort((a, b) => b.cups - a.cups);
  }, [data, period]);

  const maxCups = Math.max(...wasteData.map((d) => d.cups), 1);

  /* ── Table keys ── */
  const salesKey = col(period, "sales");
  const qtyKey = col(period, "qty");
  const marginKey = col(period, "margin");
  const marginPctKey = col(period, "margin_pct");
  const wastePctKey = col(period, "waste_pct");
  const wasteCupsKey = col(period, "waste_cups");

  return (
    <>
      {/* Title */}
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: C.text, margin: "0 0 4px 0" }}>
        F&amp;H Coffee — Forecourt Store 2064
      </h2>
      <p style={{ fontSize: "12px", color: C.textDim, margin: "0 0 20px 0" }}>
        Frank &amp; Honest Drinks To Go
      </p>

      {/* Period toggle */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
        {PERIODS.map((p) => (
          <button key={p.key} onClick={() => setPeriod(p.key)} style={pillBtn(period === p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: C.textDim, fontSize: "13px", padding: "60px 0", textAlign: "center" }}>
          Loading F&amp;H Coffee data...
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Total Sales", value: fmt(kpis.totalSales), accent: C.accent, color: C.text },
              { label: "Total Cups Sold", value: kpis.totalQty.toLocaleString("en-IE"), accent: "#06b6d4", color: C.text },
              { label: "Average Margin %", value: `${kpis.avgMarginPct.toFixed(1)}%`, accent: marginColor(kpis.avgMarginPct), color: marginColor(kpis.avgMarginPct) },
              { label: "Waste % vs 10% Target", value: `${kpis.wastePct.toFixed(1)}%`, accent: wasteColor(kpis.wastePct), color: wasteColor(kpis.wastePct) },
            ].map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  background: C.card, borderRadius: "10px", padding: "20px",
                  borderLeft: `3px solid ${kpi.accent}`,
                }}
              >
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "8px" }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: "24px", fontWeight: 600, color: kpi.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* Waste Chart */}
          <div style={{ background: C.card, borderRadius: "10px", padding: "20px", border: `1px solid ${C.border}`, marginBottom: "24px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>
              Waste Cups by Product
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {wasteData.map((d, i) => (
                <div key={i}>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: C.text, marginBottom: "4px" }}>
                    {d.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ flex: 1, height: "22px", background: C.bg, borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${(d.cups / maxCups) * 100}%`,
                        background: d.pct > 15 ? `${C.red}88` : d.pct > 10 ? `${C.amber}88` : `${C.green}88`,
                        borderRadius: "4px",
                      }}
                    />
                    {/* 10% target line */}
                    <div
                      style={{
                        position: "absolute",
                        left: "10%",
                        top: 0, bottom: 0, width: "2px",
                        background: C.red,
                        borderRight: `1px dashed ${C.red}`,
                        opacity: 0.6,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: C.text, width: "50px", textAlign: "right", flexShrink: 0 }}>
                    {d.cups}
                  </div>
                  <div style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: wasteColor(d.pct), width: "55px", textAlign: "right", flexShrink: 0 }}>
                    {d.pct.toFixed(1)}%
                  </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "8px", fontSize: "11px", color: C.textMuted, display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "12px", height: "2px", background: C.red }} /> 10% waste target
            </div>
          </div>

          {/* Product Table */}
          <div style={{ background: C.card, borderRadius: "10px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ overflowX: "auto", maxHeight: "500px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr>
                    {[
                      { label: "Product Name", align: "left" },
                      { label: "Sales €", align: "right" },
                      { label: "Cups", align: "right" },
                      { label: "Margin €", align: "right" },
                      { label: "Margin %", align: "right" },
                      { label: "Waste %", align: "right" },
                      { label: "Waste Cups", align: "right" },
                    ].map((h) => (
                      <th
                        key={h.label}
                        style={{
                          padding: "10px 12px",
                          textAlign: h.align as "left" | "right",
                          color: C.textDim, fontWeight: 600, fontSize: "11px",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          borderBottom: `2px solid ${C.accent}`,
                          background: C.card, position: "sticky", top: 0, zIndex: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: C.textDim }}>
                        No F&amp;H Coffee data found
                      </td>
                    </tr>
                  ) : (
                    data.map((row, i) => {
                      const mPct = normMarginPct(row[marginPctKey]);
                      const wPctRaw = num(row[wastePctKey]);
                      const wPct = Math.abs(wPctRaw) * 100;
                      const wCups = Math.abs(num(row[wasteCupsKey]));
                      return (
                        <tr key={row.lv_code + i} style={{ background: rowBg(mPct) }}>
                          <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500, maxWidth: "280px" }}>
                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {cleanName(row.name)}
                            </div>
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                            {fmt(row[salesKey] as number | null)}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                            {num(row[qtyKey]).toLocaleString("en-IE")}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                            {fmt(row[marginKey] as number | null)}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: marginColor(mPct) }}>
                            {mPct.toFixed(1)}%
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: wasteColor(wPct) }}>
                            {row[wastePctKey] != null ? `${wPct.toFixed(1)}%` : "—"}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                            {wCups > 0 ? wCups : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
