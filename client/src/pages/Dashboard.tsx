import { useState, useEffect } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { useSystemMetrics } from "@/hooks/use-metrics";
import { useSecurityLogs } from "@/hooks/use-security-logs";
import { CyberCard } from "@/components/CyberCard";
import { StatWidget } from "@/components/StatsDisplay";
import { TransactionForm } from "@/components/TransactionForm";
import { 
  Shield, Activity, Lock, Server, Cpu, Radio, AlertTriangle, 
  Terminal, Database, Globe, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: transactions, isLoading: isLoadingTx } = useTransactions();
  const { data: metrics } = useSystemMetrics();
  const { data: logs } = useSecurityLogs();

  // Mock chart data generation (simulating real-time updates)
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          entropy: Math.floor(Math.random() * 50) + 50,
          load: Math.floor(Math.random() * 30) + 20,
        };
        const newData = [...prev, newPoint];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const latestMetric = metrics?.[0];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      {/* HUD Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/20 pb-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary text-glow tracking-tighter">
            QUANTUM<span className="text-white">LEDGER</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            SYSTEM ONLINE :: V.4.0.2 :: ENCRYPTION ACTIVE
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right hidden md:block">
            <p className="text-xs text-muted-foreground uppercase">Server Time</p>
            <p className="text-xl font-mono text-white">{format(new Date(), "HH:mm:ss")}</p>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: System Status */}
        <div className="lg:col-span-3 space-y-6">
          <CyberCard title="Node Status" glowColor="cyan" delay={0.1}>
            <div className="space-y-4">
              <StatWidget 
                label="Quantum Entropy" 
                value={latestMetric?.quantumEntropy || "---"} 
                unit="Q-BITS"
                icon={Activity}
                color="purple"
                trend={latestMetric ? (latestMetric.quantumEntropy || 0) / 2 : 50}
              />
              <StatWidget 
                label="Network Latency" 
                value={latestMetric?.networkLatency || "---"} 
                unit="MS"
                icon={Radio}
                color="green"
                trend={100 - (latestMetric?.networkLatency || 0)}
              />
              <StatWidget 
                label="CPU Load" 
                value={latestMetric?.cpuUsage || "---"} 
                unit="%"
                icon={Cpu}
                color="cyan"
                trend={latestMetric?.cpuUsage || 0}
              />
            </div>
          </CyberCard>

          <CyberCard title="Operations" glowColor="green" delay={0.2}>
            <div className="space-y-3">
              <TransactionForm />
              <button className="w-full bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/50 p-3 font-mono text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all">
                <Database className="w-4 h-4" /> Export Ledger
              </button>
            </div>
          </CyberCard>

          <CyberCard title="Entropy Flux" className="h-[200px]" delay={0.3}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333' }}
                  itemStyle={{ color: '#0ff', fontFamily: 'monospace' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="entropy" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2} 
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="load" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CyberCard>
        </div>

        {/* Center Column: Transactions Grid */}
        <div className="lg:col-span-6 space-y-6">
          <CyberCard title="Live Transaction Feed" className="min-h-[600px] flex flex-col" delay={0.2}>
            <div className="flex-1 overflow-hidden relative">
              <div className="scanline" /> {/* Visual Effect */}
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-primary/20 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      <th className="p-3">Hash</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Sender -&gt; Receiver</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-sm">
                    {isLoadingTx ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                          Decrypting Ledger...
                        </td>
                      </tr>
                    ) : transactions?.length === 0 ? (
                       <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No transactions found in current block.
                        </td>
                      </tr>
                    ) : (
                      transactions?.slice(0, 10).map((tx) => (
                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                          <td className="p-3 font-xs text-muted-foreground group-hover:text-primary transition-colors truncate max-w-[100px]">
                            {tx.hash.substring(0, 12)}...
                          </td>
                          <td className="p-3 font-bold text-white">
                            {Number(tx.amount).toFixed(4)} <span className="text-xs text-primary/70">{tx.currency}</span>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span className="text-white/50">{tx.sender.substring(0, 6)}</span>
                              <span className="text-primary">→</span>
                              <span className="text-white/50">{tx.receiver.substring(0, 6)}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={cn(
                              "px-2 py-0.5 text-[10px] uppercase border",
                              tx.status === 'verified' ? "bg-green-500/10 text-green-400 border-green-500/30" :
                              tx.status === 'pending' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" :
                              "bg-red-500/10 text-red-400 border-red-500/30"
                            )}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-3 text-right text-xs text-muted-foreground">
                            {tx.timestamp ? format(new Date(tx.timestamp), "HH:mm:ss") : "--:--"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CyberCard>
        </div>

        {/* Right Column: Security & Logs */}
        <div className="lg:col-span-3 space-y-6">
          <CyberCard title="Security Monitor" glowColor="red" delay={0.3}>
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500/10 relative">
                   <Shield className="w-6 h-6 text-green-500" />
                   <div className="absolute inset-0 rounded-full border border-green-500 animate-ping opacity-20" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-white">FIREWALL ACTIVE</p>
                   <p className="text-xs text-green-400">0 THREATS DETECTED</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-xs text-muted-foreground">UPTIME</p>
                 <p className="font-mono text-white">99.99%</p>
               </div>
            </div>

            <div className="h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-primary/20">
              {logs?.map((log) => (
                <div key={log.id} className="p-3 bg-black/40 border border-white/5 text-xs font-mono">
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "uppercase font-bold",
                      log.level === 'critical' ? "text-red-500" :
                      log.level === 'warning' ? "text-yellow-500" : "text-blue-400"
                    )}>
                      [{log.level}]
                    </span>
                    <span className="text-white/30">{log.timestamp ? format(new Date(log.timestamp), "HH:mm:ss") : ""}</span>
                  </div>
                  <p className="text-white/80 mb-1">{log.event}</p>
                  {log.sourceIp && (
                    <p className="text-white/40 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {log.sourceIp}
                    </p>
                  )}
                </div>
              ))}
              
              {/* Static fallbacks if no logs */}
              {!logs?.length && (
                <>
                  <div className="p-3 bg-black/40 border border-white/5 text-xs font-mono opacity-50">
                    <span className="text-blue-400 font-bold">[INFO]</span> System initialization complete
                  </div>
                   <div className="p-3 bg-black/40 border border-white/5 text-xs font-mono opacity-50">
                    <span className="text-blue-400 font-bold">[INFO]</span> Connecting to Quantum Node...
                  </div>
                </>
              )}
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
}

function Loader2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
