"use client";

import { useState, useMemo } from "react";
import { SAMPLE_DATA } from "@/lib/sample-data";
import { DataTable, Column } from "@/components/ui/DataTable";
import { AiChat } from "@/components/AiChat";
import { C } from "@/lib/utils";
import type { Benchmark } from "@/lib/types";

const { benchmarks } = SAMPLE_DATA;

export default function BenchmarkPage() {
  const [search, setSearch] = useState("");

  const data = useMemo(() => {
    let filtered = benchmarks;
    if (search) filtered = filtered.filter((b) => b.n.toLowerCase().includes(search.toLowerCase()));
    return [...filtered].sort((a, b) => (a.v ?? 0) - (b.v ?? 0)); // worst underperformance first
  }, [search]);

  const columns: Column<Benchmark>[] = [
    { label: "Product", key: "n", render: (r) => <span style={{ fontWeight: 500 }}>{r.n}</span> },
    {
      label: "Expected Qty",
      key: "bq",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.textDim }}>
          {r.bq != null ? r.bq.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      label: "Actual Qty",
      key: "aq",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {r.aq != null ? r.aq.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      label: "Variance",
      key: "v",
      align: "right",
      render: (r) => {
        if (r.v == null) return <span style={{ color: C.textMuted }}>—</span>;
        return (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              color: r.v >= 0 ? C.green : C.red,
            }}
          >
            {r.v > 0 ? "+" : ""}
            {r.v.toLocaleString()}
          </span>
        );
      },
    },
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
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.text }}>Benchmark</h2>
            <p style={{ fontSize: "12px", color: C.textDim, marginTop: "2px" }}>
              Sorted by biggest underperformance vs benchmark — {data.length} products
            </p>
          </div>
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
              width: "220px",
            }}
          />
        </div>
        <DataTable columns={columns} data={data} maxHeight="600px" />
      </div>

      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
