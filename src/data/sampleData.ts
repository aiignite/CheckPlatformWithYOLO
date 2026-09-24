import { BoundingBox, CameraStream, VideoLearningStep, TrainingJob, AlertItem } from '../types/yolo';

export const DEFECT_CLASSES = [
  { id: 0, name: 'missing_component', displayName: '元件缺失 (Missing Part)', color: '#ef4444', category: 'defect' },
  { id: 1, name: 'solder_bridge', displayName: '虚焊/连锡 (Solder Defect)', color: '#f97316', category: 'defect' },
  { id: 2, name: 'polarity_error', displayName: '极性反接 (Polarity Error)', color: '#eab308', category: 'defect' },
  { id: 3, name: 'foreign_object', displayName: '异物杂质 (Foreign Object)', color: '#a855f7', category: 'defect' },
  { id: 4, name: 'ic_chip_normal', displayName: '主控芯片正常 (IC Chip)', color: '#10b981', category: 'component' },
  { id: 5, name: 'resistor_normal', displayName: '贴片电阻正常 (Resistor)', color: '#06b6d4', category: 'component' },
  { id: 6, name: 'capacitor_normal', displayName: '电容正常 (Capacitor)', color: '#3b82f6', category: 'component' },
  { id: 7, name: 'safety_helmet', displayName: '安全帽佩戴 (PPE Helmet)', color: '#22c55e', category: 'safety' },
  { id: 8, name: 'no_helmet', displayName: '未戴安全帽 (No Helmet)', color: '#dc2626', category: 'safety' },
  { id: 9, name: 'danger_zone_entry', displayName: '违规越界进入 (Zone Breach)', color: '#b91c1c', category: 'safety' },
];

export const INITIAL_CAMERAS: CameraStream[] = [
  {
    id: 'cam_smt_01',
    name: 'SMT-01 高精度贴片检测工位',
    location: '1号生产车间 · SMT贴片线前端',
    type: 'GigE',
    resolution: '2592 x 1944 (5MP)',
    fps: 32,
    status: 'online',
    stationId: 'station_smt_01',
    modelDeployed: 'YOLOv8-SMT-v2.4 (Active)',
    defectCountToday: 7,
    latencyMs: 14.8,
    boxes: [
      { id: 'b1', classId: 0, className: 'missing_component', category: 'defect', x: 0.32, y: 0.41, w: 0.12, h: 0.10, confidence: 0.94, status: 'fail', description: 'C104贴片电容焊盘空置' },
      { id: 'b2', classId: 1, className: 'solder_bridge', category: 'defect', x: 0.58, y: 0.28, w: 0.09, h: 0.08, confidence: 0.88, status: 'fail', description: 'Q3三极管引脚连锡短路' },
      { id: 'b3', classId: 4, className: 'ic_chip_normal', category: 'component', x: 0.42, y: 0.55, w: 0.22, h: 0.24, confidence: 0.98, status: 'pass', description: 'MCU主控对准度 99.8%' },
      { id: 'b4', classId: 5, className: 'resistor_normal', category: 'component', x: 0.18, y: 0.32, w: 0.08, h: 0.07, confidence: 0.95, status: 'pass', description: 'R12电阻位置正常' }
    ]
  },
  {
    id: 'cam_assembly_02',
    name: 'ASSY-02 机械手装配与锁螺丝',
    location: '1号生产车间 · 自动化装配岛',
    type: 'GigE',
    resolution: '1920 x 1080',
    fps: 30,
    status: 'online',
    stationId: 'station_assy_02',
    modelDeployed: 'YOLOv8-Assembly-v3.1',
    defectCountToday: 2,
    latencyMs: 16.2,
    boxes: [
      { id: 'b5', classId: 2, className: 'polarity_error', category: 'defect', x: 0.35, y: 0.48, w: 0.14, h: 0.13, confidence: 0.91, status: 'fail', description: '二极管D1方向与丝印反向' },
      { id: 'b6', classId: 4, className: 'ic_chip_normal', category: 'component', x: 0.62, y: 0.40, w: 0.20, h: 0.22, confidence: 0.96, status: 'pass', description: '外壳螺丝紧固度合格' }
    ]
  },
  {
    id: 'cam_logistics_03',
    name: 'LOG-03 成品智能分拣与封箱',
    location: '2号仓库 · 出货集装输送线',
    type: 'RTSP',
    resolution: '1920 x 1080',
    fps: 25,
    status: 'online',
    stationId: 'station_log_03',
    modelDeployed: 'YOLOv8-Pack-v1.9',
    defectCountToday: 0,
    latencyMs: 21.5,
    boxes: [
      { id: 'b7', classId: 4, className: 'ic_chip_normal', category: 'component', x: 0.28, y: 0.35, w: 0.38, h: 0.42, confidence: 0.99, status: 'pass', description: '条码扫描识别成功, 标签居中' }
    ]
  },
  {
    id: 'cam_safety_04',
    name: 'SAFE-04 机械臂重载作业安全警戒区',
    location: '1号车间 · 危险机械臂作业网围',
    type: 'RTSP',
    resolution: '1920 x 1080',
    fps: 28,
    status: 'warning',
    stationId: 'station_safe_04',
    modelDeployed: 'YOLOv8-Safety-PPE-v2.0',
    defectCountToday: 4,
    latencyMs: 18.0,
    boxes: [
      { id: 'b8', classId: 8, className: 'no_helmet', category: 'safety', x: 0.44, y: 0.18, w: 0.18, h: 0.36, confidence: 0.89, status: 'fail', description: '作业人员未规范佩戴安全帽' },
      { id: 'b9', classId: 9, className: 'danger_zone_entry', category: 'safety', x: 0.38, y: 0.52, w: 0.35, h: 0.38, confidence: 0.93, status: 'fail', description: '检测到靠近黄色警戒线 1.2m' }
    ]
  }
];

