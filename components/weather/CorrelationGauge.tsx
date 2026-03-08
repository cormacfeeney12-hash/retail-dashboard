"use client";

import { C } from "@/lib/utils";
import { corrStrength } from "@/lib/weather-data";

interface Props {
  value: number;
  size?: number;
}

const ZONES = [
  { start: -180, end: -144, color: "#ef4444", lines: ["No", "Correlation"] },
  { start: -144, end: -108, color: "#f59e0b", lines: ["Weak"] },
  { start: -108, end: -54,  color: "#84cc16", lines: ["Moderate", "Correlation"] },
  { start:  -54, end:   0,  color: "#22c55e", lines: ["Strong", "Correlation"] },
];

const TICKS = [
  { val: 0,   label: "0" },
  { val: 0.2, label: "0.2" },
  { val: 0.4, label: "0.4" },
  { val: 0.7, label: "0.7" },
  { val: 1.0, label: "1.0" },
];

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function arcPath(
  cx: number, cy: number,
  outer: number, inner: number,
  startAngle: number, endAngle: number
): string {
  const x1 = cx + outer * Math.cos(toRad(startAngle));
  const y1 = cy + outer * Math.sin(toRad(startAngle));
  const x2 = cx + outer * Math.cos(toRad(endAngle));
  const y2 = cy + outer * Math.sin(toRad(endAngle));
  const x3 = cx + inner * Math.cos(toRad(endAngle));
  const y3 = cy + inner * Math.sin(toRad(endAngle));
  const x4 = cx + inner * Math.cos(toRad(startAngle));
  const y4 = cy + inner * Math.sin(toRad(startAngle));
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`;
}

export function CorrelationGauge({ value, size = 220 }: Props) {
  const absVal = Math.abs(value);
  const { color: labelColor, label } = corrStrength(absVal);

  const cx = size / 2;
  const cy = size * 0.72;
  const outerR = size * 0.44;
  const innerR = size * 0.28;

  // Needle: 0 → -180°, 1.0 → 0°  (left to right across half-circle)
  const needleDeg = -180 + absVal * 180;
  const needleRad = toRad(needleDeg);
  const needleLen = outerR + 4;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  const svgH = size * 0.62;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={svgH} viewBox={`0 0 ${size} ${svgH}`}>
        {/* Dim zone arcs */}
        {ZONES.map((z, i) => (
          <path
            key={`bg${i}`}
            d={arcPath(cx, cy, outerR, innerR, z.start, z.end)}
            fill={z.color}
            opacity={0.22}
          />
        ))}

        {/* Active (filled-up-to-needle) zone arcs */}
        {ZONES.map((z, i) => {
          if (needleDeg <= z.start) return null;
          const end = Math.min(z.end, needleDeg);
          return (
            <path
              key={`act${i}`}
              d={arcPath(cx, cy, outerR, innerR, z.start, end)}
              fill={z.color}
              opacity={0.85}
            />
          );
        })}

        {/* Zone labels */}
        {ZONES.map((z, i) => {
          const midAngle = (z.start + z.end) / 2;
          const labelR = (outerR + innerR) / 2;
          const lx = cx + labelR * Math.cos(toRad(midAngle));
          const ly = cy + labelR * Math.sin(toRad(midAngle));
          return (
            <text
              key={`lbl${i}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={8}
              fontWeight="700"
              opacity={0.75}
              fontFamily="'DM Sans', sans-serif"
            >
              {z.lines.map((line, li) => (
                <tspan key={li} x={lx} dy={li === 0 ? 0 : 10}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}

        {/* Tick marks */}
        {TICKS.map((t, i) => {
          const angle = -180 + t.val * 180;
          const rad = toRad(angle);
          const tx1 = cx + (outerR + 2)  * Math.cos(rad);
          const ty1 = cy + (outerR + 2)  * Math.sin(rad);
          const tx2 = cx + (outerR + 8)  * Math.cos(rad);
          const ty2 = cy + (outerR + 8)  * Math.sin(rad);
          const tlx = cx + (outerR + 18) * Math.cos(rad);
          const tly = cy + (outerR + 18) * Math.sin(rad);
          return (
            <g key={`tk${i}`}>
              <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={C.textMuted} strokeWidth={1.5} />
              <text
                x={tlx}
                y={tly}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={C.textDim}
                fontSize={9}
                fontFamily="'JetBrains Mono', monospace"
              >
                {t.label}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="white" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill={C.bg} stroke="white" strokeWidth={2} />
        {/* Glow tip */}
        <circle cx={nx} cy={ny} r={3} fill={labelColor} opacity={0.85} />
      </svg>

      {/* Value + label */}
      <div style={{ marginTop: -8, textAlign: "center" }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            fontFamily: "'JetBrains Mono', monospace",
            color: labelColor,
          }}
        >
          {value >= 0 ? "+" : ""}{value.toFixed(2)}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: labelColor,
            marginTop: 2,
          }}
        >
          {label.toUpperCase()} CORRELATION
        </div>
        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>
          {value > 0
            ? "Higher → Higher Sales"
            : value < 0
            ? "Higher → Lower Sales"
            : "No relationship"}
        </div>
      </div>
    </div>
  );
}
