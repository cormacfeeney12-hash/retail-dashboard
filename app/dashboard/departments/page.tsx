"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { rds } from "@/lib/rds";
import { SAMPLE_DATA } from "@/lib/sample-data";
import { AiChat } from "@/components/AiChat";
import { C, fmt } from "@/lib/utils";
import { STORE_LABELS, STORE_COLORS } from "@/components/DashboardNav";
import { useStore, type StoreFilter } from "@/contexts/StoreContext";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TopSellerRow {
  store_number: string;
  name: string;
  lv_code: string;
  category: string;
  category_code: string;
  subcategory: string;
  l7d_sales: number | null;
  l7d_qty: number | null;
  l7d_margin: number | null;
  l7d_margin_pct: number | null;
  ly_sales: number | null;
  ly_qty: number | null;
  ly_margin: number | null;
  ly_margin_pct: number | null;
  ytd_sales: number | null;
  ytd_qty: number | null;
  ytd_margin: number | null;
  ytd_margin_pct: number | null;
  yd_sales: number | null;
  yd_qty: number | null;
  yd_margin: number | null;
  yd_margin_pct: number | null;
}

interface AggRow {
  name: string;
  code: string;
  sales: number;
  qty: number;
  margin: number;
  marginPct: number;
  childCount?: number;
}

interface MarginAlert {
  name: string;
  lvCode: string;
  category: string;
  l7dMarginPct: number;
  ytdMarginPct: number;
  dropPct: number;
  qty: number;
  marginImpact: number;
}

type Period = "yd" | "l7d" | "ytd" | "ly";
type DrillLevel = "category" | "subcategory" | "product";

