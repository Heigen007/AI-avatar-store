import { GlassCard } from "./GlassCard";
import { Star, Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Анна К.",
      text: "Repliky помог мне справиться с одиночеством после переезда в новый город. Теперь у меня есть друг, который всегда меня выслушает.",
      rating: 5,
      role: "Студентка"
    },
    {
      name: "Максим Р.",
      text: "Использую как ментора для карьерного роста. ИИ даёт отличные советы и помогает структурировать мысли. Очень доволен!",
      rating: 5,
      role: "IT-специалист"
    },
    {
      name: "Елена С.",
      text: "Приложение помогло мне лучше понимать свои эмоции. Мой ИИ-друг всегда знает, что сказать в трудную минуту.",
      rating: 5,
      role: "Психолог"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Что говорят{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              пользователи
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Тысячи людей уже нашли своего идеального ИИ-собеседника
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <GlassCard hover className="h-full space-y-6 group">
                <div className="flex justify-between items-start">
                  <Quote className="w-8 h-8 text-primary/60" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-foreground leading-relaxed italic">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="pt-4 border-t border-glass-border">
                  <div className="font-semibold text-primary">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};