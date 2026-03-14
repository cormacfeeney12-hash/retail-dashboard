"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { rds } from "@/lib/rds";
import { C, fmt } from "@/lib/utils";

/* ───── types ───── */

interface ProductResult {
  name: string;
  lv_code: string;
  category: string;
  subcategory: string;
  store_number: string;
  yd_margin_pct: number | null;
  l7d_margin_pct: number | null;
  ytd_margin_pct: number | null;
  yd_qty: number | null;
  l7d_qty: number | null;
  ytd_qty: number | null;
  yd_sales: number | null;
  l7d_sales: number | null;
  ytd_sales: number | null;
  yd_margin: number | null;
  l7d_margin: number | null;
  ytd_margin: number | null;
}

interface CpuRow {
  invoice_cpu: number | null;
  rsp: number | null;
}

interface PriceCheck {
  id: number;
  created_at: string;
  product_name: string;
  lv_code: string | null;
  store_number: string | null;
  competitor_name: string;
  our_price: number | null;
  their_price: number;
  our_cost: number | null;
  our_margin_pct: number | null;
  their_margin_pct: number | null;
  margin_impact: number | null;
  recommendation: string | null;
  category: string | null;
}

type StoreFilter = "2064" | "2056";

/* ───── helpers ───── */

const num = (v: unknown): number => (typeof v === "number" ? v : 0);

/** Normalise margin_pct: if stored as decimal (0.28) → 28, if already % (28) → 28 */
const normPct = (v: number | null | undefined): number => {
  const n = num(v);
  return Math.abs(n) < 1 && n !== 0 ? n * 100 : n;
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

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: `1px solid ${C.border}`,
  background: C.bg,
  color: C.text,
  fontSize: "14px",
  outline: "none",
  width: "100%",
};

const marginColor = (pct: number) => {
  if (pct >= 30) return C.green;
  if (pct >= 20) return C.amber;
  return C.red;
};

/* ───── component ───── */

