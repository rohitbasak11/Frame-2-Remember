import HeroLogo from "@/components/home/HeroLogo";
import FloatingHeroImages from "@/components/home/FloatingHeroImages";
import About from "@/components/home/About";
import PortfolioShuffle from "@/components/home/PortfolioShuffle";
import Connect from "@/components/home/Connect";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      {/* Hero Animation Container */}
      <div className="relative h-screen w-full flex items-center justify-center pointer-events-none">
        <FloatingHeroImages />
        <HeroLogo />
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-color-text" />
        </div>
      </div>

      {/* Main Content Sections */}
      <About />
      <div className="h-24 md:h-48" /> {/* Spacer */}
      <PortfolioShuffle />
      <div className="h-24 md:h-48" /> {/* Spacer */}
      <Connect />
      <Footer />
    </>
  );
}
