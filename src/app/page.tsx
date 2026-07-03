import { Hero } from "@/components/home/Hero";
import { GamesSection } from "@/components/home/GamesSection";
import { SaloonSection } from "@/components/home/SaloonSection";
import { WorldSection } from "@/components/home/WorldSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <GamesSection />
      <SaloonSection />
      <WorldSection />
      <PillarsSection />
      <FinalCta />
    </>
  );
}
