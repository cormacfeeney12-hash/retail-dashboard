import { C } from "@/lib/utils";
import Link from "next/link";

export default function UploadPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📤</div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: C.text, marginBottom: "8px" }}>
          Upload Reports
        </h1>
        <p style={{ fontSize: "14px", color: C.textDim, maxWidth: "400px" }}>
          Excel file upload and parsing coming in Phase 2. Connect your Pyramid Analytics reports
          to populate the dashboard with live data.
        </p>
      </div>
      <Link
        href="/dashboard"
        style={{
          background: C.accent,
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "14px",
          textDecoration: "none",
        }}
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
