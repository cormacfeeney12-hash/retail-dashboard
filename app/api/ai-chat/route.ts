import { NextRequest, NextResponse } from "next/server";
import type { ReportData } from "@/lib/types";

function buildContext(data: ReportData): string {
  const d = data.summary.daily;
  const w = data.summary.wtd;
  const y = data.summary.ytd;

  return `You are an AI retail analyst for ${data.storeName}. Report date: ${data.reportDate}, Week ${data.weekNumber}.

SALES PERFORMANCE:
- Today: €${d.retailSales.toFixed(2)} (${(d.retailSalesVarPct * 100).toFixed(2)}% vs LY)
- WTD: €${w.retailSales.toFixed(2)} (${(w.retailSalesVarPct * 100).toFixed(2)}% vs LY)
- YTD: €${y.retailSales.toFixed(2)} (${(y.retailSalesVarPct * 100).toFixed(2)}% vs LY)

SCAN MARGIN:
- Today: ${(d.scanMargin * 100).toFixed(2)}% (LY: ${(d.scanMarginLY * 100).toFixed(2)}%)
- WTD: ${(w.scanMargin * 100).toFixed(2)}% | YTD: ${(y.scanMargin * 100).toFixed(2)}%

WASTE:
- Today: €${d.waste.toFixed(2)} (${(d.wasteVarPct * 100).toFixed(1)}% vs LY)
- WTD: €${w.waste.toFixed(2)} | YTD: €${y.waste.toFixed(2)}

F&H COFFEE:
- Total sales: €${data.fhTotals.totalSales.toFixed(2)}
- Cups invoiced: ${data.fhTotals.totalInvoiced} | Sold: ${data.fhTotals.totalSold} | Variance: ${data.fhTotals.totalVariance}
${data.fhData
  .filter((p) => p.variance !== 0)
  .map((p) => `  - ${p.name}: ${p.variance > 0 ? "+" : ""}${p.variance} cups variance`)
  .join("\n")}

TOP DEPARTMENTS (weekly sales):
${data.departments
  .filter((d) => d.s != null && d.s > 0)
  .sort((a, b) => (b.s ?? 0) - (a.s ?? 0))
  .slice(0, 8)
  .map((d) => `  - ${d.n}: €${(d.s ?? 0).toFixed(2)} (${((d.sv ?? 0) * 100).toFixed(1)}% vs LY)`)
  .join("\n")}

TOP PRODUCTS (by qty):
${data.products
  .sort((a, b) => b.q - a.q)
  .slice(0, 10)
  .map((p) => `  - ${p.n}: ${p.q} units, €${p.s.toFixed(2)} sales, ${(p.mp * 100).toFixed(1)}% margin`)
  .join("\n")}

HOURLY PEAK: ${data.hourlySales.reduce((a, b) => (b.v > a.v ? b : a), data.hourlySales[0])?.h ?? "N/A"}

Be concise, specific, and actionable. Use the data above to answer questions accurately.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI chat not configured (missing OPENAI_API_KEY)" }, { status: 503 });
  }

  let body: { message: string; reportData: ReportData };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { message, reportData } = body;
  if (!message || !reportData) {
    return NextResponse.json({ error: "Missing message or reportData" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1024,
        messages: [
          { role: "system", content: buildContext(reportData) },
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI API error:", res.status, errText);
      return NextResponse.json(
        { error: `OpenAI error ${res.status}: ${errText}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "No response";
    return NextResponse.json({ content });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json({ error: "Connection error" }, { status: 500 });
  }
}
