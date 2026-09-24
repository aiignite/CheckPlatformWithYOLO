import React from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Languages, 
  Layers
} from 'lucide-react';
import { Language } from '../types/yolo';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  activeAlertsCount: number;
  fpsAverage: number;
  activeCamerasCount: number;
  onNavigateToAlerts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  activeAlertsCount,
  fpsAverage,
  activeCamerasCount,
  onNavigateToAlerts,
}) => {
  const isZh = language === 'zh';

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50 text-slate-200">
      {/* Zone 1: Single text element wordmark + clean unboxed station identifier */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            YoloCheck
          </span>
        </div>
        <span className="text-slate-600 hidden sm:inline" aria-hidden="true">/</span>
        <span className="text-xs text-slate-400 hidden sm:inline">
          {isZh ? 'SMT产线质量与SOP施教视觉中枢' : 'SMT Quality & SOP Visual Studio'}
        </span>
      </div>

      {/* Zone 2: Telemetry as quiet unboxed text with separators and tabular numerals */}
      <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-mono tabular-nums font-medium">{activeCamerasCount}/4</span>
          <span>{isZh ? '路活跃相机' : 'Active Cameras'}</span>
        </span>
        <span className="text-slate-600" aria-hidden="true">·</span>
        <span>
          <span className="text-slate-200 font-mono tabular-nums font-semibold">{fpsAverage.toFixed(1)}</span>
          <span className="ml-1 text-slate-400">FPS</span>
        </span>
        <span className="text-slate-600" aria-hidden="true">·</span>
        <span className="text-slate-300 font-mono text-[11px]">TensorRT FP16</span>
        <span className="text-slate-600" aria-hidden="true">·</span>
        <span className="text-emerald-400 font-mono text-[11px]">MQTT QoS 1</span>
      </div>

      {/* Zone 3: 1-2 primary actions and quiet controls */}
      <div className="flex items-center space-x-3">
        {/* Active Alert Trigger Button */}
        {activeAlertsCount > 0 ? (
          <button
            onClick={onNavigateToAlerts}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 rounded-lg text-rose-300 text-xs font-semibold transition cursor-pointer"
            title={isZh ? '点击进入告警处置中枢' : 'Open Alert Center'}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-mono tabular-nums">{activeAlertsCount}</span>
            <span>{isZh ? '待处置' : 'Alerts'}</span>
          </button>
        ) : (
          <span className="text-xs text-emerald-400 font-mono hidden lg:inline">
            ● 0 ALERTS
          </span>
        )}

        {/* Language switch button */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition cursor-pointer"
          title={isZh ? '切换语言 (Switch Language)' : 'Switch Language'}
        >
          <Languages className="w-3 h-3 text-cyan-400" />
          <span className="font-medium text-[11px]">{isZh ? 'EN' : '中'}</span>
        </button>

        <button 
          onClick={() => window.location.reload()}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition cursor-pointer"
          title={isZh ? '刷新状态' : 'Refresh State'}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

