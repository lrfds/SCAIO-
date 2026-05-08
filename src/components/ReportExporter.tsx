import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Activity,
  Shield,
  Database,
  CheckCircle,
  Loader2,
  FileJson,
  Table,
  X
} from 'lucide-react';

interface ReportConfig {
  type: 'health' | 'audit' | 'configuration' | 'full';
  format: 'pdf' | 'json' | 'csv';
  includeTimestamp: boolean;
  includeMetrics: boolean;
  includeAnomalies: boolean;
  dateRange: 'today' | 'week' | 'month' | 'all';
}

interface ReportExporterProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockMetrics = {
  healthState: 'GREEN',
  avgScore: 8.7,
  successRate: 94,
  totalCycles: 247,
  activeAgents: 3,
  anomalies: [
    'Score degradation detected at 14:32 - Auto-recovered',
    'High retry count (3) at 09:15 - Strategy adjusted',
    'WhatsApp connection restored at 16:20'
  ]
};

const mockSettings = {
  minQualityScore: 7.0,
  maxRetries: 3,
  minSuccessRate: 70,
  healthInterval: 60,
  whatsappEnabled: true
};

export default function ReportExporter({ isOpen, onClose }: ReportExporterProps) {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'health',
    format: 'pdf',
    includeTimestamp: true,
    includeMetrics: true,
    includeAnomalies: true,
    dateRange: 'today'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const reportTypes = [
    { id: 'health', label: 'Health Report', icon: Activity, desc: 'Status do sistema, métricas e saúde dos agentes', color: 'cyan' },
    { id: 'audit', label: 'Audit Trail', icon: Shield, desc: 'Trilha de eventos, decisões e alterações', color: 'amber' },
    { id: 'configuration', label: 'Configuration', icon: Database, desc: 'Configurações atuais do sistema', color: 'emerald' },
    { id: 'full', label: 'Full Report', icon: FileText, desc: 'Relatório completo do sistema', color: 'violet' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setGenerated(true);
    setIsGenerating(false);
    setTimeout(() => setGenerated(false), 3000);
  };

  const handleDownload = () => {
    const content = generateReportContent();
    const blob = new Blob([content], { type: getMimeType() });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scaio_report_${config.type}_${Date.now()}.${config.format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReportContent = () => {
    const timestamp = new Date().toISOString();
    const sections = [];
    
    sections.push(`╔══════════════════════════════════════════════════════════════╗`);
    sections.push(`║              SCAIO - SYSTEM REPORT                            ║`);
    sections.push(`╚══════════════════════════════════════════════════════════════╝`);
    sections.push(`Generated: ${timestamp}`);
    sections.push(`Report Type: ${config.type.toUpperCase()}`);
    sections.push(`Format: ${config.format.toUpperCase()}`);
    sections.push(`Period: ${config.dateRange.toUpperCase()}`);
    sections.push(`═══════════════════════════════════════════════════════════════`);
    
    if (config.includeMetrics && (config.type === 'health' || config.type === 'full')) {
      sections.push(`\n📊 SYSTEM METRICS`);
      sections.push(`─────────────────────────────────────────────────────────────`);
      sections.push(`Health State: ${mockMetrics.healthState}`);
      sections.push(`Average Score: ${mockMetrics.avgScore}/10`);
      sections.push(`Success Rate: ${mockMetrics.successRate}%`);
      sections.push(`Total Cycles: ${mockMetrics.totalCycles}`);
      sections.push(`Active Agents: ${mockMetrics.activeAgents}`);
    }
    
    if (config.includeAnomalies && (config.type === 'audit' || config.type === 'full')) {
      sections.push(`\n⚠️ ANOMALIES DETECTED`);
      sections.push(`─────────────────────────────────────────────────────────────`);
      mockMetrics.anomalies.forEach(a => sections.push(`• ${a}`));
    }
    
    if (config.type === 'configuration' || config.type === 'full') {
      sections.push(`\n⚙️ SYSTEM CONFIGURATION`);
      sections.push(`─────────────────────────────────────────────────────────────`);
      sections.push(`MIN_QUALITY_SCORE: ${mockSettings.minQualityScore}`);
      sections.push(`Max Retries: ${mockSettings.maxRetries}`);
      sections.push(`Success Rate Threshold: ${mockSettings.minSuccessRate}%`);
      sections.push(`Health Check Interval: ${mockSettings.healthInterval}s`);
      sections.push(`WhatsApp Enabled: ${mockSettings.whatsappEnabled ? 'Yes' : 'No'}`);
    }
    
    sections.push(`\n═══════════════════════════════════════════════════════════════`);
    sections.push(`SCAIO - Sistema Cognitivo Autônomo de Inteligência Operacional`);
    sections.push(`This report is automatically generated for compliance purposes.`);
    
    return sections.join('\n');
  };

  const getMimeType = () => {
    switch (config.format) {
      case 'json': return 'application/json';
      case 'csv': return 'text/csv';
      default: return 'text/plain';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-xl border border-[#21262d] bg-[#0d1117] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#21262d] bg-[#06080e]">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-[#e6edf3]">Exportar Relatório</h2>
          </div>
          <button onClick={onClose} className="text-[#8b949e] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Report Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">Tipo de Relatório</label>
            <div className="grid grid-cols-2 gap-3">
              {reportTypes.map(type => {
                const Icon = type.icon;
                const isSelected = config.type === type.id;
                const colors: Record<string, { border: string; bg: string; text: string }> = {
                  cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
                  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
                  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
                  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400' }
                };
                const color = colors[type.color];
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setConfig(prev => ({ ...prev, type: type.id as any }))}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      isSelected 
                        ? `${color.border} ${color.bg}`
                        : 'border-[#21262d] bg-[#06080e] hover:border-[#30363d]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? color.text : 'text-[#8b949e]'}`} />
                      <span className={`text-sm font-medium ${isSelected ? color.text : 'text-[#e6edf3]'}`}>
                        {type.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8b949e]">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Formato</label>
            <div className="flex gap-2">
              {[
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'json', label: 'JSON', icon: FileJson },
                { id: 'csv', label: 'CSV', icon: Table }
              ].map(format => (
                <button
                  key={format.id}
                  onClick={() => setConfig(prev => ({ ...prev, format: format.id as any }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    config.format === format.id
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#06080e] text-[#8b949e] hover:text-[#e6edf3] border border-[#21262d]'
                  }`}
                >
                  <format.icon className="w-4 h-4" />
                  <span className="text-sm">{format.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Opções</label>
            
            {[
              { key: 'includeTimestamp', label: 'Incluir Timestamp' },
              { key: 'includeMetrics', label: 'Incluir Métricas' },
              { key: 'includeAnomalies', label: 'Incluir Anomalias' }
            ].map(opt => (
              <label key={opt.key} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#06080e] border border-[#21262d]">
                <span className="text-sm text-[#e6edf3]">{opt.label}</span>
                <input
                  type="checkbox"
                  checked={config[opt.key as keyof ReportConfig] as boolean}
                  onChange={(e) => setConfig(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                  className="w-4 h-4 rounded border-[#21262d] bg-[#0d1117] text-cyan-500 focus:ring-cyan-500/20"
                />
              </label>
            ))}
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Período</label>
            <div className="flex gap-2">
              {['today', 'week', 'month', 'all'].map(range => (
                <button
                  key={range}
                  onClick={() => setConfig(prev => ({ ...prev, dateRange: range as any }))}
                  className={`px-4 py-2 rounded-lg text-xs capitalize transition-all ${
                    config.dateRange === range
                      ? 'bg-cyan-500 text-[#06080e] font-medium'
                      : 'bg-[#06080e] text-[#8b949e] border border-[#21262d] hover:border-[#30363d]'
                  }`}
                >
                  {range === 'today' ? 'Hoje' : range === 'week' ? 'Semana' : range === 'month' ? 'Mês' : 'Todo'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#21262d] bg-[#06080e]">
          {generated && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle className="w-3 h-3" />
              Gerado!
            </span>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#06080e] font-medium transition-all disabled:opacity-50 text-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Gerar Relatório
              </>
            )}
          </button>
          
          {generated && !isGenerating && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#06080e] font-medium transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
