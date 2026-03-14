import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = "store-margin-tool-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeNumber = searchParams.get("store_number");
  const category = searchParams.get("category");

  let query = supabase
    .from("photo_library")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (storeNumber && storeNumber !== "both") {
    query = query.eq("store_number", storeNumber);
  }
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Generate presigned URLs for each photo
  if (data && data.length > 0) {
    const withUrls = await Promise.all(
      data.map(async (p: Record<string, unknown>) => {
        try {
          const command = new GetObjectCommand({ Bucket: BUCKET, Key: p.s3_key as string });
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
          return { ...p, url };
        } catch {
          return { ...p, url: null };
        }
      })
    );
    return NextResponse.json({ data: withUrls });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("photo_library")
    .insert(body)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data?.[0] ?? null });
}
