"use client";

import { useState, useMemo } from "react";
import { SAMPLE_DATA } from "@/lib/sample-data";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AiChat } from "@/components/AiChat";
import { C, fmt } from "@/lib/utils";
import type { Product } from "@/lib/types";

type SortKey = "q" | "s" | "m" | "mp";

const { products } = SAMPLE_DATA;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("q");
  const [sortDir, setSortDir] = useState<-1 | 1>(-1);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === -1 ? 1 : -1));
    else { setSortKey(key); setSortDir(-1); }
  };

  const data = useMemo(() => {
    let filtered = products;
    if (search) filtered = filtered.filter((p) => p.n.toLowerCase().includes(search.toLowerCase()));
    return [...filtered].sort((a, b) => (b[sortKey] - a[sortKey]) * sortDir);
  }, [search, sortKey, sortDir]);

  const marginColor = (mp: number) => {
    if (mp >= 0.3) return C.green;
    if (mp >= 0.15) return C.amber;
    return C.red;
  };

  const columns: Column<Product>[] = [
    { label: "Product", key: "n", render: (r) => <span style={{ fontWeight: 500 }}>{r.n}</span> },
    {
      label: "Qty",
      key: "q",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{r.q.toLocaleString()}</span>
      ),
    },
    {
      label: "Sales €",
      key: "s",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(r.s)}</span>
      ),
    },
    {
      label: "Margin €",
      key: "m",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(r.m)}</span>
      ),
    },
    {
      label: "Margin %",
      key: "mp",
      align: "right",
      render: (r) => (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            color: marginColor(r.mp),
          }}
        >
          {(r.mp * 100).toFixed(1)}%
        </span>
      ),
    },
  ];

  const SORT_LABELS: { key: SortKey; label: string }[] = [
    { key: "q", label: "Qty" },
    { key: "s", label: "Sales" },
    { key: "m", label: "Margin €" },
    { key: "mp", label: "Margin %" },
  ];

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
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.text }}>Top Sellers</h2>
            <p style={{ fontSize: "12px", color: C.textDim, marginTop: "2px" }}>
              {data.length} products
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Sort buttons */}
            <div style={{ display: "flex", gap: "4px" }}>
              {SORT_LABELS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSort(s.key)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${sortKey === s.key ? C.accent : C.border}`,
                    background: sortKey === s.key ? `${C.accent}22` : "transparent",
                    color: sortKey === s.key ? C.accent : C.textDim,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: sortKey === s.key ? 600 : 400,
                  }}
                >
                  {s.label}{sortKey === s.key ? (sortDir === -1 ? " ↓" : " ↑") : ""}
                </button>
              ))}
            </div>
            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
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

        <DataTable columns={columns} data={data} maxHeight="600px" />
      </div>

      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
