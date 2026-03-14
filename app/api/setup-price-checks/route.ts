import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST() {
  try {
    const result = await pool.query(
      "SELECT to_regclass('public.price_checks') AS tbl"
    );
    const exists = result.rows[0]?.tbl !== null;

    if (!exists) {
      return NextResponse.json({
        exists: false,
        message: "Table price_checks does not exist in RDS.",
      });
    }

    return NextResponse.json({ exists: true, message: "price_checks table is ready" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