export default function PriceTrackerPage() {
  const [store, setStore] = useState<StoreFilter>("2064");

  // Search state
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Selected product
  const [selected, setSelected] = useState<ProductResult | null>(null);
  const [cpuData, setCpuData] = useState<CpuRow | null>(null);

  // Competitor input
  const [competitorName, setCompetitorName] = useState("");
  const [competitorPrice, setCompetitorPrice] = useState("");
  const [photoFile, setPhotoFile] = useState<string>("");

  // Track whether user has saved this comparison
  const [saved, setSaved] = useState(false);

  // History
  const [history, setHistory] = useState<PriceCheck[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);

  /* ── load history ── */
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    const { data, error } = await rds.query<PriceCheck>(
      "SELECT * FROM price_checks ORDER BY created_at DESC LIMIT 50"
    );
    if (error) {
      console.error("History load error:", error);
      setTableExists(false);
    } else {
      setHistory(data || []);
      setTableExists(true);
    }
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /* ── search products (fuzzy multi-word) ── */
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

      // Each word must appear in the name (AND logic)
      // Also fetch lv_code matches for the full query
      const cols = "name,lv_code,category,subcategory,store_number,yd_margin_pct,l7d_margin_pct,ytd_margin_pct,yd_qty,l7d_qty,ytd_qty,yd_sales,l7d_sales,ytd_sales,yd_margin,l7d_margin,ytd_margin";

      // For name: each word must appear (AND logic via multiple ILIKE conditions)
      const nameConditions = words.map((_, i) => `name ILIKE $${i + 2}`).join(" AND ");
      const nameParams: unknown[] = [store, ...words.map((w) => `%${w}%`)];
      const { data: nameData } = await rds.query<ProductResult>(
        `SELECT ${cols} FROM top_sellers WHERE store_number = $1 AND ${nameConditions} LIMIT 15`,
        nameParams
      );

      // For lv_code: simple match on full query
      const { data: codeData } = await rds.query<ProductResult>(
        `SELECT ${cols} FROM top_sellers WHERE store_number = $1 AND lv_code ILIKE $2 LIMIT 5`,
        [store, `%${query.trim()}%`]
      );

      // Merge results, deduplicate by lv_code
      const seen = new Set<string>();
      const merged: ProductResult[] = [];
      for (const row of [...(nameData || []), ...(codeData || [])]) {
        const key = `${row.lv_code}-${row.store_number}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(row);
        }
      }

      setSearchResults(merged.slice(0, 15));
      setShowDropdown(true);
      setSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, store]);

  /* ── select product ── */
  const selectProduct = async (product: ProductResult) => {
    setSelected(product);
    setShowDropdown(false);
    setQuery(product.name);
    setSaved(false);

    // Fetch CPU data
    const { data } = await rds.query<CpuRow>(
      "SELECT invoice_cpu, rsp FROM cpu_comparisons WHERE lv_code = $1 ORDER BY created_at DESC LIMIT 1",
      [product.lv_code]
    );

    // If cpu_comparisons has data, use it; otherwise derive from top_sellers
    if (data && data.length > 0) {
      setCpuData(data[0]);
    } else {
      // Derive cost & RSP from top_sellers margin data
      // RSP = sales / qty, Cost = RSP * (1 - margin_pct)
      const qty = num(product.l7d_qty) || num(product.yd_qty);
      const sales = num(product.l7d_sales) || num(product.yd_sales);
      const marginPctRaw = product.l7d_margin_pct ?? product.yd_margin_pct;
      const marginPct = normPct(marginPctRaw) / 100; // as decimal 0-1

      if (qty > 0 && sales > 0) {
        const derivedRsp = sales / qty;
        const derivedCost = derivedRsp * (1 - marginPct);
        setCpuData({ invoice_cpu: derivedCost, rsp: derivedRsp });
      } else {
        setCpuData(null);
      }
    }
  };

  /* ── live comparison (recomputes as user types) ── */
  const liveCalc = useMemo(() => {
    const theirPrice = parseFloat(competitorPrice);
    if (!selected || isNaN(theirPrice) || theirPrice <= 0) return null;

    const rsp = cpuData?.rsp ?? 0;
    const cost = cpuData?.invoice_cpu ?? 0;

    // Their margin % if they bought at our cost
    const theirMarginPct = cost > 0 && theirPrice > 0 ? ((theirPrice - cost) / theirPrice) * 100 : 0;

    // Our current margin %
    const ourCurrentMarginPct = normPct(selected.l7d_margin_pct ?? selected.yd_margin_pct);

    // Margin % difference: their margin minus ours
    const marginPctDiff = theirMarginPct - ourCurrentMarginPct;

    // Margin € impact per unit if we change our price to match
    const marginImpactPerUnit = theirPrice - rsp;

    // Recommendation
    let recommendation: string;
    let recColor: string;
    let impactLabel: string;
    if (theirPrice > rsp) {
      recommendation = "We are cheaper";
      recColor = "#38bdf8"; // blue
      impactLabel = "Potential margin gain if you raise price to match";
    } else if (rsp - theirPrice < rsp * 0.03) {
      recommendation = "Price is competitive";
      recColor = C.green;
      impactLabel = "Price is within 3% — minimal impact";
    } else {
      recommendation = "Consider reviewing";
      recColor = C.red;
      impactLabel = "Margin lost if you lower price to match";
    }

    // Period impacts: € change if we move our price to competitor price
    // impact = (competitor_price - our_rsp) × qty
    // positive = competitor higher (we gain by raising), negative = they're cheaper (we lose by lowering)
    const ydQ = num(selected.yd_qty);
    const l7dQ = num(selected.l7d_qty) || ydQ;
    const ytdQ = num(selected.ytd_qty) || l7dQ;

    const priceDiffPerUnit = theirPrice - rsp;

    const periodImpacts = [
      { label: "Yesterday", qty: ydQ, impact: priceDiffPerUnit * ydQ },
      { label: "Last 7 Days", qty: l7dQ, impact: priceDiffPerUnit * l7dQ },
      { label: "YTD", qty: ytdQ, impact: priceDiffPerUnit * ytdQ },
    ];

    return { theirMarginPct, ourCurrentMarginPct, marginPctDiff, marginImpactPerUnit, recommendation, recColor, impactLabel, periodImpacts };
  }, [selected, competitorPrice, cpuData]);

  /* ── save to history ── */
  const saveCheck = async () => {
    if (!selected || !liveCalc || !competitorName.trim()) return;
    const theirPrice = parseFloat(competitorPrice);
    if (isNaN(theirPrice) || theirPrice <= 0) return;

    const rsp = cpuData?.rsp ?? 0;
    const cost = cpuData?.invoice_cpu ?? 0;

    if (tableExists) {
      const { error } = await rds.insert("price_checks", {
        product_name: selected.name,
        lv_code: selected.lv_code,
        store_number: store,
        competitor_name: competitorName.trim(),
        our_price: rsp,
        their_price: theirPrice,
        our_cost: cost,
        our_margin_pct: normPct(selected.l7d_margin_pct ?? selected.yd_margin_pct),
        their_margin_pct: liveCalc.theirMarginPct,
        margin_impact: liveCalc.marginImpactPerUnit,
        recommendation: liveCalc.recommendation,
        category: selected.category,
      });
      if (!error) {
        setSaved(true);
        loadHistory();
      }
    }
  };

  /* ── reset ── */
  const reset = () => {
    setQuery("");
    setSelected(null);
    setCpuData(null);
    setCompetitorName("");
    setCompetitorPrice("");
    setPhotoFile("");
    setSaved(false);
    setSearchResults([]);
  };

  const ourRsp = cpuData?.rsp ?? 0;
  const ourCost = cpuData?.invoice_cpu ?? 0;
  const currentMarginPct = normPct(selected?.l7d_margin_pct ?? selected?.yd_margin_pct);

  return (
    <>
      {/* Store toggle */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
        {(
          [
            { key: "2064" as StoreFilter, label: "Store 2064" },
            { key: "2056" as StoreFilter, label: "Store 2056" },
          ] as const
        ).map((s) => (
          <button key={s.key} onClick={() => { setStore(s.key); reset(); }} style={pillBtn(store === s.key)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ─── PRODUCT SEARCH ─── */}
      <div
        style={{
          background: C.card,
          borderRadius: "10px",
          padding: "24px",
          border: `1px solid ${C.border}`,
          marginBottom: "16px",
          position: "relative",
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
          Product Search
        </h3>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search by product name or LV code..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); setSaved(false); }}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            style={inputStyle}
          />
          {searching && (
            <div style={{ position: "absolute", right: "14px", top: "12px", fontSize: "12px", color: C.textDim }}>
              Searching...
            </div>
          )}

          {/* Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                marginTop: "4px",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 100,
              }}
            >
              {searchResults.map((r, i) => (
                <button
                  key={`${r.lv_code}-${i}`}
                  onClick={() => selectProduct(r)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 14px",
                    border: "none",
                    borderBottom: i < searchResults.length - 1 ? `1px solid ${C.border}` : "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    color: C.text,
                    fontSize: "13px",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{r.name}</span>
                  <span style={{ color: C.textDim, marginLeft: "8px", fontSize: "12px" }}>
                    {r.lv_code} · {r.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected product details */}
        {selected && (
          <div style={{ marginTop: "20px" }}>
            {/* Top row: Name, Margin %, Category */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Product Name</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>{selected.name}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Current Margin %</div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: marginColor(currentMarginPct),
                  }}
                >
                  {currentMarginPct.toFixed(2)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Category</div>
                <div style={{ fontSize: "14px", color: C.text }}>{selected.category}</div>
              </div>
            </div>
            {/* Bottom row: Cost, RSP, LV Code */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Our Cost (Invoice CPU)</div>
                <div style={{ fontSize: "18px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                  {ourCost > 0 ? fmt(ourCost) : "—"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Our Selling Price (RSP)</div>
                <div style={{ fontSize: "18px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                  {ourRsp > 0 ? fmt(ourRsp) : "—"}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>LV Code</div>
                  <div style={{ fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", color: C.textDim }}>
                    {selected.lv_code}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── COMPETITOR PRICE SECTION ─── */}
      {selected && (
        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "24px",
            border: `1px solid ${C.border}`,
            marginBottom: "16px",
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
            Competitor Price Check
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
            <div>
              <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Competitor Store</div>
              <input
                type="text"
                placeholder="e.g. Tesco, Dunnes..."
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Their Price €</div>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={competitorPrice}
                onChange={(e) => { setCompetitorPrice(e.target.value); setSaved(false); }}
                style={inputStyle}
              />
            </div>
            <div>
              <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Photo (optional)</div>
              <label
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: photoFile ? C.text : C.textDim,
                }}
              >
                <span>{photoFile || "Upload photo..."}</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setPhotoFile(f ? f.name : "");
                  }}
                />
              </label>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={saveCheck}
                disabled={!competitorName.trim() || !liveCalc || saved}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: saved ? C.green : C.accent,
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: !competitorName.trim() || !liveCalc || saved ? "not-allowed" : "pointer",
                  opacity: !competitorName.trim() || !liveCalc || saved ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {saved ? "Saved" : "Save Check"}
              </button>
              <button
                onClick={reset}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: `1px solid ${C.green}`,
                  background: "transparent",
                  color: C.green,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CALCULATION RESULTS ─── */}
      {liveCalc && (
        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "24px",
            border: `1px solid ${C.border}`,
            borderTop: `3px solid ${liveCalc.recColor}`,
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: C.textDim,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Comparison Results
            </h3>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                background: `${liveCalc.recColor}22`,
                color: liveCalc.recColor,
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {liveCalc.recommendation}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>
                Their Margin % (at our cost)
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: marginColor(liveCalc.theirMarginPct),
                }}
              >
                {liveCalc.theirMarginPct.toFixed(2)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>
                Our Current Margin %
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: marginColor(liveCalc.ourCurrentMarginPct),
                }}
              >
                {liveCalc.ourCurrentMarginPct.toFixed(2)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>
                Margin % Difference
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: liveCalc.marginPctDiff > 0 ? C.green : liveCalc.marginPctDiff < 0 ? C.red : C.text,
                }}
              >
                {liveCalc.marginPctDiff > 0 ? "+" : ""}{liveCalc.marginPctDiff.toFixed(2)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>
                € Impact / Unit
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: liveCalc.marginImpactPerUnit > 0 ? C.green : liveCalc.marginImpactPerUnit < 0 ? C.red : C.text,
                }}
              >
                {liveCalc.marginImpactPerUnit > 0 ? "+" : ""}
                {fmt(liveCalc.marginImpactPerUnit)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PERIOD IMPACT TABLE ─── */}
      {liveCalc && liveCalc.periodImpacts.length > 0 && (
        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "24px",
            border: `1px solid ${C.border}`,
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: C.textDim,
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Period Impact — If We Matched Their Price
          </h3>
          <div
            style={{
              fontSize: "12px",
              color: liveCalc.marginImpactPerUnit > 0 ? C.green : liveCalc.marginImpactPerUnit < 0 ? C.red : C.textDim,
              marginBottom: "16px",
            }}
          >
            {liveCalc.impactLabel}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Period", "Units Sold", "€ Impact"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 12px",
                        textAlign: h === "Period" ? "left" : "right",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: C.textDim,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {liveCalc.periodImpacts.map((p) => (
                  <tr key={p.label}>
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: 600,
                        color: C.accent,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {p.label}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: C.text,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {p.qty.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        color: p.impact > 0 ? C.green : p.impact < 0 ? C.red : C.text,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {p.impact > 0 ? "+" : ""}{fmt(p.impact)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── PRICE CHECK HISTORY ─── */}
      <div
        style={{
          background: C.card,
          borderRadius: "10px",
          padding: "24px",
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
          Price Check History
        </h3>

        {historyLoading ? (
          <div style={{ color: C.textDim, fontSize: "13px", padding: "40px 0", textAlign: "center" }}>
            Loading...
          </div>
        ) : !tableExists || history.length === 0 ? (
          <div style={{ color: C.textMuted, fontSize: "13px", padding: "40px 0", textAlign: "center" }}>
            No price checks yet
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Date", "Product", "Our Price", "Competitor", "Their Price", "Margin Impact"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 12px",
                          textAlign: "left",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: C.textDim,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id}>
                    <td style={{ padding: "10px 12px", color: C.textDim, borderBottom: `1px solid ${C.border}` }}>
                      {new Date(row.created_at).toLocaleDateString("en-IE")}
                    </td>
                    <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500, borderBottom: `1px solid ${C.border}` }}>
                      {row.product_name}
                      {row.lv_code && (
                        <span style={{ color: C.textDim, fontSize: "11px", marginLeft: "6px" }}>
                          {row.lv_code}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: C.text,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {fmt(row.our_price)}
                    </td>
                    <td style={{ padding: "10px 12px", color: C.text, borderBottom: `1px solid ${C.border}` }}>
                      {row.competitor_name}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: C.text,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {fmt(row.their_price)}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        color: num(row.margin_impact) < 0 ? C.red : C.green,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {num(row.margin_impact) >= 0 ? "+" : ""}
                      {fmt(row.margin_impact)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
