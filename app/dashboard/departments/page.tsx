"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { SAMPLE_DATA } from "@/lib/sample-data";
import { AiChat } from "@/components/AiChat";
import { C, fmt } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TopSellerRow {
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

interface DeptRow {
  name: string;
  code: string;
  sales: number;
  qty: number;
  margin: number;
  marginPct: number;
  subDepts?: DeptRow[];
}

type Period = "yd" | "l7d" | "ytd" | "ly";

const PERIODS: { key: Period; label: string }[] = [
  { key: "yd", label: "Yesterday" },
  { key: "l7d", label: "Last 7 Days" },
  { key: "ytd", label: "YTD" },
  { key: "ly", label: "LY" },
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DepartmentsPage() {
  const [rawData, setRawData] = useState<TopSellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("l7d");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /* ---------- Fetch ---------- */

  useEffect(() => {
    async function load() {
      setLoading(true);
      const PAGE = 1000;
      let all: TopSellerRow[] = [];
      let from = 0;
      let done = false;

      while (!done) {
        const { data, error } = await supabase
          .from("top_sellers")
          .select(
            "category,category_code,subcategory,l7d_sales,l7d_qty,l7d_margin,l7d_margin_pct,ly_sales,ly_qty,ly_margin,ly_margin_pct,ytd_sales,ytd_qty,ytd_margin,ytd_margin_pct,yd_sales,yd_qty,yd_margin,yd_margin_pct"
          )
          .eq("store_number", "2064")
          .range(from, from + PAGE - 1);

        if (error) {
          console.error("Departments fetch error:", error);
          break;
        }
        all = all.concat(data || []);
        if (!data || data.length < PAGE) done = true;
        else from += PAGE;
      }

      setRawData(all);
      setLoading(false);
    }
    load();
  }, []);

  /* ---------- Aggregate by category ---------- */

  const departments = useMemo(() => {
    const salesKey = `${period}_sales` as keyof TopSellerRow;
    const qtyKey = `${period}_qty` as keyof TopSellerRow;
    const marginKey = `${period}_margin` as keyof TopSellerRow;

    const catMap = new Map<
      string,
      { name: string; code: string; sales: number; qty: number; margin: number; subMap: Map<string, { name: string; sales: number; qty: number; margin: number }> }
    >();

    for (const r of rawData) {
      const catKey = r.category || "Unknown";
      const catCode = r.category_code || "";
      let cat = catMap.get(catKey);
      if (!cat) {
        cat = { name: catKey, code: catCode, sales: 0, qty: 0, margin: 0, subMap: new Map() };
        catMap.set(catKey, cat);
      }
      const s = num(r[salesKey]);
      const q = num(r[qtyKey]);
      const m = num(r[marginKey]);
      cat.sales += s;
      cat.qty += q;
      cat.margin += m;

      const subKey = r.subcategory || "Other";
      let sub = cat.subMap.get(subKey);
      if (!sub) {
        sub = { name: subKey, sales: 0, qty: 0, margin: 0 };
        cat.subMap.set(subKey, sub);
      }
      sub.sales += s;
      sub.qty += q;
      sub.margin += m;
    }

    const result: DeptRow[] = [];
    for (const [, cat] of catMap) {
      const subDepts: DeptRow[] = [];
      for (const [, sub] of cat.subMap) {
        subDepts.push({
          name: sub.name,
          code: "",
          sales: sub.sales,
          qty: sub.qty,
          margin: sub.margin,
          marginPct: sub.sales !== 0 ? (sub.margin / sub.sales) * 100 : 0,
        });
      }
      subDepts.sort((a, b) => b.sales - a.sales);

      result.push({
        name: cat.name,
        code: cat.code,
        sales: cat.sales,
        qty: cat.qty,
        margin: cat.margin,
        marginPct: cat.sales !== 0 ? (cat.margin / cat.sales) * 100 : 0,
        subDepts,
      });
    }
    result.sort((a, b) => b.sales - a.sales);
    return result;
  }, [rawData, period]);

  /* ---------- Summary KPIs ---------- */

  const totals = useMemo(() => {
    let sales = 0, margin = 0, qty = 0;
    for (const d of departments) {
      sales += d.sales;
      margin += d.margin;
      qty += d.qty;
    }
    return {
      sales,
      margin,
      qty,
      marginPct: sales !== 0 ? (margin / sales) * 100 : 0,
      deptCount: departments.length,
    };
  }, [departments]);

  /* ---------- Action flags ---------- */

  const flags = useMemo(() => {
    const lowMargin = departments.filter((d) => d.marginPct < 20 && d.sales > 0);
    const highPerformers = departments.filter((d) => d.marginPct >= 30 && d.sales > 0);
    return { lowMargin, highPerformers };
  }, [departments]);

  /* ---------- Display data ---------- */

  const displayData = useMemo(() => {
    if (selectedDept) {
      const dept = departments.find((d) => d.name === selectedDept);
      let subs = dept?.subDepts || [];
      if (search) {
        const q = search.toLowerCase();
        subs = subs.filter((s) => s.name.toLowerCase().includes(q));
      }
      return subs;
    }
    let depts = departments;
    if (search) {
      const q = search.toLowerCase();
      depts = depts.filter((d) => d.name.toLowerCase().includes(q));
    }
    return depts;
  }, [departments, selectedDept, search]);

  const selectedDeptData = departments.find((d) => d.name === selectedDept);

  /* ---------- Export ---------- */

  const handleExport = useCallback(async () => {
    const XLSX = await import("xlsx");
    const exportRows = displayData.map((r) => ({
      Department: r.name,
      "Sales €": r.sales,
      Qty: r.qty,
      "Margin €": r.margin,
      "Margin %": `${r.marginPct.toFixed(1)}%`,
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Departments");
    const periodLabel = PERIODS.find((p) => p.key === period)?.label ?? period;
    XLSX.writeFile(wb, `departments_2064_${periodLabel.replace(/\s/g, "_")}.xlsx`);
  }, [displayData, period]);

  /* ---------- Breadcrumb ---------- */

  const breadcrumb = selectedDept
    ? ["All Departments", selectedDept]
    : ["All Departments"];

  /* ---------- Render ---------- */

  return (
    <>
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
                Departments
              </h2>
              <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                {breadcrumb.map((item, i) => (
                  <span key={i} style={{ fontSize: "12px" }}>
                    {i > 0 && <span style={{ color: C.textMuted, margin: "0 4px" }}>/</span>}
                    <span
                      onClick={() => {
                        if (i === 0) setSelectedDept(null);
                      }}
                      style={{
                        color: i < breadcrumb.length - 1 ? C.accent : C.textDim,
                        cursor: i < breadcrumb.length - 1 ? "pointer" : "default",
                      }}
                    >
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
          </div>

          {/* Period toggle */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  style={pillBtn(period === p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ width: "1px", height: "20px", background: C.border }} />

            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments\u2026"
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
          <div
            style={{
              background: C.bg,
              borderRadius: "8px",
              padding: "14px 16px",
              borderLeft: `3px solid ${C.accent}`,
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "6px" }}>
              {selectedDept ? "Dept Sales" : "Total Sales"}
            </div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
              {loading ? "..." : fmt(selectedDeptData?.sales ?? totals.sales)}
            </div>
          </div>
          <div
            style={{
              background: C.bg,
              borderRadius: "8px",
              padding: "14px 16px",
              borderLeft: `3px solid ${C.accent}`,
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "6px" }}>
              {selectedDept ? "Dept Margin %" : "Avg Margin %"}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                color: marginColor(selectedDeptData?.marginPct ?? totals.marginPct),
              }}
            >
              {loading ? "..." : `${(selectedDeptData?.marginPct ?? totals.marginPct).toFixed(1)}%`}
            </div>
          </div>
          <div
            style={{
              background: C.bg,
              borderRadius: "8px",
              padding: "14px 16px",
              borderLeft: `3px solid ${C.cyan}`,
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "6px" }}>
              Total Qty
            </div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
              {loading ? "..." : fmtQty(selectedDeptData?.qty ?? totals.qty)}
            </div>
          </div>
          <div
            style={{
              background: C.bg,
              borderRadius: "8px",
              padding: "14px 16px",
              borderLeft: `3px solid ${C.amber}`,
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: C.textDim, textTransform: "uppercase", marginBottom: "6px" }}>
              Total Margin €
            </div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
              {loading ? "..." : fmt(selectedDeptData?.margin ?? totals.margin)}
            </div>
          </div>
        </div>

        {/* Action flags */}
        {!selectedDept && !loading && (flags.lowMargin.length > 0 || flags.highPerformers.length > 0) && (
          <div
            style={{
              padding: "12px 20px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {flags.lowMargin.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                <span style={{ color: C.red, fontWeight: 600 }}>&#9679;</span>
                <span style={{ color: C.textDim }}>
                  <strong style={{ color: C.red }}>{flags.lowMargin.length}</strong> dept{flags.lowMargin.length !== 1 ? "s" : ""} below 20% margin
                </span>
              </div>
            )}
            {flags.highPerformers.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                <span style={{ color: C.green, fontWeight: 600 }}>&#9679;</span>
                <span style={{ color: C.textDim }}>
                  <strong style={{ color: C.green }}>{flags.highPerformers.length}</strong> dept{flags.highPerformers.length !== 1 ? "s" : ""} above 30% margin
                </span>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        {loading ? (
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
                    { label: selectedDept ? "Sub-Department" : "Department", align: "left" },
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
                {displayData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", padding: "40px", color: C.textDim }}
                    >
                      No departments found
                    </td>
                  </tr>
                ) : (
                  displayData.map((row, i) => (
                    <tr
                      key={row.name + i}
                      onClick={() => {
                        if (!selectedDept && row.subDepts && row.subDepts.length > 0) {
                          setSelectedDept(row.name);
                          setSearch("");
                        }
                      }}
                      style={{
                        background: i % 2 === 0 ? C.bg : C.card,
                        cursor: !selectedDept && row.subDepts ? "pointer" : undefined,
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedDept && row.subDepts) {
                          (e.currentTarget as HTMLTableRowElement).style.background = C.borderLight;
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          i % 2 === 0 ? C.bg : C.card;
                      }}
                    >
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
                      <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {row.name?.replace(/^[A-Z]\d+\s*-\s*/, "")}
                          {!selectedDept && row.subDepts && row.subDepts.length > 0 && (
                            <span style={{ color: C.textMuted, fontSize: "11px" }}>
                              ({row.subDepts.length})
                            </span>
                          )}
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
                        {fmt(row.sales)}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: C.text,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {fmtQty(row.qty)}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: C.text,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {fmt(row.margin)}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 600,
                          color: marginColor(row.marginPct),
                        }}
                      >
                        {row.marginPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))
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
