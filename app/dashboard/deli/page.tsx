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

interface CorrRow {
  name: string;
  lv_code: string;
  subcategory: string;
  period: string;
  day_of_week: string;
  sales: number | null;
  qty: number | null;
  margin: number | null;
  margin_pct: number | null;
  waste_qty: number | null;
  waste_cost: number | null;
}

type Period = "yd" | "l7d" | "ytd" | "ly";
type TabView = "overview" | "patterns";

const PERIODS: { key: Period; label: string }[] = [
  { key: "yd", label: "Yesterday" },
  { key: "l7d", label: "Last 7 Days" },
  { key: "ytd", label: "YTD" },
  { key: "ly", label: "LY" },
];

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

const pillBtn = (active: boolean, color?: string): React.CSSProperties => {
  const c = active ? (color ?? C.accent) : undefined;
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
  const [corrData, setCorrData] = useState<CorrRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [corrLoading, setCorrLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("yd");
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabView>("overview");

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
    async function loadCorr() {
      setCorrLoading(true);
      const { data: rows, error } = await rds.query<CorrRow>(
        "SELECT * FROM deli_wastage_correlation WHERE store_number = '2064'"
      );
      if (error) console.error("Correlation load error:", error);
      setCorrData(rows || []);
      setCorrLoading(false);
    }
    load();
    loadCorr();
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

  /* ══════════════════════════════════════════════════════════════════
     PATTERN RECOGNITION — derived from deli_wastage_correlation
     ══════════════════════════════════════════════════════════════════ */

  /* A) Waste by Day of Week — average waste qty per day, YTD vs LY YTD */
  const wasteByDay = useMemo(() => {
    const ytdMap = new Map<string, { total: number; count: number }>();
    const lyMap = new Map<string, { total: number; count: number }>();
    for (const r of corrData) {
      const wq = num(r.waste_qty);
      const map = r.period === "YTD" ? ytdMap : lyMap;
      const ex = map.get(r.day_of_week);
      if (!ex) map.set(r.day_of_week, { total: wq, count: 1 });
      else { ex.total += wq; ex.count++; }
    }
    return DAYS_ORDER.map((day) => {
      const ytd = ytdMap.get(day);
      const ly = lyMap.get(day);
      return {
        day: day.slice(0, 3),
        dayFull: day,
        ytdAvg: ytd ? ytd.total / ytd.count : 0,
        lyAvg: ly ? ly.total / ly.count : 0,
        ytdTotal: ytd?.total ?? 0,
        lyTotal: ly?.total ?? 0,
      };
    });
  }, [corrData]);

  const maxDayWaste = Math.max(...wasteByDay.flatMap((d) => [d.ytdAvg, d.lyAvg]), 1);

  /* B) YTD vs LY Waste Comparison by product */
  const wasteComparison = useMemo(() => {
    const ytdMap = new Map<string, number>();
    const lyMap = new Map<string, number>();
    const nameMap = new Map<string, string>();
    for (const r of corrData) {
      const key = r.lv_code || r.name;
      const wc = num(r.waste_cost);
      if (r.period === "YTD") ytdMap.set(key, (ytdMap.get(key) ?? 0) + wc);
      else lyMap.set(key, (lyMap.get(key) ?? 0) + wc);
      if (!nameMap.has(key)) nameMap.set(key, cleanName(r.name));
    }
    const rows: { name: string; key: string; ytdCost: number; lyCost: number; change: number; changePct: number }[] = [];
    const allKeys = new Set([...ytdMap.keys(), ...lyMap.keys()]);
    for (const key of allKeys) {
      const ytd = ytdMap.get(key) ?? 0;
      const ly = lyMap.get(key) ?? 0;
      const change = ytd - ly;
      const changePct = ly > 0 ? ((ytd - ly) / ly) * 100 : ytd > 0 ? 100 : 0;
      rows.push({ name: nameMap.get(key) ?? key, key, ytdCost: ytd, lyCost: ly, change, changePct });
    }
    rows.sort((a, b) => b.change - a.change);
    return rows.filter((r) => r.ytdCost > 0 || r.lyCost > 0);
  }, [corrData]);

  /* C) Top Waste Offenders by Day */
  const topByDay = useMemo(() => {
    // Only YTD period
    const dayMap = new Map<string, Map<string, { name: string; wasteCost: number }>>();
    for (const r of corrData) {
      if (r.period !== "YTD") continue;
      if (!dayMap.has(r.day_of_week)) dayMap.set(r.day_of_week, new Map());
      const prodMap = dayMap.get(r.day_of_week)!;
      const key = r.lv_code || r.name;
      const ex = prodMap.get(key);
      const wc = num(r.waste_cost);
      if (!ex) prodMap.set(key, { name: cleanName(r.name), wasteCost: wc });
      else ex.wasteCost += wc;
    }
    return DAYS_ORDER.map((day) => {
      const prodMap = dayMap.get(day);
      if (!prodMap) return { day: day.slice(0, 3), dayFull: day, top3: [] as { name: string; wasteCost: number }[] };
      const sorted = Array.from(prodMap.values()).sort((a, b) => b.wasteCost - a.wasteCost).slice(0, 3);
      return { day: day.slice(0, 3), dayFull: day, top3: sorted };
    });
  }, [corrData]);

  /* D) Margin Alerts — products where YTD margin_pct < LY margin_pct by >3pp */
  const marginAlerts = useMemo(() => {
    // Average margin_pct per product per period
    const ytdMap = new Map<string, { sum: number; count: number; name: string; sub: string }>();
    const lyMap = new Map<string, { sum: number; count: number }>();
    for (const r of corrData) {
      const key = r.lv_code || r.name;
      const mp = num(r.margin_pct);
      if (r.period === "YTD") {
        const ex = ytdMap.get(key);
        if (!ex) ytdMap.set(key, { sum: mp, count: 1, name: cleanName(r.name), sub: r.subcategory });
        else { ex.sum += mp; ex.count++; }
      } else {
        const ex = lyMap.get(key);
        if (!ex) lyMap.set(key, { sum: mp, count: 1 });
        else { ex.sum += mp; ex.count++; }
      }
    }
    const alerts: { name: string; sub: string; ytdPct: number; lyPct: number; drop: number }[] = [];
    for (const [key, ytd] of ytdMap) {
      const ly = lyMap.get(key);
      if (!ly) continue;
      const ytdPct = (ytd.sum / ytd.count) * 100;
      const lyPct = (ly.sum / ly.count) * 100;
      const drop = lyPct - ytdPct;
      if (drop > 3) alerts.push({ name: ytd.name, sub: ytd.sub, ytdPct, lyPct, drop });
    }
    alerts.sort((a, b) => b.drop - a.drop);
    return alerts;
  }, [corrData]);

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

  const thStyle: React.CSSProperties = {
    padding: "10px 12px", color: C.textDim, fontWeight: 600, fontSize: "11px",
    letterSpacing: "0.06em", textTransform: "uppercase",
    borderBottom: `2px solid ${C.accent}`,
    background: C.card, position: "sticky", top: 0, zIndex: 1, whiteSpace: "nowrap",
  };

  return (
    <>
      {/* Title */}
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: C.text, margin: "0 0 4px 0" }}>
        Deli — Forecourt Store 2064
      </h2>
      <p style={{ fontSize: "12px", color: C.textDim, margin: "0 0 20px 0" }}>
        New Deli Report — Food To Go, Bakery &amp; Fresh
      </p>

      {/* Tab toggle: Overview / Pattern Recognition */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
        <button onClick={() => setTab("overview")} style={pillBtn(tab === "overview", "#7C3AED")}>
          Overview
        </button>
        <button onClick={() => setTab("patterns")} style={pillBtn(tab === "patterns", "#f59e0b")}>
          Pattern Recognition
        </button>
        <div style={{ width: "16px" }} />
        {tab === "overview" && PERIODS.map((p) => (
          <button key={p.key} onClick={() => setPeriod(p.key)} style={pillBtn(period === p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
           TAB: OVERVIEW (existing content)
         ═══════════════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <>
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
                      background: "#7C3AED", border: "none", borderRadius: "8px",
                      color: "#fff", cursor: "pointer", padding: "10px 20px",
                      fontSize: "15px", fontWeight: 600, lineHeight: 1,
                      position: "sticky", top: "80px", zIndex: 30,
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
                    background: C.bg, border: `1px solid ${C.border}`, borderRadius: "8px",
                    padding: "6px 12px", fontSize: "13px", color: C.text, outline: "none", width: "220px",
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
                          <th key={h.label} style={{ ...thStyle, textAlign: h.align }}>{h.label}</th>
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
                              style={{ background: rowBg(row.marginPct), cursor: clickable ? "pointer" : undefined, transition: "background 0.1s" }}
                              onMouseEnter={(e) => { if (clickable) (e.currentTarget as HTMLTableRowElement).style.background = C.borderLight; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = rowBg(row.marginPct); }}
                            >
                              <td style={{ padding: "10px 12px", textAlign: "right", color: C.textDim, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</td>
                              <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500, maxWidth: "300px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.name}</div>
                                  {clickable && row.childCount != null && row.childCount > 0 && (
                                    <span style={{ color: C.textMuted, fontSize: "11px", flexShrink: 0 }}>({row.childCount}) ›</span>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(row.sales)}</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{row.qty.toLocaleString("en-IE")}</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(row.margin)}</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: marginColor(row.marginPct) }}>{row.marginPct.toFixed(1)}%</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{row.wasteQty.toLocaleString("en-IE")}</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: row.wastePct > 4 ? C.red : row.wastePct > 0 ? C.amber : C.green }}>{row.wastePct.toFixed(1)}%</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: row.wasteCost > 0 ? C.red : C.green }}>{fmt(row.wasteCost)}</td>
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
                            <div style={{ fontSize: "12px", fontWeight: 500, color: C.text, maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                            <div style={{ fontSize: "10px", color: C.textDim }}>{!selectedSub && r.subcategory}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ flex: 1, height: "20px", background: C.bg, borderRadius: "4px", overflow: "hidden" }}>
                              <div style={{ width: `${barPct}%`, height: "100%", background: `${C.red}88`, borderRadius: "4px", transition: "width 0.3s" }} />
                            </div>
                            <div style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: C.red, width: "70px", textAlign: "right", flexShrink: 0 }}>{fmt(r.wasteCost)}</div>
                            <div style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: C.textDim, width: "40px", textAlign: "right", flexShrink: 0 }}>{r.wasteQty} qty</div>
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
      )}

      {/* ═══════════════════════════════════════════════════════════
           TAB: PATTERN RECOGNITION
         ═══════════════════════════════════════════════════════════ */}
      {tab === "patterns" && (
        <>
          {corrLoading ? (
            <div style={{ color: C.textDim, fontSize: "13px", padding: "60px 0", textAlign: "center" }}>
              Loading pattern data...
            </div>
          ) : (
            <>
              {/* ── A) Waste by Day of Week ── */}
              <div style={{ background: C.card, borderRadius: "10px", padding: "20px", border: `1px solid ${C.border}`, marginBottom: "24px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                  A) Avg Waste Qty by Day of Week
                </h3>
                <p style={{ fontSize: "11px", color: C.textMuted, margin: "0 0 12px 0" }}>
                  Average waste per product per day — YTD vs LY YTD
                </p>
                {/* Legend */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: C.accent }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: C.accent }} /> YTD
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: C.textDim }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: `${C.textDim}66` }} /> LY YTD
                  </div>
                </div>
                {/* Bar chart */}
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "200px" }}>
                  {wasteByDay.map((d, i) => {
                    const ytdH = maxDayWaste > 0 ? (d.ytdAvg / maxDayWaste) * 180 : 0;
                    const lyH = maxDayWaste > 0 ? (d.lyAvg / maxDayWaste) * 180 : 0;
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "180px" }}>
                          <div style={{ width: "18px", height: `${lyH}px`, background: `${C.textDim}66`, borderRadius: "3px 3px 0 0", transition: "height 0.3s" }} title={`LY: ${d.lyAvg.toFixed(1)}`} />
                          <div style={{ width: "18px", height: `${ytdH}px`, background: C.accent, borderRadius: "3px 3px 0 0", transition: "height 0.3s" }} title={`YTD: ${d.ytdAvg.toFixed(1)}`} />
                        </div>
                        <div style={{ fontSize: "10px", color: C.textDim, fontWeight: 600 }}>{d.day}</div>
                        <div style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: C.accent }}>{d.ytdAvg.toFixed(1)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── B) YTD vs LY Waste Comparison ── */}
              <div style={{ background: C.card, borderRadius: "10px", border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: "24px" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                    B) YTD vs LY Waste Cost Comparison
                  </h3>
                  <p style={{ fontSize: "11px", color: C.textMuted, margin: 0 }}>
                    Products where waste cost has increased &gt;20% highlighted in red
                  </p>
                </div>
                <div style={{ overflowX: "auto", maxHeight: "500px", overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr>
                        {["#", "Product", "YTD Waste €", "LY YTD Waste €", "Change €", "Change %"].map((h, hi) => (
                          <th key={h} style={{ ...thStyle, textAlign: hi < 2 ? "left" : "right" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {wasteComparison.slice(0, 50).map((r, i) => {
                        const bad = r.changePct > 20;
                        return (
                          <tr key={r.key + i} style={{ background: bad ? "rgba(220, 53, 69, 0.06)" : i % 2 === 0 ? C.bg : C.card }}>
                            <td style={{ padding: "8px 12px", color: C.textDim, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</td>
                            <td style={{ padding: "8px 12px", color: C.text, fontWeight: 500, maxWidth: "250px" }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: r.ytdCost > 0 ? C.red : C.text }}>{fmt(r.ytdCost)}</td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: C.textDim }}>{fmt(r.lyCost)}</td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: r.change > 0 ? C.red : C.green }}>
                              {r.change > 0 ? "+" : ""}{fmt(r.change)}
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: r.changePct > 20 ? C.red : r.changePct > 0 ? C.amber : C.green }}>
                              {r.changePct > 0 ? "+" : ""}{r.changePct.toFixed(0)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── C) Top Waste Offenders by Day ── */}
              <div style={{ background: C.card, borderRadius: "10px", padding: "20px", border: `1px solid ${C.border}`, marginBottom: "24px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                  C) Top 3 Waste Offenders by Day
                </h3>
                <p style={{ fontSize: "11px", color: C.textMuted, margin: "0 0 16px 0" }}>
                  Highest waste cost products for each day of the week (YTD)
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                  {topByDay.map((d) => (
                    <div key={d.dayFull} style={{ background: C.bg, borderRadius: "8px", padding: "12px 10px", border: `1px solid ${C.border}`, borderTop: `2px solid ${C.red}` }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: C.text, marginBottom: "10px", textAlign: "center" }}>{d.day}</div>
                      {d.top3.length === 0 ? (
                        <div style={{ fontSize: "10px", color: C.textMuted, textAlign: "center" }}>No data</div>
                      ) : (
                        d.top3.map((p, pi) => (
                          <div key={pi} style={{ marginBottom: pi < 2 ? "8px" : 0 }}>
                            <div style={{ fontSize: "10px", color: C.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>
                              {pi + 1}. {p.name}
                            </div>
                            <div style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: C.red }}>
                              {fmt(p.wasteCost)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── D) Margin Trend Alerts ── */}
              {marginAlerts.length > 0 && (
                <div style={{ background: C.card, borderRadius: "10px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.amber, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                      D) Margin Drop Alerts — YTD vs LY YTD
                    </h3>
                    <p style={{ fontSize: "11px", color: C.textMuted, margin: 0 }}>
                      Products where YTD margin % is more than 3pp below LY YTD — may have pricing or cost issues ({marginAlerts.length} flagged)
                    </p>
                  </div>
                  <div style={{ overflowX: "auto", maxHeight: "500px", overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr>
                          {["#", "Product", "Subcategory", "LY Margin %", "YTD Margin %", "Drop"].map((h, hi) => (
                            <th key={h} style={{ ...thStyle, borderBottomColor: C.amber, textAlign: hi < 3 ? "left" : "right" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {marginAlerts.map((a, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? C.bg : C.card }}>
                            <td style={{ padding: "8px 12px", color: C.textDim, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</td>
                            <td style={{ padding: "8px 12px", color: C.text, fontWeight: 500, maxWidth: "220px" }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</div>
                            </td>
                            <td style={{ padding: "8px 12px", color: C.textDim, fontSize: "11px", maxWidth: "180px" }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.sub}</div>
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: marginColor(a.lyPct) }}>{a.lyPct.toFixed(1)}%</td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: marginColor(a.ytdPct) }}>{a.ytdPct.toFixed(1)}%</td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: C.red }}>-{a.drop.toFixed(1)}pp</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
