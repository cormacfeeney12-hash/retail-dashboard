import Link from "next/link";
import { C } from "@/lib/utils";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: "8px",
          }}
        >
          Pyramid Analytics
        </div>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: C.text,
            letterSpacing: "-0.03em",
            marginBottom: "8px",
          }}
        >
          Retail Dashboard
        </h1>
        <p style={{ fontSize: "15px", color: C.textDim }}>
          Store performance analytics, powered by AI
        </p>
      </div>

      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: "14px",
          padding: "32px",
          width: "360px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: C.textDim,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="you@store.com"
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "14px",
              color: C.text,
              outline: "none",
              width: "100%",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: C.textDim,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "14px",
              color: C.text,
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        {/* Phase 1: direct link to dashboard */}
        <Link
          href="/dashboard"
          style={{
            display: "block",
            background: C.accent,
            color: "#fff",
            textAlign: "center",
            padding: "11px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px",
            textDecoration: "none",
            marginTop: "4px",
          }}
        >
          Sign in
        </Link>

        <p style={{ fontSize: "12px", color: C.textMuted, textAlign: "center" }}>
          Auth integration coming in Phase 2
        </p>
      </div>
    </div>
  );
}
