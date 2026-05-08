import { useState } from 'react';
import { Database, Brain, Layers, Search, ArrowRight, Save, History, Sparkles } from 'lucide-react';

interface MemoryType {
  id: string;
  name: string;
  icon: typeof Database;
  color: string;
  description: string;
  useCases: string[];
  retention: string;
  size: string;
}

const memoryTypes: MemoryType[] = [
  {
    id: 'semantic',
    name: 'Memória Semântica',
    icon: Brain,
    color: 'violet',
    description: 'Armazena embeddings vetoriais de editais, permitindo busca por similaridade e recuperação de contexto.',
    useCases: ['Busca por similaridade', 'Recuperação de contexto', 'Análise de padrões'],
    retention: 'Permanente',
    size: '~2.4GB',
  },
  {
    id: 'procedural',
    name: 'Memória Procedural',
    icon: Layers,
    color: 'cyan',
    description: 'Armazena workflows e padrões de execução aprendidos pelo sistema ao longo do tempo.',
    useCases: ['Otimização de workflows', 'Aprendizado contínuo', 'Adaptação de estratégias'],
    retention: 'Evolui com o tempo',
    size: '~180MB',
  },
  {
    id: 'episodic',
    name: 'Memória Episódica',
    icon: History,
    color: 'emerald',
    description: 'Registro de execuções específicas, resultados e decisões tomadas em cada ciclo.',
    useCases: ['Auditoria', 'Debugging', 'Análise retrospectiva'],
    retention: '30 dias (rolante)',
    size: '~890MB',
  },
  {
    id: 'working',
    name: 'Memória de Trabalho',
    icon: Sparkles,
    color: 'pink',
    description: 'Cache em Redis para estado ativo, contexto imediato e filas de processamento.',
    useCases: ['Contexto ativo', 'Filas de tarefas', 'Estado de sessão'],
    retention: 'Volátil',
    size: '~64MB',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  violet:  { bg: 'bg-violet-500/5',  border: 'border-violet-500/30',  text: 'text-violet-400',  accent: 'from-violet-400/20 to-violet-600/20' },
  cyan:    { bg: 'bg-cyan-500/5',    border: 'border-cyan-500/30',    text: 'text-cyan-400',    accent: 'from-cyan-400/20 to-cyan-600/20' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-400', accent: 'from-emerald-400/20 to-emerald-600/20' },
  pink:    { bg: 'bg-pink-500/5',    border: 'border-pink-500/30',    text: 'text-pink-400',    accent: 'from-pink-400/20 to-pink-600/20' },
};

export default function MemoryArchitecture() {
  const [activeMemory, setActiveMemory] = useState('semantic');

  const activeData = memoryTypes.find((m) => m.id === activeMemory)!;
  const ActiveIcon = activeData.icon;
  const colors = colorMap[activeData.color];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-cyan-400 terminal-font tracking-widest uppercase">
            Qdrant + PostgreSQL + Redis
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            <span className="gradient-text">Arquitetura de Memória</span>
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm sm:text-base">
            Sistema de memória multinível inspirado em arquiteturas cognitivas.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Memory Type Selector */}
          <div className="lg:col-span-4 space-y-3">
            {memoryTypes.map((memory) => {
              const Icon = memory.icon;
              const mc = colorMap[memory.color];
              const isActive = memory.id === activeMemory;

              return (
                <button
                  key={memory.id}
                  onClick={() => setActiveMemory(memory.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                    isActive
                      ? `${mc.bg} ${mc.border} shadow-lg`
                      : 'bg-[#0d1117] border-[#21262d] hover:border-[#30363d]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive ? mc.bg : 'bg-white/[0.03]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? mc.text : 'text-[#8b949e]'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${isActive ? 'text-white' : 'text-[#8b949e]'}`}>
                        {memory.name}
                      </div>
                      <div className="text-[10px] text-[#8b949e]/60 mt-0.5">
                        Retenção: {memory.retention}
                      </div>
                    </div>
                    {isActive && (
                      <ArrowRight className={`w-4 h-4 ${mc.text} flex-shrink-0`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Memory Detail */}
          <div className="lg:col-span-8">
            <div className={`p-6 rounded-xl border ${colors.border} ${colors.bg} h-full`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center">
                  <ActiveIcon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeData.name}</h3>
                  <p className="text-sm text-[#8b949e] mt-1">{activeData.description}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-black/20 border border-[#21262d]/50 text-center">
                  <Database className="w-4 h-4 text-[#8b949e] mx-auto mb-1" />
                  <div className="text-sm font-semibold text-white">{activeData.size}</div>
                  <div className="text-[10px] text-[#8b949e]">Armazenamento</div>
                </div>
                <div className="p-3 rounded-lg bg-black/20 border border-[#21262d]/50 text-center">
                  <Save className="w-4 h-4 text-[#8b949e] mx-auto mb-1" />
                  <div className="text-sm font-semibold text-white">{activeData.retention}</div>
                  <div className="text-[10px] text-[#8b949e]">Retenção</div>
                </div>
                <div className="p-3 rounded-lg bg-black/20 border border-[#21262d]/50 text-center">
                  <Search className="w-4 h-4 text-[#8b949e] mx-auto mb-1" />
                  <div className="text-sm font-semibold text-white">{'<50ms'}</div>
                  <div className="text-[10px] text-[#8b949e]">Latência</div>
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">
                  Casos de Uso
                </h4>
                <div className="space-y-2">
                  {activeData.useCases.map((useCase, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-[#21262d]/50"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                      <span className="text-sm text-[#e6edf3]">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Note */}
              <div className="mt-6 p-3 rounded-lg bg-black/30 border border-[#21262d]/50">
                <div className="text-[10px] terminal-font text-[#8b949e]/60">
                  <span className={colors.text}>$</span> qdrant_client.search(
                  <br />
                  &nbsp;&nbsp;collection="editais",
                  <br />
                  &nbsp;&nbsp;vector=embedding,
                  <br />
                  &nbsp;&nbsp;limit=10
                  <br />
                  )
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Memory Flow Diagram */}
        <div className="mt-12 p-6 rounded-xl border border-[#21262d] bg-[#0d1117]">
          <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-6 text-center">
            Fluxo de Dados na Memória
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Entrada', 'Processamento', 'Embedding', 'Qdrant', 'PostgreSQL', 'Redis'].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div
                  className={`px-4 py-2 rounded-lg text-sm ${
                    step === 'Qdrant'
                      ? 'bg-violet-500/10 border border-violet-500/30 text-violet-400'
                      : step === 'PostgreSQL'
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      : step === 'Redis'
                      ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400'
                      : 'bg-white/[0.03] border border-[#21262d] text-[#8b949e]'
                  }`}
                >
                  {step}
                </div>
                {i < 5 && (
                  <ArrowRight className="w-4 h-4 text-[#21262d] hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
