import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { sql, params } = await req.json();
    if (!sql || typeof sql !== "string") {
      return NextResponse.json({ error: "Missing sql" }, { status: 400 });
    }
    const result = await pool.query(sql, params ?? []);
    return NextResponse.json({ rows: result.rows, rowCount: result.rowCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("DB query error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
