import { Hero } from "@/components/sections/Hero";
import { Newsletter } from "@/components/sections/Newsletter";
import { RecipesRail } from "@/components/sections/RecipesRail";
import { Reviews } from "@/components/sections/Reviews";
import { ShopSection } from "@/components/sections/ShopSection";
import { SprayVsSpoon } from "@/components/sections/SprayVsSpoon";
import { TrustStrip } from "@/components/sections/TrustStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ShopSection />
      <SprayVsSpoon />
      <RecipesRail />
      <Reviews />
      <Newsletter />
    </>
  );
}
