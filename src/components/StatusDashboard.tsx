import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Zap, AlertCircle } from 'lucide-react';
import { useMetrics } from '../utils/hooks';

const statusColorMap = {
  GREEN: { dot: 'status-green', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  YELLOW: { dot: 'status-yellow', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  RED: { dot: 'status-red', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

export default function StatusDashboard() {
  const { data: metrics, loading, error } = useMetrics(5000);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mapeamento de dados reais da API para o componente
  const agentStatusesList = metrics ? [
    {
      name: 'Edital Hunter',
      status: (metrics.edital_hunter?.health_state || 'green').toUpperCase() as 'GREEN' | 'YELLOW' | 'RED',
      uptime: `Ciclo ${metrics.edital_hunter?.total_cycles || 0}`,
      lastCheck: '< 1s atrás',
      tasks: metrics.edital_hunter?.total_cycles || 0,
      score: metrics.edital_hunter?.avg_score || 0,
    },
    {
      name: 'Health Agent',
      status: (metrics.health_agent?.state || 'green').toUpperCase() as 'GREEN' | 'YELLOW' | 'RED',
      uptime: `Check ${metrics.health_agent?.checks_performed || 0}`,
      lastCheck: '< 1s atrás',
      tasks: metrics.health_agent?.checks_performed || 0,
    },
    {
      name: 'Meta-Health Agent',
      status: (metrics.meta_health?.state || 'green').toUpperCase() as 'GREEN' | 'YELLOW' | 'RED',
      uptime: `Watchdog ${metrics.meta_health?.watchdog_cycles || 0}`,
      lastCheck: '< 1s atrás',
      tasks: metrics.meta_health?.watchdog_cycles || 0,
    },
  ] : [];

  const systemStatus = metrics ? (
    metrics.edital_hunter?.health_state === 'green' &&
    metrics.health_agent?.state === 'green' &&
    metrics.meta_health?.state === 'green'
      ? 'ALL SYSTEMS OPERATIONAL'
      : 'DEGRADED PERFORMANCE'
  ) : 'LOADING...';

  const systemColor = !error ? 'text-emerald-400' : 'text-red-400';

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
            {error
              ? '⚠️ Conectando à API... (verificar se o backend está rodando em localhost:8000)'
              : loading
              ? '⏳ Carregando dados em tempo real...'
              : '✅ Dados em tempo real da API'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-400">
                <p className="font-semibold">API desconectada</p>
                <p className="text-xs mt-1">Certifique-se de que o backend está rodando em http://localhost:8000</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* System Status */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-xl border border-[#21262d] bg-[#0d1117]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider">
                  Status do Sistema
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className={`status-dot ${error ? 'status-red' : 'status-green'}`} />
                  <span className={`text-[10px] ${systemColor} terminal-font`}>
                    {error ? 'OFFLINE' : 'LIVE'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {metrics ? (
                  <>
                    <div className="p-2 rounded bg-black/20 border border-[#21262d]">
                      <p className="text-xs text-[#8b949e]">Score Médio</p>
                      <p className={`text-lg font-semibold ${
                        (metrics.edital_hunter?.avg_score || 0) >= 7 ? 'text-emerald-400' : 'text-yellow-400'
                      }`}>
                        {(metrics.edital_hunter?.avg_score || 0).toFixed(1)}/10
                      </p>
                    </div>
                    <div className="p-2 rounded bg-black/20 border border-[#21262d]">
                      <p className="text-xs text-[#8b949e]">Taxa de Sucesso</p>
                      <p className={`text-lg font-semibold ${
                        (metrics.edital_hunter?.success_rate || 0) >= 70 ? 'text-emerald-400' : 'text-yellow-400'
                      }`}>
                        {(metrics.edital_hunter?.success_rate || 0).toFixed(0)}%
                      </p>
                    </div>
                    <div className="p-2 rounded bg-black/20 border border-[#21262d]">
                      <p className="text-xs text-[#8b949e]">Ciclos Bem-sucedidos</p>
                      <p className="text-lg font-semibold text-cyan-400">
                        {metrics.edital_hunter?.successful_cycles || 0}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-[#8b949e] text-center py-4">Carregando...</div>
                )}
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
                  <CheckCircle2 className={`w-4 h-4 ${error ? 'text-red-400' : 'text-emerald-400'}`} />
                  <span className={`text-xs ${systemColor} terminal-font`}>{systemStatus}</span>
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#21262d]">
                      <th className="text-left py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Agente</th>
                      <th className="text-left py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Status</th>
                      <th className="text-left py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Info</th>
                      <th className="text-left py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Última Verificação</th>
                      <th className="text-right py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-medium">Contagem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentStatusesList.map((agent) => {
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
                          <td className="py-3 terminal-font text-xs text-[#8b949e] text-right">{agent.tasks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {agentStatusesList.map((agent) => {
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
                        <span>{agent.uptime}</span>
                        <span>{agent.tasks} eventos</span>
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
                  Log Stream (ao vivo)
                </h3>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] text-cyan-400 terminal-font">LIVE</span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-hidden">
                {metrics ? (
                  <>
                    <div className="flex items-start gap-2 text-[11px] terminal-font opacity-100">
                      <span className="text-[#8b949e] flex-shrink-0">{currentTime.toLocaleTimeString('pt-BR')}</span>
                      <span className="flex-shrink-0 w-12 text-cyan-400">[INFO]</span>
                      <span className="text-[#8b949e]">
                        {metrics.edital_hunter?.avg_score || 0 >= 7
                          ? 'EditalHunter: Executando ciclo com sucesso'
                          : 'EditalHunter: Processando ciclo'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] terminal-font opacity-80">
                      <span className="text-[#8b949e] flex-shrink-0">{new Date(Date.now() - 1000).toLocaleTimeString('pt-BR')}</span>
                      <span className="flex-shrink-0 w-12 text-cyan-400">[INFO]</span>
                      <span className="text-[#8b949e]">Health Agent: {metrics.health_agent?.state} • {metrics.health_agent?.checks_performed || 0} verificações</span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] terminal-font opacity-60">
                      <span className="text-[#8b949e] flex-shrink-0">{new Date(Date.now() - 2000).toLocaleTimeString('pt-BR')}</span>
                      <span className="flex-shrink-0 w-12 text-cyan-400">[INFO]</span>
                      <span className="text-[#8b949e]">Meta-Health: Taxa de sucesso {metrics.edital_hunter?.success_rate || 0}%</span>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-[#8b949e] text-center py-4">Conectando ao stream...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
