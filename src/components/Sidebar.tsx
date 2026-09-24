import React from 'react';
import { 
  FileSearch, 
  Camera, 
  Scan, 
  Video, 
  Flame, 
  CheckCircle2, 
  BarChart3, 
  BellRing, 
  MapPin,
  ChevronRight,
  Rocket
} from 'lucide-react';
import { ViewMode, Language } from '../types/yolo';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  language: Language;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  language,
  activeAlertsCount,
}) => {
  const isZh = language === 'zh';

  const menuItems: { id: ViewMode; labelZh: string; labelEn: string; icon: React.ElementType; badge?: string | number }[] = [
    {
      id: 'analysis',
      labelZh: '功能剖析与系统架构',
      labelEn: 'System Architecture & Analysis',
      icon: FileSearch,
    },
    {
      id: 'live-monitor',
      labelZh: '产线多路实时监控',
      labelEn: 'Live Camera Streams',
      icon: Camera,
      badge: '4路'
    },
    {
      id: 'vision-inspector',
      labelZh: 'YOLO缺陷检测与标注质检',
      labelEn: 'Vision Defect Inspector',
      icon: Scan,
    },
    {
      id: 'video-learning',
      labelZh: '视频学习与SOP施教工作台',
      labelEn: 'Video SOP Learning Workbench',
      icon: Video,
      badge: '核心'
    },
    {
      id: 'training-studio',
      labelZh: '模型训练与多维评估中心',
      labelEn: 'Model Training & Evaluation',
      icon: Flame,
    },
    {
      id: 'dataset-checker',
      labelZh: 'YOLO数据集体检与纠错',
      labelEn: 'Dataset Health & Anomaly Fixer',
      icon: CheckCircle2,
      badge: '新功能'
    },
    {
      id: 'mes-analytics',
      labelZh: '生产效率与OEE数据分析',
      labelEn: 'MES Efficiency & OEE Stats',
      icon: BarChart3,
    },
    {
      id: 'alert-workflow',
      labelZh: '告警联动与处置工单',
      labelEn: 'Alerts & Workflow Center',
      icon: BellRing,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined
    },
    {
      id: 'optimization-roadmap',
      labelZh: '优化方案与实施规划路线',
      labelEn: 'Optimization & Implementation',
      icon: MapPin,
      badge: '规划'
    },
    {
      id: 'phase-implementation',
      labelZh: '阶段落地工程控制台',
      labelEn: 'Phase Implementation Console',
      icon: Rocket,
      badge: '实施中'
    },
  ];

  return (
    <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {isZh ? '系统功能与仿真中枢' : 'System Modules & Studio'}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/60 text-cyan-200 border border-cyan-500/40 shadow-sm shadow-cyan-900/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{isZh ? item.labelZh : item.labelEn}</span>
              </div>

              <div className="flex items-center space-x-1 shrink-0 ml-1">
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      typeof item.badge === 'number'
                        ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                        : item.badge === '核心' || item.badge === '新功能'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer System Spec Info */}
      <div className="p-3 m-3 rounded-lg bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between text-slate-300 font-semibold">
          <span>YoloCheck Engine</span>
          <span className="text-emerald-400 font-mono">v8.2.0</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          {isZh ? '支持 YOLOv8/v11 目标检测、实例分割与骨骼姿态多模态推理' : 'Supports YOLOv8/v11 object, segmentation & pose estimation.'}
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-cyan-400/90 font-mono border-t border-slate-800">
          <span>Edge-Cloud Dual Sync</span>
          <span className="text-emerald-400">● 100% HEALTHY</span>
        </div>
      </div>
    </aside>
  );
};
