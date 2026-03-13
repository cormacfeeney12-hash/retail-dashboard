"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { C, fmt } from "@/lib/utils";

interface TopSeller {
  store_number: number;
  name: string;
  lv_code: string;
  category: string;
  category_code: string;
  l4w_sales: number;
  l4w_margin: number;
  l4w_margin_pct: number;
}

type PeriodFilter = "l4w" | "yesterday";

export function TopSellers() {
  const [data, setData] = useState<TopSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter>("l4w");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("top_sellers")
        .select("*")
        .order("category_code", { ascending: true })
        .order("l4w_margin", { ascending: false });

      if (error) console.error("Top sellers load error:", error);
      setData(rows || []);
      setLoading(false);
    }
    load();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(data.map((r) => r.category))].sort();
    return ["All", ...cats];
  }, [data]);

  const filtered = useMemo(() => {
    let rows = data;
    if (category !== "All") rows = rows.filter((r) => r.category === category);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }
    return rows;
  }, [data, category, search]);

  const marginColor = (pct: number) => {
    if (pct >= 0.3) return C.green;
    if (pct >= 0.15) return C.amber;
    return C.red;
  };

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
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.text, margin: 0 }}>
            Top Sellers
          </h2>
          <p style={{ fontSize: "12px", color: C.textDim, marginTop: "2px", margin: 0 }}>
            {loading ? "Loading..." : `${filtered.length} products`}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Period toggle */}
          <div style={{ display: "flex", gap: "2px" }}>
            {([
              { key: "l4w" as PeriodFilter, label: "Last 4 Weeks" },
              { key: "yesterday" as PeriodFilter, label: "Yesterday" },
            ]).map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  border: `1px solid ${period === p.key ? C.accent : C.border}`,
                  background: period === p.key ? `${C.accent}22` : "transparent",
                  color: period === p.key ? C.accent : C.textDim,
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: period === p.key ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "6px 10px",
              fontSize: "12px",
              color: C.text,
              outline: "none",
              maxWidth: "220px",
              cursor: "pointer",
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

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
                  { label: "Product Name", align: "left" },
                  { label: "LV Code", align: "left" },
                  { label: "Category", align: "left" },
                  { label: "Sales \u20AC", align: "right" },
                  { label: "Margin \u20AC", align: "right" },
                  { label: "Margin %", align: "right" },
                ].map((col) => (
                  <th
                    key={col.label}
                    style={{
                      padding: "10px 12px",
                      textAlign: col.align as "left" | "right",
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
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: C.textDim,
                    }}
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={row.lv_code + i}
                    style={{
                      background: i % 2 === 0 ? C.bg : C.card,
                    }}
                  >
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
                      {fmt(row.l4w_sales)}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        color: C.text,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {fmt(row.l4w_margin)}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        color: marginColor(row.l4w_margin_pct),
                      }}
                    >
                      {(row.l4w_margin_pct * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
