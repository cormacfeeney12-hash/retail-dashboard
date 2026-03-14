"use client";

import { usePathname, useRouter } from "next/navigation";
import { C } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";

const NAV_ITEMS = [
  { label: "Overview",        path: "/dashboard" },
  { label: "Margin Alerts",   path: "/dashboard/margin-alerts" },
  { label: "Departments",     path: "/dashboard/departments" },
  { label: "Top Sellers",     path: "/dashboard/products" },
  { label: "Price Tracker",   path: "/dashboard/price-tracker" },
  { label: "Benchmark",       path: "/dashboard/benchmark" },
];

/* ── Store name mapping ── */
export const STORE_LABELS: Record<string, string> = {
  "2064": "Forecourt",
  "2056": "Supermarket",
  both: "Both Stores",
  combined: "Combined",
};

export const STORE_COLORS: Record<string, string> = {
  "2064": "#0066CC",
  "2056": "#00A651",
};

/* ── Dynamic week/date ── */
function getWeekInfo() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const d = new Date(Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${days[yesterday.getDay()]} ${yesterday.getDate()} ${months[yesterday.getMonth()]} ${yesterday.getFullYear()}`;

  return { weekNo, dateStr };
}

/* ── SVG Logo ── */
function CentraLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="48" fill="#f5c518" />
      <circle cx="50" cy="50" r="42" fill="#008b8b" />
      <text x="50" y="30" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="Arial, sans-serif">
        {"FEENEY'S"}
      </text>
      <text x="50" y="48" textAnchor="middle" fill="#f5c518" fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif">
        CENTRA
      </text>
      <text x="50" y="62" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600" fontFamily="Arial, sans-serif">
        DROMORE
      </text>
      <text x="50" y="72" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600" fontFamily="Arial, sans-serif">
        WEST
      </text>
    </svg>
  );
}

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { weekNo, dateStr } = getWeekInfo();
  const { themeColor } = useStore();

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <div
      style={{
        background: C.bg,
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* ── Header row — Logo + Title + Week info ── */}
      <div
        style={{
          padding: "12px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <CentraLogo />
          <div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: themeColor,
                marginBottom: "2px",
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
                margin: 0,
              }}
            >
              Blair Feeney Ltd
            </h1>
          </div>
        </div>

        <div style={{ textAlign: "right", fontSize: "13px", color: C.textDim }}>
          <div style={{ fontWeight: 600, color: C.text, fontSize: "14px" }}>
            Week {weekNo}
          </div>
          <div>Data for: {dateStr}</div>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div style={{ display: "flex", gap: "2px", overflowX: "auto", padding: "0 28px" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                padding: "10px 16px",
                background: active ? C.card : "transparent",
                border: "none",
                borderBottom: active ? `2px solid ${themeColor}` : "2px solid transparent",
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
        <div style={{ flex: 1 }} />
        <button
          onClick={() => router.push("/dashboard/presentation")}
          style={{
            padding: "10px 16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 400,
            color: C.textDim,
            whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
          title="Presentation mode"
        >
          ▶ Present
        </button>
      </div>
    </div>
  );
}
