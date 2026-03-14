"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { rds } from "@/lib/rds";
import { C, fmt } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Row {
  store_number: string;
  name: string;
  lv_code: string;
  category: string;
  subcategory: string;
  yd_sales: number | null;
  yd_qty: number | null;
  yd_margin: number | null;
  yd_margin_pct: number | null;
  l7d_sales: number | null;
  l7d_qty: number | null;
  l7d_margin: number | null;
  l7d_margin_pct: number | null;
  ytd_sales: number | null;
  ytd_qty: number | null;
  ytd_margin: number | null;
  ytd_margin_pct: number | null;
  ly_sales: number | null;
  ly_qty: number | null;
  ly_margin: number | null;
  ly_margin_pct: number | null;
}

interface Alert {
  name: string;
  lvCode: string;
  category: string;
  subcategory: string;
  currentPct: number;
  comparisonPct: number;
  dropPp: number;
  qty: number;
  impact: number;
}

type StoreFilter = "2064" | "2056" | "both";
type Comparison = "yd_ytd" | "l7d_ytd" | "yd_ly";

const COMPARISONS: { key: Comparison; label: string }[] = [
  { key: "yd_ytd", label: "Yesterday vs YTD" },
  { key: "l7d_ytd", label: "Last 7 Days vs YTD" },
  { key: "yd_ly", label: "Yesterday vs Same Day LY" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const num = (v: unknown): number => (typeof v === "number" ? v : 0);
const fmtQty = (v: number) => v.toLocaleString("en-IE");

const marginColor = (pct: number) => {
  if (pct >= 30) return C.green;
  if (pct >= 20) return C.amber;
  return C.red;
};

const pillBtn = (active: boolean): React.CSSProperties => ({
  padding: "5px 12px",
  borderRadius: "6px",
  border: `1px solid ${active ? C.accent : C.border}`,
  background: active ? `${C.accent}22` : "transparent",
  color: active ? C.accent : C.textDim,
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: active ? 600 : 400,
  transition: "all 0.15s",
});

const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  color: C.textDim,
  fontWeight: 600,
  fontSize: "11px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  borderBottom: `1px solid ${C.border}`,
  background: C.card,
  position: "sticky",
  top: 0,
  zIndex: 1,
  whiteSpace: "nowrap",
};

/* ------------------------------------------------------------------ */
/*  Comparison config                                                  */
/* ------------------------------------------------------------------ */

function getKeys(comp: Comparison) {
  switch (comp) {
    case "yd_ytd":
      return {
        curSales: "yd_sales" as keyof Row,
        curMargin: "yd_margin" as keyof Row,
        curPct: "yd_margin_pct" as keyof Row,
        curQty: "yd_qty" as keyof Row,
        cmpPct: "ytd_margin_pct" as keyof Row,
        curLabel: "Yesterday",
        cmpLabel: "YTD",
      };
    case "l7d_ytd":
      return {
        curSales: "l7d_sales" as keyof Row,
        curMargin: "l7d_margin" as keyof Row,
        curPct: "l7d_margin_pct" as keyof Row,
        curQty: "l7d_qty" as keyof Row,
        cmpPct: "ytd_margin_pct" as keyof Row,
        curLabel: "Last 7 Days",
        cmpLabel: "YTD",
      };
    case "yd_ly":
      return {
        curSales: "yd_sales" as keyof Row,
        curMargin: "yd_margin" as keyof Row,
        curPct: "yd_margin_pct" as keyof Row,
        curQty: "yd_qty" as keyof Row,
        cmpPct: "ly_margin_pct" as keyof Row,
        curLabel: "Yesterday",
        cmpLabel: "Same Day LY",
      };
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MarginAlertsPage() {
  const [rawData, setRawData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<StoreFilter>("2064");
  const [comparison, setComparison] = useState<Comparison>("l7d_ytd");

  /* ---------- Fetch ---------- */

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await rds.query<Row>(
        "SELECT store_number,name,lv_code,category,subcategory,yd_sales,yd_qty,yd_margin,yd_margin_pct,l7d_sales,l7d_qty,l7d_margin,l7d_margin_pct,ytd_sales,ytd_qty,ytd_margin,ytd_margin_pct,ly_sales,ly_qty,ly_margin,ly_margin_pct FROM top_sellers"
      );
      if (error) console.error("Margin alerts fetch error:", error);
      setRawData(data || []);
      setLoading(false);
    }
    load();
  }, []);

  /* ---------- Filter by store ---------- */

  const storeData = useMemo(() => {
    if (store === "both") return rawData;
    return rawData.filter((r) => r.store_number === store);
  }, [rawData, store]);

  /* ---------- Build alerts ---------- */

  const keys = getKeys(comparison);

  const alerts = useMemo(() => {
    const result: Alert[] = [];
    for (const r of storeData) {
      const curPctRaw = num(r[keys.curPct]);
      const cmpPctRaw = num(r[keys.cmpPct]);
      const curSales = num(r[keys.curSales]);
      const curMargin = num(r[keys.curMargin]);
      const curQty = num(r[keys.curQty]);

      if (curSales <= 0 || cmpPctRaw <= 0) continue;

      const curPct = curPctRaw * 100;
      const cmpPct = cmpPctRaw * 100;
      const dropPp = cmpPct - curPct;

      if (dropPp > 3) {
        const expectedMargin = curSales * cmpPctRaw;
        const impact = expectedMargin - curMargin;
        result.push({
          name: r.name,
          lvCode: r.lv_code,
          category: r.category,
          subcategory: r.subcategory,
          currentPct: curPct,
          comparisonPct: cmpPct,
          dropPp,
          qty: curQty,
          impact,
        });
      }
    }
    result.sort((a, b) => b.impact - a.impact);
    return result;
  }, [storeData, keys]);

  /* ---------- Summary ---------- */

  const summary = useMemo(() => {
    let totalImpact = 0;
    for (const a of alerts) totalImpact += a.impact;

    // Overall store margin change
    let curSalesTotal = 0, curMarginTotal = 0, cmpSalesTotal = 0, cmpMarginTotal = 0;
    // For comparison period sales, use the appropriate keys
    const cmpSalesKey = comparison === "yd_ly" ? "ly_sales" as keyof Row : "ytd_sales" as keyof Row;
    const cmpMarginKey = comparison === "yd_ly" ? "ly_margin" as keyof Row : "ytd_margin" as keyof Row;

    for (const r of storeData) {
      curSalesTotal += num(r[keys.curSales]);
      curMarginTotal += num(r[keys.curMargin]);
      cmpSalesTotal += num(r[cmpSalesKey]);
      cmpMarginTotal += num(r[cmpMarginKey]);
    }

    const curOverallPct = curSalesTotal !== 0 ? (curMarginTotal / curSalesTotal) * 100 : 0;
    const cmpOverallPct = cmpSalesTotal !== 0 ? (cmpMarginTotal / cmpSalesTotal) * 100 : 0;
    const changePp = curOverallPct - cmpOverallPct;

    const top5 = alerts.slice(0, 5);

    return { totalImpact, curOverallPct, cmpOverallPct, changePp, flaggedCount: alerts.length, top5 };
  }, [alerts, storeData, keys, comparison]);

  /* ---------- Export ---------- */

  const handleExport = useCallback(async () => {
    const XLSX = await import("xlsx");
    const rows = alerts.map((a) => ({
      "Product Name": a.name,
      "LV Code": a.lvCode,
      Category: a.category,
      Subcategory: a.subcategory,
      [`${keys.curLabel} Margin %`]: `${a.currentPct.toFixed(1)}%`,
      [`${keys.cmpLabel} Margin %`]: `${a.comparisonPct.toFixed(1)}%`,
      "Drop pp": `-${a.dropPp.toFixed(1)}`,
      "Units Sold": a.qty,
      "Impact": a.impact.toFixed(2),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Margin Alerts");
    XLSX.writeFile(wb, `margin_alerts_${store}.xlsx`);
  }, [alerts, store, keys]);

  /* ---------- Render ---------- */

  return (
    <div
      style={{
        background: C.card,
        borderRadius: "10px",
        border: `1px solid ${C.border}`,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.text, margin: 0 }}>
              Margin Alerts
            </h2>
            <p style={{ fontSize: "12px", color: C.textDim, margin: "2px 0 0" }}>
              Products where margin % has dropped more than 3pp vs comparison period
            </p>
          </div>
          <button
            onClick={handleExport}
            style={{ ...pillBtn(false), display: "flex", alignItems: "center", gap: "4px" }}
          >
            <span style={{ fontSize: "14px" }}>&#8595;</span> Export Excel
          </button>
        </div>

        {/* Store + Comparison toggles */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            {(
              [
                { key: "2064" as StoreFilter, label: "2064" },
                { key: "2056" as StoreFilter, label: "2056" },
                { key: "both" as StoreFilter, label: "Both Stores" },
              ] as const
            ).map((s) => (
              <button key={s.key} onClick={() => setStore(s.key)} style={pillBtn(store === s.key)}>
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ width: "1px", height: "20px", background: C.border }} />

          <div style={{ display: "flex", gap: "2px" }}>
            {COMPARISONS.map((c) => (
              <button key={c.key} onClick={() => setComparison(c.key)} style={pillBtn(comparison === c.key)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary boxes */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: C.textDim, fontSize: "13px" }}>
          Loading margin alerts...
        </div>
      ) : (
        <>
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${C.border}`,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
            }}
          >
            {/* Total impact */}
            <div style={{ background: C.bg, borderRadius: "8px", padding: "16px 20px", borderLeft: `3px solid ${C.red}` }}>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "8px" }}>
                Estimated Margin Impact
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                -{fmt(Math.abs(summary.totalImpact))}
              </div>
              <div style={{ fontSize: "11px", color: C.textDim, marginTop: "4px" }}>
                vs {keys.cmpLabel} average
              </div>
            </div>

            {/* Overall margin change */}
            <div style={{ background: C.bg, borderRadius: "8px", padding: "16px 20px", borderLeft: `3px solid ${summary.changePp >= 0 ? C.green : C.red}` }}>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "8px" }}>
                Overall Margin % Change
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: summary.changePp >= 0 ? C.green : C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                {summary.changePp >= 0 ? "▲" : "▼"} {Math.abs(summary.changePp).toFixed(2)}pp
              </div>
              <div style={{ fontSize: "11px", color: C.textDim, marginTop: "4px" }}>
                {keys.curLabel}: {summary.curOverallPct.toFixed(2)}% — {keys.cmpLabel}: {summary.cmpOverallPct.toFixed(2)}%
              </div>
            </div>

            {/* Products flagged */}
            <div style={{ background: C.bg, borderRadius: "8px", padding: "16px 20px", borderLeft: `3px solid ${C.amber}` }}>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "8px" }}>
                Products Flagged
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: C.amber, fontFamily: "'JetBrains Mono', monospace" }}>
                {summary.flaggedCount}
              </div>
              <div style={{ fontSize: "11px", color: C.textDim, marginTop: "4px" }}>
                margin dropped &gt;3pp vs {keys.cmpLabel}
              </div>
            </div>
          </div>

          {/* Top 5 impacted products */}
          {summary.top5.length > 0 && (
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", color: C.textDim, textTransform: "uppercase", marginBottom: "12px" }}>
                Top 5 Most Impacted Products
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(summary.top5.length, 5)}, 1fr)`, gap: "10px" }}>
                {summary.top5.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.bg,
                      borderRadius: "8px",
                      padding: "14px 16px",
                      border: `1px solid ${C.border}`,
                      borderTop: `2px solid ${C.red}`,
                    }}
                  >
                    <div style={{ fontSize: "12px", color: C.text, fontWeight: 500, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.name}
                    </div>
                    <div style={{ fontSize: "11px", color: C.textDim, fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>
                      {a.lvCode}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", color: C.textDim }}>Drop</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                        -{a.dropPp.toFixed(1)}pp
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", color: C.textDim }}>Units</span>
                      <span style={{ fontSize: "12px", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                        {fmtQty(a.qty)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "11px", color: C.textDim }}>Impact</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                        -{fmt(Math.abs(a.impact))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full table */}
          <div style={{ overflowX: "auto", maxHeight: "600px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {[
                    { label: "#", align: "right" },
                    { label: "Product Name", align: "left" },
                    { label: "LV Code", align: "left" },
                    { label: "Category", align: "left" },
                    { label: "Subcategory", align: "left" },
                    { label: `${keys.curLabel} %`, align: "right" },
                    { label: `${keys.cmpLabel} %`, align: "right" },
                    { label: "Drop", align: "right" },
                    { label: "Units Sold", align: "right" },
                    { label: "€ Impact", align: "right" },
                  ].map((h) => (
                    <th key={h.label} style={{ ...thStyle, textAlign: h.align as "left" | "right" }}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "40px", color: C.textDim }}>
                      No products flagged for this comparison
                    </td>
                  </tr>
                ) : (
                  alerts.map((a, i) => (
                    <tr key={a.lvCode + i} style={{ background: i % 2 === 0 ? C.bg : C.card }}>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: C.textDim, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500, maxWidth: "250px" }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.name}
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", color: C.textDim, fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
                        {a.lvCode}
                      </td>
                      <td style={{ padding: "10px 12px", color: C.textDim, fontSize: "12px", maxWidth: "160px" }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.category?.replace(/^[A-Z]\d+\s*-\s*/, "")}
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", color: C.textDim, fontSize: "12px", maxWidth: "160px" }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.subcategory?.replace(/^[A-Z]\d+\s*-\s*/, "")}
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: marginColor(a.currentPct) }}>
                        {a.currentPct.toFixed(1)}%
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: marginColor(a.comparisonPct) }}>
                        {a.comparisonPct.toFixed(1)}%
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: C.red }}>
                        -{a.dropPp.toFixed(1)}pp
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                        {fmtQty(a.qty)}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: C.red }}>
                        -{fmt(Math.abs(a.impact))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
