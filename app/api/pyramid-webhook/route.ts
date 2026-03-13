import { NextRequest, NextResponse } from "next/server";

const API_KEY = "pyramid-webhook-2064";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "pyramid-webhook" });
}

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  if (key !== API_KEY) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  console.log("=== Pyramid Webhook Received ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  console.log("Body:", JSON.stringify(body, null, 2));
  console.log("=== End Webhook ===");

  return NextResponse.json({
    received: true,
    timestamp: new Date().toISOString(),
    payload: body,
  });
}