export const SOP_LEARNING_STEPS: VideoLearningStep[] = [
  {
    stepOrder: 1,
    actionName: '工件取料与治具初固定',
    description: '右手从防静电周转箱取PCB裸板，平稳放入定位治具槽位内，确认防呆卡扣锁紧。',
    startTime: 0.0,
    endTime: 3.4,
    duration: 3.4,
    confidence: 0.96,
    keyframeTime: 1.8,
    objectsInvolved: ['pcb_board', 'fixture_clamp', 'operator_hand'],
    operatorPose: {
      posture: '双臂前伸俯身操作',
      handCoord: [0.45, 0.62],
      keypoints: [
        [0.48, 0.25, 0.99], [0.47, 0.38, 0.98], [0.42, 0.52, 0.95],
        [0.45, 0.62, 0.93], [0.55, 0.54, 0.94], [0.58, 0.65, 0.91]
      ]
    },
    isStandard: true,
    notes: '动作节拍优于标杆 0.4s'
  },
  {
    stepOrder: 2,
    actionName: '离子风枪表面除尘与电荷中和',
    description: '左手握持静电风枪，在板卡上方 15cm 处沿蛇形轨迹吹拂 2.5 秒，吹除浮尘微粒。',
    startTime: 3.4,
    endTime: 6.2,
    duration: 2.8,
    confidence: 0.93,
    keyframeTime: 4.9,
    objectsInvolved: ['ion_air_gun', 'pcb_surface'],
    operatorPose: {
      posture: '左侧抬臂手持工具',
      handCoord: [0.38, 0.48],
      keypoints: [
        [0.49, 0.26, 0.98], [0.46, 0.39, 0.97], [0.38, 0.48, 0.96],
        [0.56, 0.53, 0.93], [0.57, 0.62, 0.90]
      ]
    },
    isStandard: true,
    notes: '喷吹时长符合工艺规范 (2.5s-3.0s)'
  },
  {
    stepOrder: 3,
    actionName: '精细贴片元件取置 (SMD Alignment)',
    description: '使用真空吸笔拾取 0402 阻容元件，借助放大目镜辅助准确定位焊盘中心。',
    startTime: 6.2,
    endTime: 11.5,
    duration: 5.3,
    confidence: 0.91,
    keyframeTime: 8.7,
    objectsInvolved: ['vacuum_pen', 'smd_tray', 'pcb_pad'],
    operatorPose: {
      posture: '双手微调精细操作',
      handCoord: [0.51, 0.59],
      keypoints: [
        [0.50, 0.28, 0.99], [0.48, 0.42, 0.97], [0.47, 0.56, 0.94],
        [0.51, 0.59, 0.95], [0.54, 0.55, 0.93]
      ]
    },
    isStandard: true,
    notes: '吸嘴中心对准误差小于 0.05mm'
  },
  {
    stepOrder: 4,
    actionName: '热风恒温焊接与焊点凝固',
    description: '恒温烙铁头接触焊盘 1.8 秒送锡，热风回流保持，焊点成形饱满光滑呈圆弧状。',
    startTime: 11.5,
    endTime: 16.0,
    duration: 4.5,
    confidence: 0.89,
    keyframeTime: 13.6,
    objectsInvolved: ['soldering_iron', 'solder_wire', 'solder_joint'],
    operatorPose: {
      posture: '双手交叉协作作业',
      handCoord: [0.52, 0.61],
      keypoints: [
        [0.50, 0.29, 0.98], [0.46, 0.43, 0.96], [0.44, 0.58, 0.92],
        [0.52, 0.61, 0.94], [0.56, 0.58, 0.91]
      ]
    },
    isStandard: true,
    notes: '送锡量适中，无连锡虚焊风险'
  },
  {
    stepOrder: 5,
    actionName: 'AOI视觉自检确认与下料周转',
    description: '按下工位AOI视觉自检按键，观察屏幕合格绿灯亮起，取出工件放入防静电成型架。',
    startTime: 16.0,
    endTime: 19.8,
    duration: 3.8,
    confidence: 0.97,
    keyframeTime: 18.1,
    objectsInvolved: ['aoi_button', 'green_light', 'carrier_rack'],
    operatorPose: {
      posture: '右臂抬起按压并双手出料',
      handCoord: [0.65, 0.45],
      keypoints: [
        [0.51, 0.27, 0.99], [0.50, 0.39, 0.98], [0.59, 0.42, 0.96],
        [0.65, 0.45, 0.95], [0.45, 0.56, 0.92]
      ]
    },
    isStandard: true,
    notes: '全流程单循环标准工时 19.8s (设计节拍 22.0s，富余 10%)'
  }
];

