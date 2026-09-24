import React, { useState } from 'react';
import { 
  Flame, 
  Play, 
  BarChart2, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Radio, 
  RotateCcw,
  Sparkles,
  Download,
  FastForward,
  Check
} from 'lucide-react';
import { TrainingJob, Language } from '../../types/yolo';
import { INITIAL_TRAINING_JOBS } from '../../data/sampleData';

interface TrainingStudioViewProps {
  language: Language;
}

export const TrainingStudioView: React.FC<TrainingStudioViewProps> = ({ language }) => {
  const isZh = language === 'zh';
  const [jobs, setJobs] = useState<TrainingJob[]>(INITIAL_TRAINING_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0].id);

  // New Training Form States
  const [newJobName, setNewJobName] = useState('SMT-HighPrecision-V3');
  const [newBackbone, setNewBackbone] = useState<'YOLOv8n' | 'YOLOv8s' | 'YOLOv8m' | 'YOLOv8-pose'>('YOLOv8s');
  const [newEpochs, setNewEpochs] = useState<number>(100);
  const [newBatch, setNewBatch] = useState<number>(32);
  const [newDataset, setNewDataset] = useState('SMT_Defects_Clean_v3.4');
  const [isLaunching, setIsLaunching] = useState(false);
  const [activationMsg, setActivationMsg] = useState<string | null>(null);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const handleLaunchTraining = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);

    setTimeout(() => {
      const newJob: TrainingJob = {
        id: `job-${Date.now().toString().slice(-6)}`,
        name: newJobName,
        modelBackbone: newBackbone,
        taskType: newBackbone === 'YOLOv8-pose' ? 'action_recognition' : 'object_detection',
        datasetName: newDataset,
        epochs: newEpochs,
        currentEpoch: 1,
        batchSize: newBatch,
        imageSize: 640,
        status: 'running',
        progress: 1,
        map50: 0.52,
        map50_95: 0.35,
        precision: 0.55,
        recall: 0.50,
        lossHistory: [
          { epoch: 1, boxLoss: 2.10, clsLoss: 2.45, dflLoss: 1.80, map50: 0.52 }
        ]
      };
      setJobs([newJob, ...jobs]);
      setSelectedJobId(newJob.id);
      setIsLaunching(false);
    }, 600);
  };

  const handleStepEpochs = (stepCount: number) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id !== selectedJob.id) return job;
        const nextEpoch = Math.min(job.epochs, job.currentEpoch + stepCount);
        const progress = Math.min(100, Math.round((nextEpoch / job.epochs) * 100));
        const isFinished = nextEpoch >= job.epochs;

        // Generate loss steps
        const lastLoss = job.lossHistory[job.lossHistory.length - 1] || { boxLoss: 1.5, clsLoss: 1.6, dflLoss: 1.2, map50: 0.7 };
        const newLossHistory = [...job.lossHistory];
        for (let ep = job.currentEpoch + 1; ep <= nextEpoch; ep += Math.max(1, Math.floor(stepCount / 3))) {
          const ratio = ep / job.epochs;
          newLossHistory.push({
            epoch: ep,
            boxLoss: Math.max(0.4, Number((lastLoss.boxLoss * (1 - ratio * 0.4)).toFixed(3))),
            clsLoss: Math.max(0.3, Number((lastLoss.clsLoss * (1 - ratio * 0.45)).toFixed(3))),
            dflLoss: Math.max(0.5, Number((lastLoss.dflLoss * (1 - ratio * 0.35)).toFixed(3))),
            map50: Math.min(0.985, Number((0.55 + ratio * 0.43).toFixed(3))),
          });
        }

        return {
          ...job,
          currentEpoch: nextEpoch,
          progress,
          status: isFinished ? 'completed' : 'running',
          map50: Math.min(0.985, Number((0.55 + (nextEpoch / job.epochs) * 0.43).toFixed(3))),
          precision: Math.min(0.978, Number((0.60 + (nextEpoch / job.epochs) * 0.37).toFixed(3))),
          recall: Math.min(0.965, Number((0.58 + (nextEpoch / job.epochs) * 0.38).toFixed(3))),
          lossHistory: newLossHistory,
        };
      })
    );
  };

  const handleExportEngine = (job: TrainingJob) => {
    const blob = new Blob([`# TensorRT Engine Manifest for ${job.name}\nBackbone=${job.modelBackbone}\nPrecision=FP16\nmAP50=${job.map50}\nBatch=1`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.name}_fp16.engine`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportOnnx = (job: TrainingJob) => {
    const blob = new Blob([`# ONNX Model weights manifest for ${job.name}\nBackbone=${job.modelBackbone}\nPrecision=FP32`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.name}.onnx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeployModel = (job: TrainingJob) => {
    setActivationMsg(
      isZh
        ? `模型 [${job.name}] 已成功激活为权重主干，并已同步热更新至 SMT-01 及 ASSY-02 产线边缘相机！`
        : `Model [${job.name}] successfully deployed to Edge Cameras SMT-01 & ASSY-02!`
    );
    setTimeout(() => setActivationMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-rose-950 border border-rose-500/30 text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">
              {isZh ? '模型训练与多维评估中心 (Training Studio)' : 'YOLO Model Training & Evaluation Studio'}
            </h2>
            <p className="text-xs text-slate-400">
              {isZh
                ? '自主超参数调优 · 损失收敛曲线监控 · mAP@0.5 精确率评估 · 产线边缘一键激活下发'
                : 'Custom hyperparameter training, loss convergence monitoring, mAP evaluation, and 1-click edge deployment.'}
            </p>
          </div>
        </div>
      </div>

      {activationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{activationMsg}</span>
        </div>
      )}

      {/* Main Grid: Jobs list & Loss Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Jobs List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white text-xs">
                {isZh ? '训练任务列表' : 'Training Jobs Queue'}
              </span>
              <span className="text-slate-400 text-[11px] font-mono tabular-nums">{jobs.length} 任务</span>
            </div>

            <div className="space-y-2.5">
              {jobs.map((job) => {
                const isSelected = selectedJobId === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white truncate max-w-[180px]">{job.name}</span>
                      <span className="text-[11px] font-medium">
                        {job.status === 'completed' ? (
                          <span className="text-emerald-400 font-mono">● 已收敛</span>
                        ) : (
                          <span className="text-amber-400 font-mono animate-pulse">● 训练中</span>
                        )}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mb-2">
                      {job.modelBackbone} · {job.datasetName.split(' ')[0]}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-500"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>Epoch: {job.currentEpoch}/{job.epochs}</span>
                      <span className="text-cyan-300 font-bold">mAP50: {(job.map50 * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Launch New Job Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{isZh ? '新建模型训练任务' : 'Configure New Training'}</span>
            </h3>

            <form onSubmit={handleLaunchTraining} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">模型名称:</label>
                <input
                  type="text"
                  value={newJobName}
                  onChange={(e) => setNewJobName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">骨干网络 (Backbone):</label>
                  <select
                    value={newBackbone}
                    onChange={(e) => setNewBackbone(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white"
                  >
                    <option value="YOLOv8n">YOLOv8n (轻量-超高帧率)</option>
                    <option value="YOLOv8s">YOLOv8s (推荐-均衡)</option>
                    <option value="YOLOv8m">YOLOv8m (高精度大模型)</option>
                    <option value="YOLOv8-pose">YOLOv8-pose (骨骼动作)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">训练轮数 (Epochs):</label>
                  <input
                    type="number"
                    value={newEpochs}
                    onChange={(e) => setNewEpochs(parseInt(e.target.value))}
                    min={10}
                    max={500}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white font-mono tabular-nums"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLaunching}
                className="w-full py-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-semibold rounded-lg shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isLaunching ? (isZh ? '初始化中...' : 'Launching...') : (isZh ? '🚀 启动 GPU 训练集群' : 'Start Training')}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Selected Job Diagnostics & Chart */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5 shadow-xl">
            {/* Job Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="font-bold text-white text-base">{selectedJob.name}</h3>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">({selectedJob.modelBackbone})</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  数据集: <span className="text-slate-300 font-mono">{selectedJob.datasetName}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedJob.status === 'running' && (
                  <button
                    onClick={() => handleStepEpochs(10)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>{isZh ? '演进 10 Epochs' : 'Step 10'}</span>
                  </button>
                )}

                <button
                  onClick={() => handleExportEngine(selectedJob)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.engine</span>
                </button>

                <button
                  onClick={() => handleExportOnnx(selectedJob)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.onnx</span>
                </button>

                <button
                  onClick={() => handleDeployModel(selectedJob)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isZh ? '部署至产线相机' : 'Deploy to Edge'}</span>
                </button>
              </div>
            </div>

            {/* Metrics KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block mb-1">mAP@0.5</span>
                <span className="font-mono tabular-nums text-lg font-bold text-cyan-300">
                  {(selectedJob.map50 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block mb-1">mAP@0.5:0.95</span>
                <span className="font-mono tabular-nums text-lg font-bold text-indigo-300">
                  {(selectedJob.map50_95 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block mb-1">精确率 (Precision)</span>
                <span className="font-mono tabular-nums text-lg font-bold text-emerald-400">
                  {(selectedJob.precision * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block mb-1">召回率 (Recall)</span>
                <span className="font-mono tabular-nums text-lg font-bold text-amber-400">
                  {(selectedJob.recall * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Loss Convergence Chart SVG */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <span>{isZh ? '训练损失与精确率收敛轨迹 (Training Curve)' : 'Loss & Accuracy Convergence'}</span>
                </span>
                <div className="flex items-center space-x-4 text-[11px]">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
                    <span className="text-slate-300">mAP@0.5</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded bg-rose-400" />
                    <span className="text-slate-300">Box Loss</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-400" />
                    <span className="text-slate-300">Cls Loss</span>
                  </span>
                </div>
              </div>

              <div className="h-56 bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
                {/* SVG Line Chart */}
                <div className="relative w-full h-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

                    {/* mAP Curve (Cyan - ascending) */}
                    <path
                      d={selectedJob.lossHistory
                        .map((pt, idx) => {
                          const x = (idx / Math.max(1, selectedJob.lossHistory.length - 1)) * 480 + 10;
                          const y = 150 - pt.map50 * 130;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                    />

                    {/* Box Loss Curve (Rose - descending) */}
                    <path
                      d={selectedJob.lossHistory
                        .map((pt, idx) => {
                          const x = (idx / Math.max(1, selectedJob.lossHistory.length - 1)) * 480 + 10;
                          const y = 20 + pt.boxLoss * 45;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />

                    {/* Cls Loss Curve (Amber - descending) */}
                    <path
                      d={selectedJob.lossHistory
                        .map((pt, idx) => {
                          const x = (idx / Math.max(1, selectedJob.lossHistory.length - 1)) * 480 + 10;
                          const y = 25 + pt.clsLoss * 40;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono tabular-nums pt-1 border-t border-slate-900">
                  <span>Epoch 1</span>
                  <span>Epoch {Math.floor(selectedJob.epochs / 2)}</span>
                  <span>Epoch {selectedJob.epochs}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
