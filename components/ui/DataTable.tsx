"use client";

import { ReactNode } from "react";
import { C } from "@/lib/utils";

export interface Column<T> {
  label: string;
  key: keyof T | string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMsg?: string;
  maxHeight?: string;
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  emptyMsg = "No data",
  maxHeight,
}: DataTableProps<T>) {
  return (
    <div
      style={{
        overflowX: "auto",
        ...(maxHeight ? { maxHeight, overflowY: "auto" } : {}),
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  padding: "10px 12px",
                  textAlign: (col.align ?? "left") as React.CSSProperties["textAlign"],
                  color: C.textDim,
                  fontWeight: 600,
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  borderBottom: `1px solid ${C.border}`,
                  background: C.card,
                  position: maxHeight ? "sticky" : undefined,
                  top: maxHeight ? 0 : undefined,
                  zIndex: maxHeight ? 1 : undefined,
                  whiteSpace: "nowrap",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: "center", padding: "40px", color: C.textDim }}
              >
                {emptyMsg}
              </td>
            </tr>
          ) : (
            data.map((row, ri) => (
              <tr
                key={ri}
                onClick={() => onRowClick?.(row)}
                style={{
                  background: ri % 2 === 0 ? C.bg : C.card,
                  cursor: onRowClick ? "pointer" : undefined,
                  transition: onRowClick ? "background 0.1s" : undefined,
                }}
                onMouseEnter={
                  onRowClick
                    ? (e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = C.borderLight;
                      }
                    : undefined
                }
                onMouseLeave={
                  onRowClick
                    ? (e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          ri % 2 === 0 ? C.bg : C.card;
                      }
                    : undefined
                }
              >
                {columns.map((col, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "10px 12px",
                      textAlign: (col.align ?? "left") as React.CSSProperties["textAlign"],
                      color: C.text,
                      borderBottom: `1px solid ${C.border}33`,
                    }}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
