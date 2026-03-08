export const fmt = (v: number | null | undefined) => {
  if (v == null) return "—";
  return v.toLocaleString("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const fmtK = (v: number | null | undefined) => {
  if (v == null) return "—";
  return `€${(v / 1000).toFixed(1)}k`;
};

export const fmtPct = (v: number | null | undefined) => {
  if (v == null) return "—";
  const sign = v >= 0 ? "+" : "";
  return `${sign}${(v * 100).toFixed(2)}%`;
};

/** Returns true (green), false (red), or null (neutral).
 *  invert=true means lower is better (e.g. waste). */
export const good = (v: number | null | undefined, invert = false): boolean | null => {
  if (v == null) return null;
  if (v === 0) return null;
  return invert ? v < 0 : v > 0;
};

export const C = {
  bg: "#0c0e14",
  card: "#151820",
  border: "#1e2230",
  borderLight: "#282d3e",
  text: "#e8eaf0",
  textDim: "#8b90a5",
  textMuted: "#525872",
  accent: "#818cf8",
  green: "#4ade80",
  red: "#f87171",
  amber: "#fbbf24",
  coffee: "#d97706",
  coffeeDark: "#92400e",
  cyan: "#06b6d4",
} as const;
