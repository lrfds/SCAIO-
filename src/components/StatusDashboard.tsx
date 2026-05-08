import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, Clock, CheckCircle2, Zap } from 'lucide-react';

interface SystemMetric {
  label: string;
  value: number;
  max: number;
  unit: string;
  icon: typeof Cpu;
  color: string;
}

interface AgentStatus {
  name: string;
  status: 'GREEN' | 'YELLOW' | 'RED';
  uptime: string;
  lastCheck: string;
  tasks: number;
}

const initialMetrics: SystemMetric[] = [
  { label: 'CPU', value: 23, max: 100, unit: '%', icon: Cpu, color: 'cyan' },
  { label: 'Memória', value: 4.2, max: 16, unit: 'GB', icon: HardDrive, color: 'emerald' },
  { label: 'Rede I/O', value: 12, max: 100, unit: 'MB/s', icon: Wifi, color: 'violet' },
  { label: 'Atividade', value: 87, max: 100, unit: '%', icon: Activity, color: 'pink' },
];

const agentStatuses: AgentStatus[] = [
  { name: 'Edital Hunter', status: 'GREEN', uptime: '14d 7h 23m', lastCheck: '2s atrás', tasks: 1247 },
  { name: 'Health Agent', status: 'GREEN', uptime: '14d 7h 23m', lastCheck: '1s atrás', tasks: 8934 },
  { name: 'Meta-Health Agent', status: 'GREEN', uptime: '14d 7h 23m', lastCheck: '5s atrás', tasks: 421 },
  { name: 'WhatsApp Channel', status: 'GREEN', uptime: '14d 7h 22m', lastCheck: '3s atrás', tasks: 56 },
];

