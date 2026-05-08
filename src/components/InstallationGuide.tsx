import { useState } from 'react';
import { Copy, Check, Terminal, Download, Settings, Rocket } from 'lucide-react';

const installSteps = [
  {
    id: 'clone',
    title: 'Clone o Repositório',
    icon: Download,
    command: 'git clone https://github.com/org/scaio.git && cd scaio',
    description: 'Baixe o código fonte e entre no diretório do projeto.',
  },
  {
    id: 'env',
    title: 'Configure as Variáveis',
    icon: Settings,
    command: 'cp .env.example .env && nano .env',
    description: 'Copie o template e edite suas chaves de API (OpenAI, Qdrant, WhatsApp).',
  },
  {
    id: 'bootstrap',
    title: 'Execute o Bootstrap',
    icon: Terminal,
    command: './install.sh',
    description: 'Script idempotente que instala dependências e configura o ambiente.',
  },
  {
    id: 'launch',
    title: 'Inicie o Ecossistema',
    icon: Rocket,
    command: './scripts/start.sh',
    description: 'Inicia todos os containers Docker e serviços systemd.',
  },
];

const dockerServices = [
  { name: 'postgres', port: '5432', desc: 'Metadados e estado transacional' },
  { name: 'qdrant', port: '6333', desc: 'Memória vetorial semântica' },
  { name: 'redis', port: '6379', desc: 'Cache e filas de mensagens' },
  { name: 'evolution-api', port: '8080', desc: 'Gateway WhatsApp' },
];

export default function InstallationGuide() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="install" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-cyan-400 terminal-font tracking-widest uppercase">
            Primeiros Passos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            <span className="gradient-text">Guia de Instalação</span>
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm sm:text-base">
            Setup completo em 4 passos. Bootstrap automatizado e idempotente.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-2 space-y-3">
            {installSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              const isPast = index < activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-500/5 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                      : isPast
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-[#0d1117] border-[#21262d] hover:border-[#21262d]/80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : isPast
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-white/[0.03] text-[#8b949e]'
                      }`}
                    >
                      {isPast ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-[10px] uppercase tracking-wider terminal-font mb-0.5 ${
                          isActive ? 'text-cyan-400' : isPast ? 'text-emerald-400' : 'text-[#8b949e]'
                        }`}
                      >
                        Passo {index + 1}
                      </div>
                      <h3
                        className={`font-semibold ${
                          isActive ? 'text-white' : isPast ? 'text-emerald-100' : 'text-[#8b949e]'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Services Preview */}
            <div className="mt-6 p-4 rounded-xl border border-[#21262d] bg-[#0d1117]">
              <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">
                Serviços Docker
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {dockerServices.map((svc) => (
                  <div
                    key={svc.name}
                    className="p-2 rounded-lg bg-black/20 border border-[#21262d]/50"
                  >
                    <div className="text-xs terminal-font text-cyan-400">{svc.name}</div>
                    <div className="text-[10px] text-[#8b949e]">:{svc.port}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Detail */}
          <div className="lg:col-span-3">
            <div className="p-6 rounded-xl border border-[#21262d] bg-[#0d1117] h-full">
              {installSteps.map((step, index) => {
                const Icon = step.icon;
                if (index !== activeStep) return null;

                return (
                  <div key={step.id} className="animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-cyan-400 uppercase tracking-wider terminal-font">
                          Passo {index + 1} de {installSteps.length}
                        </div>
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      </div>
                    </div>

                    <p className="text-[#8b949e] mb-6">{step.description}</p>

                    {/* Command Box */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                      <div className="relative p-4 rounded-xl bg-black/40 border border-[#21262d] terminal-font">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-[#8b949e]" />
                            <span className="text-[10px] text-[#8b949e] uppercase">Terminal</span>
                          </div>
                          <button
                            onClick={() => handleCopy(step.id, step.command)}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-[10px] text-[#8b949e]"
                          >
                            {copiedId === step.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                        <code className="text-sm text-cyan-300 block overflow-x-auto">
                          <span className="text-emerald-400">$</span> {step.command}
                        </code>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                      <button
                        onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                        disabled={activeStep === 0}
                        className="px-4 py-2 text-sm text-[#8b949e] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Anterior
                      </button>
                      <div className="flex gap-1">
                        {installSteps.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveStep(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i === activeStep ? 'bg-cyan-400' : 'bg-[#21262d] hover:bg-[#30363d]'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setActiveStep(Math.min(installSteps.length - 1, activeStep + 1))
                        }
                        disabled={activeStep === installSteps.length - 1}
                        className="px-4 py-2 text-sm text-[#8b949e] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Próximo →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
