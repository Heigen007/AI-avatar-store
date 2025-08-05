import { GlassCard } from "./GlassCard";
import { User, Bot, MessageCircle } from "lucide-react";
import appMockups from "@/assets/app-mockups.jpg";

export const UserJourneySection = () => {
  const steps = [
    {
      icon: User,
      title: "Расскажи о себе",
      description: "Укажи имя, возраст и расскажи о своих интересах"
    },
    {
      icon: Bot,
      title: "Создай ИИ-аватара",
      description: "Выбери имя, пол, характер и голос для своего ИИ-друга"
    },
    {
      icon: MessageCircle,
      title: "Общайся и развивайся",
      description: "Отправляй сообщения, фото и созванивайся в любое время"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Как начать{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              пользоваться?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Всего 3 простых шага до знакомства с твоим персональным ИИ-другом
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <GlassCard hover className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                        <step.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-primary bg-primary/20 px-3 py-1 rounded-full">
                          Шаг {index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>

          {/* App Mockups */}
          <div className="flex justify-center animate-fade-in delay-300">
            <GlassCard className="p-8" glow>
              <img 
                src={appMockups} 
                alt="App Interface Mockups" 
                className="w-full h-auto rounded-2xl"
              />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};