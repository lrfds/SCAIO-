import { useState } from 'react';
import {
  Search, Heart, Eye, MessageCircle, ChevronRight,
  Folder, Code, Brain, Wrench, Database, Activity, AlertTriangle, Phone
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  icon: typeof Search;
  color: string;
  submodules: { name: string; desc: string; icon: typeof Folder }[];
}

const agents: Agent[] = [
  {
    id: 'edital-hunter',
    name: 'Edital Hunter',
    emoji: '🎯',
    tagline: 'Agente Core — Busca Cognitiva',
    description:
      'Busca e análise cognitiva de editais públicos. Utiliza CrewAI para orquestração de agentes, LangGraph para grafos cognitivos, Qdrant para memória semântica e Playwright para navegação web.',
    icon: Search,
    color: 'cyan',
    submodules: [
      { name: 'agents/', desc: 'Lógica do agente (CrewAI)', icon: Brain },
      { name: 'cognitive/', desc: 'Estado e grafos cognitivos (LangGraph)', icon: Activity },
      { name: 'memory/', desc: 'Interface Qdrant (semântica/procedural)', icon: Database },
      { name: 'tools/', desc: 'Ferramentas (Playwright, validadores)', icon: Wrench },
    ],
  },
  {
    id: 'health-agent',
    name: 'Health Agent',
    emoji: '💚',
    tagline: 'Supervisor Principal',
    description:
      'Monitora continuamente os agentes operacionais. Coleta sinais operacionais, cognitivos e estruturais. Classifica o estado de saúde (GREEN → YELLOW → RED) e executa ações corretivas automáticas.',
    icon: Heart,
    color: 'emerald',
    submodules: [
      { name: 'sensors/', desc: 'Coleta sinais operacionais e cognitivos', icon: Activity },
      { name: 'classifier/', desc: 'Classificação GREEN → RED', icon: AlertTriangle },
      { name: 'actions/', desc: 'Ações corretivas (isolamento, alertas)', icon: Wrench },
      { name: 'monitor/', desc: 'Watchdog contínuo', icon: Eye },
    ],
  },
  {
    id: 'meta-health-agent',
    name: 'Meta-Health Agent',
    emoji: '🔮',
    tagline: 'Supervisor Final',
    description:
      'Supervisiona o próprio Health Agent, garantindo que o supervisor esteja funcionando. Implementa auto-restart com backoff exponencial e escalonamento para humano via WhatsApp.',
    icon: Eye,
    color: 'violet',
    submodules: [
      { name: 'meta_watchdog.py', desc: 'Loop de verificação do supervisor', icon: Activity },
      { name: 'auto_restart.py', desc: 'Reinício com backoff exponencial', icon: Wrench },
      { name: 'escalation.py', desc: 'Escalonamento para humano (WhatsApp)', icon: Phone },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Channel',
    emoji: '📱',
    tagline: 'Comunicação — Canal de Alerta',
    description:
      'Canal de comunicação com operadores humanos via Evolution API. Formata e envia alertas executivos, relatórios de status e notificações de escalonamento.',
    icon: MessageCircle,
    color: 'green',
    submodules: [
      { name: 'client.py', desc: 'Cliente Evolution API', icon: Code },
      { name: 'notifier.py', desc: 'Formatação e envio de alertas', icon: MessageCircle },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; accent: string }> = {
  cyan:    { bg: 'bg-cyan-500/5',    border: 'border-cyan-500/30',    text: 'text-cyan-400',    glow: 'shadow-cyan-500/10',    accent: 'from-cyan-400 to-cyan-600' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/10', accent: 'from-emerald-400 to-emerald-600' },
  violet:  { bg: 'bg-violet-500/5',  border: 'border-violet-500/30',  text: 'text-violet-400',  glow: 'shadow-violet-500/10',  accent: 'from-violet-400 to-violet-600' },
  green:   { bg: 'bg-green-500/5',   border: 'border-green-500/30',   text: 'text-green-400',   glow: 'shadow-green-500/10',   accent: 'from-green-400 to-green-600' },
};

export default function AgentsSection() {
  const [expanded, setExpanded] = useState<string | null>('edital-hunter');

  return (
    <section id="agents" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-cyan-400 terminal-font tracking-widest uppercase">
            Componentes do Ecossistema
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            <span className="gradient-text">Agentes & Módulos</span>
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm sm:text-base">
            Cada agente possui responsabilidade única e é supervisionado pela camada acima.
          </p>
        </div>

        {/* Agent Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {agents.map((agent) => {
            const colors = colorMap[agent.color];
            const isExpanded = expanded === agent.id;

            return (
              <div
                key={agent.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? `${colors.border} ${colors.bg} shadow-xl ${colors.glow}`
                    : 'border-[#21262d] bg-[#0d1117] hover:border-[#21262d]/80'
                }`}
              >
                {/* Card Header */}
                <button
                  className="w-full p-5 sm:p-6 flex items-start gap-4 text-left"
                  onClick={() => setExpanded(isExpanded ? null : agent.id)}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center text-xl`}>
                    {agent.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[10px] terminal-font ${colors.text} uppercase tracking-wider mb-0.5`}>
                      {agent.tagline}
                    </div>
                    <h3 className="text-lg font-bold text-[#e6edf3]">{agent.name}</h3>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-[#8b949e] transition-transform flex-shrink-0 mt-1 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 animate-fade-in-up">
                    <p className="text-sm text-[#8b949e] leading-relaxed mb-5">
                      {agent.description}
                    </p>

                    {/* Submodules */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-[#8b949e] uppercase tracking-wider terminal-font">
                        Submódulos
                      </span>
                      {agent.submodules.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <div
                            key={sub.name}
                            className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-[#21262d]/50 hover:border-[#21262d] transition-colors"
                          >
                            <SubIcon className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                            <div className="min-w-0">
                              <span className="text-xs terminal-font text-[#e6edf3]">
                                {sub.name}
                              </span>
                              <span className="text-xs text-[#8b949e] ml-2">
                                — {sub.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
