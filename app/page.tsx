import { HeaderOrigin } from "@/components/header-origin";
import { HeroOrigin } from "@/components/hero-origin";
import { HowItWorks } from "@/components/how-it-works";
import { FeaturesOrigin } from "@/components/features-origin";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023]">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-mesh-gradient opacity-20 animate-gradient"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#007953] rounded-full animate-float"></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#00a86b] rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[#007953] rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#00a86b] rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <HeaderOrigin />
        <HeroOrigin />
        <HowItWorks />
        <FeaturesOrigin />
        <Testimonials />
        <Footer />
      </div>
    </main>
  );
}
