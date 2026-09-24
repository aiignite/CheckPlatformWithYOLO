import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Maximize2, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Layers,
  Camera as CameraIcon,
  Download,
  Filter
} from 'lucide-react';
import { CameraStream, Language } from '../../types/yolo';
import { DEFECT_CLASSES } from '../../data/sampleData';

interface LiveMonitorViewProps {
  cameras: CameraStream[];
  language: Language;
  onTriggerSimulatedAlert: (camera: CameraStream) => void;
}

export const LiveMonitorView: React.FC<LiveMonitorViewProps> = ({
  cameras,
  language,
  onTriggerSimulatedAlert,
}) => {
  const isZh = language === 'zh';
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [minConf, setMinConf] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedStationFilter, setSelectedStationFilter] = useState<string>('all');
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  const selectedCamera = cameras.find((c) => c.id === selectedCameraId) || null;

  const filteredCameras = cameras.filter((cam) => {
    if (selectedStationFilter === 'all') return true;
    return cam.stationId.toLowerCase().includes(selectedStationFilter.toLowerCase());
  });

  const handleCaptureSnapshot = (cam: CameraStream) => {
    const notice = isZh
      ? `已成功抓拍 ${cam.name} (${cam.stationId}) 现场高清帧，附带 ${cam.boxes.length} 个 YOLO 缺陷坐标已保存至质检台账！`
      : `Captured snapshot from ${cam.name} with ${cam.boxes.length} YOLO boxes to audit log!`;
    setSnapshotToast(notice);
    setTimeout(() => setSnapshotToast(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">
              {isZh ? '产线多路实时监控流 (4路高清并发)' : 'Live Multi-Camera Production Grid'}
            </h2>
            <p className="text-xs text-slate-400">
              {isZh ? '支持 GigE 工业相机与 RTSP 视频流, YOLO 目标检测毫秒级叠加' : 'Ultra-low latency GigE & RTSP streams with real-time YOLO bounding boxes'}
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              isPlaying
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950 text-amber-300 border-amber-500/40'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? (isZh ? '正在拉流' : 'Live Streaming') : (isZh ? '已暂停' : 'Paused')}</span>
          </button>

          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              showBoxes
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isZh ? '检测框' : 'Boxes'}</span>
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              showLabels
                ? 'bg-indigo-950 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isZh ? '标签' : 'Labels'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              soundEnabled
                ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title={isZh ? '开启告警声光仿真' : 'Audio Alarm'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isZh ? '声光' : 'Audio'}</span>
          </button>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <span className="text-slate-400 text-[11px]">{isZh ? '过滤阈值' : 'Threshold'}:</span>
            <input
              type="range"
              min="0.2"
              max="0.95"
              step="0.05"
              value={minConf}
              onChange={(e) => setMinConf(parseFloat(e.target.value))}
              className="w-16 accent-cyan-500 cursor-pointer"
            />
            <span className="font-mono tabular-nums text-cyan-300 font-bold text-[11px] w-8">
              {(minConf * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {snapshotToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* Station Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 mr-1">{isZh ? '工位筛选:' : 'Filter Station:'}</span>
        {[
          { id: 'all', nameZh: '全部工位 (All)', nameEn: 'All Stations' },
          { id: 'smt', nameZh: 'SMT 贴片工位', nameEn: 'SMT Stations' },
          { id: 'assy', nameZh: '机械手装配', nameEn: 'Robotic Assembly' },
          { id: 'test', nameZh: '综合电气检测', nameEn: 'Electrical Test' },
          { id: 'pack', nameZh: '自动包装仓储', nameEn: 'Packaging' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStationFilter(tab.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              selectedStationFilter === tab.id
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {isZh ? tab.nameZh : tab.nameEn}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCameras.map((cam) => {
          const isWarning = cam.status === 'warning';
          const filteredBoxes = cam.boxes.filter((b) => b.confidence >= minConf);

          return (
            <div
              key={cam.id}
              className={`bg-slate-900/90 border rounded-xl overflow-hidden flex flex-col transition-all shadow-lg ${
                isWarning
                  ? 'border-rose-500/60 shadow-rose-950/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Stream Title Bar */}
              <div className="px-4 py-2.5 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      cam.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-ping'
                    }`}
                  />
                  <span className="font-bold text-white tracking-wide">{cam.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono tabular-nums">({cam.type})</span>
                </div>

                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-cyan-400 font-mono tabular-nums">{cam.fps} FPS</span>
                  <span className="text-slate-400 font-mono tabular-nums">{cam.latencyMs}ms</span>
                  <button
                    onClick={() => handleCaptureSnapshot(cam)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                    title={isZh ? '现场快速抓拍' : 'Capture Snapshot'}
                  >
                    <CameraIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedCameraId(cam.id)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                    title={isZh ? '特写放大' : 'Maximize'}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Video Simulated Surface */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden group select-none">
                <div 
                  className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"
                />

                {/* Simulated Industrial Station Background SVG */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <svg className="w-full h-full text-slate-800" viewBox="0 0 400 225" fill="none">
                    <rect x="50" y="30" width="300" height="165" rx="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle cx="200" cy="112" r="45" stroke="currentColor" strokeWidth="1" />
                    <line x1="50" y1="112" x2="350" y2="112" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="200" y1="30" x2="200" y2="195" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M 60 40 L 75 40 M 60 40 L 60 55" stroke="currentColor" strokeWidth="2" />
                    <path d="M 340 40 L 325 40 M 340 40 L 340 55" stroke="currentColor" strokeWidth="2" />
                    <path d="M 60 185 L 75 185 M 60 185 L 60 170" stroke="currentColor" strokeWidth="2" />
                    <path d="M 340 185 L 325 185 M 340 185 L 340 170" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>

                {/* Station ID Stamp */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur border border-white/10 text-[10px] font-mono tabular-nums text-emerald-400">
                  REC ● {cam.stationId} | {cam.resolution}
                </div>

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur border border-white/10 text-[10px] font-mono text-slate-300">
                  {cam.modelDeployed}
                </div>

                {/* Bounding Box Renderings */}
                {showBoxes &&
                  filteredBoxes.map((box) => {
                    const cls = DEFECT_CLASSES.find((c) => c.id === box.classId);
                    const color = cls?.color || '#38bdf8';
                    const isDefect = box.category === 'defect' || box.category === 'safety';

                    return (
                      <div
                        key={box.id}
                        className="absolute border-2 transition-all duration-300 pointer-events-none"
                        style={{
                          left: `${box.x * 100}%`,
                          top: `${box.y * 100}%`,
                          width: `${box.w * 100}%`,
                          height: `${box.h * 100}%`,
                          borderColor: color,
                          backgroundColor: `${color}18`,
                          boxShadow: isDefect ? `0 0 10px ${color}88` : 'none',
                        }}
                      >
                        <span className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-white" />
                        <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white" />
                        <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />

                        {showLabels && (
                          <div
                            className="absolute -top-6 left-0 px-1.5 py-0.5 text-[9px] font-mono tabular-nums font-bold text-white rounded whitespace-nowrap shadow flex items-center space-x-1"
                            style={{ backgroundColor: color }}
                          >
                            <span>{cls?.displayName?.split(' ')[0] || box.className}</span>
                            <span className="bg-black/40 px-1 rounded text-[8px]">
                              {(box.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* Quick Action Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 pointer-events-auto">
                  <button
                    onClick={() => onTriggerSimulatedAlert(cam)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-rose-600/30 transition cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isZh ? '模拟触发缺陷告警' : 'Inject Anomaly'}</span>
                  </button>
                  <button
                    onClick={() => handleCaptureSnapshot(cam)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold shadow-lg transition cursor-pointer"
                  >
                    <CameraIcon className="w-3.5 h-3.5" />
                    <span>{isZh ? '快速抓拍' : 'Snapshot'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedCameraId(cam.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{isZh ? '单路特写' : 'Focus'}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-400">
                  <span>{cam.location}</span>
                </div>

                <div className="flex items-center space-x-3 text-slate-400">
                  <span>
                    {isZh ? '今日拦截' : 'Defects'}:{' '}
                    <strong className={`font-mono tabular-nums ${cam.defectCountToday > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {cam.defectCountToday}
                    </strong>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono tabular-nums text-cyan-300">
                    {filteredBoxes.length} {isZh ? '个目标' : 'targets'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for single camera full examination */}
      {selectedCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-white text-base">{selectedCamera.name}</h3>
                <span className="text-xs text-slate-400 font-mono tabular-nums">[{selectedCamera.stationId}]</span>
              </div>
              <button
                onClick={() => setSelectedCameraId(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition cursor-pointer"
              >
                {isZh ? '关闭退出' : 'Close'}
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <div className="absolute top-3 left-3 text-xs font-mono tabular-nums text-emerald-400 bg-black/60 px-2 py-1 rounded">
                  STREAM ID: {selectedCamera.id} | MODEL: {selectedCamera.modelDeployed}
                </div>

                {selectedCamera.boxes.map((b) => (
                  <div
                    key={b.id}
                    className="absolute border-2 border-cyan-400 bg-cyan-500/10"
                    style={{
                      left: `${b.x * 100}%`,
                      top: `${b.y * 100}%`,
                      width: `${b.w * 100}%`,
                      height: `${b.h * 100}%`,
                    }}
                  >
                    <span className="absolute -top-6 left-0 bg-cyan-500 text-black px-1.5 py-0.5 text-xs font-bold rounded">
                      {b.className} ({(b.confidence * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* Defect items list */}
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-slate-300">
                    {isZh ? '当前识别目标与工位状态明细' : 'Detected Objects & Diagnostics'}
                  </h4>
                  <button
                    onClick={() => handleCaptureSnapshot(selectedCamera)}
                    className="px-2.5 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs font-medium flex items-center space-x-1 cursor-pointer"
                  >
                    <CameraIcon className="w-3 h-3" />
                    <span>{isZh ? '抓拍存证' : 'Snapshot'}</span>
                  </button>
                </div>
                <div className="space-y-1.5 text-xs">
                  {selectedCamera.boxes.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800/80"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            b.status === 'fail' ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-semibold text-white">{b.className}</span>
                        <span className="text-slate-400">({b.description})</span>
                      </div>
                      <span className="font-mono tabular-nums text-cyan-400 font-bold">
                        {(b.confidence * 100).toFixed(1)}% 置信度
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
