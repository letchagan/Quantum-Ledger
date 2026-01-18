import { Activity, Cpu, Wifi, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: any;
  color?: "cyan" | "purple" | "green" | "red";
  trend?: number;
}

export function StatWidget({ label, value, unit, icon: Icon, color = "cyan", trend }: StatProps) {
  const colorMap = {
    cyan: "text-primary border-primary",
    purple: "text-secondary border-secondary",
    green: "text-accent border-accent",
    red: "text-destructive border-destructive",
  };

  return (
    <div className="relative group">
       <div className={cn(
         "absolute -inset-0.5 bg-gradient-to-r opacity-30 blur group-hover:opacity-75 transition duration-500",
         color === 'cyan' ? 'from-primary to-blue-600' :
         color === 'purple' ? 'from-secondary to-pink-600' :
         color === 'green' ? 'from-accent to-emerald-600' :
         'from-destructive to-orange-600'
       )}></div>
      <div className="relative bg-black/80 border border-white/10 p-4 flex items-center gap-4">
        <div className={cn("p-3 border bg-black/50", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-mono font-bold text-white text-glow">{value}</h4>
            {unit && <span className="text-xs text-white/50">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              <div className={cn("w-full h-1 bg-white/10 rounded-full overflow-hidden")}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(trend, 100)}%` }}
                  className={cn("h-full", 
                    color === 'cyan' ? 'bg-primary' :
                    color === 'purple' ? 'bg-secondary' :
                    color === 'green' ? 'bg-accent' : 'bg-destructive'
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
