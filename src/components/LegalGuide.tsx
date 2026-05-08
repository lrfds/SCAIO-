import { useState } from 'react';
import {
  Scale, Shield, AlertTriangle, CheckCircle, BookOpen,
  ChevronRight, ChevronDown, Gavel, Users, Activity, Lock
} from 'lucide-react';

interface Phase {
  id: string;
  day: string;
  title: string;
  question: string;
  icon: typeof Scale;
  color: string;
  content: {
    concept: string;
    analogy: string;
    actions: string[];
  }[];
}

const phases: Phase[] = [
  {
    id: 'phase1',
    day: 'Dias 1-2',
    title: 'Apropriação e Entendimento Estratégico',
    question: 'Como este sistema se comporta como um organismo regulado?',
    icon: BookOpen,
    color: 'blue',
    content: [
      {
        concept: 'O Sistema como Fiscal Autônomo',
        analogy: 'Órgão de fiscalização virtual',
        actions: [
          'Departamento de compliance digital 24/7',
          'Pode ser treinado e autoavalia',
          'Não é apenas um robô, mas um agente fiscalizador',
        ],
      },
      {
        concept: 'Metacognição como Devido Processo Legal',
        analogy: 'Due process of law',
        actions: [
          'Regra: "nunca entregue sem validar"',
          'Cada ação observada, avaliada e registrada',
          'Gera trilha de auditoria incontestável',
        ],
      },
      {
        concept: 'Pirâmide de Supervisão',
        analogy: 'Freios e contrapesos algorítmicos',
        actions: [
          'Agente → Health Agent → Meta-Health Agent',
          'Elimina "falha do sistema" como desculpa',
          'Maior garantia jurídica do projeto',
        ],
      },
    ],
  },
  {
    id: 'phase2',
    day: 'Dia 3',
    title: 'Configuração Inicial e Mapeamento de Riscos',
    question: 'Quais são os limites de atuação deste agente?',
    icon: Shield,
    color: 'emerald',
    content: [
      {
        concept: 'MIN_QUALITY_SCORE (7.0)',
        analogy: 'Limiar de Materialidade',
        actions: [
          'Score < 7: informação rejeitada automaticamente',
          'Prefere silenciar a arriscar falso positivo',
          'Evidência forte de diligência',
        ],
      },
      {
        concept: 'ALERT_RECIPIENTS',
        analogy: 'Linha de sucessão',
        actions: [
          'Defina Head Jurídico e Head de Operações',
          'Responsabilidade é compartilhada',
          'Múltiplos contatos garantem redundância',
        ],
      },
      {
        concept: 'Fontes .gov.br',
        analogy: 'Atos de governança',
        actions: [
          'Revisar e manter lista de fontes oficiais',
          'Adicionar portais estaduais/municipais',
          'Remover fontes não confiáveis',
        ],
      },
    ],
  },
  {
    id: 'phase3',
    day: 'Dias 4-7',
    title: 'Ativação e Operação Inicial',
    question: 'O sistema está aprendendo corretamente e não está causando danos?',
    icon: Activity,
    color: 'cyan',
    content: [
      {
        concept: 'Modo Steady State',
        analogy: 'Operação Contínua',
        actions: [
          'Monitoramento de exceção',
          'Sistema fala apenas em ORANGE ou RED',
          'Não interfira enquanto estiver GREEN',
        ],
      },
      {
        concept: 'Análise dos Primeiros Alertas',
        analogy: 'Parecer preliminar',
        actions: [
          'ORANGE: autorize auto-remediação (3 tentativas)',
          'Sistema tenta sozinho antes de escalar',
          'Intervenção humana apenas se necessário',
        ],
      },
      {
        concept: 'A Importância do Silêncio',
        analogy: 'Silêncio administrativo positivo',
        actions: [
          'Ausência de alertas = 100% operacional',
          'Silêncio é melhor indicador de desempenho',
          'Sistema aprendendo ativamente',
        ],
      },
    ],
  },
  {
    id: 'phase4',
    day: 'Dia 30+',
    title: 'Consolidação da Governança',
    question: 'Como provamos diligência e conformidade?',
    icon: Gavel,
    color: 'violet',
    content: [
      {
        concept: 'Trilha de Auditoria (EventStore)',
        analogy: 'Prova pericial digital',
        actions: [
          'Relatório mensal do PostgreSQL',
          'Todos os eventos registrados: editais, scores, decisões',
          'Evidência pericial da operação',
        ],
      },
      {
        concept: 'Revisão das Estratégias Aprendidas',
        analogy: 'Precedentes do sistema',
        actions: [
          'Relatório quinzenal da Memória Procedural (Qdrant)',
          'Estratégias de Sucesso vs. Proibidas',
          'Kit de melhorias contínuas',
        ],
      },
      {
        concept: 'Evolução da Governança (A1, A2, A3)',
        analogy: 'Maturidade operacional',
        actions: [
          'A1: Hardening AppArmor para dados sigilosos',
          'A2: Backup e auditoria externa',
          'A3: Dashboard para alta administração',
        ],
      },
    ],
  },
];