const PERIODS: { key: Period; label: string }[] = [
  { key: "yd", label: "Yesterday" },
  { key: "l7d", label: "Last 7 Days" },
  { key: "ytd", label: "YTD" },
  { key: "ly", label: "LY" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const num = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
  return 0;
};
const fmtQty = (v: number) => v.toLocaleString("en-IE");

const marginColor = (pct: number) => {
  if (pct >= 30) return C.green;
  if (pct >= 20) return C.amber;
  return C.red;
};

const pillBtn = (active: boolean, color?: string, theme?: string): React.CSSProperties => {
  const c = color && active ? color : active ? (theme ?? C.accent) : undefined;
  return {
    padding: "5px 12px",
    borderRadius: "6px",
    border: `1px solid ${c ?? C.border}`,
    background: c ? `${c}22` : "transparent",
    color: c ?? C.textDim,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: active ? 600 : 400,
    transition: "all 0.15s",
  };
};

const thStyleBase: Omit<React.CSSProperties, "borderBottom"> = {
  padding: "10px 12px",
  color: C.textDim,
  fontWeight: 600,
  fontSize: "11px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  background: C.card,
  position: "sticky",
  top: 0,
  zIndex: 1,
  whiteSpace: "nowrap",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DepartmentsPage() {
  const [rawData, setRawData] = useState<TopSellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { store, setStore, themeColor } = useStore();
  const [period, setPeriod] = useState<Period>("l7d");

  const thStyle: React.CSSProperties = { ...thStyleBase, borderBottom: `2px solid ${themeColor}` };

  // Drill-down state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [alertsExpanded, setAlertsExpanded] = useState(false);
  const [showAlertDetail, setShowAlertDetail] = useState(false);

  const drillLevel: DrillLevel = selectedSubcategory
    ? "product"
    : selectedCategory
      ? "subcategory"
      : "category";

  /* ---------- Fetch all data ---------- */

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await rds.query<TopSellerRow>("SELECT * FROM top_sellers");
      if (error) console.error("Departments fetch error:", error);
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

  /* ---------- Period column keys ---------- */

  const salesKey = `${period}_sales` as keyof TopSellerRow;
  const qtyKey = `${period}_qty` as keyof TopSellerRow;
  const marginKey = `${period}_margin` as keyof TopSellerRow;

  /* ---------- Margin Drop Alerts (always L7D vs YTD) ---------- */

  const marginAlerts = useMemo(() => {
    const alerts: MarginAlert[] = [];
    for (const r of storeData) {
      const l7dPct = num(r.l7d_margin_pct);
      const ytdPct = num(r.ytd_margin_pct);
      const l7dSales = num(r.l7d_sales);
      const l7dMargin = num(r.l7d_margin);
      const l7dQty = num(r.l7d_qty);

      if (l7dSales <= 0 || ytdPct <= 0) continue;

      const dropPct = (ytdPct - l7dPct) * 100; // in percentage points
      if (dropPct > 3) {
        // margin impact: what margin would have been at ytd rate minus actual
        const expectedMargin = l7dSales * ytdPct;
        const impact = expectedMargin - l7dMargin;
        alerts.push({
          name: r.name,
          lvCode: r.lv_code,
          category: r.category,
          l7dMarginPct: l7dPct * 100,
          ytdMarginPct: ytdPct * 100,
          dropPct,
          qty: l7dQty,
          marginImpact: impact,
        });
      }
    }
    alerts.sort((a, b) => b.qty - a.qty);
    return alerts.slice(0, 50);
  }, [storeData]);

  /* ---------- Alert summary stats ---------- */

  const alertSummary = useMemo(() => {
    let totalImpact = 0;
    for (const a of marginAlerts) totalImpact += a.marginImpact;

    // Store-level L7D vs YTD margin
    let l7dSales = 0, l7dMargin = 0, ytdSales = 0, ytdMargin = 0;
    for (const r of storeData) {
      l7dSales += num(r.l7d_sales);
      l7dMargin += num(r.l7d_margin);
      ytdSales += num(r.ytd_sales);
      ytdMargin += num(r.ytd_margin);
    }
    const l7dPct = l7dSales !== 0 ? (l7dMargin / l7dSales) * 100 : 0;
    const ytdPct = ytdSales !== 0 ? (ytdMargin / ytdSales) * 100 : 0;
    const changePp = l7dPct - ytdPct;

    const top5 = [...marginAlerts].sort((a, b) => b.marginImpact - a.marginImpact).slice(0, 5);

    return { totalImpact, l7dPct, ytdPct, changePp, top5 };
  }, [marginAlerts, storeData]);

  /* ---------- Aggregate data for current drill level ---------- */

  const displayRows = useMemo(() => {
    if (drillLevel === "product") {
      // Show individual products for the selected subcategory
      let products = storeData.filter(
        (r) => r.category === selectedCategory && r.subcategory === selectedSubcategory
      );
      if (search) {
        const words = search.toLowerCase().split(/\s+/).filter(Boolean);
        products = products.filter((r) => {
          const haystack = `${r.name ?? ""} ${r.lv_code ?? ""}`.toLowerCase();
          return words.every((w) => haystack.includes(w));
        });
      }
      const rows: AggRow[] = products.map((r) => ({
        name: r.name || r.lv_code,
        code: r.lv_code,
        sales: num(r[salesKey]),
        qty: num(r[qtyKey]),
        margin: num(r[marginKey]),
        marginPct: num(r[salesKey]) !== 0 ? (num(r[marginKey]) / num(r[salesKey])) * 100 : 0,
      }));
      rows.sort((a, b) => b.margin - a.margin);
      return rows;
    }

    if (drillLevel === "subcategory") {
      // Aggregate by subcategory within selected category
      const subMap = new Map<string, { sales: number; qty: number; margin: number; count: number }>();
      for (const r of storeData) {
        if (r.category !== selectedCategory) continue;
        const key = r.subcategory || "Other";
        const existing = subMap.get(key);
        const s = num(r[salesKey]);
        const q = num(r[qtyKey]);
        const m = num(r[marginKey]);
        if (!existing) {
          subMap.set(key, { sales: s, qty: q, margin: m, count: 1 });
        } else {
          existing.sales += s;
          existing.qty += q;
          existing.margin += m;
          existing.count++;
        }
      }
      let rows: AggRow[] = Array.from(subMap.entries()).map(([name, v]) => ({
        name,
        code: "",
        sales: v.sales,
        qty: v.qty,
        margin: v.margin,
        marginPct: v.sales !== 0 ? (v.margin / v.sales) * 100 : 0,
        childCount: v.count,
      }));
      if (search) {
        const words = search.toLowerCase().split(/\s+/).filter(Boolean);
        rows = rows.filter((r) => {
          const haystack = r.name.toLowerCase();
          return words.every((w) => haystack.includes(w));
        });
      }
      rows.sort((a, b) => b.margin - a.margin);
      return rows;
    }

    // Category level - aggregate by category, top 10 by margin
    const catMap = new Map<string, { name: string; code: string; sales: number; qty: number; margin: number; subCount: Set<string> }>();
    for (const r of storeData) {
      const key = r.category || "Unknown";
      const existing = catMap.get(key);
      const s = num(r[salesKey]);
      const q = num(r[qtyKey]);
      const m = num(r[marginKey]);
      if (!existing) {
        const subs = new Set<string>();
        if (r.subcategory) subs.add(r.subcategory);
        catMap.set(key, { name: key, code: r.category_code || "", sales: s, qty: q, margin: m, subCount: subs });
      } else {
        existing.sales += s;
        existing.qty += q;
        existing.margin += m;
        if (r.subcategory) existing.subCount.add(r.subcategory);
      }
    }
    let rows: AggRow[] = Array.from(catMap.values()).map((v) => ({
      name: v.name,
      code: v.code,
      sales: v.sales,
      qty: v.qty,
      margin: v.margin,
      marginPct: v.sales !== 0 ? (v.margin / v.sales) * 100 : 0,
      childCount: v.subCount.size,
    }));
    if (search) {
      const words = search.toLowerCase().split(/\s+/).filter(Boolean);
      rows = rows.filter((r) => {
        const haystack = r.name.toLowerCase();
        return words.every((w) => haystack.includes(w));
      });
    }
    rows.sort((a, b) => b.margin - a.margin);
    return rows;
  }, [storeData, drillLevel, selectedCategory, selectedSubcategory, salesKey, qtyKey, marginKey, search]);

  /* ---------- Summary KPIs ---------- */

  const totals = useMemo(() => {
    let sales = 0, margin = 0, qty = 0;
    for (const r of displayRows) {
      sales += r.sales;
      margin += r.margin;
      qty += r.qty;
    }
    return {
      sales,
      margin,
      qty,
      marginPct: sales !== 0 ? (margin / sales) * 100 : 0,
    };
  }, [displayRows]);

  /* ---------- Breadcrumb ---------- */

  const breadcrumb: { label: string; onClick: (() => void) | null }[] = [
    {
      label: "All Categories",
      onClick: drillLevel !== "category" ? () => { setSelectedCategory(null); setSelectedSubcategory(null); setSearch(""); } : null,
    },
  ];
  if (selectedCategory) {
    breadcrumb.push({
      label: selectedCategory.replace(/^[A-Z]\d+\s*-\s*/, ""),
      onClick: drillLevel === "product" ? () => { setSelectedSubcategory(null); setSearch(""); } : null,
    });
  }
  if (selectedSubcategory) {
    breadcrumb.push({
      label: selectedSubcategory.replace(/^[A-Z]\d+\s*-\s*/, ""),
      onClick: null,
    });
  }

  /* ---------- Navigation ---------- */

  const handleRowClick = (row: AggRow) => {
    if (drillLevel === "category") {
      setSelectedCategory(row.name);
      setSearch("");
    } else if (drillLevel === "subcategory") {
      setSelectedSubcategory(row.name);
      setSearch("");
    }
  };

  const handleBack = () => {
    if (drillLevel === "product") {
      setSelectedSubcategory(null);
    } else if (drillLevel === "subcategory") {
      setSelectedCategory(null);
    }
    setSearch("");
  };

  /* ---------- Export ---------- */

  const handleExport = useCallback(async () => {
    const XLSX = await import("xlsx");
    const exportRows = displayRows.map((r) => ({
      Name: r.name,
      "Sales €": r.sales,
      Qty: r.qty,
      "Margin €": r.margin,
      "Margin %": `${r.marginPct.toFixed(1)}%`,
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Departments");
    const periodLabel = PERIODS.find((p) => p.key === period)?.label ?? period;
    XLSX.writeFile(wb, `departments_${store}_${periodLabel.replace(/\s/g, "_")}.xlsx`);
  }, [displayRows, period, store]);

  /* ---------- Level label ---------- */

  const levelLabel = drillLevel === "product" ? "Product" : drillLevel === "subcategory" ? "Subcategory" : "Category";

  /* ---------- Render ---------- */

  return (
    <>
      <div
        style={{
          background: C.card,
          borderRadius: "10px",
          border: `1px solid ${C.border}`,
        }}
      >
        {/* Sticky header + KPIs */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: C.card,
            borderRadius: "10px 10px 0 0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
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
          {/* Title + breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {drillLevel !== "category" && (
                  <button
                    onClick={handleBack}
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
                    }}
                  >
                    &#8592; Back
                  </button>
                )}
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.text, margin: 0 }}>
                  Departments
                </h2>
              </div>
              {/* Breadcrumb */}
              <div style={{ display: "flex", gap: "2px", marginTop: "4px", fontSize: "12px" }}>
                {breadcrumb.map((item, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ color: C.textMuted, margin: "0 4px" }}>›</span>}
                    <span
                      onClick={item.onClick ?? undefined}
                      style={{
                        color: item.onClick ? C.accent : C.textDim,
                        cursor: item.onClick ? "pointer" : "default",
                      }}
                    >
                      {item.label}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleExport}
              style={{ ...pillBtn(false), display: "flex", alignItems: "center", gap: "4px" }}
            >
              <span style={{ fontSize: "14px" }}>&#8595;</span> Export Excel
            </button>
          </div>

          {/* Store + Period toggles */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Store toggle */}
            <div style={{ display: "flex", gap: "2px" }}>
              {(
                [
                  { key: "2064" as StoreFilter, label: STORE_LABELS["2064"] },
                  { key: "2056" as StoreFilter, label: STORE_LABELS["2056"] },
                  { key: "both" as StoreFilter, label: STORE_LABELS["both"] },
                ] as const
              ).map((s) => (
                <button key={s.key} onClick={() => setStore(s.key)} style={pillBtn(store === s.key, STORE_COLORS[s.key], themeColor)}>
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ width: "1px", height: "20px", background: C.border }} />

            {/* Period toggle */}
            <div style={{ display: "flex", gap: "2px" }}>
              {PERIODS.map((p) => (
                <button key={p.key} onClick={() => setPeriod(p.key)} style={pillBtn(period === p.key, undefined, themeColor)}>
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ width: "1px", height: "20px", background: C.border }} />

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
                width: "200px",
              }}
            />
          </div>
        </div>

        {/* Summary KPIs */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
          }}
        >
          {[
            { label: "Total Sales", value: fmt(totals.sales), accent: themeColor },
            { label: "Margin %", value: `${totals.marginPct.toFixed(1)}%`, accent: marginColor(totals.marginPct), color: marginColor(totals.marginPct) },
            { label: "Total Qty", value: fmtQty(totals.qty), accent: C.cyan },
            { label: "Total Margin €", value: fmt(totals.margin), accent: C.amber },
          ].map((kpi) => (
            <div
              key={kpi.label}
              style={{
                background: C.bg,
                borderRadius: "8px",
                padding: "14px 16px",
                borderLeft: `3px solid ${kpi.accent}`,
              }}
            >
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "6px" }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: kpi.color ?? C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                {loading ? "..." : kpi.value}
              </div>
            </div>
          ))}
        </div>

        </div>{/* end sticky header + KPIs */}

        {/* Margin Drop Alerts */}
        {!loading && marginAlerts.length > 0 && drillLevel === "category" && !showAlertDetail && (
          <div
            onClick={() => setShowAlertDetail(true)}
            style={{
              padding: "12px 20px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = C.bg; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px" }}>&#9888;&#65039;</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.amber }}>
                Margin Drop Alerts — Last 7 Days vs YTD
              </span>
              <span style={{ fontSize: "11px", color: C.textDim }}>
                ({marginAlerts.length} products flagged)
              </span>
            </div>
            <span style={{ color: C.accent, fontSize: "12px", fontWeight: 500 }}>
              View Details ›
            </span>
          </div>
        )}

        {/* Margin Drop Alert Detail View */}
        {!loading && showAlertDetail && (
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {/* Header with close */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px" }}>&#9888;&#65039;</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: C.amber }}>
                  Margin Drop Alerts — Last 7 Days vs YTD
                </span>
              </div>
              <button
                onClick={() => setShowAlertDetail(false)}
                style={{
                  ...pillBtn(false),
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                &#10005; Close
              </button>
            </div>

            {/* Summary boxes */}
            <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ background: C.bg, borderRadius: "8px", padding: "16px 20px", borderLeft: `3px solid ${C.red}` }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "8px" }}>
                  Estimated Margin Impact vs YTD Average
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                  -{fmt(Math.abs(alertSummary.totalImpact))}
                </div>
                <div style={{ fontSize: "11px", color: C.textDim, marginTop: "4px" }}>
                  across {marginAlerts.length} flagged products
                </div>
              </div>
              <div style={{ background: C.bg, borderRadius: "8px", padding: "16px 20px", borderLeft: `3px solid ${alertSummary.changePp >= 0 ? C.green : C.red}` }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "8px" }}>
                  Store Margin — L7D vs YTD
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 700, color: alertSummary.changePp >= 0 ? C.green : C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                    {alertSummary.changePp >= 0 ? "▲" : "▼"} {Math.abs(alertSummary.changePp).toFixed(2)}pp
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: C.textDim, marginTop: "4px" }}>
                  L7D: {alertSummary.l7dPct.toFixed(2)}% — YTD: {alertSummary.ytdPct.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Top 5 most impacted products */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", color: C.textDim, textTransform: "uppercase", marginBottom: "12px" }}>
                Top 5 Most Impacted Products
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                {alertSummary.top5.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.bg,
                      borderRadius: "8px",
                      padding: "12px 14px",
                      border: `1px solid ${C.border}`,
                      borderTop: `2px solid ${C.red}`,
                    }}
                  >
                    <div style={{ fontSize: "11px", color: C.text, fontWeight: 500, marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.name}
                    </div>
                    <div style={{ fontSize: "11px", color: C.textDim, fontFamily: "'JetBrains Mono', monospace", marginBottom: "2px" }}>
                      {a.lvCode}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: C.red, fontFamily: "'JetBrains Mono', monospace", marginTop: "6px" }}>
                      -{fmt(Math.abs(a.marginImpact))}
                    </div>
                    <div style={{ fontSize: "10px", color: C.textDim, marginTop: "4px" }}>
                      {a.ytdMarginPct.toFixed(1)}% → {a.l7dMarginPct.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full alerts table */}
            <div style={{ overflowX: "auto", maxHeight: "500px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr>
                    {[
                      { label: "#", align: "right" },
                      { label: "Product", align: "left" },
                      { label: "LV Code", align: "left" },
                      { label: "Category", align: "left" },
                      { label: "YTD Margin %", align: "right" },
                      { label: "L7D Margin %", align: "right" },
                      { label: "Drop", align: "right" },
                      { label: "Units Sold", align: "right" },
                      { label: "Margin € Impact", align: "right" },
                    ].map((h) => (
                      <th key={h.label} style={{ ...thStyle, textAlign: h.align as "left" | "right" }}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {marginAlerts.map((a, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? C.bg : C.card }}>
                      <td style={{ padding: "8px 12px", textAlign: "right", color: C.textDim, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: "8px 12px", color: C.text, fontWeight: 500, maxWidth: "250px" }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.name}
                        </div>
                      </td>
                      <td style={{ padding: "8px 12px", color: C.textDim, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
                        {a.lvCode}
                      </td>
                      <td style={{ padding: "8px 12px", color: C.textDim, fontSize: "11px", maxWidth: "180px" }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.category?.replace(/^[A-Z]\d+\s*-\s*/, "")}
                        </div>
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: marginColor(a.ytdMarginPct) }}>
                        {a.ytdMarginPct.toFixed(1)}%
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: marginColor(a.l7dMarginPct) }}>
                        {a.l7dMarginPct.toFixed(1)}%
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: C.red }}>
                        -{a.dropPct.toFixed(1)}pp
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                        {fmtQty(a.qty)}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: C.red }}>
                        -{fmt(Math.abs(a.marginImpact))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Main table (hidden when alert detail is open) */}
        {showAlertDetail ? null : loading ? (
          <div style={{ color: C.textDim, fontSize: "13px", padding: "40px 0", textAlign: "center" }}>
            Loading departments...
          </div>
        ) : (
          <div style={{ overflowX: "auto", maxHeight: "600px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {[
                    { label: "#", align: "right" },
                    { label: levelLabel, align: "left" },
                    { label: "Sales €", align: "right" },
                    { label: "Units", align: "right" },
                    { label: "Margin €", align: "right" },
                    { label: "Margin %", align: "right" },
                  ].map((h) => (
                    <th key={h.label} style={{ ...thStyle, textAlign: h.align as "left" | "right" }}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: C.textDim }}>
                      No data found
                    </td>
                  </tr>
                ) : (
                  displayRows.map((row, i) => {
                    const clickable = drillLevel !== "product";
                    return (
                      <tr
                        key={row.name + row.code + i}
                        onClick={() => clickable && handleRowClick(row)}
                        style={{
                          background: i % 2 === 0 ? C.bg : C.card,
                          cursor: clickable ? "pointer" : undefined,
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          if (clickable) (e.currentTarget as HTMLTableRowElement).style.background = C.borderLight;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? C.bg : C.card;
                        }}
                      >
                        <td style={{ padding: "10px 12px", textAlign: "right", color: C.textDim, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
                          {i + 1}
                        </td>
                        <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500, maxWidth: "350px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {row.name?.replace(/^[A-Z]\d+\s*-\s*/, "")}
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
                          {fmtQty(row.qty)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                          {fmt(row.margin)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: marginColor(row.marginPct) }}>
                          {row.marginPct.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
