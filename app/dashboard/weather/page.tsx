"use client";

import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { C } from "@/lib/utils";
import { WEATHER_DATA, CORRELATIONS, corrStrength } from "@/lib/weather-data";
import { CorrelationGauge } from "@/components/weather/CorrelationGauge";
import { WeatherForecast } from "@/components/weather/WeatherForecast";
import { AiChat } from "@/components/AiChat";
import { SAMPLE_DATA } from "@/lib/sample-data";

const WEATHER_ACCENT = "#38bdf8";

// ─── Key stat calculations ────────────────────────────────────────────────────
const avgTemp = WEATHER_DATA.reduce((s, d) => s + d.temp, 0) / WEATHER_DATA.length;
const aboveAvg = WEATHER_DATA.filter((d) => d.temp >= avgTemp);
const belowAvg = WEATHER_DATA.filter((d) => d.temp < avgTemp);
const salesAbove = Math.round(aboveAvg.reduce((s, d) => s + d.sales, 0) / aboveAvg.length);
const salesBelow = Math.round(belowAvg.reduce((s, d) => s + d.sales, 0) / belowAvg.length);

// ─── Insight text per factor ──────────────────────────────────────────────────
const INSIGHTS: Record<string, React.ReactNode> = {
  temp: (
    <>
      <strong style={{ color: "#e8eaf0" }}>Temperature is your #1 predictor (r = +0.77).</strong> Every
      degree warmer correlates with ~€4,000 more in weekly sales. Warmest week (9.1°C, Wk 50) hit
      €117.6k. Coldest (3.9°C, Wk 01) dropped to €90.9k. Wk 52 (Christmas, Dec 22–28) had low sales
      despite mild weather — likely reduced trading hours.
    </>
  ),
  feelsLike: (
    <>
      <strong style={{ color: "#e8eaf0" }}>Feels-like shows strong correlation (r = +0.67).</strong> When
      it feels below 0°C (Wk 01, Wk 02), sales dropped significantly. This accounts for wind chill — a
      good proxy for "will people leave the house?"
    </>
  ),
  wind: (
    <>
      <strong style={{ color: "#e8eaf0" }}>Wind shows positive correlation (+0.44) — counterintuitive.</strong>{" "}
      Warmest weeks (Atlantic systems) also brought wind. Wk 50 had highest wind (55.1 km/h) AND highest
      sales. Wind alone is not a useful predictor — temperature is what drives footfall.
    </>
  ),
  rain: (
    <>
      <strong style={{ color: "#e8eaf0" }}>Rainfall has no meaningful correlation (+0.20).</strong> Your
      customers are used to rain. Wk 50 had 47.4mm and your highest sales. People in the west of Ireland
      don&apos;t stay home for rain.
    </>
  ),
  sunshine: (
    <>
      <strong style={{ color: "#e8eaf0" }}>Sunshine shows no correlation (-0.14).</strong> Winter sunshine
      hours are low everywhere (range: 13–39 hrs/week). May become meaningful with spring/summer data when
      variation is greater.
    </>
  ),
};

// ─── Tooltip for scatter plot ────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ScatterTooltip({ active, payload, selectedCorr }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "12px",
      }}
    >
      <div style={{ fontWeight: 700, color: C.text }}>
        {d.w}{" "}
        <span style={{ color: C.textDim, fontWeight: 400 }}>({d.dateRange})</span>
      </div>
      <div style={{ color: C.textDim, marginTop: "4px" }}>
        Sales:{" "}
        <span style={{ color: C.text, fontWeight: 600 }}>
          €{(d.sales / 1000).toFixed(1)}k
        </span>
      </div>
      <div style={{ color: C.textDim }}>
        {selectedCorr?.factor}:{" "}
        <span style={{ color: C.text, fontWeight: 600 }}>
          {d[selectedCorr?.key]} {selectedCorr?.unit}
        </span>
      </div>
    </div>
  );
}