export const INITIAL_TRAINING_JOBS: TrainingJob[] = [
  {
    id: 'job-yolo-smt-202604',
    name: 'SMT贴片缺陷高精检测模型 (YOLOv8s-FineTuned)',
    modelBackbone: 'YOLOv8s',
    taskType: 'object_detection',
    datasetName: 'SMT_Defects_Clean_v3.4 (4,820 张标定图)',
    epochs: 100,
    currentEpoch: 100,
    batchSize: 32,
    imageSize: 640,
    status: 'completed',
    progress: 100,
    map50: 0.948,
    map50_95: 0.782,
    precision: 0.962,
    recall: 0.935,
    lossHistory: [
      { epoch: 10, boxLoss: 1.42, clsLoss: 1.85, dflLoss: 1.35, map50: 0.62 },
      { epoch: 25, boxLoss: 0.98, clsLoss: 1.10, dflLoss: 1.05, map50: 0.78 },
      { epoch: 50, boxLoss: 0.65, clsLoss: 0.72, dflLoss: 0.88, map50: 0.87 },
      { epoch: 75, boxLoss: 0.48, clsLoss: 0.49, dflLoss: 0.76, map50: 0.92 },
      { epoch: 100, boxLoss: 0.36, clsLoss: 0.31, dflLoss: 0.68, map50: 0.948 }
    ]
  },
  {
    id: 'job-pose-action-202604',
    name: '工位动作骨骼姿态识别模型 (YOLOv8-Pose-SOP)',
    modelBackbone: 'YOLOv8-pose',
    taskType: 'action_recognition',
    datasetName: 'Assembly_Action_Sequences (12,400 帧骨骼样本)',
    epochs: 80,
    currentEpoch: 64,
    batchSize: 16,
    imageSize: 640,
    status: 'running',
    progress: 80,
    map50: 0.912,
    map50_95: 0.724,
    precision: 0.928,
    recall: 0.901,
    lossHistory: [
      { epoch: 10, boxLoss: 1.55, clsLoss: 1.90, dflLoss: 1.40, map50: 0.58 },
      { epoch: 30, boxLoss: 0.88, clsLoss: 0.95, dflLoss: 1.02, map50: 0.75 },
      { epoch: 50, boxLoss: 0.59, clsLoss: 0.62, dflLoss: 0.84, map50: 0.86 },
      { epoch: 64, boxLoss: 0.44, clsLoss: 0.45, dflLoss: 0.75, map50: 0.912 }
    ]
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt_091',
    cameraId: 'cam_safety_04',
    cameraName: 'SAFE-04 机械臂重载作业区',
    stationId: 'station_safe_04',
    severity: 'critical',
    category: 'safety',
    title: '人员未戴安全帽进入机械臂回转红线区域',
    detail: '工号 0418 巡检人员未按规范穿戴 PPE 且跨入 1.5m 危险警戒线，触发一键急停预警。',
    timestamp: '17:42:15',
    status: 'pending',
    assignedTo: '安全主管 李工'
  },
  {
    id: 'alt_090',
    cameraId: 'cam_smt_01',
    cameraName: 'SMT-01 贴片检测工位',
    stationId: 'station_smt_01',
    severity: 'warning',
    category: 'defect',
    title: '连续 3 块板卡出现 C104 电容虚焊/缺失',
    detail: '置信度 0.94，疑似 2 号供料飞达 (Feeder) 出现步进卡料或吸嘴堵塞，建议换料自检。',
    timestamp: '17:35:08',
    status: 'investigating',
    assignedTo: 'SMT技术员 张师傅'
  },
  {
    id: 'alt_089',
    cameraId: 'cam_assembly_02',
    cameraName: 'ASSY-02 自动化装配岛',
    stationId: 'station_assy_02',
    severity: 'info',
    category: 'efficiency',
    title: '工步节拍超时 +18% (瓶颈工位报警)',
    detail: '当前单件平均工时由标准 19.8s 升至 23.4s，影响下工位线平衡率。',
    timestamp: '17:12:44',
    status: 'resolved',
    assignedTo: '班组长 王伟'
  }
];

export const SAMPLE_YOLO_DATASET_TXT = `# 标准 YOLO 标注格式测试样本 (class_id x_center y_center width height)
# 正常标注
0 0.3200 0.4100 0.1200 0.1000
1 0.5800 0.2800 0.0900 0.0800
4 0.4200 0.5500 0.2200 0.2400

# 故意包含的异常行（用于测试体检引擎与自动修复）
0 1.0850 0.4100 0.1500 0.1200  # 异常：坐标超出范围 > 1.0
2 0.4500 0.6000 -0.0500 0.1000  # 异常：宽度出现负数
99 0.2500 0.3000 0.1000 0.1000 # 异常：class_id 99 超出类别字典
5 0.5000 0.5000 0.0000 0.0000  # 异常：面积为 0 的无效包围盒
`;
