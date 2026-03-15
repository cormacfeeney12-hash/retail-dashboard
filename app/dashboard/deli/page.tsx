"use client";

import { useEffect, useState, useMemo } from "react";
import { rds } from "@/lib/rds";
import { C, fmt } from "@/lib/utils";

/* ── Types ── */

interface DeliRow {
  name: string;
  lv_code: string;
  subcategory: string;
  l7d_sales: number | null; l7d_qty: number | null; l7d_margin: number | null; l7d_margin_pct: number | null; l7d_waste_qty: number | null; l7d_waste_cost: number | null;
  ly_sales: number | null;  ly_qty: number | null;  ly_margin: number | null;  ly_margin_pct: number | null;  ly_waste_qty: number | null;  ly_waste_cost: number | null;
  ytd_sales: number | null; ytd_qty: number | null; ytd_margin: number | null; ytd_margin_pct: number | null; ytd_waste_qty: number | null; ytd_waste_cost: number | null;
  yd_sales: number | null;  yd_qty: number | null;  yd_margin: number | null;  yd_margin_pct: number | null;  yd_waste_qty: number | null;  yd_waste_cost: number | null;
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

const col = (period: Period, metric: string) => `${period}_${metric}` as keyof DeliRow;

const marginColor = (pct: number) => {
  if (pct >= 30) return C.green;
  if (pct >= 20) return C.amber;
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

const cleanName = (name: string): string =>
  name.replace(/^\d+\s*-\s*/, "").replace(/\|.*$/, "").trim();

interface AggRow {
  name: string;
  sales: number;
  qty: number;
  margin: number;
  marginPct: number;
  wasteQty: number;
  wastePct: number;
  wasteCost: number;
  childCount?: number;
}

/* ── Component ── */

export default function DeliPage() {
  const [data, setData] = useState<DeliRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("yd");
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: rows, error } = await rds.query<DeliRow>(
        "SELECT * FROM deli_report WHERE store_number = '2064' ORDER BY subcategory, name"
      );
      if (error) console.error("Deli load error:", error);
      setData((rows || []).filter((r) => r.name && !r.name.toLowerCase().startsWith("article")));
      setLoading(false);
    }
    load();
  }, []);

  /* ── Period column keys ── */
  const sK = col(period, "sales");
  const qK = col(period, "qty");
  const mK = col(period, "margin");
  const wqK = col(period, "waste_qty");
  const wcK = col(period, "waste_cost");

  /* ── KPIs ── */
  const kpis = useMemo(() => {
    let sales = 0, qty = 0, margin = 0, wasteQty = 0, wasteCost = 0;
    const rows = selectedSub ? data.filter((r) => r.subcategory === selectedSub) : data;
    for (const r of rows) {
      sales += num(r[sK]); qty += num(r[qK]); margin += num(r[mK]);
      wasteQty += num(r[wqK]); wasteCost += num(r[wcK]);
    }
    const marginPct = sales > 0 ? (margin / sales) * 100 : 0;
    return { sales, qty, margin, marginPct, wasteQty, wasteCost };
  }, [data, period, selectedSub, sK, qK, mK, wqK, wcK]);

  /* ── Subcategory aggregation ── */
  const subcatRows = useMemo(() => {
    const map = new Map<string, { sales: number; qty: number; margin: number; wasteQty: number; wasteCost: number; count: number }>();
    for (const r of data) {
      const key = r.subcategory || "Other";
      const ex = map.get(key);
      const s = num(r[sK]), q = num(r[qK]), m = num(r[mK]), wq = num(r[wqK]), wc = num(r[wcK]);
      if (!ex) {
        map.set(key, { sales: s, qty: q, margin: m, wasteQty: wq, wasteCost: wc, count: 1 });
      } else {
        ex.sales += s; ex.qty += q; ex.margin += m; ex.wasteQty += wq; ex.wasteCost += wc; ex.count++;
      }
    }
    let rows: AggRow[] = Array.from(map.entries()).map(([name, v]) => ({
      name,
      sales: v.sales,
      qty: v.qty,
      margin: v.margin,
      marginPct: v.sales > 0 ? (v.margin / v.sales) * 100 : 0,
      wasteQty: v.wasteQty,
      wastePct: v.qty > 0 ? (v.wasteQty / v.qty) * 100 : 0,
      wasteCost: v.wasteCost,
      childCount: v.count,
    }));
    if (search && !selectedSub) {
      const words = search.toLowerCase().split(/\s+/).filter(Boolean);
      rows = rows.filter((r) => words.every((w) => r.name.toLowerCase().includes(w)));
    }
    rows.sort((a, b) => b.margin - a.margin);
    return rows;
  }, [data, period, search, selectedSub, sK, qK, mK, wqK, wcK]);

  /* ── Product-level rows for selected subcategory ── */
  const productRows = useMemo(() => {
    if (!selectedSub) return [];
    let rows = data.filter((r) => r.subcategory === selectedSub);
    if (search) {
      const words = search.toLowerCase().split(/\s+/).filter(Boolean);
      rows = rows.filter((r) => words.every((w) => cleanName(r.name).toLowerCase().includes(w)));
    }
    const mapped: AggRow[] = rows.map((r) => {
      const s = num(r[sK]), q = num(r[qK]), m = num(r[mK]), wq = num(r[wqK]), wc = num(r[wcK]);
      return {
        name: cleanName(r.name),
        sales: s, qty: q, margin: m,
        marginPct: s > 0 ? (m / s) * 100 : 0,
        wasteQty: wq,
        wastePct: q > 0 ? (wq / q) * 100 : 0,
        wasteCost: wc,
      };
    });
    mapped.sort((a, b) => b.margin - a.margin);
    return mapped;
  }, [data, selectedSub, search, period, sK, qK, mK, wqK, wcK]);

  const displayRows = selectedSub ? productRows : subcatRows;
  const levelLabel = selectedSub ? "Product" : "Subcategory";

  /* ── Wastage impact (top products by waste cost) ── */
  const wasteImpact = useMemo(() => {
    const rows = (selectedSub ? data.filter((r) => r.subcategory === selectedSub) : data)
      .map((r) => ({
        name: cleanName(r.name),
        subcategory: r.subcategory,
        wasteCost: num(r[wcK]),
        wasteQty: num(r[wqK]),
        qty: num(r[qK]),
      }))
      .filter((r) => r.wasteCost > 0)
      .sort((a, b) => b.wasteCost - a.wasteCost)
      .slice(0, 10);
    return rows;
  }, [data, selectedSub, period, wcK, wqK, qK]);

  const maxWasteCost = Math.max(...wasteImpact.map((r) => r.wasteCost), 1);

  /* ── Table header columns ── */
  const headers = [
    { label: "#", align: "right" as const },
    { label: levelLabel, align: "left" as const },
    { label: "Sales €", align: "right" as const },
    { label: "Qty", align: "right" as const },
    { label: "Margin €", align: "right" as const },
    { label: "Margin %", align: "right" as const },
    { label: "Waste Qty", align: "right" as const },
    { label: "Waste %", align: "right" as const },
    { label: "Waste Cost €", align: "right" as const },
  ];

  return (
    <>
      {/* Title */}
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: C.text, margin: "0 0 4px 0" }}>
        Deli — Forecourt Store 2064
      </h2>
      <p style={{ fontSize: "12px", color: C.textDim, margin: "0 0 20px 0" }}>
        New Deli Report — Food To Go, Bakery &amp; Fresh
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
          Loading Deli data...
        </div>
      ) : (
        <>
          {/* KPI Boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Total Sales", value: fmt(kpis.sales), accent: C.accent },
              { label: "Total Qty", value: kpis.qty.toLocaleString("en-IE"), accent: C.cyan },
              { label: "Total Margin", value: fmt(kpis.margin), accent: C.amber },
              { label: "Avg Margin %", value: `${kpis.marginPct.toFixed(1)}%`, accent: marginColor(kpis.marginPct), color: marginColor(kpis.marginPct) },
              { label: "Total Waste Qty", value: kpis.wasteQty.toLocaleString("en-IE"), accent: C.red },
              { label: "Total Waste Cost", value: fmt(kpis.wasteCost), accent: C.red, color: kpis.wasteCost > 0 ? C.red : C.green },
            ].map((k) => (
              <div
                key={k.label}
                style={{
                  background: C.card,
                  borderRadius: "8px",
                  padding: "14px 16px",
                  border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${k.accent}`,
                }}
              >
                <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "6px" }}>
                  {k.label}
                </div>
                <div style={{ fontSize: "20px", fontWeight: 600, color: k.color ?? C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                  {k.value}
                </div>
              </div>
            ))}
          </div>

          {/* Back button + search */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            {selectedSub && (
              <button
                onClick={() => { setSelectedSub(null); setSearch(""); }}
                style={{
                  background: "#7C3AED",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "10px 20px",
                  fontSize: "15px",
                  fontWeight: 600,
                  lineHeight: 1,
                  position: "sticky",
                  top: "80px",
                  zIndex: 30,
                }}
              >
                &#8592; Back
              </button>
            )}
            <div style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>
              {selectedSub ? selectedSub : "All Subcategories"}
            </div>
            <div style={{ flex: 1 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${levelLabel.toLowerCase()}s\u2026`}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "13px",
                color: C.text,
                outline: "none",
                width: "220px",
              }}
            />
          </div>

          {/* Data Table */}
          <div style={{ background: C.card, borderRadius: "10px", border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: "24px" }}>
            <div style={{ overflowX: "auto", maxHeight: "600px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr>
                    {headers.map((h) => (
                      <th
                        key={h.label}
                        style={{
                          padding: "10px 12px",
                          textAlign: h.align,
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
                  {displayRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: C.textDim }}>
                        No data found
                      </td>
                    </tr>
                  ) : (
                    displayRows.map((row, i) => {
                      const clickable = !selectedSub;
                      return (
                        <tr
                          key={row.name + i}
                          onClick={() => clickable && setSelectedSub(row.name)}
                          style={{
                            background: rowBg(row.marginPct),
                            cursor: clickable ? "pointer" : undefined,
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) => { if (clickable) (e.currentTarget as HTMLTableRowElement).style.background = C.borderLight; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = rowBg(row.marginPct); }}
                        >
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.textDim, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
                            {i + 1}
                          </td>
                          <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500, maxWidth: "300px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {row.name}
                              </div>
                              {clickable && row.childCount != null && row.childCount > 0 && (
                                <span style={{ color: C.textMuted, fontSize: "11px", flexShrink: 0 }}>
                                  ({row.childCount}) ›
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                            {fmt(row.sales)}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                            {row.qty.toLocaleString("en-IE")}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                            {fmt(row.margin)}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: marginColor(row.marginPct) }}>
                            {row.marginPct.toFixed(1)}%
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                            {row.wasteQty.toLocaleString("en-IE")}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: row.wastePct > 4 ? C.red : row.wastePct > 0 ? C.amber : C.green }}>
                            {row.wastePct.toFixed(1)}%
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: row.wasteCost > 0 ? C.red : C.green }}>
                            {fmt(row.wasteCost)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wastage Impact Section */}
          {wasteImpact.length > 0 && (
            <div style={{ background: C.card, borderRadius: "10px", padding: "20px", border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                Top Wastage Impact — By Cost
              </h3>
              <p style={{ fontSize: "11px", color: C.textMuted, margin: "0 0 16px 0" }}>
                Products ranked by waste cost impact
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {wasteImpact.map((r, i) => {
                  const barPct = (r.wasteCost / maxWasteCost) * 100;
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 500, color: C.text, maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.name}
                        </div>
                        <div style={{ fontSize: "10px", color: C.textDim }}>
                          {!selectedSub && r.subcategory}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "20px", background: C.bg, borderRadius: "4px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${barPct}%`,
                              height: "100%",
                              background: `${C.red}88`,
                              borderRadius: "4px",
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: C.red, width: "70px", textAlign: "right", flexShrink: 0 }}>
                          {fmt(r.wasteCost)}
                        </div>
                        <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: C.textDim, width: "40px", textAlign: "right", flexShrink: 0 }}>
                          {r.wasteQty} qty
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
