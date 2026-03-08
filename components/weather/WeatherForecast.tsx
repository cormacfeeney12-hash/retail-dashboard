"use client";

import { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { C } from "@/lib/utils";
import { TEMP_REGRESSION } from "@/lib/weather-data";

interface ForecastDay {
  date: string;
  day: string;
  tempMax: number;
  tempMin: number;
  feelsLike: number | null;
  rain: number;
  wind: number;
  sunshine: number;
}

const { slope, intercept } = TEMP_REGRESSION;

function predictSales(avgTemp: number) {
  return Math.round(slope * avgTemp + intercept);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ForecastTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d: ForecastDay = payload[0]?.payload;
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
      <div style={{ fontWeight: 700, color: C.text, marginBottom: "4px" }}>{d.day}</div>
      <div style={{ color: C.textDim }}>
        Temp: <span style={{ color: C.text }}>{d.tempMin}° – {d.tempMax}°C</span>
      </div>
      <div style={{ color: C.textDim }}>
        Rain: <span style={{ color: "#60a5fa" }}>{d.rain}mm</span>
      </div>
      <div style={{ color: C.textDim }}>
        Wind: <span style={{ color: C.text }}>{d.wind} km/h</span>
      </div>
    </div>
  );
}

export function WeatherForecast() {
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) { setError("timeout"); setLoading(false); }
    }, 8000);

    fetch(
      "https://api.open-meteo.com/v1/forecast" +
        "?latitude=54.249357&longitude=-8.874162" +
        "&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_mean,precipitation_sum,wind_speed_10m_max,sunshine_duration" +
        "&timezone=Europe/Dublin&forecast_days=14"
    )
      .then((r) => r.json())
      .then((data) => {
        clearTimeout(timeout);
        if (data.daily) {
          setForecast(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.daily.time.map((t: string, i: number) => ({
              date: t,
              day: new Date(t + "T12:00:00").toLocaleDateString("en-IE", {
                weekday: "short",
                day: "numeric",
                month: "short",
              }),
              tempMax: data.daily.temperature_2m_max[i],
              tempMin: data.daily.temperature_2m_min[i],
              feelsLike: data.daily.apparent_temperature_mean?.[i] ?? null,
              rain: data.daily.precipitation_sum[i],
              wind: data.daily.wind_speed_10m_max[i],
              sunshine: Math.round(((data.daily.sunshine_duration?.[i] ?? 0) / 3600) * 10) / 10,
            }))
          );
        } else {
          setError("no data");
        }
        setLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setError("network");
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background: C.card,
          borderRadius: "12px",
          padding: "32px",
          border: `1px solid ${C.border}`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "18px", marginBottom: "8px" }}>🌤️</div>
        <div style={{ color: C.textDim, fontSize: "13px" }}>Loading 14-day forecast…</div>
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div
        style={{
          background: C.card,
          borderRadius: "12px",
          padding: "24px",
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "20px" }}>🌤️</span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: C.text }}>
              14-Day Forecast — Dromore West
            </div>
            <div style={{ fontSize: "11px", color: C.textMuted }}>
              Live forecast requires internet · Works when deployed on Vercel
            </div>
          </div>
        </div>

        <div
          style={{
            background: C.bg,
            borderRadius: "10px",
            padding: "20px",
            border: `1px solid ${C.border}`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "13px", color: C.textDim, marginBottom: "12px" }}>
            When deployed, this section will show:
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              "14-day temperature forecast",
              "Daily rainfall prediction",
              "Wind speed outlook",
              "Predicted weekly sales based on weather",
            ].map((f) => (
              <span
                key={f}
                style={{
                  fontSize: "11px",
                  color: "#38bdf8",
                  background: "#38bdf812",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                {f}
              </span>
            ))}
          </div>
          <div style={{ marginTop: "14px", fontSize: "11px", color: C.textMuted }}>
            API: api.open-meteo.com/v1/forecast · 54.249°N, 8.874°W · No API key required
          </div>
        </div>

        <div
          style={{
            marginTop: "14px",
            fontSize: "12px",
            color: C.textDim,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: C.text }}>How the prediction works:</strong> Using the
          temperature correlation (r = +0.77), sales are estimated as:{" "}
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#818cf8",
            }}
          >
            €{Math.round(slope).toLocaleString()} × avg temp + €{Math.round(intercept).toLocaleString()}
          </span>
          . A week averaging 8°C would predict{" "}
          <strong style={{ color: C.text }}>
            €{predictSales(8).toLocaleString()}
          </strong>{" "}
          in sales.
        </div>
      </div>
    );
  }

  const week1 = forecast.slice(0, 7);
  const week2 = forecast.slice(7, 14);

  const avgT1 =
    week1.reduce((s, d) => s + (d.tempMax + d.tempMin) / 2, 0) / week1.length;
  const avgT2 =
    week2.length > 0
      ? week2.reduce((s, d) => s + (d.tempMax + d.tempMin) / 2, 0) / week2.length
      : null;

  const predW1 = predictSales(avgT1);
  const predW2 = avgT2 != null ? predictSales(avgT2) : null;

  return (
    <div
      style={{
        background: C.card,
        borderRadius: "12px",
        padding: "18px",
        border: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: C.text }}>
            14-Day Forecast — Dromore West
          </div>
          <div style={{ fontSize: "11px", color: C.textMuted }}>
            Live · Open-Meteo API · Updated hourly
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div
            style={{
              background: "#818cf815",
              border: "1px solid #818cf830",
              borderRadius: "8px",
              padding: "8px 14px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: C.textMuted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Next 7 Days
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#818cf8",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              €{(predW1 / 1000).toFixed(1)}k
            </div>
            <div style={{ fontSize: "9px", color: C.textDim }}>predicted sales</div>
          </div>
          {predW2 != null && (
            <div
              style={{
                background: `${C.border}80`,
                borderRadius: "8px",
                padding: "8px 14px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: C.textMuted,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Days 8–14
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: C.textDim,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                €{(predW2 / 1000).toFixed(1)}k
              </div>
              <div style={{ fontSize: "9px", color: C.textMuted }}>predicted sales</div>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={forecast} margin={{ top: 5, right: 10, bottom: 40, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis
            dataKey="day"
            tick={{ fill: C.textDim, fontSize: 8, angle: -35, textAnchor: "end" as const }}
            axisLine={{ stroke: C.border }}
            tickLine={false}
            interval={0}
            height={50}
          />
          <YAxis
            yAxisId="temp"
            tick={{ fill: C.textDim, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v + "°"}
            width={30}
          />
          <YAxis
            yAxisId="rain"
            orientation="right"
            tick={{ fill: "#60a5fa", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v + "mm"}
            width={40}
          />
          <Tooltip content={<ForecastTooltip />} />
          <Bar yAxisId="rain" dataKey="rain" fill="#60a5fa" fillOpacity={0.3} radius={[3, 3, 0, 0]} barSize={12} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempMax"
            stroke="#f87171"
            strokeWidth={2}
            dot={{ r: 3, fill: "#f87171", stroke: C.bg, strokeWidth: 1 }}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempMin"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ r: 3, fill: "#06b6d4", stroke: C.bg, strokeWidth: 1 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "8px", fontStyle: "italic" }}>
        Sales prediction based on temperature correlation (r = +0.77). Accuracy improves with more data.
      </div>
    </div>
  );
}
