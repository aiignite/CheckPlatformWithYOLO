export type ViewMode = 
  | 'analysis'
  | 'phase-implementation'
  | 'live-monitor'
  | 'vision-inspector'
  | 'video-learning'
  | 'training-studio'
  | 'dataset-checker'
  | 'mes-analytics'
  | 'alert-workflow'
  | 'optimization-roadmap';

export type Language = 'zh' | 'en';

export interface BoundingBox {
  id: string;
  classId: number;
  className: string;
  category: 'defect' | 'component' | 'safety' | 'operator' | 'tool';
  x: number; // normalized 0..1
  y: number;
  w: number;
  h: number;
  confidence: number;
  status?: 'pass' | 'warning' | 'fail';
  description?: string;
  severity?: 'critical' | 'warning' | 'info';
}

export interface CameraStream {
  id: string;
  name: string;
  location: string;
  type: 'GigE' | 'RTSP';
  resolution: string;
  fps: number;
  status: 'online' | 'warning' | 'offline';
  stationId: string;
  modelDeployed: string;
  defectCountToday: number;
  latencyMs: number;
  boxes: BoundingBox[];
}

export interface VideoLearningStep {
  id?: string;
  stepOrder: number;
  actionName: string;
  description: string;
  startTime: number;
  endTime: number;
  duration: number;
  durationSeconds?: number;
  standardToleranceSec?: number;
  confidence: number;
  keyframeTime: number;
  objectsInvolved: string[];
  detectedObjects?: string[];
  operatorPose: {
    posture: string;
    handCoord: [number, number];
    keypoints: [number, number, number][]; // [x, y, conf]
  };
  isStandard: boolean;
  notes: string;
  workerId?: string;
  status?: string;
}

export interface TrainingJob {
  id: string;
  name: string;
  modelBackbone: 'YOLOv8n' | 'YOLOv8s' | 'YOLOv8m' | 'YOLOv8-pose';
  taskType: 'object_detection' | 'action_recognition' | 'defect_classification';
  datasetName: string;
  epochs: number;
  currentEpoch: number;
  batchSize: number;
  imageSize: number;
  status: 'running' | 'completed' | 'pending' | 'failed';
  progress: number;
  map50: number;
  map50_95: number;
  precision: number;
  recall: number;
  lossHistory: {
    epoch: number;
    boxLoss: number;
    clsLoss: number;
    dflLoss: number;
    map50: number;
  }[];
}

export interface AlertItem {
  id: string;
  cameraId: string;
  cameraName: string;
  stationId: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'defect' | 'safety' | 'efficiency';
  title: string;
  detail: string;
  timestamp: string;
  status: 'pending' | 'investigating' | 'resolved';
  assignedTo?: string;
  imageUrl?: string;
}

export interface YoloAnnotationValidation {
  lineNumber: number;
  rawText: string;
  classId?: number;
  className?: string;
  cx?: number;
  cy?: number;
  w?: number;
  h?: number;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestedFix?: string;
}
