"use client";

import { C } from "@/lib/utils";
import type { Period } from "@/lib/types";

interface PeriodTabsProps {
  active: Period;
  onChange: (p: Period) => void;
}

const TABS: { label: string; value: Period }[] = [
  { label: "Today", value: "daily" },
  { label: "WTD", value: "wtd" },
  { label: "YTD", value: "ytd" },
];

export function PeriodTabs({ active, onChange }: PeriodTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "3px",
        background: C.card,
        borderRadius: "8px",
        padding: "3px",
        border: `1px solid ${C.border}`,
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            background: active === t.value ? C.accent : "transparent",
            color: active === t.value ? "#fff" : C.textDim,
            transition: "all 0.15s",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
