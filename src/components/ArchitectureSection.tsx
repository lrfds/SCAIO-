import { Layers, Shield, Eye, RefreshCw, AlertTriangle, Server } from 'lucide-react';

const layers = [
  {
    level: 1,
    name: 'Agentes Operacionais',
    desc: 'Edital Hunter + Ferramentas',
    icon: Layers,
    color: 'cyan',
    detail: 'CrewAI + LangGraph + Playwright',
  },
  {
    level: 2,
    name: 'Health Agent',
    desc: 'Supervisor Principal',
    icon: Shield,
    color: 'emerald',
    detail: 'Sensores → Classificador → Ações',
  },
  {
    level: 3,
    name: 'Meta-Health Agent',
    desc: 'Supervisor Final',
    icon: Eye,
    color: 'violet',
    detail: 'Watchdog + Auto-restart + Escalonamento',
  },
  {
    level: 4,
    name: 'systemd',
    desc: 'Last Mile — SO',
    icon: Server,
    color: 'pink',
    detail: 'Hardening + Isolamento + Reinício',
  },
];

const antifragileFeatures = [
  { icon: RefreshCw, label: 'Auto-cura', desc: 'Reinício com backoff exponencial' },
  { icon: AlertTriangle, label: 'Sem falha silenciosa', desc: 'Todo erro é detectado e reportado' },
  { icon: Shield, label: 'Isolamento', desc: 'Agentes isolados via systemd' },
];

const colorMap: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  cyan:    { bg: 'bg-cyan-500/5',    border: 'border-cyan-500/30',    text: 'text-cyan-400',    bar: 'bg-cyan-400' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-400' },
  violet:  { bg: 'bg-violet-500/5',  border: 'border-violet-500/30',  text: 'text-violet-400',  bar: 'bg-violet-400' },
  pink:    { bg: 'bg-pink-500/5',    border: 'border-pink-500/30',    text: 'text-pink-400',    bar: 'bg-pink-400' },
};

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-cyan-400 terminal-font tracking-widest uppercase">
            Padrão Arquitetural
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            <span className="gradient-text">Multi-Agent Metacognitive</span>
            <br />
            <span className="text-[#e6edf3]">Architecture (MAMA)</span>
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm sm:text-base">
            Sistema de supervisão em cascata com 4 camadas, garantindo
            antifragilidade e ausência de ponto único de falha silencioso.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Cascade Layers */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-6">
              Cascata de Supervisão
            </h3>
            {layers.map((layer, i) => {
              const Icon = layer.icon;
              const colors = colorMap[layer.color];
              return (
                <div key={layer.level} className="relative">
                  {/* Connector line */}
                  {i < layers.length - 1 && (
                    <div className="absolute left-6 top-full w-0.5 h-4 bg-gradient-to-b from-[#21262d] to-transparent z-0" />
                  )}
                  <div
                    className={`relative p-4 sm:p-5 rounded-xl border ${colors.bg} ${colors.border} card-hover group`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Level indicator */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] terminal-font ${colors.text} uppercase tracking-wider`}>
                            Camada {layer.level}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-[#e6edf3] mb-0.5">
                          {layer.name}
                        </h4>
                        <p className="text-sm text-[#8b949e] mb-2">{layer.desc}</p>
                        <div className="terminal-font text-[11px] text-[#8b949e]/60 bg-black/20 rounded px-2 py-1 inline-block">
                          {layer.detail}
                        </div>
                      </div>

                      {/* Arrow down */}
                      {i < layers.length - 1 && (
                        <div className="flex-shrink-0 mt-2">
                          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                            <path d="M8 0v20M2 14l6 6 6-6" stroke="currentColor" strokeWidth="1.5" className="text-[#21262d]" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right side: Antifragile + Philosophy */}
          <div className="space-y-8">
            {/* Philosophy Card */}
            <div className="p-6 rounded-xl border border-[#21262d] bg-[#0d1117]">
              <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4">
                Princípio Fundamental
              </h3>
              <blockquote className="text-lg sm:text-xl font-light text-[#e6edf3] italic leading-relaxed border-l-2 border-cyan-500/40 pl-4">
                "Nunca entregue algo apenas porque encontrou. Entregue somente após
                <span className="gradient-text font-semibold"> validar</span>,
                <span className="gradient-text font-semibold"> aprender</span> e
                <span className="gradient-text font-semibold"> evoluir</span>."
              </blockquote>
            </div>

            {/* Antifragile Features */}
            <div className="p-6 rounded-xl border border-[#21262d] bg-[#0d1117]">
              <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-6">
                Antifragilidade
              </h3>
              <div className="space-y-4">
                {antifragileFeatures.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div key={feat.label} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#e6edf3]">{feat.label}</div>
                        <div className="text-xs text-[#8b949e]">{feat.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack Badges */}
            <div className="p-6 rounded-xl border border-[#21262d] bg-[#0d1117]">
              <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4">
                Stack Tecnológica
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'CrewAI', 'LangGraph', 'Playwright', 'Qdrant',
                  'PostgreSQL', 'Redis', 'Docker', 'systemd',
                  'Evolution API', 'Python', 'WhatsApp'
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs terminal-font text-[#8b949e] bg-white/[0.03] border border-[#21262d] rounded-full hover:border-cyan-500/30 hover:text-cyan-400 transition-all cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
