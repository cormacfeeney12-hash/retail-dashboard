"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { C, fmt } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TopSeller {
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

type Period = "yd" | "l7d" | "ytd" | "ly";
type SortField = "margin" | "sales" | "qty";
type SortDir = "desc" | "asc";
type StoreFilter = "2064" | "2056" | "combined";
type Slice = "top" | "bottom";

const PERIODS: { key: Period; label: string }[] = [
  { key: "yd", label: "Yesterday" },
  { key: "l7d", label: "Last 7 Days" },
  { key: "ytd", label: "YTD" },
  { key: "ly", label: "LY" },
];

const SORT_OPTIONS: { key: SortField; label: string }[] = [
  { key: "margin", label: "Margin €" },
  { key: "sales", label: "Sales €" },
  { key: "qty", label: "Qty" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const col = (period: Period, metric: "sales" | "qty" | "margin" | "margin_pct") =>
  `${period}_${metric}` as keyof TopSeller;

const num = (v: unknown): number => (typeof v === "number" ? v : 0);

const fmtQty = (v: number | null | undefined) => (v == null ? "—" : v.toLocaleString("en-IE"));

const marginColor = (pct: number | null) => {
  if (pct == null) return C.textDim;
  const p = pct * 100;
  if (p >= 30) return C.green;
  if (p >= 20) return C.amber;
  return C.red;
};

/* ------------------------------------------------------------------ */
/*  Shared inline-style helpers                                        */
/* ------------------------------------------------------------------ */

const selectStyle: React.CSSProperties = {
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: "8px",
  padding: "6px 10px",
  fontSize: "12px",
  color: C.text,
  outline: "none",
  maxWidth: "240px",
  cursor: "pointer",
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TopSellers() {
  const [data, setData] = useState<TopSeller[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [store, setStore] = useState<StoreFilter>("2064");
  const [period, setPeriod] = useState<Period>("l7d");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [search, setSearch] = useState("");

  // Sort & slice
  const [sortField, setSortField] = useState<SortField>("margin");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [slice, setSlice] = useState<Slice>("top");

  /* ---------- Fetch data (paginate past Supabase 1000-row default) -- */

  useEffect(() => {
    async function load() {
      setLoading(true);
      const PAGE = 1000;
      let allRows: TopSeller[] = [];
      let from = 0;
      let done = false;

      while (!done) {
        const { data: rows, error } = await supabase
          .from("top_sellers")
          .select("*")
          .range(from, from + PAGE - 1);

        if (error) {
          console.error("Top sellers load error:", error);
          break;
        }
        allRows = allRows.concat(rows || []);
        if (!rows || rows.length < PAGE) done = true;
        else from += PAGE;
      }

      setData(allRows);
      setLoading(false);
    }
    load();
  }, []);

  /* ---------- Derived lists ---------- */

  const storeData = useMemo(() => {
    if (store === "combined") {
      // Aggregate rows across stores by lv_code
      const map = new Map<string, TopSeller>();
      for (const r of data) {
        const existing = map.get(r.lv_code);
        if (!existing) {
          map.set(r.lv_code, { ...r, store_number: "combined" });
        } else {
          // Sum all numeric fields
          const merged = { ...existing };
          for (const p of ["yd", "l7d", "ytd", "ly"] as const) {
            for (const m of ["sales", "qty", "margin"] as const) {
              const k = col(p, m);
              (merged as Record<string, unknown>)[k] = num(existing[k]) + num(r[k]);
            }
            // Recalculate margin_pct from totals
            const salesK = col(p, "sales");
            const marginK = col(p, "margin");
            const pctK = col(p, "margin_pct");
            const totalSales = num(merged[salesK]);
            (merged as Record<string, unknown>)[pctK] =
              totalSales !== 0 ? num(merged[marginK]) / totalSales : null;
          }
          map.set(r.lv_code, merged);
        }
      }
      return Array.from(map.values());
    }
    return data.filter((r) => r.store_number === store);
  }, [data, store]);

  const categories = useMemo(() => {
    const cats = [...new Set(storeData.map((r) => r.category))].sort();
    return ["All", ...cats];
  }, [storeData]);

  const subcategories = useMemo(() => {
    if (category === "All") return ["All"];
    const subs = [
      ...new Set(
        storeData.filter((r) => r.category === category).map((r) => r.subcategory)
      ),
    ].sort();
    return ["All", ...subs];
  }, [storeData, category]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategory("All");
  }, [category]);

  /* ---------- Filter, sort, slice ---------- */

  const processed = useMemo(() => {
    let rows = storeData;

    // Category filter
    if (category !== "All") rows = rows.filter((r) => r.category === category);
    // Subcategory filter
    if (subcategory !== "All") rows = rows.filter((r) => r.subcategory === subcategory);
    // Search
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.name?.toLowerCase().includes(q));
    }

    // Sort
    const sortKey = col(period, sortField === "qty" ? "qty" : sortField === "sales" ? "sales" : "margin");
    rows = [...rows].sort((a, b) => {
      const va = num(a[sortKey]);
      const vb = num(b[sortKey]);
      return sortDir === "desc" ? vb - va : va - vb;
    });

    // Slice top/bottom 100
    if (slice === "top") {
      rows = rows.slice(0, 100);
    } else {
      rows = rows.slice(-100).reverse();
    }

    return rows;
  }, [storeData, category, subcategory, search, period, sortField, sortDir, slice]);

  /* ---------- Export ---------- */

  const handleExport = useCallback(async () => {
    const XLSX = await import("xlsx");
    const exportRows = processed.map((r) => ({
      "Product Name": r.name,
      "LV Code": r.lv_code,
      Category: r.category,
      Subcategory: r.subcategory,
      [`Sales €`]: r[col(period, "sales")],
      Qty: r[col(period, "qty")],
      [`Margin €`]: r[col(period, "margin")],
      [`Margin %`]: r[col(period, "margin_pct")] != null
        ? `${(num(r[col(period, "margin_pct")]) * 100).toFixed(1)}%`
        : "",
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Top Sellers");
    const periodLabel = PERIODS.find((p) => p.key === period)?.label ?? period;
    XLSX.writeFile(wb, `top_sellers_${store}_${periodLabel.replace(/\s/g, "_")}.xlsx`);
  }, [processed, period, store]);

  /* ---------- Render ---------- */

  const salesKey = col(period, "sales");
  const qtyKey = col(period, "qty");
  const marginKey = col(period, "margin");
  const marginPctKey = col(period, "margin_pct");

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
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.text, margin: 0 }}>
              Top Sellers
            </h2>
            <p style={{ fontSize: "12px", color: C.textDim, marginTop: "2px", margin: 0 }}>
              {loading ? "Loading..." : `${processed.length} products`}
            </p>
          </div>

          <button
            onClick={handleExport}
            style={{
              ...pillBtn(false),
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "14px" }}>&#8595;</span> Export Excel
          </button>
        </div>

        {/* Controls row 1: Store, Period */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Store toggle */}
          <div style={{ display: "flex", gap: "2px" }}>
            {(
              [
                { key: "2064" as StoreFilter, label: "2064" },
                { key: "2056" as StoreFilter, label: "2056" },
                { key: "combined" as StoreFilter, label: "Combined" },
              ] as const
            ).map((s) => (
              <button key={s.key} onClick={() => setStore(s.key)} style={pillBtn(store === s.key)}>
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ width: "1px", height: "20px", background: C.border }} />

          {/* Period toggle */}
          <div style={{ display: "flex", gap: "2px" }}>
            {PERIODS.map((p) => (
              <button key={p.key} onClick={() => setPeriod(p.key)} style={pillBtn(period === p.key)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls row 2: Category, Subcategory, Sort, Direction, Slice, Search */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={selectStyle}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Subcategory dropdown */}
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            style={{ ...selectStyle, maxWidth: "280px" }}
            disabled={category === "All"}
          >
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          <div style={{ width: "1px", height: "20px", background: C.border }} />

          {/* Sort by */}
          <span style={{ fontSize: "12px", color: C.textDim }}>Sort:</span>
          <div style={{ display: "flex", gap: "2px" }}>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSortField(s.key)}
                style={pillBtn(sortField === s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Direction toggle */}
          <button
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            style={pillBtn(false)}
            title={sortDir === "desc" ? "Best to Worst" : "Worst to Best"}
          >
            {sortDir === "desc" ? "Best ▸ Worst" : "Worst ▸ Best"}
          </button>

          <div style={{ width: "1px", height: "20px", background: C.border }} />

          {/* Top / Bottom toggle */}
          <div style={{ display: "flex", gap: "2px" }}>
            <button onClick={() => setSlice("top")} style={pillBtn(slice === "top")}>
              Top 100
            </button>
            <button onClick={() => setSlice("bottom")} style={pillBtn(slice === "bottom")}>
              Bottom 100
            </button>
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products\u2026"
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "13px",
              color: C.text,
              outline: "none",
              width: "200px",
              marginLeft: "auto",
            }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div
          style={{
            color: C.textDim,
            fontSize: "13px",
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          Loading top sellers...
        </div>
      ) : (
        <div style={{ overflowX: "auto", maxHeight: "600px", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>
                {[
                  { label: "#", align: "right" },
                  { label: "Product Name", align: "left" },
                  { label: "LV Code", align: "left" },
                  { label: "Category", align: "left" },
                  { label: "Sales €", align: "right" },
                  { label: "Qty", align: "right" },
                  { label: "Margin €", align: "right" },
                  { label: "Margin %", align: "right" },
                ].map((h) => (
                  <th
                    key={h.label}
                    style={{
                      padding: "10px 12px",
                      textAlign: h.align as "left" | "right",
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
                    }}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processed.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: "center", padding: "40px", color: C.textDim }}
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                processed.map((row, i) => {
                  const pct = row[marginPctKey] as number | null;
                  return (
                    <tr key={row.lv_code + i} style={{ background: i % 2 === 0 ? C.bg : C.card }}>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: C.textDim,
                          fontSize: "11px",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: C.text,
                          fontWeight: 500,
                          maxWidth: "300px",
                        }}
                      >
                        <div
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.name}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: C.textDim,
                          fontSize: "12px",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {row.lv_code}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: C.textDim,
                          fontSize: "12px",
                          maxWidth: "180px",
                        }}
                      >
                        <div
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.category}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: C.text,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {fmt(row[salesKey] as number | null)}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: C.text,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {fmtQty(row[qtyKey] as number | null)}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: C.text,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {fmt(row[marginKey] as number | null)}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 600,
                          color: marginColor(pct),
                        }}
                      >
                        {pct != null ? `${(pct * 100).toFixed(1)}%` : "—"}
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
  );
}
