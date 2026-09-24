import React, { useState } from 'react';
import { 
  Scan, 
  Layers, 
  CheckCircle2, 
  AlertOctagon, 
  Sliders, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  PlusCircle, 
  Trash2,
  FileCode,
  Tag,
  Download,
  Plus
} from 'lucide-react';
import { BoundingBox, Language } from '../../types/yolo';
import { DEFECT_CLASSES } from '../../data/sampleData';

interface VisionInspectorViewProps {
  language: Language;
}

interface SceneOption {
  id: string;
  nameZh: string;
  nameEn: string;
  category: string;
  boxes: BoundingBox[];
}

export const VisionInspectorView: React.FC<VisionInspectorViewProps> = ({ language }) => {
  const isZh = language === 'zh';

  const initialScenes: SceneOption[] = [
    {
      id: 'pcb-dense',
      nameZh: 'SMT-PCB 0402密闭贴片缺陷检测',
      nameEn: 'Dense SMT PCB 0402 Defect Check',
      category: 'SMT Manufacturing',
      boxes: [
        { id: 'sb-1', classId: 0, className: 'missing_component', category: 'defect', x: 0.32, y: 0.38, w: 0.11, h: 0.09, confidence: 0.95, status: 'fail', description: 'C104电容空焊盘' },
        { id: 'sb-2', classId: 1, className: 'solder_bridge', category: 'defect', x: 0.58, y: 0.26, w: 0.10, h: 0.08, confidence: 0.89, status: 'fail', description: 'Q3三极管引脚连锡短路' },
        { id: 'sb-3', classId: 2, className: 'polarity_error', category: 'defect', x: 0.22, y: 0.62, w: 0.12, h: 0.11, confidence: 0.92, status: 'fail', description: 'D2稳压二极管方向反装' },
        { id: 'sb-4', classId: 4, className: 'ic_chip_normal', category: 'component', x: 0.42, y: 0.52, w: 0.24, h: 0.26, confidence: 0.99, status: 'pass', description: 'STM32主控芯片对准合格' },
        { id: 'sb-5', classId: 5, className: 'resistor_normal', category: 'component', x: 0.72, y: 0.44, w: 0.08, h: 0.07, confidence: 0.96, status: 'pass', description: 'R44精密电阻无偏移' },
      ]
    },
    {
      id: 'assembly-bolt',
      nameZh: '自动化机械手锁螺丝与线束端子检验',
      nameEn: 'Auto Screwing & Harness Inspection',
      category: 'Assembly Island',
      boxes: [
        { id: 'sb-6', classId: 3, className: 'foreign_object', category: 'defect', x: 0.36, y: 0.32, w: 0.14, h: 0.12, confidence: 0.87, status: 'fail', description: '金属铜屑异物侵入' },
        { id: 'sb-7', classId: 4, className: 'ic_chip_normal', category: 'component', x: 0.52, y: 0.45, w: 0.28, h: 0.30, confidence: 0.98, status: 'pass', description: '底板螺丝扭矩合格' },
      ]
    }
  ];

  const [scenes, setScenes] = useState<SceneOption[]>(initialScenes);
  const [currentSceneId, setCurrentSceneId] = useState<string>(scenes[0].id);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [activeClasses, setActiveClasses] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRawYoloCode, setShowRawYoloCode] = useState<boolean>(false);
  const [isAddingBox, setIsAddingBox] = useState<boolean>(false);
  const [newBoxClassId, setNewBoxClassId] = useState<number>(0);
  const [newBoxDesc, setNewBoxDesc] = useState<string>('现场手动追加标注');

  const activeScene = scenes.find((s) => s.id === currentSceneId) || scenes[0];

  const handleSceneChange = (id: string) => {
    setCurrentSceneId(id);
    setSelectedBoxId(null);
  };

  const toggleClass = (id: number) => {
    if (activeClasses.includes(id)) {
      setActiveClasses(activeClasses.filter((c) => c !== id));
    } else {
      setActiveClasses([...activeClasses, id]);
    }
  };

  const handleAddBox = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = DEFECT_CLASSES.find((c) => c.id === newBoxClassId) || DEFECT_CLASSES[0];
    const newBox: BoundingBox = {
      id: `box-${Date.now().toString().slice(-4)}`,
      classId: cls.id,
      className: cls.name,
      category: cls.category as any,
      x: 0.50,
      y: 0.50,
      w: 0.12,
      h: 0.10,
      confidence: 0.98,
      status: cls.category === 'defect' ? 'fail' : 'pass',
      description: newBoxDesc,
    };

    setScenes(scenes.map((s) => s.id === activeScene.id ? { ...s, boxes: [...s.boxes, newBox] } : s));
    setSelectedBoxId(newBox.id);
    setIsAddingBox(false);
  };

  const handleDeleteBox = (boxId: string) => {
    setScenes(scenes.map((s) => s.id === activeScene.id ? { ...s, boxes: s.boxes.filter((b) => b.id !== boxId) } : s));
    if (selectedBoxId === boxId) setSelectedBoxId(null);
  };

  const downloadLabelsTxt = () => {
    const lines = visibleBoxes.map(
      (b) => `${b.classId} ${b.x.toFixed(4)} ${b.y.toFixed(4)} ${b.w.toFixed(4)} ${b.h.toFixed(4)}`
    ).join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeScene.id}_labels.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleBoxes = activeScene.boxes.filter(
    (b) => b.confidence >= confidenceThreshold && activeClasses.includes(b.classId)
  );

  const defectCount = visibleBoxes.filter((b) => b.category === 'defect').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">
              {isZh ? 'YOLO 视觉缺陷与目标质检工作台' : 'YOLO Defect & Label Inspection Workbench'}
            </h2>
            <p className="text-xs text-slate-400">
              {isZh ? '高精度包围盒交互检查、置信度阈值调谐与 YOLO 标定格式互通' : 'Interactive bounding box inspection, threshold tuning, and YOLO format export'}
            </p>
          </div>
        </div>

        {/* Scene Selector & Add Box Action */}
        <div className="flex items-center space-x-2">
          {scenes.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSceneChange(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentSceneId === s.id
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isZh ? s.nameZh : s.nameEn}
            </button>
          ))}

          <button
            onClick={() => setIsAddingBox(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isZh ? '添加标注' : 'Add Box'}</span>
          </button>
        </div>
      </div>

      {/* Add Box Modal */}
      {isAddingBox && (
        <div className="p-4 bg-slate-900 border border-cyan-500/40 rounded-xl space-y-3 animate-fadeIn">
          <div className="flex justify-between items-center text-xs font-bold text-white">
            <span>{isZh ? '手动追加新标注目标' : 'Add New Annotation Box'}</span>
            <button onClick={() => setIsAddingBox(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
          </div>
          <form onSubmit={handleAddBox} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">类别 (Class)</label>
              <select
                value={newBoxClassId}
                onChange={(e) => setNewBoxClassId(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                {DEFECT_CLASSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">缺陷描述 (Description)</label>
              <input
                type="text"
                value={newBoxDesc}
                onChange={(e) => setNewBoxDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                placeholder="例如: C102精密电容微偏移"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition cursor-pointer"
              >
                {isZh ? '确认添加并在画布上高亮' : 'Confirm & Highlight'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Inspection Canvas */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
          {/* Canvas Toolbar */}
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="font-semibold text-white">
                {isZh ? activeScene.nameZh : activeScene.nameEn}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono tabular-nums">
                {visibleBoxes.length} {isZh ? '个检出目标' : 'boxes'}
              </span>
              {defectCount > 0 && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-rose-400 font-mono tabular-nums font-bold">
                    {defectCount} {isZh ? '项缺陷异常' : 'defects'}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                title={isZh ? '放大' : 'Zoom In'}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                title={isZh ? '缩小' : 'Zoom Out'}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                title={isZh ? '重置缩放' : 'Reset Zoom'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono tabular-nums text-slate-400 text-[10px]">
                {(zoomLevel * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Interactive Inspection Canvas Container */}
          <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center p-4 select-none">
            <div
              className="relative w-full h-full max-w-2xl max-h-[460px] bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-inner transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Circuit Board Schematic Render Canvas */}
              <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
                <rect width="600" height="400" fill="#0b171c" />
                <path d="M 50 100 L 200 100 L 250 150 L 350 150 L 400 200 L 550 200" stroke="#0ea5e9" strokeWidth="2" opacity="0.35" />
                <path d="M 80 300 L 180 300 L 230 250 L 320 250 L 380 320 L 520 320" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.3" />
                <circle cx="192" cy="152" r="8" fill="#eab308" opacity="0.7" />
                <circle cx="212" cy="152" r="8" fill="#eab308" opacity="0.7" />
                <circle cx="348" cy="108" r="8" fill="#eab308" opacity="0.7" />
                <circle cx="368" cy="108" r="8" fill="#eab308" opacity="0.7" />
                <rect x="252" y="208" width="144" height="104" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                <text x="324" y="265" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="middle">
                  STM32F407
                </text>
                <ellipse cx="348" cy="108" rx="14" ry="7" fill="#f97316" opacity="0.4" />
              </svg>

              {/* Bounding Boxes Layer */}
              {visibleBoxes.map((box) => {
                const cls = DEFECT_CLASSES.find((c) => c.id === box.classId);
                const color = cls?.color || '#38bdf8';
                const isSelected = selectedBoxId === box.id;

                return (
                  <div
                    key={box.id}
                    onClick={() => setSelectedBoxId(box.id)}
                    className={`absolute border-2 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${box.x * 100}%`,
                      top: `${box.y * 100}%`,
                      width: `${box.w * 100}%`,
                      height: `${box.h * 100}%`,
                      borderColor: color,
                      backgroundColor: `${color}25`,
                    }}
                  >
                    <span className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-xs" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-xs" />
                    <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-xs" />
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-xs" />

                    <div
                      className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono tabular-nums font-bold text-white shadow whitespace-nowrap flex items-center space-x-1"
                      style={{ backgroundColor: color }}
                    >
                      <span>{cls?.displayName?.split(' ')[0]}</span>
                      <span className="bg-black/40 px-1 rounded text-[9px]">
                        {(box.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live YOLO Export View */}
          <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>{isZh ? '对应 YOLO 标定文件 (labels.txt) 实时导出预览' : 'Live YOLO Normalized Label Export'}</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={downloadLabelsTxt}
                  className="text-cyan-400 hover:text-cyan-300 transition text-[11px] cursor-pointer flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>{isZh ? '下载 labels.txt' : 'Download'}</span>
                </button>
                <button
                  onClick={() => setShowRawYoloCode(!showRawYoloCode)}
                  className="text-slate-400 hover:text-white transition text-[11px] cursor-pointer"
                >
                  {showRawYoloCode ? (isZh ? '收起' : 'Hide') : (isZh ? '展开查看' : 'Show Text')}
                </button>
              </div>
            </div>

            {showRawYoloCode && (
              <pre className="p-3 bg-slate-900 border border-slate-800 rounded font-mono tabular-nums text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
                {visibleBoxes
                  .map(
                    (b) =>
                      `${b.classId} ${b.x.toFixed(4)} ${b.y.toFixed(4)} ${b.w.toFixed(4)} ${b.h.toFixed(
                        4
                      )}  # ${b.className} (${b.description})`
                  )
                  .join('\n')}
              </pre>
            )}
          </div>
        </div>

        {/* Right Controls & Details Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Threshold Tuning Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 className="font-bold text-white text-xs flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{isZh ? '置信度与 NMS 动态调谐' : 'Confidence & NMS Tuning'}</span>
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>{isZh ? '最低置信度阈值 (Conf)' : 'Confidence Threshold'}:</span>
                <span className="font-mono tabular-nums text-cyan-300 font-bold">
                  {(confidenceThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.10 (高召回率)</span>
                <span>0.50</span>
                <span>0.95 (高精确率)</span>
              </div>
            </div>
          </div>

          {/* Class Filter Badges */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center space-x-2">
              <Tag className="w-4 h-4 text-cyan-400" />
              <span>{isZh ? '检测类别过滤开关' : 'Class Filter Toggles'}</span>
            </h3>

            <div className="space-y-1.5">
              {DEFECT_CLASSES.slice(0, 7).map((cls) => {
                const isActive = activeClasses.includes(cls.id);
                return (
                  <button
                    key={cls.id}
                    onClick={() => toggleClass(cls.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      isActive
                        ? 'bg-slate-800/90 text-white border-slate-700'
                        : 'bg-slate-950/60 text-slate-500 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cls.color }}
                      />
                      <span>{cls.displayName}</span>
                    </div>
                    <span className="text-[10px] font-mono tabular-nums text-slate-400">ID: {cls.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Box Diagnostics Card */}
          {selectedBoxId ? (
            (() => {
              const b = activeScene.boxes.find((item) => item.id === selectedBoxId);
              if (!b) return null;
              const cls = DEFECT_CLASSES.find((c) => c.id === b.classId);

              return (
                <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-4 space-y-3 shadow-lg shadow-cyan-950/20">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-cyan-300 text-xs">
                      {isZh ? '选定目标诊断属性' : 'Target Diagnostics'}
                    </span>
                    <button
                      onClick={() => setSelectedBoxId(null)}
                      className="text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      {isZh ? '取消选择' : 'Deselect'}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">类别:</span>
                      <span className="font-bold text-white">{cls?.displayName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">置信度:</span>
                      <span className="font-mono tabular-nums text-cyan-300 font-bold">
                        {(b.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">质检状态:</span>
                      <span
                        className={`font-semibold ${
                          b.status === 'fail' ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {b.status === 'fail' ? '缺陷不合格 (NG)' : '合格通过 (PASS)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">详情说明:</span>
                      <span className="text-slate-300 font-medium">{b.description}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 font-mono tabular-nums text-[11px] text-slate-400">
                      Center: ({b.x.toFixed(3)}, {b.y.toFixed(3)}) | Size: {b.w.toFixed(3)} x {b.h.toFixed(3)}
                    </div>

                    <button
                      onClick={() => handleDeleteBox(b.id)}
                      className="w-full py-1.5 mt-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-600/40 text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isZh ? '删除此标注框' : 'Delete Box'}</span>
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
              {isZh ? '在左侧画布上点击任意包围盒以查看详细坐标、编辑或删除' : 'Click any box on the canvas to inspect'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
