"use client";

import { usePathname, useRouter } from "next/navigation";
import { C } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview",        path: "/dashboard" },
  { label: "Margin Alerts",   path: "/dashboard/margin-alerts" },
  { label: "⏰ Trading Hours", path: "/dashboard/trading" },
  { label: "🌦️ Weather",      path: "/dashboard/weather" },
  { label: "☕ F&H Coffee",   path: "/dashboard/coffee" },
  { label: "Departments",     path: "/dashboard/departments" },
  { label: "Top Sellers",     path: "/dashboard/products" },
  { label: "Price Tracker",   path: "/dashboard/price-tracker" },
  { label: "Benchmark",       path: "/dashboard/benchmark" },
];

const ACCENT: Record<string, string> = {
  "/dashboard/trading": C.cyan,
  "/dashboard/weather": "#38bdf8",
  "/dashboard/coffee":  C.coffee,
};

export function DashboardNav({
  storeName,
  reportDate,
  weekNumber,
}: {
  storeName: string;
  reportDate: string;
  weekNumber: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <div
      style={{
        background: C.bg,
        borderBottom: `1px solid ${C.border}`,
        padding: "16px 28px 0",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Top row — title + store info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.accent,
              marginBottom: "4px",
            }}
          >
            Pyramid Analytics
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: C.text,
              letterSpacing: "-0.02em",
            }}
          >
            Retail Storyboard
          </h1>
        </div>
        <div style={{ textAlign: "right", fontSize: "13px", color: C.textDim }}>
          <div style={{ fontWeight: 600, color: C.text }}>{storeName}</div>
          <div>
            {reportDate} · Wk {weekNumber}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: "2px", overflowX: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const accent = ACCENT[item.path] ?? C.accent;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                padding: "10px 16px",
                background: active ? C.card : "transparent",
                border: "none",
                borderBottom: active ? `2px solid ${accent}` : "2px solid transparent",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                color: active ? C.text : C.textDim,
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                borderRadius: "6px 6px 0 0",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
