"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { FHProduct, FHTotals } from "@/lib/types";
import { C, fmt, fmtPct } from "@/lib/utils";
import { KpiCard } from "./ui/KpiCard";
import { DataTable, Column } from "./ui/DataTable";

interface Props {
  data: FHProduct[];
  totals: FHTotals;
}

export function FrankHonestSection({ data, totals }: Props) {
  const activeSales = data.filter((d) => d.sales > 0);
  const chartData = activeSales.map((d) => ({ name: d.name, sales: d.sales }));
  const varianceData = data
    .filter((d) => d.invoiceQty > 0 || d.variance !== 0)
    .map((d) => ({ name: d.name, invoiced: d.invoiceQty, variance: Math.abs(d.variance) }));

  const columns: Column<FHProduct>[] = [
    { label: "Product", key: "name" },
    {
      label: "Sales €",
      key: "sales",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {r.sales > 0 ? fmt(r.sales) : <span style={{ color: C.textMuted }}>—</span>}
        </span>
      ),
    },
    {
      label: "Invoiced",
      key: "invoiceQty",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {r.invoiceQty || <span style={{ color: C.textMuted }}>—</span>}
        </span>
      ),
    },
    {
      label: "Waste %",
      key: "wastePct",
      align: "right",
      render: (r) => (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color:
              r.wastePct == null
                ? C.textMuted
                : r.wastePct >= 1
                ? C.red
                : r.wastePct < 0
                ? C.green
                : C.amber,
          }}
        >
          {r.wastePct == null ? "—" : fmtPct(r.wastePct)}
        </span>
      ),
    },
    {
      label: "Cups",
      key: "wasteCups",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {r.wasteCups !== 0 ? r.wasteCups : <span style={{ color: C.textMuted }}>—</span>}
        </span>
      ),
    },
    {
      label: "Variance",
      key: "variance",
      align: "right",
      render: (r) => {
        if (r.variance === 0) return <span style={{ color: C.textMuted }}>—</span>;
        const isWaste = r.variance > 0;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: isWaste ? C.red : C.green }}>
              {r.variance > 0 ? "+" : ""}{r.variance}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: "4px",
                background: isWaste ? `${C.red}22` : `${C.green}22`,
                color: isWaste ? C.red : C.green,
                letterSpacing: "0.05em",
              }}
            >
              {isWaste ? "WASTE" : "OVERSOLD"}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>☕</span> F&H Coffee
        </h2>
        <p style={{ fontSize: "13px", color: C.textDim, marginTop: "4px" }}>
          Frank &amp; Honest telemetry tracking — invoiced cups vs scanned at till
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        <KpiCard label="Total Sales" value={fmt(totals.totalSales)} accent={C.coffee} />
        <KpiCard label="Cups Invoiced" value={totals.totalInvoiced.toLocaleString()} accent={C.coffee} />
        <KpiCard label="Cups Sold" value={totals.totalSold.toLocaleString()} accent={C.coffee} />
        <KpiCard
          label="Variance"
          value={totals.totalVariance.toLocaleString()}
          accent={totals.totalVariance > 0 ? C.red : totals.totalVariance < 0 ? C.green : C.textDim}
          subtitle={totals.totalVariance > 0 ? "cups waste/theft" : totals.totalVariance < 0 ? "cups oversold" : undefined}
        />
      </div>

      {/* Explainer banner */}
      <div
        style={{
          background: `${C.coffee}18`,
          border: `1px solid ${C.coffee}44`,
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "13px",
          color: C.textDim,
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: C.amber, fontWeight: 600 }}>How it works: </span>
        F&H invoices the store for every cup dispensed by the machine (telemetry). The store scans cups at the till.
        A positive variance means cups were dispensed but not scanned — waste or theft. Negative means more scanned than dispensed.
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "16px",
            border: `1px solid ${C.border}`,
          }}
        >
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Sales by Product
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 5, left: 5, bottom: 40 }}>
              <XAxis dataKey="name" tick={{ fill: C.textDim, fontSize: 10 }} angle={-30} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} tick={{ fill: C.textDim, fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
              <Tooltip formatter={(v: unknown) => [fmt(v as number), "Sales"]} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.text }} />
              <Bar dataKey="sales" fill={C.coffee} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: C.card,
            borderRadius: "10px",
            padding: "16px",
            border: `1px solid ${C.border}`,
          }}
        >
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: C.textDim, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Invoiced vs Variance (cups)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={varianceData} margin={{ top: 0, right: 5, left: 5, bottom: 40 }}>
              <XAxis dataKey="name" tick={{ fill: C.textDim, fontSize: 10 }} angle={-30} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textDim, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.text }} />
              <Bar dataKey="invoiced" name="Invoiced" fill={`${C.accent}88`} radius={[4, 4, 0, 0]} />
              <Bar dataKey="variance" name="Variance" radius={[4, 4, 0, 0]}>
                {varianceData.map((entry, i) => {
                  const src = data.find((d) => d.name === entry.name);
                  return <Cell key={i} fill={src && src.variance > 0 ? C.red : C.green} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product detail table */}
      <div
        style={{
          background: C.card,
          borderRadius: "10px",
          border: `1px solid ${C.border}`,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px", borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>Product Detail</h3>
        </div>
        <DataTable columns={columns} data={data} />
      </div>

      {/* Alert cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {data.filter((d) => d.wastePct === 1).map((d) => (
          <div
            key={d.id}
            style={{
              background: `${C.red}18`,
              border: `1px solid ${C.red}44`,
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "13px",
              color: C.red,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <span>
              <strong>{d.name}</strong> — 100% waste ({d.invoiceQty} cups invoiced, 0 scanned). Check machine/till configuration.
            </span>
          </div>
        ))}
        {data.filter((d) => d.variance < -50).map((d) => (
          <div
            key={d.id}
            style={{
              background: `${C.green}18`,
              border: `1px solid ${C.green}44`,
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "13px",
              color: C.green,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "16px" }}>ℹ️</span>
            <span>
              <strong>{d.name}</strong> — {Math.abs(d.variance)} cups oversold (more scanned than invoiced). May indicate telemetry undercount.
            </span>
          </div>
        ))}
        {data.filter((d) => d.id === "milk_ab" && d.variance > 0).map((d) => (
          <div
            key={d.id}
            style={{
              background: `${C.amber}18`,
              border: `1px solid ${C.amber}44`,
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "13px",
              color: C.amber,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <span>
              <strong>Milk Aborts</strong> — {d.variance} recorded. Machine aborted mid-pour. Check milk supply/machine maintenance.
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
