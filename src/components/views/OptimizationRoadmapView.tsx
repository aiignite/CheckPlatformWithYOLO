import React from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Zap, 
  ArrowRight, 
  Target, 
  AlertTriangle,
  Download,
  Rocket
} from 'lucide-react';
import { Language } from '../../types/yolo';

interface OptimizationRoadmapViewProps {
  language: Language;
  onNavigateToImplementation?: () => void;
}

export const OptimizationRoadmapView: React.FC<OptimizationRoadmapViewProps> = ({ 
  language,
  onNavigateToImplementation,
}) => {
  const isZh = language === 'zh';

  const exportPlan = () => {
    const content = `# YoloCheck 系统优化与分阶段实施方案规划
发布版本: v2.6-Plan
规划周期: 8周 (4个实施阶段)

## 阶段目标总览
- 阶段一 (第1-2周): 架构解耦与边缘轻量化 (ONNX / TensorRT + WebSocket)
- 阶段二 (第3-4周): 数据质量与标定自动化治理 (YOLO 数据集体检与一键纠错)
- 阶段三 (第5-6周): 视频施教学习与交互标注闭环 (Web 端姿态关键帧自研微调画布)
- 阶段四 (第7-8周): 工业高可用、云边断网续传与 PLC 硬件联动 (72h 离线存活)

...
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YoloCheck_Optimization_Roadmap_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const phases = [
    {
      phase: '阶段一 (第 1 - 2 周)',
      titleZh: '架构解耦与边缘算力加速 (Edge Acceleration)',
      titleEn: 'Decoupling & Edge Lightweighting',
      color: 'border-cyan-500/40 bg-cyan-950/20',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
      milestones: [
        '边缘推理引擎全面支持 TensorRT FP16 / ONNX-Runtime，单帧推理延迟由 18ms 压降至 8.5ms；',
        '将原先的轮询请求升级为全双工 WebSocket 与 MQTT QoS 1 混合推流，减少 70% HTTP 开销；',
        '完成前端 React 19 + Tailwind 精益重构，包体积减少 45%，首屏渲染由 2.4s 提速至 0.6s；',
        '补齐 tasks.md 第 5 项中遗留的前端单测用例与 i18n 缺失字典。'
      ]
    },
    {
      phase: '阶段二 (第 3 - 4 周)',
      titleZh: '数据集体检治理与标注闭环 (Dataset Governance)',
      titleEn: 'Dataset Health & Auto-Repair Tooling',
      color: 'border-emerald-500/40 bg-emerald-950/20',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
      milestones: [
        '内嵌 YOLO 数据集体检器，自动捕获坐标越界 [0, 1]、负宽度、零面积、非法标签行；',
        '提供一键自动边界钳位 (Clamping) 与数据清洗导出工具，杜绝训练崩溃；',
        '集成 Albumentations 工业合成数据增强（高斯模糊、贴片反光、反向阴影模拟）；',
        '建立标注样本版本树 (Dataset V1 -> V2)，支持增量标注热更新。'
      ]
    },
    {
      phase: '阶段三 (第 5 - 6 周)',
      titleZh: '视频施教工作台交互升级 (Interactive Teach-in)',
      titleEn: 'Video SOP & Interactive Teach-in Studio',
      color: 'border-indigo-500/40 bg-indigo-950/20',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-500/40',
      milestones: [
        '在视频学习中增加在线交互式拖拽微调画布，允许现场班长直接拉框修正漏检元件；',
        'YOLOv8-pose 骨骼关键点时间序列聚类，自动匹配标准动作模板（误差容忍度可设）；',
        '一键生成符合工厂现场标准的图文版《标准作业指导书 (SOP.pdf)》；',
        '实现"施教视频 -> 关键帧提取 -> 框体校验 -> 模型训练 -> 相机部署"全流程 15 分钟闭环。'
      ]
    },
    {
      phase: '阶段四 (第 7 - 8 周)',
      titleZh: '云边协同与工业高可用硬化 (Industrial Resiliency)',
      titleEn: 'Production HA & Edge-Cloud Resiliency',
      color: 'border-amber-500/40 bg-amber-950/20',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-500/40',
      milestones: [
        '边缘工控机配置本地 SQLite 双写暂存，支持断网离线连续运行 72 小时无损；',
        '网络恢复后采用后台静默断点续传同步至云端 PostgreSQL；',
        '接入 Modbus-TCP / OPC-UA 工业总线协议，支持与西门子/三菱 PLC 进行声光报警急停联锁；',
        '通过 7×24 小时极限拷机测试与工业电磁干扰 (EMC) 场景标定。'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">
              {isZh ? 'YoloCheck 深度优化与分阶段实施落地路线图' : 'Optimization & Phased Implementation Roadmap'}
            </h2>
            <p className="text-xs text-slate-400">
              {isZh
                ? '针对现有代码库痛点制定 8 周 4 阶段落地计划 · 量化指标保障工业级稳定可靠'
                : '8-week phased execution plan addressing architectural bottlenecks and driving production readiness.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {onNavigateToImplementation && (
            <button
              onClick={onNavigateToImplementation}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 transition cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>{isZh ? '进入阶段落地工程控制台' : 'Open Phase Console'}</span>
            </button>
          )}

          <button
            onClick={exportPlan}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isZh ? '导出规划书' : 'Export .MD'}</span>
          </button>
        </div>
      </div>

      {/* Quantitative KPI Targets Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center space-x-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <span>{isZh ? '优化实施量化验收指标对比 (Before vs After)' : 'Quantitative Deliverables & Metrics Matrix'}</span>
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-2.5 px-3">关键工程指标</th>
                <th className="py-2.5 px-3">当前版本现状 (Current)</th>
                <th className="py-2.5 px-3">优化后目标 (Target)</th>
                <th className="py-2.5 px-3">核心改进措施</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">单帧端到端推理时延</td>
                <td className="py-2.5 px-3 font-mono text-amber-400">18.5 ms (Python PyTorch)</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400">&lt; 8.5 ms (TensorRT FP16)</td>
                <td className="py-2.5 px-3 text-slate-400">C++ ONNX/TensorRT 加速层集成</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">新模型施教到部署周期</td>
                <td className="py-2.5 px-3 font-mono text-amber-400">3 ~ 5 工作日 (人工抓图标定)</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400">&lt; 4 小时 (全自动施教管线)</td>
                <td className="py-2.5 px-3 text-slate-400">视频学习工作台 + 一键微调下发</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">标注数据越界崩溃率</td>
                <td className="py-2.5 px-3 font-mono text-rose-400">约 6.5% 训练中途报越界</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400">0.0% (零崩溃阻断)</td>
                <td className="py-2.5 px-3 text-slate-400">集成 YOLO 数据集体检器与自动钳位</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">网络偶发中断生存期</td>
                <td className="py-2.5 px-3 font-mono text-rose-400">直接报错中断告警</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400">&gt; 72 小时本地无损缓冲</td>
                <td className="py-2.5 px-3 text-slate-400">边缘 SQLite 双写队列 + 异步断点续传</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Phased Implementation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {phases.map((p, idx) => (
          <div key={idx} className={`border rounded-xl p-5 space-y-3.5 shadow-lg ${p.color}`}>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${p.badgeColor}`}>
                {p.phase}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Milestone M{idx + 1}</span>
            </div>

            <h3 className="font-bold text-white text-base">
              {isZh ? p.titleZh : p.titleEn}
            </h3>

            <ul className="space-y-2 text-xs text-slate-300">
              {p.milestones.map((m, mIdx) => (
                <li key={mIdx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
