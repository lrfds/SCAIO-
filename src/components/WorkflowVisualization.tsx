import { useState, useEffect } from 'react';
import {
  Globe, Search, Brain, Database, Shield, CheckCircle, MessageCircle,
  ArrowRight, Play, Pause, RotateCcw
} from 'lucide-react';

interface FlowStep {
  id: string;
  label: string;
  icon: typeof Globe;
  color: string;
  description: string;
}

const flowSteps: FlowStep[] = [
  { id: 'sources', label: 'Fontes', icon: Globe, color: 'cyan', description: 'PNCP, ComprasNet, BEC, outras APIs' },
  { id: 'search', label: 'Edital Hunter', icon: Search, color: 'blue', description: 'Busca e extração de editais' },
  { id: 'cognitive', label: 'Análise', icon: Brain, color: 'violet', description: 'Processamento semântico e classificação' },
  { id: 'memory', label: 'Qdrant', icon: Database, color: 'purple', description: 'Armazenamento vetorial e histórico' },
  { id: 'health', label: 'Health Agent', icon: Shield, color: 'emerald', description: 'Validação e monitoramento' },
  { id: 'approval', label: 'Aprovação', icon: CheckCircle, color: 'teal', description: 'Validação final do ciclo cognitivo' },
  { id: 'notify', label: 'WhatsApp', icon: MessageCircle, color: 'green', description: 'Notificação para operadores' },
];

const dataPackets = [
  { id: 1, name: 'Edital #48293', value: 'R$ 2.4M', relevance: 0.94 },
  { id: 2, name: 'Edital #48294', value: 'R$ 890K', relevance: 0.87 },
  { id: 3, name: 'Edital #48295', value: 'R$ 1.2M', relevance: 0.92 },
];

export default function WorkflowVisualization() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [packetPosition, setPacketPosition] = useState(-1);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % flowSteps.length;
        setPacketPosition(next);
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setPacketPosition(-1);
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs text-cyan-400 terminal-font tracking-widest uppercase">
            Fluxo de Dados
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            <span className="gradient-text">Workflow Operacional</span>
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm sm:text-base">
            Visualização do ciclo completo: da captura à entrega.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isPlaying
                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Simular
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-white/[0.03] text-[#8b949e] border border-[#21262d] hover:border-[#30363d] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Flow Visualization */}
        <div className="relative">
          {/* Connection Lines - Desktop */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5">
            <div className="relative w-full h-full">
              {/* Background line */}
              <div className="absolute inset-0 bg-[#21262d]" />
              {/* Progress line */}
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${(currentStep / (flowSteps.length - 1)) * 100}%` }}
              />
              {/* Animated dash overlay when playing */}
              {isPlaying && (
                <div
                  className="absolute top-0 left-0 h-full w-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.5) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite',
                  }}
                />
              )}
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isPast = index < currentStep;

              return (
                <div
                  key={step.id}
                  className="relative"
                  onClick={() => {
                    setCurrentStep(index);
                    setPacketPosition(index);
                  }}
                >
                  {/* Step Card */}
                  <div
                    className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-105 z-10'
                        : isPast
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : 'bg-[#0d1117] border-[#21262d] hover:border-[#30363d]'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto transition-colors ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : isPast
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-white/[0.03] text-[#8b949e]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Label */}
                    <div
                      className={`text-xs font-semibold text-center mb-1 transition-colors ${
                        isActive ? 'text-white' : isPast ? 'text-emerald-100' : 'text-[#8b949e]'
                      }`}
                    >
                      {step.label}
                    </div>

                    {/* Description */}
                    <div className="text-[9px] text-[#8b949e]/70 text-center leading-tight">
                      {step.description}
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Mobile arrow */}
                  {index < flowSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-2">
                      <ArrowRight
                        className={`w-4 h-4 rotate-90 transition-colors ${
                          isPast ? 'text-emerald-400' : 'text-[#21262d]'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Data Packet Visualization */}
          {packetPosition >= 0 && (
            <div className="mt-10 p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-cyan-400 terminal-font uppercase tracking-wider">
                  Pacote de Dados em Processamento
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] text-cyan-400">PROCESSANDO</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {dataPackets.map((packet) => (
                  <div
                    key={packet.id}
                    className="p-3 rounded-lg bg-black/20 border border-[#21262d]/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs terminal-font text-[#e6edf3]">
                        {packet.name}
                      </span>
                      <span className="text-[10px] text-emerald-400">{packet.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                          style={{ width: `${packet.relevance * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#8b949e] terminal-font">
                        {(packet.relevance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-[9px] text-[#8b949e]/50 mt-1">Relevância</div>
                  </div>
                ))}
              </div>

              {/* Current Step Detail */}
              <div className="mt-4 p-3 rounded-lg bg-black/20 border border-[#21262d]/50">
                <div className="flex items-start gap-3">
                  {(() => {
                    const CurrentIcon = flowSteps[currentStep].icon;
                    return (
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <CurrentIcon className="w-4 h-4 text-cyan-400" />
                      </div>
                    );
                  })()}
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {flowSteps[currentStep].label}
                    </div>
                    <div className="text-[10px] text-[#8b949e] mt-0.5">
                      {flowSteps[currentStep].description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
          {[
            { label: 'Editais/Dia', value: '2.4K', trend: '+12%' },
            { label: 'Precisão', value: '94.7%', trend: '+3.2%' },
            { label: 'Latência Média', value: '1.2s', trend: '-18%' },
            { label: 'Uptime', value: '99.98%', trend: '+0.1%' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl border border-[#21262d] bg-[#0d1117] text-center"
            >
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-[#8b949e] mt-1">{stat.label}</div>
              <div
                className={`text-[10px] mt-1 terminal-font ${
                  stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-cyan-400'
                }`}
              >
                {stat.trend} este mês
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
