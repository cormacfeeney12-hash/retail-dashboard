export interface WeatherWeek {
  w: string;
  sales: number;
  trans: number;
  avgSpend: number;
  temp: number;
  feelsLike: number;
  rain: number;
  wind: number;
  windAvg: number;
  sunshine: number;
  dateRange: string;
}

export interface CorrelationFactor {
  factor: string;
  key: keyof WeatherWeek;
  value: number;
  unit: string;
  icon: string;
}

export const WEATHER_DATA: WeatherWeek[] = [
  { w: "Wk 47", sales: 100850, trans: 4807, avgSpend: 20.98, temp: 5.8,  feelsLike: 0.8,  rain: 52.7, wind: 42.8, windAvg: 34.4, sunshine: 33.2, dateRange: "2025-11-17 to 2025-11-23" },
  { w: "Wk 48", sales: 99173,  trans: 4667, avgSpend: 21.25, temp: 8.0,  feelsLike: 3.0,  rain: 16.2, wind: 48.9, windAvg: 36.2, sunshine: 28.7, dateRange: "2025-11-24 to 2025-11-30" },
  { w: "Wk 49", sales: 99038,  trans: 4583, avgSpend: 21.61, temp: 6.8,  feelsLike: 2.5,  rain: 36.2, wind: 45.1, windAvg: 29.4, sunshine: 20.8, dateRange: "2025-12-01 to 2025-12-07" },
  { w: "Wk 50", sales: 117610, trans: 4729, avgSpend: 24.87, temp: 9.1,  feelsLike: 3.7,  rain: 47.4, wind: 55.1, windAvg: 42.2, sunshine: 14.8, dateRange: "2025-12-08 to 2025-12-14" },
  { w: "Wk 51", sales: 109010, trans: 4955, avgSpend: 22.0,  temp: 6.5,  feelsLike: 1.8,  rain: 29.1, wind: 49.3, windAvg: 32.7, sunshine: 22.3, dateRange: "2025-12-15 to 2025-12-21" },
  { w: "Wk 52", sales: 91304,  trans: 3882, avgSpend: 23.52, temp: 5.0,  feelsLike: 1.8,  rain: 0.3,  wind: 19.0, windAvg: 15.7, sunshine: 33.5, dateRange: "2025-12-22 to 2025-12-28" },
  { w: "Wk 01", sales: 90879,  trans: 4431, avgSpend: 20.51, temp: 3.9,  feelsLike: -0.9, rain: 25.1, wind: 36.3, windAvg: 24.5, sunshine: 32.2, dateRange: "2025-12-29 to 2026-01-04" },
  { w: "Wk 02", sales: 84945,  trans: 4164, avgSpend: 20.4,  temp: 4.7,  feelsLike: 0.0,  rain: 40.2, wind: 48.0, windAvg: 32.9, sunshine: 20.5, dateRange: "2026-01-05 to 2026-01-11" },
  { w: "Wk 03", sales: 92617,  trans: 4377, avgSpend: 21.16, temp: 4.7,  feelsLike: 0.5,  rain: 14.1, wind: 38.2, windAvg: 25.1, sunshine: 25.2, dateRange: "2026-01-12 to 2026-01-18" },
  { w: "Wk 04", sales: 95025,  trans: 4510, avgSpend: 21.07, temp: 5.3,  feelsLike: 1.4,  rain: 36.2, wind: 38.6, windAvg: 27.1, sunshine: 13.7, dateRange: "2026-01-19 to 2026-01-25" },
  { w: "Wk 05", sales: 90475,  trans: 4479, avgSpend: 20.2,  temp: 6.0,  feelsLike: 1.2,  rain: 42.0, wind: 47.8, windAvg: 33.8, sunshine: 35.0, dateRange: "2026-01-26 to 2026-02-01" },
  { w: "Wk 06", sales: 97902,  trans: 4662, avgSpend: 21.0,  temp: 5.7,  feelsLike: 1.1,  rain: 11.5, wind: 35.8, windAvg: 27.3, sunshine: 15.9, dateRange: "2026-02-02 to 2026-02-08" },
  { w: "Wk 07", sales: 99769,  trans: 4792, avgSpend: 20.82, temp: 5.4,  feelsLike: 1.0,  rain: 40.6, wind: 51.3, windAvg: 30.4, sunshine: 21.8, dateRange: "2026-02-09 to 2026-02-15" },
  { w: "Wk 08", sales: 100688, trans: 4668, avgSpend: 21.57, temp: 6.7,  feelsLike: 1.6,  rain: 44.2, wind: 45.2, windAvg: 36.3, sunshine: 33.1, dateRange: "2026-02-16 to 2026-02-22" },
  { w: "Wk 09", sales: 100826, trans: 4747, avgSpend: 21.24, temp: 8.3,  feelsLike: 3.9,  rain: 33.7, wind: 42.9, windAvg: 32.6, sunshine: 31.3, dateRange: "2026-02-23 to 2026-03-01" },
  { w: "Wk 10", sales: 108319, trans: 4726, avgSpend: 22.92, temp: 7.2,  feelsLike: 2.5,  rain: 14.9, wind: 39.6, windAvg: 31.3, sunshine: 38.8, dateRange: "2026-03-02 to 2026-03-08" },
];

/** Pearson correlation between two arrays */
export function corr(x: number[], y: number[]): number {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  const cov = x.reduce((s, xi, i) => s + (xi - mx) * (y[i] - my), 0) / n;
  const sx = Math.sqrt(x.reduce((s, xi) => s + (xi - mx) ** 2, 0) / n);
  const sy = Math.sqrt(y.reduce((s, yi) => s + (yi - my) ** 2, 0) / n);
  return sx === 0 || sy === 0 ? 0 : cov / (sx * sy);
}

/** Linear regression — returns { slope, intercept } */
export function linReg(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  const slope =
    x.reduce((s, t, i) => s + (t - mx) * (y[i] - my), 0) /
    x.reduce((s, t) => s + (t - mx) ** 2, 0);
  return { slope, intercept: my - slope * mx };
}

const salesArr = WEATHER_DATA.map((d) => d.sales);

export const CORRELATIONS: CorrelationFactor[] = [
  { factor: "Mean Temperature", key: "temp",      value: corr(salesArr, WEATHER_DATA.map((d) => d.temp)),      unit: "°C",   icon: "🌡️" },
  { factor: "Feels Like",       key: "feelsLike", value: corr(salesArr, WEATHER_DATA.map((d) => d.feelsLike)), unit: "°C",   icon: "🥶" },
  { factor: "Max Wind",         key: "wind",      value: corr(salesArr, WEATHER_DATA.map((d) => d.wind)),      unit: "km/h", icon: "💨" },
  { factor: "Rainfall",         key: "rain",      value: corr(salesArr, WEATHER_DATA.map((d) => d.rain)),      unit: "mm",   icon: "🌧️" },
  { factor: "Sunshine",         key: "sunshine",  value: corr(salesArr, WEATHER_DATA.map((d) => d.sunshine)),  unit: "hrs",  icon: "☀️" },
];

/** Colour and label for a given absolute correlation value */
export function corrStrength(abs: number): { color: string; label: string } {
  if (abs >= 0.7) return { color: "#22c55e", label: "Strong" };
  if (abs >= 0.4) return { color: "#84cc16", label: "Moderate" };
  if (abs >= 0.2) return { color: "#f59e0b", label: "Weak" };
  return { color: "#ef4444", label: "None" };
}

/** Temperature regression for sales predictions */
export const TEMP_REGRESSION = linReg(
  WEATHER_DATA.map((d) => d.temp),
  salesArr
);
