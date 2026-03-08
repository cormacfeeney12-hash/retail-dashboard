"use client";

import { useState } from "react";
import { SAMPLE_DATA } from "@/lib/sample-data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DataTable, Column } from "@/components/ui/DataTable";
import { KpiCard } from "@/components/ui/KpiCard";
import { Badge } from "@/components/ui/Badge";
import { AiChat } from "@/components/AiChat";
import { C, fmt, fmtPct } from "@/lib/utils";
import type { Department, SubDept } from "@/lib/types";

const { departments } = SAMPLE_DATA;

export default function DepartmentsPage() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedSubDept, setSelectedSubDept] = useState<SubDept | null>(null);

  const breadcrumb = ["All Departments", selectedDept?.n, selectedSubDept?.n].filter(Boolean) as string[];

  const drillData: (Department | SubDept)[] = selectedDept
    ? selectedSubDept
      ? []
      : selectedDept.sub
    : departments;

  const handleBreadcrumb = (index: number) => {
    if (index === 0) {
      setSelectedDept(null);
      setSelectedSubDept(null);
    } else if (index === 1) {
      setSelectedSubDept(null);
    }
  };

  const handleRowClick = (row: Department | SubDept) => {
    if (!selectedDept) {
      setSelectedDept(row as Department);
      setSelectedSubDept(null);
    } else if (!selectedSubDept) {
      setSelectedSubDept(row as SubDept);
    }
  };

  const deptColumns: Column<Department | SubDept>[] = [
    {
      label: "Department",
      key: "n",
      render: (r) => (
        <span style={{ fontWeight: 500, color: C.text, cursor: "pointer" }}>
          {r.n}
          {!selectedDept && (r as Department).sub?.length > 0 && (
            <span style={{ color: C.textMuted, marginLeft: "6px", fontSize: "11px" }}>
              ({(r as Department).sub.length})
            </span>
          )}
        </span>
      ),
    },
    {
      label: "Sales €",
      key: "s",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {r.s != null ? fmt(r.s) : <span style={{ color: C.textMuted }}>—</span>}
        </span>
      ),
    },
    {
      label: "Sales Var",
      key: "sv",
      align: "right",
      render: (r) => <Badge value={r.sv} />,
    },
    {
      label: "YTD Var",
      key: "sy",
      align: "right",
      render: (r) => <Badge value={r.sy} />,
    },
    {
      label: "Margin %",
      key: "m",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {r.m != null ? `${(r.m * 100).toFixed(2)}%` : <span style={{ color: C.textMuted }}>—</span>}
        </span>
      ),
    },
    {
      label: "Margin Var",
      key: "mv",
      align: "right",
      render: (r) => <Badge value={r.mv} />,
    },
    {
      label: "Partic.",
      key: "p",
      align: "right",
      render: (r) => (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.textDim }}>
          {r.p != null ? `${(r.p * 100).toFixed(2)}%` : "—"}
        </span>
      ),
    },
    {
      label: "Waste €",
      key: "w",
      align: "right",
      render: (r) => (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: r.w && r.w > 0 ? C.amber : C.textMuted,
          }}
        >
          {r.w != null && r.w > 0 ? fmt(r.w) : "—"}
        </span>
      ),
    },
  ];

  const currentItem = selectedSubDept ?? selectedDept;

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
          }}
        >
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>
              Departments
            </h2>
            <Breadcrumb items={breadcrumb} onNavigate={handleBreadcrumb} />
          </div>
        </div>

        {/* Drill-down KPIs */}
        {currentItem && (
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${C.border}`,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
            }}
          >
            <KpiCard
              label="Weekly Sales"
              value={currentItem.s != null ? fmt(currentItem.s) : "—"}
              variancePct={currentItem.sv}
              accent={C.accent}
            />
            <KpiCard
              label="YTD Var"
              value={fmtPct(currentItem.sy)}
              variancePct={currentItem.sy}
              accent={C.accent}
            />
            <KpiCard
              label="Margin %"
              value={currentItem.m != null ? `${(currentItem.m * 100).toFixed(2)}%` : "—"}
              variancePct={currentItem.mv}
              accent={C.accent}
            />
            <KpiCard
              label="Participation"
              value={currentItem.p != null ? `${(currentItem.p * 100).toFixed(2)}%` : "—"}
              accent={C.accent}
            />
            {!selectedSubDept && (
              <KpiCard
                label="Waste €"
                value={currentItem.w != null && currentItem.w > 0 ? fmt(currentItem.w) : "—"}
                accent={currentItem.w && currentItem.w > 0 ? C.amber : C.accent}
              />
            )}
          </div>
        )}

        {/* Table */}
        {drillData.length > 0 ? (
          <DataTable
            columns={deptColumns}
            data={drillData}
            onRowClick={selectedSubDept ? undefined : handleRowClick}
          />
        ) : (
          selectedSubDept && (
            <div style={{ padding: "40px", textAlign: "center", color: C.textDim, fontSize: "13px" }}>
              No further breakdown available for this sub-department
            </div>
          )
        )}
      </div>

      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
