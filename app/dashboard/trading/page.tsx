"use client";

import { useState } from "react";
import { SAMPLE_DATA } from "@/lib/sample-data";
import { TradingHoursSection } from "@/components/TradingHoursSection";
import { PeriodTabs } from "@/components/ui/PeriodTabs";
import { AiChat } from "@/components/AiChat";
import type { Period } from "@/lib/types";

export default function TradingPage() {
  const [period, setPeriod] = useState<Period>("daily");

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <PeriodTabs active={period} onChange={setPeriod} />
      </div>
      <TradingHoursSection
        period={period}
        tradingKpis={SAMPLE_DATA.tradingKpis}
        hourlySales={SAMPLE_DATA.hourlySales}
        weeklyTrend16={SAMPLE_DATA.weeklyTrend16}
        top3Days={SAMPLE_DATA.top3Days}
        bottom3Days={SAMPLE_DATA.bottom3Days}
        top3Hours={SAMPLE_DATA.top3Hours}
        bottom3Hours={SAMPLE_DATA.bottom3Hours}
        top3Depts={SAMPLE_DATA.top3Depts}
        bottom3Depts={SAMPLE_DATA.bottom3Depts}
        busiestSlots={SAMPLE_DATA.busiestSlots}
        quietestSlots={SAMPLE_DATA.quietestSlots}
      />
      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
