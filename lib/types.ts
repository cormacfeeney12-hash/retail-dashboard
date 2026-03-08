// ─── Period & Summary ───────────────────────────────────────────────────────

export type Period = "daily" | "wtd" | "ytd";

export interface PeriodSummary {
  retailSales: number;
  retailSalesLY: number;
  retailSalesVar: number;
  retailSalesVarPct: number;
  scanMargin: number;
  scanMarginLY: number;
  scanMarginVar: number;
  waste: number;
  wasteLY: number;
  wasteVarPct: number;
}

export interface SummaryData {
  daily: PeriodSummary;
  wtd: PeriodSummary;
  ytd: PeriodSummary;
}

// ─── Footfall ────────────────────────────────────────────────────────────────

export interface FootfallPeriod {
  transVar: number;
  salesHourlyVar: number;
  avgSpendVar: number;
}

export interface FootfallData {
  daily: FootfallPeriod;
  wtd: FootfallPeriod;
  ytd: FootfallPeriod;
}

// ─── Weekly Trend ────────────────────────────────────────────────────────────

export interface WeeklyTrendPoint {
  week: string;
  ty: number;
  ly: number;
}

// ─── F&H Coffee ──────────────────────────────────────────────────────────────

export interface FHProduct {
  id: string;
  name: string;
  sales: number;
  wastePct: number | null;
  wasteCups: number;
  invoiceQty: number;
  variance: number;
}

export interface FHTotals {
  totalSales: number;
  totalInvoiced: number;
  totalSold: number;
  totalVariance: number;
}

// ─── Departments ─────────────────────────────────────────────────────────────

export interface SubDept {
  n: string;
  s: number | null;
  sv: number | null;
  sy: number | null;
  m: number | null;
  my: number | null;
  mv: number | null;
  p: number | null;
  w: number | null;
}

export interface Department extends SubDept {
  id: string;
  sub: SubDept[];
}

// ─── Products & Benchmarks ───────────────────────────────────────────────────

export interface Product {
  n: string;
  q: number;
  s: number;
  m: number;
  mp: number;
}

export interface Benchmark {
  n: string;
  bq: number | null;
  aq: number | null;
  v: number | null;
}

// ─── Trading Hours ───────────────────────────────────────────────────────────

export interface HourlySalesPoint {
  h: string;
  v: number;
}

export interface WeeklyTrend16Point {
  w: string;
  avg: number;
  trans: number;
}

export interface TradingKpiPeriods {
  ty: number;
  wtd: number;
  ytd: number;
}

export interface TradingKpis {
  transactions: TradingKpiPeriods;
  avgSpend: TradingKpiPeriods;
  hourlySales: TradingKpiPeriods;
}

export interface TradingDay {
  d: string;
  day: string;
  v: number;
}

export interface TradingHour {
  h: string;
  d: string;
  day: string;
  v: number;
}

export interface TradingDept {
  n: string;
  v: number;
}

export interface TradingSlot {
  d: string;
  h: string;
  day: string;
  v: number;
}

// ─── Full Report ─────────────────────────────────────────────────────────────

export interface ReportData {
  reportDate: string;
  storeCode: string;
  storeName: string;
  weekNumber: number;
  summary: SummaryData;
  footfall: FootfallData;
  weeklyTrend: WeeklyTrendPoint[];
  fhData: FHProduct[];
  fhTotals: FHTotals;
  departments: Department[];
  products: Product[];
  benchmarks: Benchmark[];
  hourlySales: HourlySalesPoint[];
  weeklyTrend16: WeeklyTrend16Point[];
  tradingKpis: TradingKpis;
  top3Days: TradingDay[];
  bottom3Days: TradingDay[];
  top3Hours: TradingHour[];
  bottom3Hours: TradingHour[];
  top3Depts: TradingDept[];
  bottom3Depts: TradingDept[];
  busiestSlots: TradingSlot[];
  quietestSlots: TradingSlot[];
}

// ─── Supabase DB types ───────────────────────────────────────────────────────

export interface Store {
  id: string;
  name: string;
  code: string;
  location: string | null;
  owner_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  store_id: string;
  report_date: string;
  report_type: "storyboard" | "weekly_sales" | "top_sellers" | "fh_coffee" | "hourly_sales";
  raw_data: ReportData;
  uploaded_at: string;
}
