import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    glow?: boolean;
    hover?: boolean;
}

export const GlassCard = ({ children, className, glow = false, hover = false }: GlassCardProps) => {
    return (
        <div
            className={cn(
                "relative backdrop-blur-lg bg-gradient-glass border border-glass-border rounded-2xl p-6 overflow-hidden",
                glow && "shadow-glow",
                hover && "transition-all duration-300 hover:shadow-glow hover:border-primary/50 hover:bg-gradient-to-br hover:from-glass-bg hover:to-primary/10",
                "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-glow before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] before:pointer-events-none",
                hover && "hover:before:opacity-100",
                className
            )}
        >
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