// ─── Timeline tooltip ────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TimelineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "12px",
      }}
    >
      <div style={{ fontWeight: 700, color: C.text, marginBottom: "4px" }}>{label}</div>
      {payload.map((p: { dataKey: string; name: string; color: string; value: number }, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "3px",
              background: p.color,
              display: "inline-block",
              marginTop: "1px",
            }}
          />
          <span style={{ color: C.textDim }}>{p.name}:</span>
          <span style={{ color: C.text, fontWeight: 600 }}>
            {p.dataKey === "sales"
              ? `€${(p.value / 1000).toFixed(1)}k`
              : `${p.value}°C`}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WeatherPage() {
  const [selectedFactor, setSelectedFactor] = useState("temp");
  const selectedCorr = CORRELATIONS.find((c) => c.key === selectedFactor)!;
  const { color: dotColor } = corrStrength(Math.abs(selectedCorr.value));

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${WEATHER_ACCENT}, #0369a1)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            flexShrink: 0,
          }}
        >
          🌦️
        </div>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: C.text, margin: 0 }}>
            Weather &amp; Sales Intelligence
          </h2>
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>
            Dromore West, Co. Sligo · Open-Meteo API (CC BY 4.0) &amp; Pyramid Analytics · 16 weeks matched
          </div>
        </div>
      </div>

      {/* Top section: Gauge + Key Stat + Factor Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Gauge card */}
        <div
          style={{
            background: C.card,
            borderRadius: "12px",
            padding: "20px 16px 16px",
            border: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.textMuted,
              marginBottom: "8px",
            }}
          >
            {selectedCorr.icon} {selectedCorr.factor}
          </div>
          <CorrelationGauge value={selectedCorr.value} size={240} />
        </div>

        {/* Right: Key stat + factor cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Key Stat Banner */}
          <div
            style={{
              background: `linear-gradient(135deg, #0369a125, ${WEATHER_ACCENT}10)`,
              borderRadius: "12px",
              padding: "16px 20px",
              border: `1px solid ${WEATHER_ACCENT}25`,
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700, color: C.text, marginBottom: "4px" }}>
              Temperature is your strongest sales predictor
            </div>
            <div style={{ fontSize: "12px", color: C.textDim, lineHeight: 1.6 }}>
              Weeks above {avgTemp.toFixed(1)}°C averaged{" "}
              <strong style={{ color: C.green }}>€{(salesAbove / 1000).toFixed(1)}k</strong>.
              Weeks below averaged{" "}
              <strong style={{ color: C.red }}>€{(salesBelow / 1000).toFixed(1)}k</strong>.
              Gap:{" "}
              <strong style={{ color: C.text }}>
                €{((salesAbove - salesBelow) / 1000).toFixed(1)}k per week
              </strong>{" "}
              (~€{Math.round(((salesAbove - salesBelow) * 52) / 1000)}k annualised).
            </div>
          </div>

          {/* Factor selection cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", flex: 1 }}>
            {CORRELATIONS.map((c) => {
              const abs = Math.abs(c.value);
              const { color, label } = corrStrength(abs);
              const isActive = selectedFactor === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setSelectedFactor(c.key)}
                  style={{
                    background: isActive ? C.borderLight : C.card,
                    borderRadius: "10px",
                    padding: "12px 10px",
                    border: `1px solid ${isActive ? color + "55" : C.border}`,
                    cursor: "pointer",
                    textAlign: "center",
                    fontFamily: "inherit",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.15s",
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: color,
                      }}
                    />
                  )}
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>{c.icon}</div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: isActive ? C.text : C.textDim,
                      marginBottom: "4px",
                    }}
                  >
                    {c.factor}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      fontFamily: "'JetBrains Mono', monospace",
                      color,
                    }}
                  >
                    {c.value >= 0 ? "+" : ""}{c.value.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      fontWeight: 700,
                      color,
                      marginTop: "2px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label.toUpperCase()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scatter plot + Insight panel */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div
          style={{
            background: C.card,
            borderRadius: "12px",
            padding: "16px 18px 10px",
            border: `1px solid ${C.border}`,
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 700, color: C.text, marginBottom: "12px" }}>
            {selectedCorr.icon} {selectedCorr.factor} vs Weekly Sales
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis
                dataKey={selectedFactor}
                tick={{ fill: C.textDim, fontSize: 11 }}
                axisLine={{ stroke: C.border }}
                tickLine={false}
                label={{
                  value: `${selectedCorr.factor} (${selectedCorr.unit})`,
                  position: "bottom",
                  offset: 0,
                  fill: C.textMuted,
                  fontSize: 10,
                }}
              />
              <YAxis
                dataKey="sales"
                tick={{ fill: C.textDim, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                width={48}
              />
              <Tooltip content={<ScatterTooltip selectedCorr={selectedCorr} />} />
              <Scatter data={WEATHER_DATA}>
                {WEATHER_DATA.map((_, i) => (
                  <Cell key={i} fill={dotColor} fillOpacity={0.8} stroke={C.bg} strokeWidth={2} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: C.card,
            borderRadius: "12px",
            padding: "18px",
            border: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: WEATHER_ACCENT,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              What this means
            </div>
            <div style={{ fontSize: "13px", color: C.textDim, lineHeight: 1.7 }}>
              {INSIGHTS[selectedFactor]}
            </div>
          </div>
          <div
            style={{
              marginTop: "14px",
              fontSize: "10px",
              color: C.textMuted,
              borderTop: `1px solid ${C.border}`,
              paddingTop: "10px",
            }}
          >
            Based on 16 weeks of real data (Nov 2025 – Mar 2026). Upload more reports to strengthen
            correlations.
          </div>
        </div>
      </div>

      {/* Timeline: Sales vs Temperature */}
      <div
        style={{
          background: C.card,
          borderRadius: "12px",
          padding: "16px 18px 10px",
          border: `1px solid ${C.border}`,
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 700, color: C.text, marginBottom: "12px" }}>
          Sales vs Temperature Over Time
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={WEATHER_DATA} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis
              dataKey="w"
              tick={{ fill: C.textDim, fontSize: 10 }}
              axisLine={{ stroke: C.border }}
              tickLine={false}
            />
            <YAxis
              yAxisId="sales"
              tick={{ fill: C.textDim, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <YAxis
              yAxisId="temp"
              orientation="right"
              tick={{ fill: WEATHER_ACCENT, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v + "°C"}
              domain={[0, 12]}
              width={40}
            />
            <Tooltip content={<TimelineTooltip />} />
            <Area
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              name="Mean Temp"
              fill={WEATHER_ACCENT}
              fillOpacity={0.08}
              stroke={WEATHER_ACCENT}
              strokeWidth={2}
              dot={{ r: 4, fill: WEATHER_ACCENT, stroke: C.bg, strokeWidth: 2 }}
            />
            <Line
              yAxisId="sales"
              type="monotone"
              dataKey="sales"
              name="Weekly Sales"
              stroke={C.accent}
              strokeWidth={2.5}
              dot={{ r: 5, fill: C.accent, stroke: C.bg, strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly detail table */}
      <div
        style={{
          background: C.card,
          borderRadius: "12px",
          padding: "18px",
          border: `1px solid ${C.border}`,
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 700, color: C.text, marginBottom: "14px" }}>
          Weekly Weather &amp; Sales Detail
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px", fontSize: "12px" }}>
            <thead>
              <tr>
                {["Week", "Dates", "Sales", "Trans", "Temp", "Feels", "Rain", "Wind", "Sun"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 8px",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: C.textMuted,
                      textAlign: h === "Week" || h === "Dates" ? "left" : "right",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEATHER_DATA.map((d, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.card : C.bg }}>
                  <td
                    style={{
                      padding: "9px 8px",
                      fontWeight: 600,
                      color: C.text,
                      borderRadius: "6px 0 0 6px",
                    }}
                  >
                    {d.w}
                  </td>
                  <td style={{ padding: "9px 8px", color: C.textMuted, fontSize: "10px" }}>
                    {d.dateRange.replace(/2025-/g, "").replace(/2026-/g, "")}
                  </td>
                  <td
                    style={{
                      padding: "9px 8px",
                      textAlign: "right",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                      color: C.text,
                    }}
                  >
                    €{(d.sales / 1000).toFixed(1)}k
                  </td>
                  <td style={{ padding: "9px 8px", textAlign: "right", color: C.textDim }}>
                    {d.trans.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "9px 8px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: d.temp >= 7 ? C.green : d.temp >= 5 ? C.amber : C.red,
                    }}
                  >
                    {d.temp}°C
                  </td>
                  <td
                    style={{
                      padding: "9px 8px",
                      textAlign: "right",
                      color: d.feelsLike < 0 ? C.red : d.feelsLike < 2 ? C.amber : C.textDim,
                    }}
                  >
                    {d.feelsLike}°C
                  </td>
                  <td
                    style={{
                      padding: "9px 8px",
                      textAlign: "right",
                      color: d.rain > 40 ? C.red : d.rain > 25 ? C.amber : C.textDim,
                    }}
                  >
                    {d.rain}mm
                  </td>
                  <td style={{ padding: "9px 8px", textAlign: "right", color: C.textDim }}>
                    {d.wind}kph
                  </td>
                  <td
                    style={{
                      padding: "9px 8px",
                      textAlign: "right",
                      color: C.textDim,
                      borderRadius: "0 6px 6px 0",
                    }}
                  >
                    {d.sunshine}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forecast section */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: WEATHER_ACCENT,
            marginBottom: "12px",
          }}
        >
          Live Forecast &amp; Sales Prediction
        </div>
        <WeatherForecast />
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "24px",
          paddingTop: "14px",
          borderTop: `1px solid ${C.border}`,
          fontSize: "10px",
          color: C.textMuted,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        <span>Weather: Open-Meteo API (CC BY 4.0) · Dromore West 54.25°N, 8.87°W</span>
        <span>All data is real. 16 weeks matched (Nov 2025 – Mar 2026).</span>
      </div>

      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
