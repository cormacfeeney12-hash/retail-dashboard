"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import { STORE_LABELS } from "@/components/DashboardNav";
import OverviewPage from "@/app/dashboard/page";
import MarginAlertsPage from "@/app/dashboard/margin-alerts/page";
import type { StoreFilter } from "@/contexts/StoreContext";

/* ── Slide definitions ── */
interface Slide {
  store: StoreFilter;
  label: string;
  component: "overview" | "margin-alerts";
  comparison?: "yd_ytd";
}

const SLIDES: Slide[] = [
  { store: "2064", label: "Overview — Forecourt", component: "overview" },
  { store: "2056", label: "Overview — Supermarket", component: "overview" },
  { store: "2064", label: "Margin Alerts — Forecourt (YD vs YTD)", component: "margin-alerts", comparison: "yd_ytd" },
  { store: "2056", label: "Margin Alerts — Supermarket (YD vs YTD)", component: "margin-alerts", comparison: "yd_ytd" },
];

const INTERVAL = 45_000; // 45 seconds

export default function PresentationPage() {
  const router = useRouter();
  const { setStore } = useStore();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Set store on slide change ── */
  useEffect(() => {
    setStore(SLIDES[current].store);
  }, [current, setStore]);

  /* ── Request fullscreen on mount ── */
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  /* ── Auto-advance timer ── */
  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(0);
    const startTime = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
    }, 50);

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, paused]);

  /* ── Exit presentation ── */
  const exit = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    router.push("/dashboard");
  }, [router]);

  /* ── Keyboard controls ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { exit(); return; }
      if (e.key === " ") { e.preventDefault(); setPaused((p) => !p); return; }
      if (e.key === "ArrowRight") { setCurrent((p) => (p + 1) % SLIDES.length); return; }
      if (e.key === "ArrowLeft") { setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length); return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [exit]);

  const slide = SLIDES[current];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0c0e14",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Progress bar ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", zIndex: 10000, background: "#1a1d2a" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: paused ? "#f59e0b" : "#818cf8",
            transition: "width 0.05s linear",
          }}
        />
      </div>

      {/* ── Top bar: slide info + controls ── */}
      <div
        style={{
          position: "fixed",
          top: "3px",
          left: 0,
          right: 0,
          zIndex: 10000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 20px",
          background: "linear-gradient(to bottom, rgba(12,14,20,0.95), rgba(12,14,20,0))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#818cf8",
              background: "#818cf822",
              padding: "3px 10px",
              borderRadius: "4px",
            }}
          >
            {current + 1} / {SLIDES.length}
          </span>
          <span style={{ fontSize: "13px", color: "#9ca3af" }}>{slide.label}</span>
          {paused && (
            <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>PAUSED</span>
          )}
        </div>

        <button
          onClick={exit}
          style={{
            background: "none",
            border: "none",
            color: "#9ca3af",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px 8px",
            lineHeight: 1,
          }}
          title="Exit presentation (Esc)"
        >
          ✕
        </button>
      </div>

      {/* ── Slide content ── */}
      <div style={{ flex: 1, padding: "50px 28px 28px 28px", overflow: "auto" }}>
        {slide.component === "overview" ? (
          <OverviewPage />
        ) : (
          <MarginAlertsPage defaultComparison={slide.comparison} />
        )}
      </div>
    </div>
  );
}
