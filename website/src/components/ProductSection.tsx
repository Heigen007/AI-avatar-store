import { GlassCard } from "./GlassCard";
import { Bot, Users, MessageCircle } from "lucide-react";

export const ProductSection = () => {
  const features = [
    {
      icon: Bot,
      title: "Создавай уникального ИИ-аватара",
      description: "Персонализируй внешность, характер и поведение твоего ИИ-друга под свои предпочтения"
    },
    {
      icon: Users,
      title: "Выбирай характер, голос и отношения",
      description: "Настрой тип отношений: друг, ментор, романтический партнер или собеседник"
    },
    {
      icon: MessageCircle,
      title: "Общайся голосом, текстом и фото",
      description: "Полноценное общение через текст, голосовые сообщения и обмен фотографиями"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/15 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Возможности{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Repliky
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Создай идеального собеседника, который понимает тебя и всегда готов к общению
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <GlassCard hover className="h-full text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};