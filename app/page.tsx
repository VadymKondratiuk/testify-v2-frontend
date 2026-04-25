import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import CtaBanner from "@/components/home/CtaBanner";
 
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