import { useEffect, useState } from 'react';
import { ChevronDown, Zap, Lock, Cpu } from 'lucide-react';

function ParticleField() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 1 + Math.random() * 2,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/30"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `particle-float ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/3 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 radial-fade" />
      <ParticleField />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div
          className={`transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8">
            <span className="status-dot status-green" />
            <span className="text-xs text-cyan-300 terminal-font">
              Production-Ready / SRE-Grade
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="gradient-text">SCAIO</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#8b949e] font-light mb-2">
            Sistema Cognitivo Autônomo de
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-[#e6edf3] font-semibold mb-8">
            Inteligência Operacional
          </p>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#8b949e] leading-relaxed mb-10">
            Infraestrutura cognitiva autônoma para captação de recursos e compliance.
            Arquitetura multi-agente metacognitiva com auto-cura, memória semântica
            e supervisão em cascata.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#architecture"
              className="px-8 py-3 text-sm font-semibold text-[#06080e] bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Explorar Arquitetura
            </a>
            <a
              href="#status"
              className="px-8 py-3 text-sm font-medium text-[#e6edf3] border border-[#21262d] rounded-lg hover:border-cyan-500/40 hover:bg-white/5 transition-all"
            >
              Ver Status ao Vivo
            </a>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold gradient-text">R$ 0</div>
              <div className="text-[10px] sm:text-xs text-[#8b949e] mt-1">Custo de Licença</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold gradient-text">4</div>
              <div className="text-[10px] sm:text-xs text-[#8b949e] mt-1">Camadas de Supervisão</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Cpu className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold gradient-text-violet">MAMA</div>
              <div className="text-[10px] sm:text-xs text-[#8b949e] mt-1">Arquitetura</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-[#8b949e]" />
        </div>
      </div>
    </section>
  );
}
