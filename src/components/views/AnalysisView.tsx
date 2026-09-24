import React, { useState } from 'react';
import { 
  FileText, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  GitBranch, 
  Database, 
  Activity, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Workflow
} from 'lucide-react';
import { Language } from '../../types/yolo';

interface AnalysisViewProps {
  language: Language;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ language }) => {
  const isZh = language === 'zh';
  const [activeTab, setActiveTab] = useState<'architecture' | 'modules' | 'codebase' | 'bottlenecks'>('architecture');

  const exportReport = () => {
    const reportText = `# YoloCheck 项目深度功能分析与技术评估报告
生成时间: 2026-09-24
代码仓库: https://github.com/aiignite/YoloCheck.git

## 一、系统概述
YoloCheck 是一个基于 YOLO 计算机视觉深度学习的工业制造全流程监控与自主学习系统，覆盖电子制造（SMT）、装配生产线、仓储物流三大核心工业场景，实现质量检测、工时效率、视频培训学习、安全监控与数据统计五大核心功能。

## 二、架构设计
- 本地工控机/PC (Edge): 负责 GigE/RTSP 视频采集、实时 YOLOv8/YOLOv8-pose 推理、声光本地急停告警、轻量数据暂存。
- 云端中台 (Cloud): 基于 FastAPI 后端、PostgreSQL 数据库、EMQX MQTT 实时事件流、React + Tailwind / AntD 前端中枢、模型重训管线。
...
`;
    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YoloCheck_Deep_Analysis_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-3">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>https://github.com/aiignite/YoloCheck.git</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {isZh ? 'YoloCheck 深度功能剖析与技术架构全景' : 'YoloCheck Deep Functional Analysis & Architecture Panorama'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              {isZh
                ? '系统基于 YOLO 视觉推理引擎与视频学习工作流，将计算机视觉深度融合于 SMT 电子制造、自动化装配和工业安全监控，形成从施教、标注、训练、质检到 MES 闭环的完整工业中枢。'
                : 'Deep inspection of the YoloCheck platform: bridging edge vision inference, teaching-by-demonstration video learning, custom model training, and industrial MES closed-loop quality control.'}
            </p>
          </div>

          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 transition cursor-pointer self-start lg:self-center"
          >
            <Download className="w-4 h-4" />
            <span>{isZh ? '导出完整分析报告 (.MD)' : 'Export Full Report (.MD)'}</span>
          </button>
        </div>

        {/* Quick Nav Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800/80">
          {[
            { id: 'architecture', labelZh: '1. 总体架构与数据流', labelEn: '1. Architecture & Data Flow', icon: Layers },
            { id: 'modules', labelZh: '2. 五大业务功能模块', labelEn: '2. 5 Core Functional Pillars', icon: ShieldCheck },
            { id: 'codebase', labelZh: '3. 核心代码库与API拓扑', labelEn: '3. Codebase & API Topology', icon: Database },
            { id: 'bottlenecks', labelZh: '4. 现状痛点与优化瓶颈', labelEn: '4. Bottlenecks & Gaps Identified', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  active
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{isZh ? tab.labelZh : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Edge Component */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {isZh ? '边缘侧：本地工控机 / 普通 PC (Edge Host)' : 'Edge Host: Industrial PC / Workstation'}
                    </h3>
                    <p className="text-xs text-slate-400">Ubuntu 22.04 / Windows + RTX 3060 / GTX 1650</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-600/30">
                  4~15 TOPS
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">工业相机与 RTSP 硬件接入:</span> 支持海康 GigE (MV-CA013)、大华 RTSP 网络摄像头与工业 USB 相机低延迟拉流。
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">实时推理引擎 (YOLO Engine):</span> 基于 Ultralytics YOLOv8 / YOLOv8-pose，进行 30~60 FPS 实时目标与骨骼推断，结合 NMS 滤波。
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">毫秒级本地告警急停:</span> 人员越界或关键元件缺失时，边缘直接触发声光蜂鸣与继电器急停，无需等待云端返回。
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">MQTT 异步事件轻量上报:</span> 仅传输检测事件元数据 (JSON)、置信度与异常抓拍图，极低网络带宽占用。
                  </div>
                </li>
              </ul>
            </div>

            {/* Cloud Component */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {isZh ? '云端侧：业务协同与智能中枢 (Cloud Platform)' : 'Cloud Platform: Fast & Central Hub'}
                    </h3>
                    <p className="text-xs text-slate-400">FastAPI + PostgreSQL + EMQX MQTT + React</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-600/30">
                  Cloud Native
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">视频施教与学习工作台 (Video Learning):</span> 上传师傅标准操作视频，自动拆解关键工步、提取关键帧，标注姿态与动作序列。
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">一键训练与评估流 (Training Pipeline):</span> 自动汇聚学习标注样本，启动后台 YOLO 训练任务，生成损失曲线与混淆矩阵。
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">MES 生产与 OEE 大屏统计:</span> 采集生产节拍 (Cycle Time)、良品率、设备综合效率 (OEE) 以及工序瓶颈热力图。
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">告警分发工单与审计:</span> Critical/Warning/Info 三级流转，支持钉钉/企业微信/邮件与审计日志追溯。
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Data Flow Diagram Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
            <h3 className="font-bold text-white text-base mb-3 flex items-center space-x-2">
              <Workflow className="w-4 h-4 text-cyan-400" />
              <span>{isZh ? '端到端闭环数据流向全景' : 'End-to-End Data Pipeline'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-center">
                <div className="text-cyan-400 font-bold">1. 视觉输入</div>
                <div className="text-[11px] text-slate-300">工业相机 (GigE) / 网络摄像头 (RTSP)</div>
                <div className="text-[10px] text-slate-400 font-mono">1080P/5MP @ 30fps</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-center">
                <div className="text-blue-400 font-bold">2. 边缘推理</div>
                <div className="text-[11px] text-slate-300">YOLOv8 缺陷/物体/骨骼推断 + NMS</div>
                <div className="text-[10px] text-slate-400 font-mono">&lt; 15ms / frame</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-center">
                <div className="text-amber-400 font-bold">3. 边端决策</div>
                <div className="text-[11px] text-slate-300">置信度过滤 + 规则判定 + 本地急停</div>
                <div className="text-[10px] text-slate-400 font-mono">毫秒级硬件 I/O 触发</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-center">
                <div className="text-indigo-400 font-bold">4. 消息同步</div>
                <div className="text-[11px] text-slate-300">EMQX MQTT 发布检测事件 / 告警 payload</div>
                <div className="text-[10px] text-slate-400 font-mono">QoS 1 低延迟可靠流</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-center">
                <div className="text-emerald-400 font-bold">5. 云端聚合与自迭代</div>
                <div className="text-[11px] text-slate-300">PostgreSQL 归档 + 看板展示 + 模型再训练</div>
                <div className="text-[10px] text-slate-400 font-mono">闭环自学习优化</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 5 Functional Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>1. 质量控制 (Quality Control)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              专门针对 SMT 贴片与装配线常见缺陷的高精检测：
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-200">元件缺失:</strong> 识别贴片阻容、IC、连接器漏焊</li>
              <li><strong className="text-slate-200">连锡/虚焊:</strong> 识别引脚短路与焊锡不足</li>
              <li><strong className="text-slate-200">极性反接:</strong> 识别二极管、电解电容丝印方向错误</li>
              <li><strong className="text-slate-200">异物杂质:</strong> 识别产线杂物、毛刺与焊渣脱落</li>
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span>2. 视频学习与施教 (Video Learning)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              革命性的"师傅操作示范，AI 自主施教学徒"系统：
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-200">动作智能拆解:</strong> 基于 YOLOv8-pose 识别手部取料、定位、吹尘、焊接等动作</li>
              <li><strong className="text-slate-200">关键帧提取:</strong> 场景突变打分，自动截取工序转折画面</li>
              <li><strong className="text-slate-200">SOP 模板生成:</strong> 自动将视频转为标准化操作说明书</li>
              <li><strong className="text-slate-200">一键沉淀标注集:</strong> 自动把关键帧物体和动作转化为训练集</li>
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>3. 模型训练与评估 (Training & Eval)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              无需算法工程师介入的零代码模型自训练闭环：
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-200">多骨干支持:</strong> YOLOv8n / YOLOv8s / YOLOv8m / YOLOv8-pose</li>
              <li><strong className="text-slate-200">实时训练曲线:</strong> Box Loss, Cls Loss, DFL Loss, mAP@0.5 实时刷新</li>
              <li><strong className="text-slate-200">多版本横向对比:</strong> 精度、召回率、推理时延对比矩阵</li>
              <li><strong className="text-slate-200">一键激活下发:</strong> 点击即可将新模型部署至指定相机</li>
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>4. 工业安全监控 (Safety & PPE)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              保障重载机械臂、高温区与仓储物流人身安全：
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-200">PPE 穿戴检测:</strong> 安全帽、反光背心、防静电服实时识别</li>
              <li><strong className="text-slate-200">电子围栏越界:</strong> 危险机械臂回转半径警戒线违规入侵</li>
              <li><strong className="text-slate-200">危险动作识别:</strong> 人员摔倒、异常攀爬与奔跑检测</li>
              <li><strong className="text-slate-200">急停联动:</strong> 毫秒级声光警报与 PLC 急停联锁</li>
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>5. 生产统计与效率 MES (MES & OEE)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              打通工业 MES 系统的数据分析看板：
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-200">工时节拍分析:</strong> 实际 Cycle Time vs 标准 Cycle Time 偏差对比</li>
              <li><strong className="text-slate-200">瓶颈工位定位:</strong> 识别堆叠等待与产线节拍脱节节点</li>
              <li><strong className="text-slate-200">OEE 综合效率:</strong> 可用率 (Availability) × 表现指数 × 质量指数</li>
              <li><strong className="text-slate-200">自动报表导出:</strong> 日报、周报、月报一键导出</li>
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-violet-400 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
              <span>6. 告警处置与工单工作流 (Alerts)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              标准闭环工单响应与企业微信/钉钉联动：
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-200">三级告警流转:</strong> Critical (紧急), Warning (警告), Info (提示)</li>
              <li><strong className="text-slate-200">SOP 应急指引:</strong> 触发告警时自动推荐排查指南</li>
              <li><strong className="text-slate-200">处置责任认领:</strong> 班组长认领、核实、处置与关闭</li>
              <li><strong className="text-slate-200">审计追踪归档:</strong> 完整操作留痕与责任倒查</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Codebase & APIs */}
      {activeTab === 'codebase' && (
        <div className="space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h3 className="font-bold text-white text-sm mb-3">
              {isZh ? '后端主要 API 端点矩阵 (FastAPI + SQLAlchemy)' : 'Backend API Matrix (FastAPI)'}
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                    <th className="py-2.5 px-3">路由文件 (Router)</th>
                    <th className="py-2.5 px-3">基础路径 (Base Path)</th>
                    <th className="py-2.5 px-3">核心业务功能职责</th>
                    <th className="py-2.5 px-3">技术要点</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  <tr>
                    <td className="py-2 px-3 text-cyan-400">video_learning.py</td>
                    <td className="py-2 px-3">/api/video-templates</td>
                    <td className="py-2 px-3 font-sans">视频模板管理、帧分解、动作序列识别、SOP生成</td>
                    <td className="py-2 px-3">FFmpeg 抽帧 + YOLOv8-pose 骨骼检测</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-cyan-400">video_training.py</td>
                    <td className="py-2 px-3">/api/video-training</td>
                    <td className="py-2 px-3 font-sans">标注集管理、从学习会话导入标注、后台训练任务</td>
                    <td className="py-2 px-3">Celery/BackgroundTasks + Ultralytics train()</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-cyan-400">cameras.py</td>
                    <td className="py-2 px-3">/api/cameras</td>
                    <td className="py-2 px-3 font-sans">相机 CRUD、GigE/RTSP 配置、流状态心跳检测</td>
                    <td className="py-2 px-3">OpenCV VideoCapture / GigE SDK 封装</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-cyan-400">live_monitor.py</td>
                    <td className="py-2 px-3">/api/live-monitor</td>
                    <td className="py-2 px-3 font-sans">实时多路视频流分发、检测帧叠加、FPS 遥测</td>
                    <td className="py-2 px-3">WebSocket / MJPEG 流推流</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-cyan-400">alerts.py</td>
                    <td className="py-2 px-3">/api/alerts</td>
                    <td className="py-2 px-3 font-sans">告警事件过滤、认领、级别升级、工单流转</td>
                    <td className="py-2 px-3">Webhook 推送钉钉/企业微信</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-cyan-400">mes.py</td>
                    <td className="py-2 px-3">/api/mes</td>
                    <td className="py-2 px-3 font-sans">工单绑定、生产节拍 (Cycle Time)、OEE 统计计算</td>
                    <td className="py-2 px-3">时序数据库聚合计算</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h3 className="font-bold text-white text-sm mb-3">
              {isZh ? '前端模块组织 (React 19 + TypeScript + AntD / Tailwind)' : 'Frontend Module Organization'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              前端包含 18 个独立页面路由，基于 React Router 7 + i18next 实现中英双语国际化，通过 Axios 统一拦截 JWT Token 与会话过期处理，集成 ECharts 进行统计分析图表渲染。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
              {[
                'Dashboard 实时看板',
                'LiveMonitor 实时监控',
                'Cameras 摄像头管理',
                'Alerts 告警管理',
                'VideoLearning 视频学习',
                'VideoTraining 视频训练',
                'Evaluation 训练评估',
                'MES 生产工单',
                'Models 模型管理',
                'BatchAnalysis 批量分析',
                'Storage 存储管理',
                'AuditLogs 审计日志'
              ].map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300 font-medium truncate">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Bottlenecks & Gaps Identified */}
      {activeTab === 'bottlenecks' && (
        <div className="space-y-4">
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2.5 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{isZh ? '深度审查发现的系统现有痛点与技术债务' : 'Critical Architectural Gaps in Existing Repo'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              通过细致阅读 `temp_yolocheck` 中的全部代码、文档及 `.tasks/tasks.md`，发现以下亟待解决的核心瓶颈：
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>痛点 1: 缺少直观的 YOLO 标注语法与越界自动体检工具</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                现场操作员或算法工程师在导出或手工修改 YOLO 格式 TXT 标定时，常因归一化错误（坐标 &gt; 1.0 或 &lt; 0.0）、负宽度、超出类别字典等导致后续训练直接崩溃报错（见 tasks.md）。系统原先缺少即时语法体检与一键自动规范纠错机制。
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>痛点 2: 视频学习结果缺乏交互式标定微调画布</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                原系统虽然能由 YOLO 自动提取关键帧与检测框，但在把检测框转为训练集前，如果出现漏检或轻微漂移，操作员只能在纯文本或表格中查看，缺乏类似 LabelImg 的在线交互式拖拽微调包围盒画布，增加了训练集噪音。
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span>痛点 3: 边缘推理重度依赖本地显卡，缺乏纯 Web 轻量演示与仿真测试</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                部署前无法在浏览器端无需配置 CUDA 的情况下直观测试模型检测效果与置信度滑块。当工控机网络抖动或离线时，Web 界面直接显示黑屏或错误，缺乏弹性离线降级体验。
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>痛点 4: 前端测试覆盖不全与部分国际化文本缺失</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                在 `.tasks/tasks.md` 记录的第 5 项任务中，标注集导入和训练新建相关的中英语言键与单测用例仍未闭环，需要统一补齐并保证端到端编译测试零阻碍。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
