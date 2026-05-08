import { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Bell, 
  Brain, 
  Database, 
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Server,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

interface SettingsData {
  min_quality_score: number;
  max_retries: number;
  min_success_rate: number;
  health_check_interval: number;
  max_silence_minutes: number;
  consecutive_failures_threshold: number;
  alert_cooldown_minutes: number;
  whatsapp_enabled: boolean;
  whatsapp_recipients: string[];
  edital_hunter_enabled: boolean;
  health_agent_enabled: boolean;
  meta_health_enabled: boolean;
  qdrant_collection_semantic: string;
  qdrant_collection_procedural: string;
  api_port: number;
  websocket_enabled: boolean;
}

const defaultSettings: SettingsData = {
  min_quality_score: 7.0,
  max_retries: 3,
  min_success_rate: 70,
  health_check_interval: 60,
  max_silence_minutes: 30,
  consecutive_failures_threshold: 3,
  alert_cooldown_minutes: 60,
  whatsapp_enabled: true,
  whatsapp_recipients: ['+5511999999999', '+5511988888888'],
  edital_hunter_enabled: true,
  health_agent_enabled: true,
  meta_health_enabled: true,
  qdrant_collection_semantic: 'semantic_memory',
  qdrant_collection_procedural: 'procedural_memory',
  api_port: 8000,
  websocket_enabled: true
};

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: SettingsData) => void;
}

