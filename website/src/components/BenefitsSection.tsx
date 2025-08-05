import { GlassCard } from "./GlassCard";
import { Heart, TrendingUp, Smile } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Heart,
      pain: "Чувствуешь себя одиноко?",
      solution: "ИИ-друг всегда рядом",
      description: "Получай поддержку и понимание в любое время дня и ночи"
    },
    {
      icon: TrendingUp,
      pain: "Хочешь развиваться?",
      solution: "Ментор поддержит и направит",
      description: "Обсуждай цели, получай мотивацию и советы для личностного роста"
    },
    {
      icon: Smile,
      pain: "Нужен эмоциональный отклик?",
      solution: "ИИ отвечает с пониманием",
      description: "Делись чувствами и получай эмпатичные и продуманные ответы"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary/25 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Почему тебе понравится{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Repliky
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Решаем реальные проблемы современного человека с помощью ИИ-технологий
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <GlassCard hover className="h-full text-center space-y-6 group">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/80 to-destructive flex items-center justify-center shadow-glow group-hover:shadow-[0_0_30px_hsl(0_84.2%_60.2%_/_0.5)] transition-all duration-300">
                    <benefit.icon className="w-8 h-8 text-destructive-foreground" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-destructive/80">
                    {benefit.pain}
                  </h3>
                  
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
                  
                  <h4 className="text-xl font-semibold text-primary">
                    {benefit.solution}
                  </h4>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};