const statusDefinitions = [
  {
    status: 'GREEN',
    label: 'Saudável',
    legal: 'Conformidade plena',
    icon: CheckCircle,
    color: 'emerald',
    desc: 'Nenhuma ação humana necessária. Sistema operando dentro dos parâmetros.',
  },
  {
    status: 'ORANGE',
    label: 'Degradação',
    legal: 'Notificação extrajudicial',
    icon: AlertTriangle,
    color: 'yellow',
    desc: 'Estado de atenção. Algo mudou no ambiente. Sistema tentará auto-remediação.',
  },
  {
    status: 'RED',
    label: 'Crise',
    legal: 'Citação judicial',
    icon: Lock,
    color: 'red',
    desc: 'Falha confirmada. Intervenção humana imediata necessária.',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue:    { bg: 'bg-blue-500/5',    border: 'border-blue-500/30',    text: 'text-blue-400',    badge: 'bg-blue-400' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-400' },
  cyan:    { bg: 'bg-cyan-500/5',    border: 'border-cyan-500/30',    text: 'text-cyan-400',    badge: 'bg-cyan-400' },
  violet:  { bg: 'bg-violet-500/5',  border: 'border-violet-500/30',  text: 'text-violet-400',  badge: 'bg-violet-400' },
};

export default function LegalGuide() {
  const [expandedPhase, setExpandedPhase] = useState<string>('phase1');

  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-cyan-400 terminal-font tracking-widest uppercase">
            Para Conselheiros e Heads Jurídicos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            <span className="gradient-text">Guia Estratégico de Execução</span>
          </h2>
          <p className="text-[#8b949e] max-w-2xl mx-auto text-sm sm:text-base">
            Guia para profissionais com LL.M. focado em governança, mitigação de riscos 
            e compliance operacional — sem necessidade de detalhes de programação.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Phase Navigation */}
          <div className="lg:col-span-4 space-y-3">
            {phases.map((phase) => {
              const Icon = phase.icon;
              const colors = colorMap[phase.color];
              const isExpanded = expandedPhase === phase.id;

              return (
                <button
                  key={phase.id}
                  onClick={() => setExpandedPhase(phase.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    isExpanded
                      ? `${colors.bg} ${colors.border} shadow-lg`
                      : 'bg-[#0d1117] border-[#21262d] hover:border-[#30363d]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isExpanded ? colors.bg : 'bg-white/[0.03]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isExpanded ? colors.text : 'text-[#8b949e]'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[10px] uppercase tracking-wider terminal-font mb-0.5 ${
                        isExpanded ? colors.text : 'text-[#8b949e]'
                      }`}>
                        {phase.day}
                      </div>
                      <h3 className={`font-semibold ${isExpanded ? 'text-white' : 'text-[#8b949e]'}`}>
                        {phase.title}
                      </h3>
                      {isExpanded && (
                        <p className="text-xs text-[#8b949e] mt-2 italic">
                          "{phase.question}"
                        </p>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#8b949e] flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Status Definitions Card */}
            <div className="mt-6 p-4 rounded-xl border border-[#21262d] bg-[#0d1117]">
              <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-4">
                Glossário de Status
              </h4>
              <div className="space-y-3">
                {statusDefinitions.map((def) => {
                  const Icon = def.icon;
                  return (
                    <div key={def.status} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-${def.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 text-${def.color}-400`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{def.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded bg-${def.color}-500/20 text-${def.color}-400 terminal-font`}>
                            {def.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#8b949e] italic">{def.legal}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Phase Detail */}
          <div className="lg:col-span-8">
            {phases.map((phase) => {
              if (phase.id !== expandedPhase) return null;
              const colors = colorMap[phase.color];

              return (
                <div key={phase.id} className={`p-6 rounded-xl border ${colors.border} ${colors.bg} animate-fade-in-up`}>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full bg-white/10 ${colors.text} terminal-font`}>
                        {phase.day}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3>
                    <p className="text-[#8b949e] italic">"{phase.question}"</p>
                  </div>

                  <div className="space-y-4">
                    {phase.content.map((item, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-black/20 border border-[#21262d]/50"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-1 h-full min-h-[20px] rounded-full ${colors.badge}`} />
                          <div>
                            <h4 className="font-semibold text-white">{item.concept}</h4>
                            <span className="text-xs text-cyan-400">{item.analogy}</span>
                          </div>
                        </div>
                        <ul className="space-y-2 ml-4">
                          {item.actions.map((action, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-[#8b949e]">
                              <span className="text-cyan-400 mt-1">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Footer note */}
                  <div className="mt-6 p-4 rounded-lg bg-black/30 border border-[#21262d]/50">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-white">Responsabilidade Compartilhada</div>
                        <p className="text-xs text-[#8b949e] mt-1">
                          Este guia foi elaborado para que o(a) Sr(a)., com sua expertise em Direito e Governança, 
                          lidere a execução deste projeto com confiança. Nosso papel é traduzir a excelência técnica 
                          em uma linguagem de riscos, processos e resultados.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Memory Types Reference */}
        <div className="mt-12 p-6 rounded-xl border border-[#21262d] bg-[#0d1117]">
          <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-4 text-center">
            Arquitetura de Memória do Sistema
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Memória Procedural', legal: 'Precedentes do sistema', tech: 'Qdrant (vetorial)' },
              { name: 'Memória Semântica', legal: 'Conhecimento contextual', tech: 'Qdrant (embeddings)' },
              { name: 'Memória Episódica', legal: 'Registro de execuções', tech: 'PostgreSQL (30 dias)' },
              { name: 'Memória de Trabalho', legal: 'Contexto ativo', tech: 'Redis (volátil)' },
            ].map((mem) => (
              <div key={mem.name} className="p-3 rounded-lg bg-black/20 border border-[#21262d]/50 text-center">
                <div className="text-sm font-semibold text-white">{mem.name}</div>
                <div className="text-[10px] text-cyan-400 italic">{mem.legal}</div>
                <div className="text-[10px] text-[#8b949e] terminal-font mt-1">{mem.tech}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
