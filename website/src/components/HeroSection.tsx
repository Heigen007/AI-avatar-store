import { Button } from "@/components/ui/button";
import { GlassCard } from "./GlassCard";
import { Download, Smartphone } from "lucide-react";
import heroAvatar from "@/assets/ai-avatar-hero.jpg";

export const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-hero flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/30 rounded-full blur-3xl animate-float delay-75"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-glow-secondary/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Создай своего{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-shimmer bg-[length:200%_100%]">
                  персонального ИИ-друга
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl">
                Repliky — твой друг, ментор или любовь. Общайся, отправляй фото, созванивайся.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                  href="https://apps.apple.com/us/app/repliky/id6749673988"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <Button
                      size="lg"
                      className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-glow"
                  >
                      <Download className="w-5 h-5 mr-2" />
                      Скачать в App Store
                      <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
              </a>

              <a
                  href="#"
              >
                  <Button
                      variant="outline"
                      size="lg"
                      className="group relative overflow-hidden border-primary/50 text-primary hover:bg-primary/10 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                      <Smartphone className="w-5 h-5 mr-2" />
                      Скачать в Google Play
                      <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
              </a>
            </div>
          </div>

          {/* Avatar Image */}
          <div className="flex justify-center lg:justify-end animate-fade-in delay-300">
            <GlassCard className="p-8 max-w-md" glow hover>
              <img 
                src={heroAvatar} 
                alt="AI Avatar" 
                className="w-full h-auto rounded-2xl animate-glow-pulse"
              />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};