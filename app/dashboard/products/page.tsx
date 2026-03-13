"use client";

import { SAMPLE_DATA } from "@/lib/sample-data";
import { TopSellers } from "@/components/TopSellers";
import { AiChat } from "@/components/AiChat";

export default function ProductsPage() {
  return (
    <>
      <TopSellers />
      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
