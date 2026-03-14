"use client";

import { useEffect, useState, useMemo } from "react";
import { rds } from "@/lib/rds";
import { SAMPLE_DATA } from "@/lib/sample-data";
import { DeptBarChart } from "@/components/charts/DeptBarChart";
import { AiChat } from "@/components/AiChat";
import { CpuAlerts } from "@/components/CpuAlerts";
import { C, fmt, fmtK } from "@/lib/utils";
import { STORE_LABELS, STORE_COLORS } from "@/components/DashboardNav";

const { departments } = SAMPLE_DATA;

type StoreFilter = "2064" | "2056" | "both";

interface TopSellerRow {
  store_number: string;
  yd_sales: number | null;
  yd_margin: number | null;
  l7d_sales: number | null;
  l7d_margin: number | null;
  ytd_sales: number | null;
  ytd_margin: number | null;
  ly_sales: number | null;
  ly_margin: number | null;
  category: string;
  category_code: string;
}

const num = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
  return 0;
};

const pillBtn = (active: boolean, color?: string): React.CSSProperties => {
  const c = color && active ? color : active ? C.accent : undefined;
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

export default function OverviewPage() {
  const [allRows, setAllRows] = useState<TopSellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<StoreFilter>("2064");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await rds.query<TopSellerRow>(
        "SELECT store_number,yd_sales,yd_margin,l7d_sales,l7d_margin,ytd_sales,ytd_margin,ly_sales,ly_margin,category,category_code FROM top_sellers"
      );
      if (error) console.error("Overview fetch error:", error);
      setAllRows(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const rows = useMemo(() => {
    if (store === "both") return allRows;
    return allRows.filter((r) => r.store_number === store);
  }, [allRows, store]);

  const kpis = useMemo(() => {
    let ydSales = 0, ydMargin = 0;
    let l7dSales = 0, l7dMargin = 0;
    let ytdSales = 0, ytdMargin = 0;
    let lySales = 0, lyMargin = 0;

    for (const r of rows) {
      ydSales += num(r.yd_sales);
      ydMargin += num(r.yd_margin);
      l7dSales += num(r.l7d_sales);
      l7dMargin += num(r.l7d_margin);
      ytdSales += num(r.ytd_sales);
      ytdMargin += num(r.ytd_margin);
      lySales += num(r.ly_sales);
      lyMargin += num(r.ly_margin);
    }

    const pct = (margin: number, sales: number) =>
      sales !== 0 ? (margin / sales) * 100 : 0;

    return {
      ydSales, ydMargin, ydMarginPct: pct(ydMargin, ydSales),
      l7dSales, l7dMargin, l7dMarginPct: pct(l7dMargin, l7dSales),
      ytdSales, ytdMargin, ytdMarginPct: pct(ytdMargin, ytdSales),
      lySales, lyMargin, lyMarginPct: pct(lyMargin, lySales),
    };
  }, [rows]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { name: string; l7d_sales: number; l7d_margin: number }>();
    for (const r of rows) {
      const key = r.category_code || r.category || "Unknown";
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          name: r.category?.replace(/^[A-Z]\d+\s*-\s*/, "") || key,
          l7d_sales: num(r.l7d_sales),
          l7d_margin: num(r.l7d_margin),
        });
      } else {
        existing.l7d_sales += num(r.l7d_sales);
        existing.l7d_margin += num(r.l7d_margin);
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.l7d_sales - a.l7d_sales)
      .slice(0, 10);
  }, [rows]);

  const marginColor = (pct: number) => {
    if (pct >= 30) return C.green;
    if (pct >= 20) return C.amber;
    return C.red;
  };

  const storeLabel = STORE_LABELS[store] ?? store;

  return (
    <>
      {/* Store toggle */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
        {(
          [
            { key: "2064" as StoreFilter, label: STORE_LABELS["2064"] },
            { key: "2056" as StoreFilter, label: STORE_LABELS["2056"] },
            { key: "both" as StoreFilter, label: STORE_LABELS["both"] },
          ] as const
        ).map((s) => (
          <button key={s.key} onClick={() => setStore(s.key)} style={pillBtn(store === s.key, STORE_COLORS[s.key])}>
            {s.label}
          </button>
        ))}
      </div>

      {/* KPI grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Retail Sales */}
        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "28px 28px",
            borderTop: `2px solid ${C.accent}`,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: C.textDim,
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Retail Sales
          </div>
          {loading ? (
            <div style={{ color: C.textDim, fontSize: "13px" }}>Loading...</div>
          ) : (
            <div style={{ display: "flex", gap: "20px" }}>
              {[
                { label: "Yesterday", value: kpis.ydSales },
                { label: "Last 7 Days", value: kpis.l7dSales },
                { label: "YTD", value: kpis.ytdSales },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    ...(idx > 0 ? { borderLeft: `1px solid ${C.border}`, paddingLeft: "20px" } : {}),
                  }}
                >
                  <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "26px",
                      fontWeight: 600,
                      color: C.text,
                      fontFamily: "'JetBrains Mono', monospace",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.value > 99999 ? fmtK(item.value) : fmt(item.value)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scan Margin % */}
        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "28px 28px",
            borderTop: `2px solid ${C.accent}`,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: C.textDim,
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Scan Margin %
          </div>
          {loading ? (
            <div style={{ color: C.textDim, fontSize: "13px" }}>Loading...</div>
          ) : (
            <div style={{ display: "flex", gap: "20px" }}>
              {[
                { label: "Yesterday", value: kpis.ydMarginPct },
                { label: "Last 7 Days", value: kpis.l7dMarginPct },
                { label: "YTD", value: kpis.ytdMarginPct },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    ...(idx > 0 ? { borderLeft: `1px solid ${C.border}`, paddingLeft: "20px" } : {}),
                  }}
                >
                  <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "26px",
                      fontWeight: 600,
                      fontFamily: "'JetBrains Mono', monospace",
                      lineHeight: 1.2,
                      color: marginColor(item.value),
                    }}
                  >
                    {item.value.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LY Comparison */}
        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "28px 28px",
            borderTop: `2px solid ${C.textMuted}`,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: C.textDim,
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Last Year
          </div>
          {loading ? (
            <div style={{ color: C.textDim, fontSize: "13px" }}>Loading...</div>
          ) : (
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>
                  LY Sales
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 600,
                    color: C.text,
                    fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: 1.2,
                  }}
                >
                  {kpis.lySales > 99999 ? fmtK(kpis.lySales) : fmt(kpis.lySales)}
                </div>
              </div>
              <div style={{ flex: 1, borderLeft: `1px solid ${C.border}`, paddingLeft: "20px" }}>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>
                  LY Margin %
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: 1.2,
                    color: marginColor(kpis.lyMarginPct),
                  }}
                >
                  {kpis.lyMarginPct.toFixed(2)}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Sales Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "20px",
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
            Top Categories — Last 7 Days Sales
          </h3>
          {loading ? (
            <div style={{ color: C.textDim, fontSize: "13px", padding: "40px 0", textAlign: "center" }}>
              Loading...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {categoryBreakdown.map((cat, i) => {
                const maxSales = categoryBreakdown[0]?.l7d_sales || 1;
                const pct = cat.l7d_sales > 0 ? (cat.l7d_margin / cat.l7d_sales) * 100 : 0;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: C.textDim,
                        width: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {cat.name}
                    </div>
                    <div style={{ flex: 1, height: "18px", background: C.bg, borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(cat.l7d_sales / maxSales) * 100}%`,
                          background: `${C.accent}88`,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: C.text,
                        width: "70px",
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {fmt(cat.l7d_sales)}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: marginColor(pct),
                        width: "50px",
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {pct.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "20px",
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
            Top 8 Departments — Weekly Sales
          </h3>
          <DeptBarChart data={departments} />
        </div>
      </div>

      {/* CPU Price Alerts */}
      <div style={{ marginTop: "40px" }}>
        <CpuAlerts />
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "40px",
          fontSize: "12px",
          color: C.textMuted,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Source: Pyramid Analytics — {storeLabel}</span>
        <span>Retail Dashboard v1 — AI Powered</span>
      </div>

      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
