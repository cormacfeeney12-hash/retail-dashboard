"use client";

import { useEffect, useState } from "react";
import { rds } from "@/lib/rds";
import { C } from "@/lib/utils";

interface CpuAlert {
  lv_code: string;
  description: string;
  department: string;
  week_number: number;
  comparison_date: string;
  invoice_cpu: number;
  pyramid_cpu: number;
  variance_eur: number;
  variance_pct: number;
  retail_qty: number;
  missed_margin_eur: number;
  direction: "OVER" | "UNDER";
}

interface WeeklySummary {
  week_number: number;
  comparison_date: string;
  total_products: number;
  correct: number;
  incorrect: number;
  accuracy_pct: number;
  total_missed_margin: number;
}

export function CpuAlerts() {
  const [alerts, setAlerts] = useState<CpuAlert[]>([]);
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Latest week's incorrect CPUs
        const { data: alertData } = await rds.query<CpuAlert>(
          "SELECT * FROM v_incorrect_cpus ORDER BY comparison_date DESC LIMIT 20"
        );

        // Weekly summary (latest week)
        const { data: summaryData } = await rds.query<WeeklySummary>(
          "SELECT * FROM v_weekly_summary ORDER BY comparison_date DESC LIMIT 1"
        );

        setAlerts(alertData || []);
        setSummary(summaryData?.[0] || null);
      } catch (e) {
        console.error("CPU alerts load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalMissed = alerts.reduce((sum, a) => sum + (a.missed_margin_eur || 0), 0);

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "10px",
        padding: "20px",
        marginTop: "16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: expanded ? "16px" : "0",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>⚠️</span>
          <div>
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: C.text,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: 0,
              }}
            >
              CPU Price Alerts
            </h3>
            <p style={{ fontSize: "11px", color: C.textDim, margin: 0 }}>
              Pyramid cost vs invoice cost discrepancies
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Badge */}
          {alerts.length > 0 && (
            <div
              style={{
                background: "rgba(192,0,0,0.15)",
                border: "1px solid rgba(192,0,0,0.3)",
                borderRadius: "20px",
                padding: "3px 10px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#ff4444",
              }}
            >
              {alerts.length} issue{alerts.length !== 1 ? "s" : ""}
            </div>
          )}
          {alerts.length === 0 && !loading && (
            <div
              style={{
                background: "rgba(0,180,0,0.15)",
                border: "1px solid rgba(0,180,0,0.3)",
                borderRadius: "20px",
                padding: "3px 10px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#00b400",
              }}
            >
              ✅ All correct
            </div>
          )}
          <span style={{ color: C.textDim, fontSize: "14px" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <>
          {loading ? (
            <div style={{ color: C.textDim, fontSize: "13px", padding: "20px 0", textAlign: "center" }}>
              Loading alerts...
            </div>
          ) : (
            <>
              {/* Summary bar */}
              {summary && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  {[
                    { label: "Week", value: `Wk ${summary.week_number}` },
                    { label: "Matched", value: summary.total_products },
                    {
                      label: "Accuracy",
                      value: `${summary.accuracy_pct}%`,
                      color: summary.accuracy_pct >= 95 ? "#00b400" : summary.accuracy_pct >= 80 ? "#ff9900" : "#ff4444",
                    },
                    {
                      label: "Missed Margin",
                      value: `€${Math.abs(totalMissed).toFixed(2)}`,
                      color: totalMissed !== 0 ? "#ff4444" : "#00b400",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: "8px",
                        padding: "10px 14px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: C.textDim,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "4px",
                        }}
                      >
                        {stat.label}
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: stat.color || C.text,
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No data state */}
              {alerts.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: C.textDim,
                    fontSize: "13px",
                    background: C.bg,
                    borderRadius: "8px",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {summary
                    ? "✅ All products have correct cost prices in Pyramid this week"
                    : "No comparison data yet — drop an invoice PDF in Google Drive and wait for the nightly run"}
                </div>
              )}

              {/* Alerts table */}
              {alerts.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr>
                        {["Product", "Dept", "Invoice CPU", "Pyramid CPU", "Variance", "Qty Sold", "Missed Margin", "Direction"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "8px 10px",
                              textAlign: "left",
                              fontSize: "10px",
                              fontWeight: 700,
                              color: C.textDim,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              borderBottom: `1px solid ${C.border}`,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((a, i) => {
                        const isOver = a.direction === "OVER";
                        const isBig = Math.abs(a.variance_pct) >= 20;
                        return (
                          <tr
                            key={a.lv_code + i}
                            style={{
                              background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                            }}
                          >
                            <td style={{ padding: "9px 10px", color: C.text, fontWeight: 600, maxWidth: "200px" }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {a.description}
                              </div>
                              <div style={{ fontSize: "10px", color: C.textDim }}>{a.lv_code}</div>
                            </td>
                            <td style={{ padding: "9px 10px", color: C.textDim, fontSize: "11px", maxWidth: "120px" }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {a.department?.split(" - ")[1] || a.department}
                              </div>
                            </td>
                            <td style={{ padding: "9px 10px", color: C.text, fontWeight: 600, whiteSpace: "nowrap" }}>
                              €{a.invoice_cpu?.toFixed(4)}
                            </td>
                            <td style={{ padding: "9px 10px", color: "#ff4444", fontWeight: 600, whiteSpace: "nowrap" }}>
                              €{a.pyramid_cpu?.toFixed(4)}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                fontWeight: 700,
                                color: isBig ? "#ff4444" : "#ff9900",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {a.variance_pct > 0 ? "+" : ""}{a.variance_pct?.toFixed(1)}%
                            </td>
                            <td style={{ padding: "9px 10px", color: C.textDim, whiteSpace: "nowrap" }}>
                              {a.retail_qty?.toFixed(0)}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                fontWeight: 700,
                                color: "#ff4444",
                                whiteSpace: "nowrap",
                              }}
                            >
                              €{Math.abs(a.missed_margin_eur || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: "9px 10px", whiteSpace: "nowrap" }}>
                              <span
                                style={{
                                  background: isOver ? "rgba(255,100,0,0.15)" : "rgba(0,100,255,0.15)",
                                  color: isOver ? "#ff6400" : "#4488ff",
                                  border: `1px solid ${isOver ? "rgba(255,100,0,0.3)" : "rgba(0,100,255,0.3)"}`,
                                  borderRadius: "4px",
                                  padding: "2px 7px",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                }}
                              >
                                {isOver ? "🔺 OVER" : "🔻 UNDER"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "11px",
                  color: C.textDim,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Source: Musgrave invoice vs Pyramid Analytics</span>
                <span>Updates nightly at 7:30pm</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