const statusColorMap = {
  GREEN: { dot: 'status-green', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  YELLOW: { dot: 'status-yellow', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  RED: { dot: 'status-red', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const metricColorMap: Record<string, { bar: string; text: string }> = {
  cyan:    { bar: 'bg-cyan-400',    text: 'text-cyan-400' },
  emerald: { bar: 'bg-emerald-400', text: 'text-emerald-400' },
  violet:  { bar: 'bg-violet-400',  text: 'text-violet-400' },
  pink:    { bar: 'bg-pink-400',    text: 'text-pink-400' },
};

const logEntries = [
  { time: '12:45:03', level: 'INFO', msg: 'Edital Hunter: 3 novos editais encontrados — PNCP, ComprasNet, BEC' },
  { time: '12:44:58', level: 'INFO', msg: 'Health Agent: Todos os sensores GREEN — ciclo 8934 completo' },
  { time: '12:44:51', level: 'DEBUG', msg: 'Qdrant: Embedding cache hit ratio: 94.2%' },
  { time: '12:44:45', level: 'INFO', msg: 'Meta-Health: Watchdog OK — Health Agent respondendo em 12ms' },
  { time: '12:44:30', level: 'WARN', msg: 'Rate limit ComprasNet: 80% — aplicando backoff 2s' },
  { time: '12:44:12', level: 'INFO', msg: 'Edital Hunter: Análise semântica concluída — 2 editais relevantes' },
  { time: '12:43:58', level: 'INFO', msg: 'WhatsApp: Relatório diário enviado — 47 editais, 12 relevantes' },
  { time: '12:43:40', level: 'DEBUG', msg: 'LangGraph: Estado cognitivo persistido — 128KB' },
];

const logLevelColor: Record<string, string> = {
  INFO: 'text-cyan-400',
  DEBUG: 'text-[#8b949e]',
  WARN: 'text-yellow-400',
  ERROR: 'text-red-400',
};

export default function StatusDashboard() {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: Math.max(
            m.label === 'Memória' ? 2 : 5,
            Math.min(
              m.max * 0.95,
              m.value + (Math.random() - 0.5) * (m.label === 'Memória' ? 0.3 : 8)
            )
          ),
        }))
      );
      setCurrentTime(new Date());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="status" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-cyan-400 terminal-font tracking-widest uppercase">
            Monitoramento ao Vivo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            <span className="gradient-text">Dashboard Operacional</span>
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm sm:text-base">
            Visualização simulada do sistema de monitoramento em tempo real.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* System Metrics */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-xl border border-[#21262d] bg-[#0d1117]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider">
                  Métricas do Sistema
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="status-dot status-green" />
                  <span className="text-[10px] text-emerald-400 terminal-font">LIVE</span>
                </div>
              </div>

              <div className="space-y-4">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  const colors = metricColorMap[metric.color];
                  const pct = (metric.value / metric.max) * 100;

                  return (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                          <span className="text-xs text-[#8b949e]">{metric.label}</span>
                        </div>
                        <span className={`text-xs terminal-font ${colors.text}`}>
                          {metric.label === 'Memória'
                            ? metric.value.toFixed(1)
                            : Math.round(metric.value)}
                          {metric.unit}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors.bar} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clock */}
            <div className="p-5 rounded-xl border border-[#21262d] bg-[#0d1117]">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#8b949e]" />
                <span className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider">
                  Horário do Sistema
                </span>
              </div>
              <div className="terminal-font text-2xl gradient-text text-center">
                {currentTime.toLocaleTimeString('pt-BR')}
              </div>
              <div className="terminal-font text-xs text-[#8b949e] text-center mt-1">
                {currentTime.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Agent Status Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-xl border border-[#21262d] bg-[#0d1117]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider">
                  Status dos Agentes
                </h3>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 terminal-font">ALL SYSTEMS OPERATIONAL</span>
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#21262d]">
                      <th className="text-left py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Agente</th>
                      <th className="text-left py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Status</th>
                      <th className="text-left py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Uptime</th>
                      <th className="text-left py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Última Verificação</th>
                      <th className="text-right py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Tarefas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentStatuses.map((agent) => {
                      const sc = statusColorMap[agent.status];
                      return (
                        <tr key={agent.name} className="border-b border-[#21262d]/50 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 text-[#e6edf3] font-medium">{agent.name}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] terminal-font ${sc.bg} ${sc.border} border ${sc.text}`}>
                              <span className={`status-dot ${sc.dot}`} />
                              {agent.status}
                            </span>
                          </td>
                          <td className="py-3 terminal-font text-xs text-[#8b949e]">{agent.uptime}</td>
                          <td className="py-3 terminal-font text-xs text-[#8b949e]">{agent.lastCheck}</td>
                          <td className="py-3 terminal-font text-xs text-[#8b949e] text-right">{agent.tasks.toLocaleString('pt-BR')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {agentStatuses.map((agent) => {
                  const sc = statusColorMap[agent.status];
                  return (
                    <div key={agent.name} className="p-3 rounded-lg bg-black/20 border border-[#21262d]/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#e6edf3]">{agent.name}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] terminal-font ${sc.bg} ${sc.border} border ${sc.text}`}>
                          <span className={`status-dot ${sc.dot}`} />
                          {agent.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] terminal-font text-[#8b949e]">
                        <span>↑ {agent.uptime}</span>
                        <span>{agent.tasks.toLocaleString('pt-BR')} tarefas</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Log Stream */}
            <div className="p-5 rounded-xl border border-[#21262d] bg-[#0d1117] scan-line">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider">
                  Log Stream
                </h3>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] text-cyan-400 terminal-font">TAIL -F</span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-hidden">
                {logEntries.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 text-[11px] terminal-font ${
                      i === 0 ? 'opacity-100' : i === 1 ? 'opacity-80' : i === 2 ? 'opacity-60' : 'opacity-40'
                    } transition-opacity`}
                  >
                    <span className="text-[#8b949e] flex-shrink-0">{entry.time}</span>
                    <span className={`flex-shrink-0 w-12 ${logLevelColor[entry.level]}`}>
                      [{entry.level}]
                    </span>
                    <span className="text-[#8b949e]">{entry.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