export default function SettingsPanel({ 
  isOpen, 
  onClose,
  onSettingsChange 
}: SettingsPanelProps) {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'quality' | 'monitoring' | 'alerting' | 'agents' | 'memory' | 'api'>('quality');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('scaio_settings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.setItem('scaio_settings', JSON.stringify(settings));
    setSaveStatus('success');
    onSettingsChange?.(settings);
    
    setTimeout(() => setSaveStatus('idle'), 2000);
    setIsSaving(false);
  };

  const handleReset = () => setSettings(defaultSettings);

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'quality', label: 'Quality', icon: Brain },
    { id: 'monitoring', label: 'Monitoring', icon: Server },
    { id: 'alerting', label: 'Alerting', icon: Bell },
    { id: 'agents', label: 'Agents', icon: Shield },
    { id: 'memory', label: 'Memory', icon: Database },
    { id: 'api', label: 'API', icon: Globe }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-[#21262d] bg-[#0d1117] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#21262d] bg-[#06080e]">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-[#e6edf3]">Configurações Avançadas</h2>
            <span className="text-xs text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded terminal-font">v1.0.0</span>
          </div>
          <button onClick={onClose} className="text-[#8b949e] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 border-b border-[#21262d] bg-[#06080e] overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quality Tab */}
          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-[#21262d] bg-[#06080e]">
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  Cognitive Quality Thresholds
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">
                      MIN_QUALITY_SCORE (0-10)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={settings.min_quality_score}
                        onChange={(e) => updateSetting('min_quality_score', parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                      <span className="text-sm font-bold text-cyan-400 terminal-font w-12">
                        {settings.min_quality_score.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-[#8b949e] mt-2">
                      {settings.min_quality_score >= 7 
                        ? "⚠️ Alto rigor - apenas resultados excelentes são aceitos"
                        : "📊 Moderado - resultados bons são aceitos"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">Max Retries</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={settings.max_retries}
                        onChange={(e) => updateSetting('max_retries', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                      <span className="text-sm font-bold text-cyan-400 terminal-font w-8">{settings.max_retries}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">Min Success Rate (%)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={settings.min_success_rate}
                        onChange={(e) => updateSetting('min_success_rate', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                      <span className="text-sm font-bold text-cyan-400 terminal-font w-12">{settings.min_success_rate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-cyan-300">Impacto da Configuração</p>
                    <p className="text-xs text-cyan-200/70 mt-1">
                      Score mais alto = maior precisão, menos resultados. 
                      Score mais baixo = mais resultados, maior risco de falsos positivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-[#21262d] bg-[#06080e]">
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-4 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  Health Check Configuration
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">Check Interval (s)</label>
                    <input
                      type="number"
                      value={settings.health_check_interval}
                      onChange={(e) => updateSetting('health_check_interval', parseInt(e.target.value))}
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] focus:border-cyan-500/50 focus:outline-none"
                    />
                    <p className="text-xs text-[#8b949e] mt-1">Frequência do Health Agent</p>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">Max Silence (min)</label>
                    <input
                      type="number"
                      value={settings.max_silence_minutes}
                      onChange={(e) => updateSetting('max_silence_minutes', parseInt(e.target.value))}
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] focus:border-cyan-500/50 focus:outline-none"
                    />
                    <p className="text-xs text-[#8b949e] mt-1">Tempo sem resposta antes do alerta</p>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">Consecutive Failures Threshold</label>
                    <input
                      type="number"
                      value={settings.consecutive_failures_threshold}
                      onChange={(e) => updateSetting('consecutive_failures_threshold', parseInt(e.target.value))}
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] focus:border-cyan-500/50 focus:outline-none"
                    />
                    <p className="text-xs text-[#8b949e] mt-1">Falhas antes do estado RED</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alerting Tab */}
          {activeTab === 'alerting' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-[#21262d] bg-[#06080e]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#e6edf3] flex items-center gap-2">
                    <Bell className="w-4 h-4 text-yellow-400" />
                    WhatsApp Alerts
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.whatsapp_enabled}
                      onChange={(e) => updateSetting('whatsapp_enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#21262d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">Cooldown (minutes)</label>
                    <input
                      type="number"
                      value={settings.alert_cooldown_minutes}
                      onChange={(e) => updateSetting('alert_cooldown_minutes', parseInt(e.target.value))}
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] focus:border-cyan-500/50 focus:outline-none"
                    />
                    <p className="text-xs text-[#8b949e] mt-1">Evita spam de alertas do mesmo tipo</p>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">WhatsApp Recipients</label>
                    <div className="space-y-2">
                      {settings.whatsapp_recipients.map((recipient, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={recipient}
                            onChange={(e) => {
                              const newRecipients = [...settings.whatsapp_recipients];
                              newRecipients[idx] = e.target.value;
                              updateSetting('whatsapp_recipients', newRecipients);
                            }}
                            className="flex-1 bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] font-mono focus:border-cyan-500/50 focus:outline-none"
                            placeholder="+5511999999999"
                          />
                          <button
                            onClick={() => updateSetting('whatsapp_recipients', settings.whatsapp_recipients.filter((_, i) => i !== idx))}
                            className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 border border-red-500/30 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => updateSetting('whatsapp_recipients', [...settings.whatsapp_recipients, ''])}
                        className="text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        + Add Recipient
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-[#21262d] bg-[#06080e]">
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-4">Agent Toggles</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'edital_hunter_enabled', label: 'EditalHunter', desc: 'Busca e análise cognitiva de editais' },
                    { key: 'health_agent_enabled', label: 'Health Agent', desc: 'Supervisão contínua dos agentes' },
                    { key: 'meta_health_enabled', label: 'Meta-Health Agent', desc: 'Supervisor do supervisor (systemd)' }
                  ].map((agent) => (
                    <div key={agent.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-[#e6edf3]">{agent.label}</p>
                        <p className="text-xs text-[#8b949e]">{agent.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[agent.key as keyof SettingsData] as boolean}
                          onChange={(e) => updateSetting(agent.key as keyof SettingsData, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#21262d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Memory Tab */}
          {activeTab === 'memory' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-[#21262d] bg-[#06080e]">
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4 text-violet-400" />
                  Qdrant Collections
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">Semantic Memory Collection</label>
                    <input
                      type="text"
                      value={settings.qdrant_collection_semantic}
                      onChange={(e) => updateSetting('qdrant_collection_semantic', e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] font-mono focus:border-violet-500/50 focus:outline-none"
                    />
                    <p className="text-xs text-[#8b949e] mt-1">Fatos e dados coletados</p>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">Procedural Memory Collection</label>
                    <input
                      type="text"
                      value={settings.qdrant_collection_procedural}
                      onChange={(e) => updateSetting('qdrant_collection_procedural', e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] font-mono focus:border-violet-500/50 focus:outline-none"
                    />
                    <p className="text-xs text-[#8b949e] mt-1">Estratégias e habilidades aprendidas</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-[#21262d] bg-[#06080e]">
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  API Configuration
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#8b949e] mb-2 terminal-font">API Port</label>
                    <input
                      type="number"
                      value={settings.api_port}
                      onChange={(e) => updateSetting('api_port', parseInt(e.target.value))}
                      className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] focus:border-cyan-500/50 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <label className="text-sm text-[#e6edf3]">WebSocket</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.websocket_enabled}
                        onChange={(e) => updateSetting('websocket_enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#21262d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#21262d]">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#8b949e] terminal-font">API Key (read-only):</span>
                    <div className="flex items-center gap-2 bg-[#0d1117] rounded-lg px-3 py-1.5 border border-[#21262d]">
                      <code className="text-xs text-[#8b949e]">
                        {showApiKey ? 'scaio_live_your_secret_key_here' : '••••••••••••••••••••••••'}
                      </code>
                      <button onClick={() => setShowApiKey(!showApiKey)} className="text-[#8b949e] hover:text-white">
                        {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-[#21262d] bg-[#06080e]">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.03] transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          
          <div className="flex items-center gap-3">
            {saveStatus === 'success' && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-1 text-xs text-red-400">
                <AlertTriangle className="w-3 h-3" />
                Error
              </span>
            )}
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#06080e] font-medium transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-[#06080e]/30 border-t-[#06080e] rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
