import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ArchitectureSection from './components/ArchitectureSection';
import CognitiveCycle from './components/CognitiveCycle';
import AgentsSection from './components/AgentsSection';
import DirectoryTree from './components/DirectoryTree';
import WorkflowVisualization from './components/WorkflowVisualization';
import MemoryArchitecture from './components/MemoryArchitecture';
import LegalGuide from './components/LegalGuide';
import InstallationGuide from './components/InstallationGuide';
import StatusDashboard from './components/StatusDashboard';
import CodeExplorer from './components/CodeExplorer';
import SettingsPanel from './components/SettingsPanel';
import ReportExporter from './components/ReportExporter';
import Footer from './components/Footer';

export default function App() {
  const [codeExplorerOpen, setCodeExplorerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    const handleOpenCodeExplorer = () => setCodeExplorerOpen(true);
    const handleOpenSettings = () => setSettingsOpen(true);
    const handleOpenReport = () => setReportOpen(true);
    window.addEventListener('open-code-explorer', handleOpenCodeExplorer);
    window.addEventListener('open-settings', handleOpenSettings);
    window.addEventListener('open-report', handleOpenReport);
    return () => {
      window.removeEventListener('open-code-explorer', handleOpenCodeExplorer);
      window.removeEventListener('open-settings', handleOpenSettings);
      window.removeEventListener('open-report', handleOpenReport);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#06080e] text-[#e6edf3]">
      <Navbar />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <ArchitectureSection />
        <div className="section-divider" />
        <CognitiveCycle />
        <div className="section-divider" />
        <WorkflowVisualization />
        <div className="section-divider" />
        <MemoryArchitecture />
        <div className="section-divider" />
        <AgentsSection />
        <div className="section-divider" />
        <DirectoryTree />
        <div className="section-divider" />
        <LegalGuide />
        <div className="section-divider" />
        <InstallationGuide />
        <div className="section-divider" />
        <StatusDashboard />
      </main>
      <Footer />
      <CodeExplorer isOpen={codeExplorerOpen} onClose={() => setCodeExplorerOpen(false)} />
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ReportExporter isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}
