import React, { useState } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  Layers, 
  Sparkles, 
  Download, 
  Edit3,
  Flame,
  Activity,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import { VideoLearningStep, Language } from '../../types/yolo';
import { SOP_LEARNING_STEPS } from '../../data/sampleData';

interface VideoLearningViewProps {
  language: Language;
}

export const VideoLearningView: React.FC<VideoLearningViewProps> = ({ language }) => {
  const isZh = language === 'zh';
  const [steps, setSteps] = useState<VideoLearningStep[]>(SOP_LEARNING_STEPS);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(1.8);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [exportSuccessNotice, setExportSuccessNotice] = useState<string | null>(null);
  const [isEditingStep, setIsEditingStep] = useState<boolean>(false);

  const activeStep = steps[activeStepIndex] || steps[0];
  const totalDuration = 19.8;

  const handleStepSelect = (index: number) => {
    setActiveStepIndex(index);
    if (steps[index]) {
      setCurrentTime(steps[index].keyframeTime);
    }
  };

  const handleAddStep = () => {
    const dur = 3.5;
    const newStep: VideoLearningStep = {
      id: `step-${Date.now().toString().slice(-4)}`,
      stepOrder: steps.length + 1,
      actionName: isZh ? '自定装配验证工步' : 'Custom Assembly Step',
      description: isZh ? '现场新增自定义工步动作' : 'Operator custom verified action',
      startTime: Number(currentTime.toFixed(1)),
      endTime: Number((currentTime + dur).toFixed(1)),
      duration: dur,
      durationSeconds: dur,
      keyframeTime: Number(currentTime.toFixed(1)),
      confidence: 0.94,
      status: 'verified',
      objectsInvolved: ['pcb_board', 'tweezers'],
      detectedObjects: ['pcb_board', 'tweezers'],
      operatorPose: {
        posture: 'standing',
        handCoord: [0.5, 0.5],
        keypoints: [[0.5, 0.5, 0.9]],
      },
      isStandard: true,
      notes: 'Custom verified step',
      standardToleranceSec: 1.0,
      workerId: 'OP-4102',
    };
    setSteps([...steps, newStep]);
    setActiveStepIndex(steps.length);
  };

  const handleUpdateCurrentStep = (name: string, duration: number, tolerance: number) => {
    setSteps(
      steps.map((s, idx) =>
        idx === activeStepIndex
          ? {
              ...s,
              actionName: name,
              duration: duration,
              durationSeconds: duration,
              standardToleranceSec: tolerance,
            }
          : s
      )
    );
    setIsEditingStep(false);
  };

  const handleDeleteCurrentStep = (index: number) => {
    if (steps.length <= 1) return;
    const next = steps.filter((_, idx) => idx !== index).map((s, i) => ({ ...s, stepOrder: i + 1 }));
    setSteps(next);
    setActiveStepIndex(Math.max(0, index - 1));
  };

  const handleExportToAnnotationSet = () => {
    setExportSuccessNotice(
      isZh
        ? `已成功将当前视频会话的 ${steps.length} 个关键工步与标准时序基准导出至「SMT作业指导书 SOP-SMT-0042」！`
        : `Successfully exported ${steps.length} SOP steps & timing benchmarks to SOP-SMT-0042!`
    );
    setTimeout(() => setExportSuccessNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">
              {isZh ? '视频学习与SOP施教工作台 (Teach-by-Demonstration)' : 'Video Learning & SOP Teaching Workbench'}
            </h2>
            <p className="text-xs text-slate-400">
              {isZh
                ? '专家标准操作示范录像解析 · YOLOv8-pose 姿态骨骼追踪 · 动作工步自动聚类与时序基准'
                : 'Ingest expert demonstration videos, trace pose skeletons, and generate automated SOP action steps.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddStep}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isZh ? '新增工步' : 'Add Step'}</span>
          </button>
          <button
            onClick={handleExportToAnnotationSet}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>{isZh ? '导出SOP标准库' : 'Export SOP'}</span>
          </button>
        </div>
      </div>

      {exportSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportSuccessNotice}</span>
        </div>
      )}

      {/* Main Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Player & Pose Canvas */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-200">
                TEMPLATE: SMT贴片高精施教标准母带 (4K-60FPS)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSkeleton(!showSkeleton)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition cursor-pointer ${
                  showSkeleton
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {showSkeleton ? (isZh ? '骨骼点: 开启' : 'Pose: On') : (isZh ? '骨骼点: 关闭' : 'Pose: Off')}
              </button>
            </div>
          </div>

          {/* Video Player Mock with Pose Estimation Skeleton Overlay */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden select-none">
            <svg className="w-full h-full" viewBox="0 0 640 360" fill="none">
              <rect width="640" height="360" fill="#090d16" />
              <rect x="120" y="160" width="400" height="180" rx="6" fill="#131b2e" stroke="#1e293b" strokeWidth="2" />
              <rect x="180" y="180" width="280" height="130" rx="4" fill="#064e3b" opacity="0.6" stroke="#059669" strokeWidth="1" />
              <rect x="270" y="210" width="100" height="70" rx="3" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1.5" />

              <circle cx="320" cy="90" r="30" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <path d="M 280 140 C 290 120 350 120 360 140 L 370 200 L 270 200 Z" fill="#1e293b" />

              {showSkeleton && (
                <g className="animate-pulse">
                  <circle cx="320" cy="90" r="5" fill="#38bdf8" />
                  <line x1="320" y1="90" x2="320" y2="135" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="280" cy="135" r="5" fill="#38bdf8" />
                  <circle cx="360" cy="135" r="5" fill="#38bdf8" />
                  <line x1="280" y1="135" x2="360" y2="135" stroke="#38bdf8" strokeWidth="2" />

                  {activeStepIndex === 0 && (
                    <>
                      <line x1="280" y1="135" x2="250" y2="185" stroke="#22c55e" strokeWidth="2.5" />
                      <circle cx="250" cy="185" r="5" fill="#22c55e" />
                      <line x1="250" y1="185" x2="270" y2="220" stroke="#22c55e" strokeWidth="2.5" />
                      <circle cx="270" cy="220" r="6" fill="#facc15" />
                      <line x1="360" y1="135" x2="380" y2="185" stroke="#22c55e" strokeWidth="2.5" />
                      <circle cx="380" cy="185" r="5" fill="#22c55e" />
                      <line x1="380" y1="185" x2="370" y2="220" stroke="#22c55e" strokeWidth="2.5" />
                      <circle cx="370" cy="220" r="6" fill="#facc15" />
                    </>
                  )}

                  {activeStepIndex === 1 && (
                    <>
                      <line x1="280" y1="135" x2="240" y2="165" stroke="#38bdf8" strokeWidth="2.5" />
                      <circle cx="240" cy="165" r="5" fill="#38bdf8" />
                      <line x1="240" y1="165" x2="260" y2="195" stroke="#38bdf8" strokeWidth="2.5" />
                      <circle cx="260" cy="195" r="6" fill="#38bdf8" />
                      <line x1="360" y1="135" x2="365" y2="190" stroke="#38bdf8" strokeWidth="2" />
                      <circle cx="365" cy="190" r="5" fill="#38bdf8" />
                    </>
                  )}

                  {activeStepIndex >= 2 && (
                    <>
                      <line x1="280" y1="135" x2="295" y2="180" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx="295" cy="180" r="5" fill="#a855f7" />
                      <line x1="295" y1="180" x2="310" y2="215" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx="310" cy="215" r="6" fill="#ec4899" />
                      <line x1="360" y1="135" x2="345" y2="180" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx="345" cy="180" r="5" fill="#a855f7" />
                      <line x1="345" y1="180" x2="330" y2="215" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx="330" cy="215" r="6" fill="#ec4899" />
                    </>
                  )}
                </g>
              )}
            </svg>

            <div className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded text-xs font-mono tabular-nums text-cyan-400 border border-cyan-500/20">
              FRAME #{Math.floor(currentTime * 30)} · {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
            </div>

            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-xs flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">步骤 {activeStep.stepOrder}: {activeStep.actionName}</span>
              <span className="text-cyan-400 font-mono tabular-nums">({(activeStep.confidence * 100).toFixed(0)}% 置信度)</span>
            </div>
          </div>

          {/* Timeline Playback Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="上一步工序"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="下一步工序"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Range Slider */}
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.1"
                value={currentTime}
                onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                className="flex-1 accent-cyan-500 cursor-pointer"
              />

              <span className="font-mono tabular-nums text-xs text-slate-400 w-16 text-right">
                {currentTime.toFixed(1)}s
              </span>
            </div>
          </div>
        </div>

        {/* Right: Detected Action Steps Flow */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>{isZh ? '自动聚类动作工序列表' : 'Auto-Segmented SOP Steps'}</span>
              </span>
              <span className="text-slate-400 text-[11px] font-mono tabular-nums">
                共 {steps.length} 个工步
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {steps.map((step, idx) => {
                const isSelected = idx === activeStepIndex;
                return (
                  <div
                    key={step.id}
                    onClick={() => handleStepSelect(idx)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono tabular-nums font-bold text-cyan-400">
                          #{step.stepOrder}
                        </span>
                        <span className="font-bold text-white">{step.actionName}</span>
                      </div>
                      <span className="font-mono tabular-nums text-slate-400 text-[11px]">
                        {(step.durationSeconds ?? step.duration).toFixed(1)}s (±{step.standardToleranceSec ?? 0.5}s)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>关节点追踪置信度: <strong className="text-emerald-400 font-mono tabular-nums">{(step.confidence * 100).toFixed(0)}%</strong></span>
                      <span className="font-mono tabular-nums">关键帧: {step.keyframeTime}s</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Step Edit Card */}
          {activeStep && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">
                  {isZh ? `工步 #${activeStep.stepOrder} 参数调谐` : `Step #${activeStep.stepOrder} Editor`}
                </span>
                {steps.length > 1 && (
                  <button
                    onClick={() => handleDeleteCurrentStep(activeStepIndex)}
                    className="text-rose-400 hover:text-rose-300 text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isZh ? '删除' : 'Delete'}</span>
                  </button>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">工步动作名称:</label>
                  <input
                    type="text"
                    value={activeStep.actionName}
                    onChange={(e) =>
                      handleUpdateCurrentStep(
                        e.target.value,
                        activeStep.durationSeconds ?? activeStep.duration,
                        activeStep.standardToleranceSec ?? 0.5
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">标准节拍时长 (秒):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={activeStep.durationSeconds ?? activeStep.duration}
                      onChange={(e) =>
                        handleUpdateCurrentStep(
                          activeStep.actionName,
                          parseFloat(e.target.value) || 1,
                          activeStep.standardToleranceSec ?? 0.5
                        )
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">允许偏差公差 (秒):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={activeStep.standardToleranceSec ?? 0.5}
                      onChange={(e) =>
                        handleUpdateCurrentStep(
                          activeStep.actionName,
                          activeStep.durationSeconds ?? activeStep.duration,
                          parseFloat(e.target.value) || 0.5
                        )
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white font-mono tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
