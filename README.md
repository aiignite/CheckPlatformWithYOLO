# YoloCheck 工业级智能视觉识别与过程监控质检系统

> **YoloCheck: Industrial Vision Inspection, Process Learning & Quality Control Platform**  
> 面向现代智能制造（SMT贴片、自动化机械装配、综合电测、仓储物流）的高性能工业视觉检测、工步学习与闭环质检决策平台。

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![YOLO Engine](https://img.shields.io/badge/YOLO-v8%20%2F%20v11-00FFFF)](https://github.com/ultralytics/ultralytics)

---

## 📖 系统概述 (Overview)

**YoloCheck** 针对工业现场高节拍、微米级缺陷排查、SOP 人工作业标准度离散以及产线数据孤岛等痛点设计。系统整合了 **边缘 YOLO 高性能视觉推理**、**智能数据集体检与自动清洗**、**视频动作学习与 SOP 数字化施教** 以及 **MES / OEE 决策分析闭环**，构建了从边缘侧相机捕获到云端/中控室决策流转的完整闭环。

```text
┌─────────────────────────────────────────────────────────────────┐
│                    YoloCheck 综合质检与决策中枢                   │
├─────────────────┬─────────────────┬──────────────┬──────────────┤
│ 1. 实时多路监控 │ 2. 标定/缺陷质检 │ 3. 数据集体检│ 4. 视频学习  │
│ (Live Monitor)  │ (Vision Audit)  │ (Auditor)    │ (SOP Study)  │
├─────────────────┼─────────────────┼──────────────┼──────────────┤
│ 5. 模型训练中心 │ 6. 工业告警处置 │ 7. MES/OEE   │ 8. 实施中枢  │
│ (Studio Engine) │ (Alert Workflow)│ (Analytics)  │ (Phase Exec) │
└─────────────────┴─────────────────┴──────────────┴──────────────┘
                                  ▲
                                  │ MQTT / WebSockets / HTTP
       ┌──────────────────────────┴──────────────────────────┐
       │ 边缘工控机 / 边缘加速卡 (Edge Computing & TensorRT) │
       └──────────────────────────┬──────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
  [SMT 表面贴装工位]       [自动化机械臂装配]        [电测与仓储物流]
  (GigE 工业高清相机)       (RTSP 实时视频流)        (高动态工业网络相机)
```

---

## 🚀 核心功能模块 (Core Modules)

### 1. 🔍 YOLO 目标/缺陷质检诊断中心 (`VisionInspectorView`)
- **交互式标注与包围盒诊断**：支持交互高亮查看组件类别、置信度分数、坐标尺寸（宽/高）。
- **缺陷分类覆盖**：PCB板体定位、焊盘虚焊/桥接、电容电阻错件偏位、IC 缺脚针脚变形等。
- **阈值无级调谐**：支持动态滑动调谐最低置信度（Confidence Threshold）与 NMS 重叠抑制。
- **工业产物导出**：支持一键导出标准格式的实时 `labels.txt` 标注文档。

### 2. 🩺 YOLO 数据集格式智能体检仪 (`DatasetCheckerTool`)
- **常见格式故障排查**：坐标越界、负坐标、非法非浮点格式、字段缺失、未定义类别映射。
- **交互式数据源支持**：支持本地 `.txt` 标定导入、实时文本在线编辑与多工况预设载入。
- **工业级一键自动修复 (Auto-Clamp)**：自动将越界归一化坐标安全钳位修正至 `[0.0, 1.0]`，并提供一键导出清洗后标准标注。

### 3. 📹 产线多路实时监控流 (`LiveMonitorView`)
- **4路实时画面监控**：覆盖 SMT 表面贴装、机械手装配、综合电测、仓储包装工位。
- **单路全屏/特写诊断**：双击或点击即可呼出特写画中画，查看微米级缺陷实时热点定位。
- **单帧快照抓拍存证**：支持带有时间戳与缺陷框叠加的高清帧快速抓拍下载。

### 4. 🚀 模型训练与边缘评估中心 (`TrainingStudioView`)
- **多模型指标雷达**：对比 YOLOv8n (Nano)、YOLOv8s、YOLOv8x-Defect 模型的 mAP@50、mAP@50-95、推理延迟（FPS）及显存占用。
- **实时演进模拟**：支持单步推进 10 Epochs，实时仿真验证损失衰减与精度提升过程。
- **边缘部署包一键生成**：支持快速导出 TensorRT FP16 `.engine` 权重包与跨平台 `.onnx` 格式。

### 5. 🎓 视频学习与 SOP 施教工作台 (`VideoLearningView`)
- **作业动作智能分解**：基于人体骨骼关键点与手部坐标追踪，提取工序标准节拍（CT）。
- **SOP 节拍与容差微调**：支持交互编辑各个工序的标准耗时与安全公差，新增/删除作业工步。
- **数字化作业指导书导出**：一键生成结构化标准作业规程（SOP）数据。

### 6. 🚨 工业告警闭环流转 (`AlertWorkflowView`)
- **三级告警智能分诊**：CRITICAL（严重阻断）、WARNING（参数预警）、INFO（常规提示）。
- **处置全流程追溯**：从「已触发」到「已认领」、「整改处置中」至「已闭环」状态机追踪。
- **证据链抓拍查验**：点击任意告警记录即可弹出抓拍现场证据画面与算法复盘报告。

### 7. 📊 MES 效能与 OEE 决策看板 (`MesAnalyticsView`)
- **精益生产指标**：设备综合效率 (OEE)、产线良品率 (Yield)、平均故障间隔时间 (MTBF)。
- **瓶颈工序识别**：动态检测各工位 Cycle Time，高亮标记制约生产效率的瓶颈工序。

### 8. 🧭 8周4阶段工程落地执行中枢 (`PhaseImplementationView`)
- **四阶段闭环体系**：包含基础标定（P1）、边缘联调（P2）、模型微调（P3）及系统集成上线（P4）。
- **任务清单与达成率量化**：支持实时勾选落地任务，量化四阶段综合推进进度。

---

## 🛠️ 技术栈 (Tech Stack)

| 层级 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **前端核心** | React 19 + TypeScript | 函数式组件，全严格类型系统 |
| **构建工具** | Vite 6.x | 极速热更新，生产级打包优化 |
| **样式工程** | Tailwind CSS 4.x | 高对比度工业风深色控制台设计 |
| **图标套件** | Lucide React | 严谨轻量的现代化工程图标库 |
| **图表可视化** | Canvas API + ECharts | 高性能波形图与标注框几何计算 |
| **工业协同协议** | RESTful API / WebSocket / MQTT | 支持与工控机及 Python 后端互通 |

---

## 💻 本地开发与运行 (Getting Started)

### 前置条件
- Node.js >= 18.0.0 (推荐 Node 20 / 22)
- npm >= 9.0.0 或 bun / pnpm

### 1. 克隆仓库
```bash
git clone https://github.com/aiignite/YoloCheck.git
cd YoloCheck
```

### 2. 安装依赖
```bash
npm install
# 或者使用 bun
bun install
```

### 3. 启动开发服务器
```bash
npm run dev
```
打开浏览器访问：`http://localhost:3000`

### 4. 代码检查与构建
```bash
# TypeScript 语法及严格类型检查
npm run lint

# 生产环境构建打包
npm run build
```

---

## 📁 目录结构 (Directory Structure)

```text
├── src/
│   ├── components/               # 公共工业 UI 组件
│   │   ├── Navbar.tsx            # 顶部监控控制栏（状态指示/时钟/告警）
│   │   ├── Sidebar.tsx           # 左侧工业工位主导航
│   │   └── views/                # 八大工业核心业务视图
│   │       ├── VisionInspectorView.tsx    # YOLO 目标与缺陷标定工作台
│   │       ├── DatasetCheckerTool.tsx    # 标注文件格式体检与自动修复
│   │       ├── LiveMonitorView.tsx        # 产线 4 路 RTSP/GigE 监控与抓拍
│   │       ├── TrainingStudioView.tsx     # 模型训练收敛与边缘部署中心
│   │       ├── VideoLearningView.tsx      # 动作识别与 SOP 节拍施教
│   │       ├── AlertWorkflowView.tsx      # 工业告警工单处置与审计
│   │       ├── MesAnalyticsView.tsx       # MES 生产效能与 OEE 看板
│   │       ├── PhaseImplementationView.tsx# 8周4阶段工程落地中枢
│   │       ├── AnalysisView.tsx           # 深度缺陷多维统计
│   │       └── OptimizationRoadmapView.tsx# 产线调优演进路线
│   ├── data/
│   │   └── sampleData.ts         # 工业预设工单、缺陷类型与基准数据
│   ├── types/
│   │   └── yolo.ts               # YOLO 标注、训练任务、告警与 SOP 类型定义
│   ├── App.tsx                   # 主视图路由与状态聚合
│   ├── main.tsx                  # 渲染入口
│   └── index.css                 # 全局 Tailwind 样式与工业主题配置
├── public/                       # 静态资源
├── package.json                  # 依赖与命令配置
├── tsconfig.json                 # TypeScript 编译配置
├── vite.config.ts                # Vite 构建管线配置
└── README.md                     # 项目技术架构与说明文档
```

---

## 📄 许可证 (License)

本项目遵循 Apache-2.0 / MIT 开源许可证。欢迎提交 Issue 与 Pull Request！
