import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  glowColor?: "cyan" | "purple" | "green" | "red";
  delay?: number;
}

export function CyberCard({ children, className, title, glowColor = "cyan", delay = 0 }: CyberCardProps) {
  const borderColor = {
    cyan: "border-primary/20",
    purple: "border-secondary/20",
    green: "border-accent/20",
    red: "border-destructive/20",
  }[glowColor];

  const glowClass = {
    cyan: "shadow-[0_0_15px_rgba(0,255,255,0.1)]",
    purple: "shadow-[0_0_15px_rgba(180,0,255,0.1)]",
    green: "shadow-[0_0_15px_rgba(0,255,0,0.1)]",
    red: "shadow-[0_0_15px_rgba(255,0,0,0.1)]",
  }[glowColor];

  const titleColor = {
    cyan: "text-primary",
    purple: "text-secondary",
    green: "text-accent",
    red: "text-destructive",
  }[glowColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "cyber-card bg-card/80 backdrop-blur-sm p-4",
        borderColor,
        glowClass,
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h3 className={cn("text-lg font-bold tracking-widest uppercase flex items-center gap-2", titleColor)}>
            <span className="inline-block w-2 h-2 bg-current animate-pulse" />
            {title}
          </h3>
          <div className="flex gap-1">
             <div className="w-1 h-1 bg-white/20" />
             <div className="w-1 h-1 bg-white/20" />
             <div className="w-1 h-1 bg-white/20" />
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
}
