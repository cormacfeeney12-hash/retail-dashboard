import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const sb = createClient(url, key);

  // Try inserting a dummy row then deleting — if table doesn't exist the error
  // tells us. We can't run DDL via PostgREST, so we check and advise.
  const { error } = await sb
    .from("price_checks")
    .select("id")
    .limit(1);

  if (error && error.code === "PGRST205") {
    return NextResponse.json({
      exists: false,
      message: "Table price_checks does not exist. Run the SQL below in the Supabase SQL Editor.",
      sql: `CREATE TABLE IF NOT EXISTS price_checks (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  product_name text not null,
  lv_code text,
  store_number text,
  competitor_name text not null,
  our_price numeric,
  their_price numeric not null,
  our_cost numeric,
  our_margin_pct numeric,
  their_margin_pct numeric,
  margin_impact numeric,
  recommendation text,
  category text,
  photo_url text
);`,
    });
  }

  return NextResponse.json({ exists: true, message: "price_checks table is ready" });
}
