import { Brain, Heart, ExternalLink, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-[#21262d] bg-[#0d1117]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                <Brain className="w-4 h-4 text-[#06080e]" />
              </div>
              <span className="text-lg font-bold gradient-text">SCAIO</span>
            </div>
            <p className="text-xs text-[#8b949e] leading-relaxed max-w-xs">
              Sistema Cognitivo Autônomo de Inteligência Operacional.
              Infraestrutura open source para captação de recursos e compliance.
            </p>
          </div>

          {/* Architecture */}
          <div>
            <h4 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-wider mb-4">
              Arquitetura
            </h4>
            <ul className="space-y-2">
              {['Multi-Agent (MAMA)', 'Ciclo Metacognitivo', 'Supervisão em Cascata', 'Antifragilidade'].map((item) => (
                <li key={item}>
                  <span className="text-xs text-[#8b949e] hover:text-cyan-400 transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Components */}
          <div>
            <h4 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-wider mb-4">
              Componentes
            </h4>
            <ul className="space-y-2">
              {['Edital Hunter', 'Health Agent', 'Meta-Health Agent', 'WhatsApp Channel'].map((item) => (
                <li key={item}>
                  <span className="text-xs text-[#8b949e] hover:text-cyan-400 transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div>
            <h4 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-wider mb-4">
              Stack
            </h4>
            <ul className="space-y-2">
              {['CrewAI + LangGraph', 'Qdrant + PostgreSQL', 'Docker + systemd', 'Evolution API'].map((item) => (
                <li key={item}>
                  <span className="text-xs text-[#8b949e] hover:text-cyan-400 transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-[#8b949e]">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-emerald-400" />
              MIT / Apache 2.0
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-red-400" />
              100% Open Source
            </span>
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3 text-cyan-400" />
              R$ 0,00
            </span>
          </div>
          <div className="text-[10px] text-[#8b949e]/50 terminal-font">
            SCAIO v1.0.0 — Production-Ready / SRE-Grade
          </div>
        </div>
      </div>
    </footer>
  );
}
