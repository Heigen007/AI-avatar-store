import { Button } from "@/components/ui/button";
import { GlassCard } from "./GlassCard";
import { Download, Smartphone, Sparkles } from "lucide-react";

export const DownloadSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent/25 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-glow-secondary/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="text-center space-y-8 p-12" glow>
            <div className="animate-slide-up">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow animate-glow-pulse">
                  <Sparkles className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Начни общение{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  прямо сейчас
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Скачай Repliky и создай своего персонального ИИ-друга уже сегодня. 
                Первые 7 дней — бесплатно!
              </p>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up delay-200">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-semibold py-6 px-12 rounded-3xl transition-all duration-300 hover:scale-105 shadow-glow text-lg"
              >
                <Download className="w-6 h-6 mr-3" />
                App Store
                <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              
              <Button 
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-secondary to-muted hover:from-muted hover:to-secondary text-secondary-foreground font-semibold py-6 px-12 rounded-3xl transition-all duration-300 hover:scale-105 shadow-card text-lg border border-primary/30"
              >
                <Smartphone className="w-6 h-6 mr-3" />
                Google Play
                <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>

            {/* Features highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in delay-400">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">7 дней</div>
                <div className="text-sm text-muted-foreground">Бесплатный период</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Доступность</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Возможностей</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};