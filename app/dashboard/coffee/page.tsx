import { SAMPLE_DATA } from "@/lib/sample-data";
import { FrankHonestSection } from "@/components/FrankHonestSection";
import { AiChat } from "@/components/AiChat";

export default function CoffeePage() {
  return (
    <>
      <FrankHonestSection data={SAMPLE_DATA.fhData} totals={SAMPLE_DATA.fhTotals} />
      <AiChat data={SAMPLE_DATA} />
    </>
  );
}
