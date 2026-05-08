import { useState, useEffect } from 'react';
import {
  ClipboardList, Play, Search, Brain, SlidersHorizontal, Database, Send
} from 'lucide-react';

const cycleSteps = [
  { label: 'Planejar', icon: ClipboardList, color: 'cyan', desc: 'Define objetivos e estratégias' },
  { label: 'Executar', icon: Play, color: 'blue', desc: 'Executa ações planejadas' },
  { label: 'Avaliar', icon: Search, color: 'violet', desc: 'Avalia resultados obtidos' },
  { label: 'Refletir', icon: Brain, color: 'purple', desc: 'Aprende com a experiência' },
  { label: 'Ajustar', icon: SlidersHorizontal, color: 'pink', desc: 'Refina parâmetros internos' },
  { label: 'Persistir', icon: Database, color: 'emerald', desc: 'Salva conhecimento adquirido' },
  { label: 'Entregar', icon: Send, color: 'teal', desc: 'Entrega valor validado' },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/40',    text: 'text-cyan-400',    glow: 'rgba(0,240,255,0.3)' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/40',    text: 'text-blue-400',    glow: 'rgba(59,130,246,0.3)' },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/40',  text: 'text-violet-400',  glow: 'rgba(139,92,246,0.3)' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/40',  text: 'text-purple-400',  glow: 'rgba(168,85,247,0.3)' },
  pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/40',    text: 'text-pink-400',    glow: 'rgba(236,72,153,0.3)' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'rgba(0,255,136,0.3)' },
  teal:    { bg: 'bg-teal-500/10',    border: 'border-teal-500/40',    text: 'text-teal-400',    glow: 'rgba(20,184,166,0.3)' },
};

export default function CognitiveCycle() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % cycleSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="cycle" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-cyan-400 terminal-font tracking-widest uppercase">
            Ciclo Cognitivo Obrigatório
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            <span className="gradient-text">Ciclo Metacognitivo</span>
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm sm:text-base">
            Cada operação segue o ciclo completo: nunca entregar sem validar,
            aprender e evoluir.
          </p>
        </div>

        {/* Cycle Visualization */}
        <div className="relative max-w-4xl mx-auto">
          {/* SVG Connection Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,240,255,0.3)" />
                <stop offset="50%" stopColor="rgba(139,92,246,0.3)" />
                <stop offset="100%" stopColor="rgba(0,255,136,0.3)" />
              </linearGradient>
            </defs>
            {cycleSteps.slice(0, -1).map((_, i) => {
              const x1 = (i / (cycleSteps.length - 1)) * 900 + 50;
              const x2 = ((i + 1) / (cycleSteps.length - 1)) * 900 + 50;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={150}
                  x2={x2}
                  y2={150}
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity={i <= activeStep ? 0.8 : 0.2}
                />
              );
            })}
          </svg>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {cycleSteps.map((step, i) => {
              const Icon = step.icon;
              const colors = colorMap[step.color];
              const isActive = i === activeStep;
              const isPast = i < activeStep;

              return (
                <div
                  key={step.label}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    isActive ? 'scale-105 z-10' : ''
                  }`}
                  onClick={() => setActiveStep(i)}
                >
                  <div
                    className={`relative p-4 rounded-xl border transition-all duration-500 ${
                      isActive
                        ? `${colors.bg} ${colors.border}`
                        : isPast
                        ? 'bg-white/[0.02] border-[#21262d]/50'
                        : 'bg-white/[0.01] border-[#21262d]/30'
                    }`}
                    style={
                      isActive
                        ? { boxShadow: `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}` }
                        : {}
                    }
                  >
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0d1117] border border-[#21262d] flex items-center justify-center">
                      <span className="text-[10px] text-[#8b949e] terminal-font">{i + 1}</span>
                    </div>

                    {/* Icon */}
                    <div className={`mb-3 ${isActive ? colors.text : 'text-[#8b949e]'} transition-colors`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse-glow' : ''}`} />
                    </div>

                    {/* Label */}
                    <div className={`text-sm font-semibold mb-1 ${
                      isActive ? 'text-white' : 'text-[#8b949e]'
                    } transition-colors`}>
                      {step.label}
                    </div>

                    {/* Description */}
                    <div className={`text-[10px] leading-tight ${
                      isActive ? 'text-[#8b949e]' : 'text-[#8b949e]/50'
                    } transition-colors`}>
                      {step.desc}
                    </div>
                  </div>

                  {/* Arrow between steps (mobile/tablet) */}
                  {i < cycleSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-1">
                      <div className={`w-0.5 h-3 ${
                        isPast ? 'bg-cyan-500/40' : 'bg-[#21262d]/40'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Return arrow indicator */}
          <div className="hidden lg:flex justify-center mt-6">
            <div className="flex items-center gap-2 text-[#8b949e]/40 text-xs">
              <span>↻</span>
              <span className="terminal-font">Ciclo contínuo de evolução</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
