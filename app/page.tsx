import Hero from "@/features/home/components/Hero";
import Stats from "@/features/home/components/Stats";
import Features from "@/features/home/components/Features";
import HowItWorks from "@/features/home/components/HowItWorks";
import CtaBanner from "@/features/home/components/CtaBanner";
 
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CtaBanner />
    </main>
  );
}