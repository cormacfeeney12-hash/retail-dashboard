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

/**
 * Waste pairing by LV code: main coffee → oat milk equivalent.
 * Net waste cups = main_waste_cups + oat_waste_cups (keep sign, no abs)
 * Combined qty = main_qty + oat_qty
 * Net waste % = net_waste_cups / combined_qty * 100
 * Negative = under target (good), Positive = actual waste (bad)
 */
const WASTE_PAIRS: Record<string, string> = {
  "1499519 000": "1890874 000", // Large Coffee → OAT Coffee Large
  "1499543 000": "1890914 000", // Reg Coffee → OAT Coffee Regular
  "1499588 000": "1890847 000", // Flat White → OAT Flat White
};

const OAT_LV_CODES = new Set(Object.values(WASTE_PAIRS));
const MAIN_COFFEE_LV_CODES = new Set(Object.keys(WASTE_PAIRS));
const ALL_COFFEE_LV_CODES = new Set([...Object.keys(WASTE_PAIRS), ...Object.values(WASTE_PAIRS)]);
const TEA_LV_CODES = new Set(["1499522 000", "1499559 000"]);
const NON_COFFEE_LV_CODES = new Set(["1499522 000", "1499559 000", "1640042 000"]);
const EXCLUDED_LV_CODES = new Set(["1944667 000", "1831060 000"]); // Ice Americano, Iced Dairy

const isOatProduct = (row: CoffeeRow): boolean => OAT_LV_CODES.has(row.lv_code);
const isMainCoffee = (row: CoffeeRow): boolean => MAIN_COFFEE_LV_CODES.has(row.lv_code);
const isNonCoffee = (row: CoffeeRow): boolean => NON_COFFEE_LV_CODES.has(row.lv_code);

const findOatPair = (mainRow: CoffeeRow, rows: CoffeeRow[]): CoffeeRow | undefined => {
  const oatCode = WASTE_PAIRS[mainRow.lv_code];
  if (!oatCode) return undefined;
  return rows.find((r) => r.lv_code === oatCode);
};

const marginColor = (pct: number) => {
  if (pct >= 30) return C.green;
  if (pct >= 20) return C.amber;
  return C.red;
};

