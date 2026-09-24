import React, { useState } from 'react';
import { ViewMode, Language, CameraStream, AlertItem } from './types/yolo';
import { INITIAL_CAMERAS, INITIAL_ALERTS } from './data/sampleData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AnalysisView } from './components/views/AnalysisView';
import { LiveMonitorView } from './components/views/LiveMonitorView';
import { VisionInspectorView } from './components/views/VisionInspectorView';
import { VideoLearningView } from './components/views/VideoLearningView';
import { TrainingStudioView } from './components/views/TrainingStudioView';
import { DatasetCheckerTool } from './components/views/DatasetCheckerTool';
import { MesAnalyticsView } from './components/views/MesAnalyticsView';
import { AlertWorkflowView } from './components/views/AlertWorkflowView';
import { OptimizationRoadmapView } from './components/views/OptimizationRoadmapView';
import { PhaseImplementationView } from './components/views/PhaseImplementationView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('analysis');
  const [language, setLanguage] = useState<Language>('zh');
  const [cameras, setCameras] = useState<CameraStream[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const activeAlertsCount = alerts.filter((a) => a.status !== 'resolved').length;
  const activeCamerasCount = cameras.filter((c) => c.status !== 'offline').length;
  const fpsAverage = cameras.reduce((acc, c) => acc + c.fps, 0) / (cameras.length || 1);

  const handleTriggerSimulatedAlert = (cam: CameraStream) => {
    const newAlertId = `alt_${Date.now().toString().slice(-4)}`;
    const isSafety = cam.id.includes('safety');
    const newAlert: AlertItem = {
      id: newAlertId,
      cameraId: cam.id,
      cameraName: cam.name,
      stationId: cam.stationId,
      severity: isSafety ? 'critical' : 'warning',
      category: isSafety ? 'safety' : 'defect',
      title: isSafety ? '【紧急安全报警】检测到人员未佩戴防护装备跨入警戒红线' : `【${cam.stationId}】视觉检测到突发异常连续缺陷超标`,
      detail: `相机 ${cam.name} 触发突发异常，置信度 0.94，系统已记录事件截图，并自动下发钉钉/企业微信群通知。`,
      timestamp: new Date().toTimeString().slice(0, 8),
      status: 'pending',
      assignedTo: '值班工程师'
    };

    setAlerts([newAlert, ...alerts]);

    // Update camera status
    setCameras(
      cameras.map((c) =>
        c.id === cam.id
          ? { ...c, status: 'warning', defectCountToday: c.defectCountToday + 1 }
          : c
      )
    );
  };

  const handleUpdateAlertStatus = (
    alertId: string,
    status: 'pending' | 'investigating' | 'resolved'
  ) => {
    setAlerts(
      alerts.map((a) => (a.id === alertId ? { ...a, status } : a))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Industrial Navbar */}
      <Navbar
        language={language}
        onToggleLanguage={toggleLanguage}
        activeAlertsCount={activeAlertsCount}
        fpsAverage={fpsAverage}
        activeCamerasCount={activeCamerasCount}
        onNavigateToAlerts={() => setCurrentView('alert-workflow')}
      />

      {/* Main Body with Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          language={language}
          activeAlertsCount={activeAlertsCount}
        />

        {/* Content Scroll Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-7xl mx-auto">
            {currentView === 'analysis' && <AnalysisView language={language} />}
            {currentView === 'live-monitor' && (
              <LiveMonitorView
                cameras={cameras}
                language={language}
                onTriggerSimulatedAlert={handleTriggerSimulatedAlert}
              />
            )}
            {currentView === 'vision-inspector' && <VisionInspectorView language={language} />}
            {currentView === 'video-learning' && <VideoLearningView language={language} />}
            {currentView === 'training-studio' && <TrainingStudioView language={language} />}
            {currentView === 'dataset-checker' && <DatasetCheckerTool language={language} />}
            {currentView === 'mes-analytics' && <MesAnalyticsView language={language} />}
            {currentView === 'alert-workflow' && (
              <AlertWorkflowView
                alerts={alerts}
                language={language}
                onUpdateAlertStatus={handleUpdateAlertStatus}
              />
            )}
            {currentView === 'optimization-roadmap' && (
              <OptimizationRoadmapView 
                language={language} 
                onNavigateToImplementation={() => setCurrentView('phase-implementation')}
              />
            )}
            {currentView === 'phase-implementation' && (
              <PhaseImplementationView language={language} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
