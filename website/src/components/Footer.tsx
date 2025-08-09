import { GlassCard } from "./GlassCard";
import { Mail, MessageCircle, Instagram } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="py-16 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/15 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <GlassCard className="p-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Logo and Description */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                Repliky
                            </h3>
                            <p className="text-muted-foreground">
                                Твой персональный ИИ-друг, который всегда готов к общению и поддержке
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-foreground">Контакты</h4>
                            <div className="space-y-3">
                                <a
                                    href="mailto:replikyai@gmail.com"
                                    className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                                >
                                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                    <span>replikyai@gmail.com</span>
                                </a>
                                <br />
                                <a
                                    href="https://t.me/heigen007"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                                >
                                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                    <span>Telegram</span>
                                </a>
                                <br />
                                <a
                                    href="https://www.instagram.com/replikyai/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                                >
                                    <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                    <span>Instagram</span>
                                </a>
                            </div>
                        </div>

                        {/* Legal */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-foreground">Правовая информация</h4>
                            <div className="space-y-3">
                                <a
                                    href="https://docs.google.com/document/d/106jUWU_OIHEzbbOD5xCH6vaxMNv3hnVonSvTGSYbRms/edit?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                                >
                                    <span>Политика конфиденциальности</span>
                                </a>
                            </div>
                        </div>

                        {/* About */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-foreground">О проекте</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Repliky — это инновационная платформа для создания персональных ИИ-аватаров,
                                которые помогают людям справляться с одиночеством и развиваться.
                            </p>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-12 pt-8 border-t border-glass-border text-center">
                        <p className="text-muted-foreground">
                            © 2025 Repliky. Все права защищены. Создано с ❤️ для лучшего будущего.
                        </p>
                    </div>
                </GlassCard>
            </div>
        </footer>
    );
};
