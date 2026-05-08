import { useState } from 'react';
import {
  FolderOpen, Folder, FileText, FileCode, Settings, Terminal, ChevronRight, ChevronDown
} from 'lucide-react';

interface TreeNode {
  name: string;
  type: 'dir' | 'file';
  desc?: string;
  children?: TreeNode[];
}

const tree: TreeNode[] = [
  {
    name: 'scaio/',
    type: 'dir',
    children: [
      { name: 'README.md', type: 'file', desc: 'Documentação executiva e guia de instalação' },
      { name: 'install.sh', type: 'file', desc: 'Bootstrap automatizado e idempotente' },
      { name: '.env.example', type: 'file', desc: 'Template para variáveis de ambiente' },
      { name: 'docker-compose.yml', type: 'file', desc: 'Orquestração (Postgres, Qdrant, Redis)' },
      { name: 'requirements.txt', type: 'file', desc: 'Dependências Python' },
      {
        name: 'edital_hunter/',
        type: 'dir',
        desc: '[AGENTE CORE] Busca e análise cognitiva de editais',
        children: [
          { name: 'agents/', type: 'dir', desc: 'Lógica do agente (CrewAI)' },
          { name: 'cognitive/', type: 'dir', desc: 'Estado e grafos cognitivos (LangGraph)' },
          { name: 'memory/', type: 'dir', desc: 'Interface Qdrant (memória semântica/procedural)' },
          { name: 'tools/', type: 'dir', desc: 'Ferramentas (Playwright, validadores)' },
        ],
      },
      {
        name: 'health_agent/',
        type: 'dir',
        desc: '[SUPERVISOR PRINCIPAL] Monitora os agentes',
        children: [
          { name: 'sensors/', type: 'dir', desc: 'Coleta sinais operacionais, cognitivos e estruturais' },
          { name: 'classifier/', type: 'dir', desc: 'Lógica de classificação (GREEN → RED)' },
          { name: 'actions/', type: 'dir', desc: 'Ações corretivas (isolamento, alertas)' },
          { name: 'monitor/', type: 'dir', desc: 'Watchdog contínuo' },
        ],
      },
      {
        name: 'meta_health_agent/',
        type: 'dir',
        desc: '[SUPERVISOR FINAL] Supervisiona o Health Agent',
        children: [
          { name: 'meta_watchdog.py', type: 'file', desc: 'Loop de verificação do supervisor' },
          { name: 'auto_restart.py', type: 'file', desc: 'Reinício controlado com backoff exponencial' },
          { name: 'escalation.py', type: 'file', desc: 'Escalonamento para humano (WhatsApp)' },
        ],
      },
      {
        name: 'whatsapp/',
        type: 'dir',
        desc: '[COMUNICAÇÃO] Canal de alerta para humanos',
        children: [
          { name: 'client.py', type: 'file', desc: 'Cliente Evolution API' },
          { name: 'notifier.py', type: 'file', desc: 'Formatação e envio de alertas executivos' },
        ],
      },
      {
        name: 'config/',
        type: 'dir',
        desc: 'Configurações centralizadas',
        children: [
          { name: 'config.yaml', type: 'file', desc: 'Parâmetros dos agentes e sensores' },
          { name: 'logging.conf', type: 'file', desc: 'Configuração de logging' },
        ],
      },
      {
        name: 'scripts/',
        type: 'dir',
        desc: 'Scripts utilitários',
        children: [
          { name: 'start.sh', type: 'file', desc: 'Inicia o ecossistema' },
          { name: 'stop.sh', type: 'file', desc: 'Para o ecossistema' },
          { name: 'status.sh', type: 'file', desc: 'Relatório de status executivo' },
        ],
      },
      {
        name: 'systemd/',
        type: 'dir',
        desc: '[LAST MILE] Integração com o sistema operacional',
        children: [
          { name: 'scaio-meta.service', type: 'file', desc: 'Serviço systemd com hardening (isolamento)' },
        ],
      },
    ],
  },
];

function getFileIcon(name: string) {
  if (name.endsWith('.sh')) return <Terminal className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
  if (name.endsWith('.py')) return <FileCode className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />;
  if (name.endsWith('.yml') || name.endsWith('.yaml')) return <Settings className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />;
  if (name.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />;
  if (name.endsWith('.conf') || name.endsWith('.txt') || name.endsWith('.example')) return <FileText className="w-3.5 h-3.5 text-[#8b949e] flex-shrink-0" />;
  if (name.endsWith('.service')) return <Settings className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />;
  return <FileText className="w-3.5 h-3.5 text-[#8b949e] flex-shrink-0" />;
}

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isDir = node.type === 'dir';

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-white/[0.03] transition-colors cursor-pointer group`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => isDir && setOpen(!open)}
      >
        {isDir ? (
          <>
            {open ? (
              <ChevronDown className="w-3 h-3 text-[#8b949e] flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3 h-3 text-[#8b949e] flex-shrink-0" />
            )}
            {open ? (
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-3 flex-shrink-0" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className={`text-xs terminal-font ${
          isDir ? 'text-[#e6edf3] font-medium' : 'text-[#8b949e]'
        }`}>
          {node.name}
        </span>
        {node.desc && (
          <span className="text-[10px] text-[#8b949e]/50 ml-auto hidden sm:block truncate max-w-[50%]">
            {node.desc}
          </span>
        )}
      </div>
      {isDir && open && node.children && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 w-px bg-[#21262d]/50"
            style={{ left: `${depth * 20 + 18}px` }}
          />
          {node.children.map((child) => (
            <TreeItem key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DirectoryTree() {
  return (
    <section id="structure" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-cyan-400 terminal-font tracking-widest uppercase">
            Organização do Projeto
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            <span className="gradient-text">Estrutura de Diretórios</span>
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm sm:text-base">
            Projeto modular com separação clara de responsabilidades.
          </p>
        </div>

        {/* Tree */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-[#21262d] bg-[#0d1117] overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#21262d] bg-black/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs terminal-font text-[#8b949e] ml-2">
                ~/scaio — tree -L 2
              </span>
            </div>

            {/* Tree content */}
            <div className="p-3 max-h-[600px] overflow-y-auto">
              {tree.map((node) => (
                <TreeItem key={node.name} node={node} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
