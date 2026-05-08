import { useState, useEffect } from 'react';
import { Brain, Menu, X, ExternalLink, Shield, FileCode, Settings, FileText } from 'lucide-react';

const navLinks = [
  { href: '#architecture', label: 'Arquitetura' },
  { href: '#cycle', label: 'Ciclo' },
  { href: '#agents', label: 'Agentes' },
  { href: '#structure', label: 'Estrutura' },
  { href: '#install', label: 'Instalação' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#06080e]/90 backdrop-blur-xl border-b border-[#21262d]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#06080e]" />
              </div>
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-30 blur-md transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wider gradient-text">SCAIO</span>
              <span className="text-[9px] text-[#8b949e] tracking-widest uppercase -mt-1">Meta-Cognitive</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-code-explorer'))}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#8b949e] hover:text-cyan-400 transition-colors"
            >
              <FileCode className="w-4 h-4" />
              Code
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#8b949e] hover:text-cyan-400 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Config
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-report'))}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#8b949e] hover:text-cyan-400 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Relatório
            </button>
            <span className="flex items-center gap-2 text-xs text-[#8b949e] px-3 py-1.5 rounded-full border border-[#21262d]">
              <Shield className="w-3 h-3 text-emerald-400" />
              MIT / Apache 2.0
            </span>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#06080e] bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-lg hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[#8b949e] hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0d1117]/95 backdrop-blur-xl border-b border-[#21262d]">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-code-explorer'));
                setMobileOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-[#8b949e] hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2"
            >
              <FileCode className="w-4 h-4" />
              Code Explorer
            </button>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-settings'));
                setMobileOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-[#8b949e] hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-report'));
                setMobileOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-[#8b949e] hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Relatório
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