/** Net waste color: 0% or negative = green, 0.1-4% = amber, >4% = red */
const wasteColor = (pct: number) => {
  if (pct <= 0) return C.green;
  if (pct <= 4) return C.amber;
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
  const [period, setPeriod] = useState<Period>("yd");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: rows, error } = await rds.query<CoffeeRow>(
        "SELECT * FROM fh_coffee WHERE store_number = '2064' ORDER BY name"
      );
      if (error) console.error("F&H Coffee load error:", error);
      // Filter out header rows and excluded products
      const filtered = (rows || []).filter(
        (r) => r.name && !r.name.toLowerCase().startsWith("article") && !EXCLUDED_LV_CODES.has(r.lv_code)
      );
      setData(filtered);
      setLoading(false);
    }
    load();
  }, []);

  /* ── Separate main products vs oat/other ── */
  const mainProducts = useMemo(() => data.filter((r) => !isOatProduct(r)), [data]);

  /* ── Sorted data: by Margin € desc, oat products after their paired main ── */
  const sortedData = useMemo(() => {
    const marginKey = col(period, "margin");
    const sorted = [...mainProducts].sort((a, b) => num(b[marginKey]) - num(a[marginKey]));
    const result: CoffeeRow[] = [];
    const oatRows = data.filter((r) => isOatProduct(r));
    const used = new Set<string>();
    for (const r of sorted) {
      result.push(r);
      const oatPair = findOatPair(r, data);
      if (oatPair) { result.push(oatPair); used.add(oatPair.lv_code); }
    }
    for (const o of oatRows) {
      if (!used.has(o.lv_code)) result.push(o);
    }
    return result;
  }, [mainProducts, data, period]);

  /* ── Coffee KPIs (6 coffee LV codes) + waste cost ── */
  const coffeeKpis = useMemo(() => {
    const sK = col(period, "sales"), qK = col(period, "qty"), mK = col(period, "margin"), wK = col(period, "waste_cups");
    let sales = 0, qty = 0, margin = 0, netWaste = 0;
    for (const r of data.filter((r) => ALL_COFFEE_LV_CODES.has(r.lv_code))) {
      sales += num(r[sK]); qty += num(r[qK]); margin += num(r[mK]);
      netWaste += num(r[wK]);
    }
    const marginPct = sales > 0 ? (margin / sales) * 100 : 0;
    const wastePct = qty > 0 ? (netWaste / qty) * 100 : 0;
    // Waste cost: unit_cost = (sales - margin) / qty per main coffee, then * abs(net_waste)
    let totalWasteCost = 0;
    for (const mainCode of Object.keys(WASTE_PAIRS)) {
      const main = data.find((r) => r.lv_code === mainCode);
      const oat = data.find((r) => r.lv_code === WASTE_PAIRS[mainCode]);
      if (!main) continue;
      const s = num(main[sK]), m = num(main[mK]), q = num(main[qK]);
      const unitCost = q > 0 ? (s - m) / q : 0;
      const mainW = num(main[wK]);
      const oatW = oat ? num(oat[wK]) : 0;
      const net = mainW + oatW;
      // positive net = loss (waste cost), negative net = saving
      totalWasteCost += unitCost * net;
    }
    return { sales, qty, margin, marginPct, netWaste, wastePct, totalWasteCost };
  }, [data, period]);

  /* ── Tea KPIs (1499522, 1499559) ── */
  const teaKpis = useMemo(() => {
    const sK = col(period, "sales"), qK = col(period, "qty"), mK = col(period, "margin");
    let sales = 0, qty = 0, margin = 0;
    for (const r of data.filter((r) => TEA_LV_CODES.has(r.lv_code))) {
      sales += num(r[sK]); qty += num(r[qK]); margin += num(r[mK]);
    }
    const marginPct = sales > 0 ? (margin / sales) * 100 : 0;
    return { sales, qty, margin, marginPct };
  }, [data, period]);

  /* ── Waste chart data (only 3 main coffee types with net waste) ── */
  const wasteData = useMemo(() => {
    const wasteCupsKey = col(period, "waste_cups");
    const qtyKey = col(period, "qty");
    const coffeeRows = data.filter((r) => isMainCoffee(r));
    return coffeeRows
      .map((r) => {
        const ownCups = num(r[wasteCupsKey]);
        const oatRow = findOatPair(r, data);
        const oatCups = oatRow ? num(oatRow[wasteCupsKey]) : 0;
        const netCups = ownCups + oatCups;
        const qty = num(r[qtyKey]) + (oatRow ? num(oatRow[qtyKey]) : 0);
        const netPct = qty > 0 ? (netCups / qty) * 100 : 0;
        return { name: cleanName(r.name), cups: netCups, pct: netPct };
      })
      .sort((a, b) => b.cups - a.cups);
  }, [data, period]);

  const maxAbsCups = Math.max(...wasteData.map((d) => Math.abs(d.cups)), 1);

  /* ── Fixed waste trend data (always yd, l7d, ytd — independent of period toggle) ── */
  const TREND_PERIODS: { key: Period; label: string }[] = [
    { key: "yd", label: "Yesterday" },
    { key: "l7d", label: "Last 7 Days" },
    { key: "ytd", label: "YTD" },
  ];
  const LINE_COLORS = ["#6366f1", "#f59e0b", "#06b6d4"]; // indigo, amber, cyan
  const trendLines = useMemo(() => {
    const mainCodes = Object.keys(WASTE_PAIRS);
    return mainCodes.map((mainCode, idx) => {
      const main = data.find((r) => r.lv_code === mainCode);
      const oat = data.find((r) => r.lv_code === WASTE_PAIRS[mainCode]);
      const name = main ? cleanName(main.name) : `Coffee ${idx + 1}`;
      const points = TREND_PERIODS.map((tp) => {
        const wK = col(tp.key, "waste_cups");
        const qK = col(tp.key, "qty");
        const mainW = main ? num(main[wK]) : 0;
        const oatW = oat ? num(oat[wK]) : 0;
        const mainQ = main ? num(main[qK]) : 0;
        const oatQ = oat ? num(oat[qK]) : 0;
        const totalQ = mainQ + oatQ;
        const netCups = mainW + oatW;
        return totalQ > 0 ? (netCups / totalQ) * 100 : 0;
      });
      return { name, points, color: LINE_COLORS[idx] };
    });
  }, [data]);

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
          {/* KPI Boxes: Coffee | Tea | Overall Waste */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "16px", marginBottom: "24px" }}>
            {/* ── Coffee KPI Box ── */}
            <div style={{ background: C.card, borderRadius: "10px", padding: "16px 20px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", borderBottom: `2px solid ${C.accent}`, paddingBottom: "8px" }}>
                Coffee
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Total Sales", value: fmt(coffeeKpis.sales), color: C.text },
                  { label: "Cups Sold", value: coffeeKpis.qty.toLocaleString("en-IE"), color: C.text },
                  { label: "Avg Margin %", value: `${coffeeKpis.marginPct.toFixed(1)}%`, color: marginColor(coffeeKpis.marginPct) },
                  { label: "Net Waste Cups", value: `${coffeeKpis.netWaste > 0 ? "+" : ""}${coffeeKpis.netWaste}`, color: wasteColor(coffeeKpis.wastePct) },
                  { label: "Waste % vs 4%", value: `${coffeeKpis.wastePct > 0 ? "+" : ""}${coffeeKpis.wastePct.toFixed(1)}%`, color: wasteColor(coffeeKpis.wastePct) },
                  { label: "Est. Waste Cost", value: `${coffeeKpis.totalWasteCost > 0 ? "" : "-"}${fmt(Math.abs(coffeeKpis.totalWasteCost))}`, color: coffeeKpis.totalWasteCost > 0 ? C.red : C.green },
                ].map((k) => (
                  <div key={k.label}>
                    <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "4px" }}>{k.label}</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: k.color, fontFamily: "'JetBrains Mono', monospace" }}>{k.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "9px", color: C.textMuted, marginTop: "10px", fontStyle: "italic" }}>
                Waste cost = (sales - margin) / qty x net waste cups
              </div>
            </div>

            {/* ── Tea KPI Box ── */}
            <div style={{ background: C.card, borderRadius: "10px", padding: "16px 20px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", borderBottom: "2px solid #06b6d4", paddingBottom: "8px" }}>
                Tea
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Total Sales", value: fmt(teaKpis.sales), color: C.text },
                  { label: "Cups Sold", value: teaKpis.qty.toLocaleString("en-IE"), color: C.text },
                  { label: "Avg Margin %", value: `${teaKpis.marginPct.toFixed(1)}%`, color: marginColor(teaKpis.marginPct) },
                  { label: "Waste", value: "N/A", color: C.textDim },
                ].map((k) => (
                  <div key={k.label}>
                    <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "4px" }}>{k.label}</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: k.color, fontFamily: "'JetBrains Mono', monospace" }}>{k.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "8px", fontStyle: "italic" }}>
                Tea waste cannot be accurately calculated
              </div>
            </div>

            {/* ── Overall Waste % standalone ── */}
            <div style={{ background: C.card, borderRadius: "10px", padding: "16px 20px", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minWidth: "140px" }}>
              <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "6px", textAlign: "center" }}>
                Overall Coffee<br />Waste % vs 4%
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: wasteColor(coffeeKpis.wastePct), fontFamily: "'JetBrains Mono', monospace" }}>
                {coffeeKpis.wastePct > 0 ? "+" : ""}{coffeeKpis.wastePct.toFixed(1)}%
              </div>
              <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "4px" }}>
                {coffeeKpis.wastePct < 0 ? "Under target" : coffeeKpis.wastePct <= 4 ? "At target" : "Over target"}
              </div>
            </div>
          </div>

          {/* Net Waste Chart */}
          <div style={{ background: C.card, borderRadius: "10px", padding: "20px", border: `1px solid ${C.border}`, marginBottom: "24px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Net Waste Cups by Product
            </h3>
            <p style={{ fontSize: "11px", color: C.textMuted, margin: "0 0 16px 0" }}>
              Negative = under waste target (recovery)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {wasteData.map((d, i) => {
                const barPct = (Math.abs(d.cups) / maxAbsCups) * 50; // half-width max
                const isNeg = d.cups < 0;
                return (
                  <div key={i}>
                    <div style={{ fontSize: "12px", fontWeight: 500, color: C.text, marginBottom: "4px" }}>
                      {d.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ flex: 1, height: "22px", background: C.bg, borderRadius: "4px", position: "relative" }}>
                        {/* Center line (zero) */}
                        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: C.textDim, opacity: 0.3 }} />
                        {/* Bar: negative grows left from center, positive grows right */}
                        <div
                          style={{
                            position: "absolute",
                            top: 2, bottom: 2,
                            ...(isNeg
                              ? { right: "50%", width: `${barPct}%` }
                              : { left: "50%", width: `${barPct}%` }),
                            background: isNeg ? `${C.green}aa` : `${C.red}aa`,
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: wasteColor(d.pct), width: "50px", textAlign: "right", flexShrink: 0 }}>
                        {d.cups > 0 ? "+" : ""}{d.cups}
                      </div>
                      <div style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: wasteColor(d.pct), width: "55px", textAlign: "right", flexShrink: 0 }}>
                        {d.pct > 0 ? "+" : ""}{d.pct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Waste % Trend Line Chart (fixed — always shows yd, l7d, ytd) */}
          {(() => {
            const W = 560, H = 220, pad = { top: 30, right: 20, bottom: 40, left: 50 };
            const cW = W - pad.left - pad.right, cH = H - pad.top - pad.bottom;
            const allVals = trendLines.flatMap((l) => l.points).concat([4, 0]);
            const minY = Math.min(...allVals) - 2, maxY = Math.max(...allVals) + 2;
            const rangeY = maxY - minY || 1;
            const xPos = (i: number) => pad.left + (i / (TREND_PERIODS.length - 1)) * cW;
            const yPos = (v: number) => pad.top + ((maxY - v) / rangeY) * cH;
            return (
              <div style={{ background: C.card, borderRadius: "10px", padding: "20px", border: `1px solid ${C.border}`, marginBottom: "24px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                  Waste % Trend
                </h3>
                <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                  {trendLines.map((l) => (
                    <div key={l.name} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: C.text }}>
                      <div style={{ width: "16px", height: "3px", borderRadius: "2px", background: l.color }} />
                      {l.name}
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: C.red }}>
                    <div style={{ width: "16px", height: "0", borderTop: `2px dashed ${C.red}` }} />
                    4% target
                  </div>
                </div>
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, height: "auto" }}>
                  {/* Y axis grid lines */}
                  {Array.from({ length: 5 }, (_, i) => {
                    const v = minY + (rangeY * i) / 4;
                    const y = yPos(v);
                    return (
                      <g key={i}>
                        <line x1={pad.left} x2={W - pad.right} y1={y} y2={y} stroke={C.border} strokeWidth={0.5} />
                        <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill={C.textDim} fontFamily="'JetBrains Mono', monospace">
                          {v.toFixed(0)}%
                        </text>
                      </g>
                    );
                  })}
                  {/* 4% target dashed line */}
                  <line x1={pad.left} x2={W - pad.right} y1={yPos(4)} y2={yPos(4)} stroke={C.red} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.7} />
                  {/* 0% reference line */}
                  <line x1={pad.left} x2={W - pad.right} y1={yPos(0)} y2={yPos(0)} stroke={C.textDim} strokeWidth={0.5} opacity={0.5} />
                  {/* X axis labels */}
                  {TREND_PERIODS.map((tp, i) => (
                    <text key={tp.key} x={xPos(i)} y={H - 10} textAnchor="middle" fontSize="11" fill={C.textDim}>
                      {tp.label}
                    </text>
                  ))}
                  {/* Data lines + dots */}
                  {trendLines.map((line) => {
                    const pathD = line.points.map((v, i) => `${i === 0 ? "M" : "L"}${xPos(i)},${yPos(v)}`).join(" ");
                    return (
                      <g key={line.name}>
                        <path d={pathD} fill="none" stroke={line.color} strokeWidth={2.5} strokeLinejoin="round" />
                        {line.points.map((v, i) => (
                          <g key={i}>
                            <circle cx={xPos(i)} cy={yPos(v)} r={4} fill={line.color} />
                            <text x={xPos(i)} y={yPos(v) - 8} textAnchor="middle" fontSize="10" fontWeight="600" fill={line.color} fontFamily="'JetBrains Mono', monospace">
                              {v > 0 ? "+" : ""}{v.toFixed(1)}%
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })}
                </svg>
              </div>
            );
          })()}

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
                      { label: "Waste Cost €", align: "right" },
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
                  {sortedData.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: C.textDim }}>
                        No F&amp;H Coffee data found
                      </td>
                    </tr>
                  ) : (
                    sortedData.map((row, i) => {
                      const mPct = normMarginPct(row[marginPctKey]);
                      const oat = isOatProduct(row);
                      const nonCoffee = isNonCoffee(row);
                      const oatRow = findOatPair(row, data);

                      // Net waste for main coffee products (keep sign)
                      const ownCups = num(row[wasteCupsKey]);
                      const pairedOatCups = oatRow ? num(oatRow[wasteCupsKey]) : 0;
                      const netCups = ownCups + pairedOatCups;
                      const combinedQty = num(row[qtyKey]) + (oatRow ? num(oatRow[qtyKey]) : 0);
                      const netPct = combinedQty > 0 ? (netCups / combinedQty) * 100 : 0;

                      // Waste display logic
                      let wasteDisplay: React.ReactNode;
                      let wasteCupsDisplay: React.ReactNode;
                      let wasteCostDisplay: React.ReactNode;
                      if (oat) {
                        wasteDisplay = <span style={{ color: C.textDim }}>—</span>;
                        wasteCupsDisplay = <span style={{ color: C.textDim }}>—</span>;
                        wasteCostDisplay = <span style={{ color: C.textDim }}>—</span>;
                      } else if (nonCoffee) {
                        wasteDisplay = <span style={{ color: C.textDim }}>N/A</span>;
                        wasteCupsDisplay = <span style={{ color: C.textDim }}>N/A</span>;
                        wasteCostDisplay = <span style={{ color: C.textDim }}>N/A</span>;
                      } else if (oatRow) {
                        // Main coffee with oat pair: show net waste with sign
                        wasteDisplay = (
                          <span style={{ fontWeight: 600, color: wasteColor(netPct) }}>
                            {netPct > 0 ? "+" : ""}{netPct.toFixed(1)}%
                          </span>
                        );
                        wasteCupsDisplay = (
                          <span style={{ color: wasteColor(netPct) }}>
                            {netCups > 0 ? "+" : ""}{netCups}
                          </span>
                        );
                        // Waste cost: unit_cost * net_waste_cups
                        const s = num(row[salesKey]), m = num(row[marginKey]), q = num(row[qtyKey]);
                        const unitCost = q > 0 ? (s - m) / q : 0;
                        const cost = unitCost * netCups;
                        wasteCostDisplay = (
                          <span style={{ fontWeight: 600, color: cost > 0 ? C.red : C.green }}>
                            {cost > 0 ? "" : "-"}{fmt(Math.abs(cost))}
                          </span>
                        );
                      } else {
                        // Fallback
                        const wPct = num(row[wastePctKey]) * 100;
                        wasteDisplay = (
                          <span style={{ fontWeight: 600, color: wasteColor(wPct) }}>
                            {row[wastePctKey] != null ? `${wPct > 0 ? "+" : ""}${wPct.toFixed(1)}%` : "—"}
                          </span>
                        );
                        wasteCupsDisplay = netCups !== 0 ? netCups : "—";
                        wasteCostDisplay = <span style={{ color: C.textDim }}>—</span>;
                      }

                      return (
                        <tr key={row.lv_code + i} style={{ background: oat ? "transparent" : rowBg(mPct), opacity: oat ? 0.5 : 1 }}>
                          <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500, maxWidth: "280px" }}>
                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: oat ? "16px" : 0 }}>
                              {oat ? "↳ " : ""}{cleanName(row.name)}
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
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
                            {wasteDisplay}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                            {wasteCupsDisplay}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
                            {wasteCostDisplay}
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
