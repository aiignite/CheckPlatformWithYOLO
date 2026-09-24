import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Download, 
  Copy, 
  FileText,
  ShieldCheck,
  Upload,
  RefreshCw,
  Check,
  FileCode
} from 'lucide-react';
import { Language, YoloAnnotationValidation } from '../../types/yolo';
import { SAMPLE_YOLO_DATASET_TXT, DEFECT_CLASSES } from '../../data/sampleData';

interface DatasetCheckerToolProps {
  language: Language;
}

const PRESET_SCENARIOS = [
  {
    id: 'out_of_bounds',
    nameZh: '典型越界与脏格式',
    nameEn: 'Out-of-Bounds & Syntax Errors',
    content: `0 0.4500 0.5200 0.1200 0.1400
1 0.9800 0.5000 0.1500 0.1200 # 右侧越界: 0.98 + 0.15/2 = 1.055 > 1.0
2 0.5000 -0.0500 0.2000 0.1800 # 负数坐标异常
12 0.3000 0.4000 0.1000 0.1000 # 类别ID 12 超出字典范围
4 0.6000 0.6000 0.0000 0.1500 # 宽度为 0 导致模型计算除零崩溃
0 0.2500 0.3500 0.0800 0.0900`
  },
  {
    id: 'negative_dimensions',
    nameZh: '负尺寸与零面积',
    nameEn: 'Zero-Area & Negative Dimensions',
    content: `0 0.5000 0.5000 0.1000 0.1000
1 0.4000 0.4000 -0.0500 0.0800 # 负数宽度
2 0.7000 0.7000 0.0000 0.0000 # 零面积
3 0.2000 0.2000 0.0800 0.0600`
  },
  {
    id: 'clean_benchmark',
    nameZh: '100%全合规黄金基准集',
    nameEn: 'Clean Standard Benchmark',
    content: `0 0.4500 0.5200 0.1200 0.1400
1 0.6200 0.4800 0.1100 0.1000
2 0.3100 0.2900 0.0900 0.0800
4 0.5000 0.5000 0.2400 0.2600
5 0.7500 0.4500 0.0800 0.0700`
  }
];

export const DatasetCheckerTool: React.FC<DatasetCheckerToolProps> = ({ language }) => {
  const isZh = language === 'zh';
  const [rawText, setRawText] = useState<string>(SAMPLE_YOLO_DATASET_TXT);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [fixedNotice, setFixedNotice] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse and audit function
  const auditYoloText = (text: string): { items: YoloAnnotationValidation[]; summary: { total: number; valid: number; errors: number; warnings: number } } => {
    const lines = text.split('\n');
    const items: YoloAnnotationValidation[] = [];
    let errCount = 0;
    let warnCount = 0;

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return;
      }

      // strip inline comment
      const commentIdx = trimmed.indexOf('#');
      const dataPart = commentIdx !== -1 ? trimmed.slice(0, commentIdx).trim() : trimmed;
      const parts = dataPart.split(/\s+/);
      const errors: string[] = [];
      const warnings: string[] = [];
      let classId: number | undefined;
      let cx: number | undefined;
      let cy: number | undefined;
      let w: number | undefined;
      let h: number | undefined;

      if (parts.length < 5) {
        errors.push(isZh ? `字段不足：需要5个参数 (class_id cx cy w h)，当前仅有 ${parts.length} 个` : `Insufficient fields: expected 5, got ${parts.length}`);
      } else {
        classId = parseInt(parts[0], 10);
        cx = parseFloat(parts[1]);
        cy = parseFloat(parts[2]);
        w = parseFloat(parts[3]);
        h = parseFloat(parts[4]);

        if (isNaN(classId)) {
          errors.push(isZh ? `类别ID必须为非负整数: "${parts[0]}"` : `Class ID must be integer: "${parts[0]}"`);
        } else if (classId < 0 || classId > 9) {
          errors.push(isZh ? `类别ID ${classId} 超出当前数据字典范围 [0..9]` : `Class ID ${classId} out of range [0..9]`);
        }

        if (isNaN(cx) || isNaN(cy) || isNaN(w) || isNaN(h)) {
          errors.push(isZh ? '坐标参数包含非法非浮点数值' : 'Coordinates contain invalid non-float values');
        } else {
          if (cx < 0 || cx > 1) {
            errors.push(isZh ? `中心点 X 越界: ${cx} (必须在 [0.0, 1.0] 归一化区间)` : `Center X out of bounds: ${cx}`);
          }
          if (cy < 0 || cy > 1) {
            errors.push(isZh ? `中心点 Y 越界: ${cy} (必须在 [0.0, 1.0] 归一化区间)` : `Center Y out of bounds: ${cy}`);
          }
          if (w <= 0) {
            errors.push(isZh ? `包围盒宽度非法: ${w} (必须严格大于 0)` : `Box width invalid: ${w}`);
          } else if (w > 1) {
            warnings.push(isZh ? `包围盒宽度超过整幅画面 1.0: ${w}` : `Box width exceeds 1.0: ${w}`);
          }
          if (h <= 0) {
            errors.push(isZh ? `包围盒高度非法: ${h} (必须严格大于 0)` : `Box height invalid: ${h}`);
          } else if (h > 1) {
            warnings.push(isZh ? `包围盒高度超过整幅画面 1.0: ${h}` : `Box height exceeds 1.0: ${h}`);
          }

          // Boundary overflow check
          if (cx >= 0 && cx <= 1 && w > 0) {
            const xmin = cx - w / 2;
            const xmax = cx + w / 2;
            if (xmin < 0 || xmax > 1) {
              warnings.push(isZh ? `包围盒边缘超出图像边界: [${xmin.toFixed(3)}, ${xmax.toFixed(3)}]` : `Box extends beyond image margins`);
            }
          }
        }
      }

      if (errors.length > 0) errCount++;
      if (warnings.length > 0) warnCount++;

      items.push({
        lineNumber: idx + 1,
        rawText: line,
        classId,
        className: classId !== undefined && DEFECT_CLASSES[classId] ? DEFECT_CLASSES[classId].displayName : undefined,
        cx,
        cy,
        w,
        h,
        isValid: errors.length === 0,
        errors,
        warnings,
      });
    });

    return {
      items,
      summary: {
        total: items.length,
        valid: items.filter((i) => i.isValid).length,
        errors: errCount,
        warnings: warnCount,
      }
    };
  };

  const auditResult = auditYoloText(rawText);

  // Auto-Fix implementation with mathematical clamping
  const handleAutoFix = () => {
    const lines = rawText.split('\n');
    const fixedLines: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        fixedLines.push('');
        return;
      }
      if (trimmed.startsWith('#')) {
        fixedLines.push(line);
        return;
      }

      const commentIdx = trimmed.indexOf('#');
      const dataPart = commentIdx !== -1 ? trimmed.slice(0, commentIdx).trim() : trimmed;
      const parts = dataPart.split(/\s+/);

      if (parts.length >= 5) {
        let classId = parseInt(parts[0], 10);
        let cx = parseFloat(parts[1]);
        let cy = parseFloat(parts[2]);
        let w = parseFloat(parts[3]);
        let h = parseFloat(parts[4]);

        if (isNaN(classId) || classId < 0 || classId > 9) {
          classId = 0; // fallback to class 0
        }

        // Clamp coordinates
        cx = Math.max(0.01, Math.min(0.99, isNaN(cx) ? 0.5 : cx));
        cy = Math.max(0.01, Math.min(0.99, isNaN(cy) ? 0.5 : cy));
        w = Math.max(0.02, Math.min(0.98, isNaN(w) ? 0.1 : Math.abs(w)));
        h = Math.max(0.02, Math.min(0.98, isNaN(h) ? 0.1 : Math.abs(h)));

        // Ensure boundary box does not exceed [0, 1]
        const xmin = Math.max(0.001, cx - w / 2);
        const xmax = Math.min(0.999, cx + w / 2);
        const ymin = Math.max(0.001, cy - h / 2);
        const ymax = Math.min(0.999, cy + h / 2);

        const clampedW = xmax - xmin;
        const clampedH = ymax - ymin;
        const clampedCx = (xmin + xmax) / 2;
        const clampedCy = (ymin + ymax) / 2;

        fixedLines.push(
          `${classId} ${clampedCx.toFixed(4)} ${clampedCy.toFixed(4)} ${clampedW.toFixed(4)} ${clampedH.toFixed(4)}`
        );
      }
    });

    const result = fixedLines.join('\n');
    setRawText(result);
    setFixedNotice(true);
    setTimeout(() => setFixedNotice(false), 4000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
      }
    };
    reader.readAsText(file);
  };

  const downloadCleanFile = () => {
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataset_clean_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDataYaml = () => {
    const yamlContent = `# YoloCheck Production Dataset Config
path: ./datasets/smt_inspection
train: images/train
val: images/val
test: images/test

# Classes Definition
names:
${DEFECT_CLASSES.map((c) => `  ${c.id}: ${c.name}`).join('\n')}
`;
    const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">
              {isZh ? 'YOLO 数据集体检与智能纠错工具' : 'YOLO Dataset Health & Auto-Repair Tool'}
            </h2>
            <p className="text-xs text-slate-400">
              {isZh
                ? '严格校验归一化范围 [0, 1] · 自动查杀越界坐标与 0 面积框 · 类别字典映射与一键钳位修复'
                : 'Zero-crash training validator: inspect normalized coordinates, clamp out-of-bounds boxes, and fix YOLO syntax.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.yaml"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isZh ? '上传标注文件' : 'Upload .txt'}</span>
          </button>

          <button
            onClick={handleAutoFix}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isZh ? '一键自动纠错与钳位' : 'Auto-Fix Dataset'}</span>
          </button>

          <button
            onClick={downloadCleanFile}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title={isZh ? '导出纯净标注文件' : 'Download clean labels'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZh ? '下载 clean.txt' : 'Download .txt'}</span>
          </button>

          <button
            onClick={downloadDataYaml}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title={isZh ? '导出 YOLO data.yaml' : 'Download data.yaml'}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>data.yaml</span>
          </button>
        </div>
      </div>

      {fixedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{isZh ? '已完成全量数学钳位与异常重构！所有越界坐标已调整至安全归一化区间，可安全用于模型训练。' : 'Clamping completed! All coordinates within valid ranges.'}</span>
        </div>
      )}

      {/* Preset Scenario Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 mr-1">{isZh ? '快速载入预设场景:' : 'Load Preset Scenarios:'}</span>
        {PRESET_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setRawText(scenario.content)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition cursor-pointer"
          >
            {isZh ? scenario.nameZh : scenario.nameEn}
          </button>
        ))}
      </div>

      {/* Summary KPI Cards with Tabular Numerals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">{isZh ? '检查标注总行数' : 'Total Lines'}</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">{auditResult.summary.total}</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">{isZh ? '完全合规样本' : 'Valid Samples'}</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">{auditResult.summary.valid}</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">{isZh ? '严重语法错误' : 'Critical Errors'}</span>
          <div className={`text-2xl font-bold font-mono tabular-nums ${auditResult.summary.errors > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {auditResult.summary.errors}
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">{isZh ? '边缘溢出警告' : 'Warnings'}</span>
          <div className={`text-2xl font-bold font-mono tabular-nums ${auditResult.summary.warnings > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {auditResult.summary.warnings}
          </div>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Textarea */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{isZh ? 'YOLO 标注文本内容 (.txt 编辑器)' : 'YOLO Annotation Text (.txt)'}</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRawText(SAMPLE_YOLO_DATASET_TXT)}
                className="text-slate-400 hover:text-white text-[11px] cursor-pointer"
              >
                {isZh ? '重置默认' : 'Reset'}
              </button>
              <button
                onClick={() => copyToClipboard(rawText)}
                className="text-cyan-400 hover:text-cyan-300 text-[11px] cursor-pointer flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copySuccess ? '已复制' : '复制'}</span>
              </button>
            </div>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={14}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
            placeholder="粘贴 YOLO 标注文本，如: 0 0.45 0.50 0.12 0.14"
          />

          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>格式标准: &lt;class_id&gt; &lt;x_center&gt; &lt;y_center&gt; &lt;width&gt; &lt;height&gt;</span>
            <span className="text-cyan-400 font-mono">归一化 0.0 ~ 1.0</span>
          </div>
        </div>

        {/* Right: Line-by-Line Diagnostics */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white text-xs flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isZh ? '逐行深度质检诊断结果' : 'Line-by-Line Diagnostics'}</span>
            </span>
            <span className="text-slate-400 text-[11px]">
              {auditResult.summary.errors === 0 ? (
                <span className="text-emerald-400 font-bold">✓ 全部合规，可直接用于模型训练</span>
              ) : (
                <span className="text-rose-400 font-bold">存在阻止训练的语法错误</span>
              )}
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
            {auditResult.items.map((item) => {
              const hasErr = item.errors.length > 0;
              const hasWarn = item.warnings.length > 0;

              return (
                <div
                  key={item.lineNumber}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                    hasErr
                      ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                      : hasWarn
                      ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                      : 'bg-slate-950 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400 font-bold">
                      第 {item.lineNumber} 行: {item.className || `类别ID: ${item.classId ?? '未知'}`}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {hasErr ? (
                        <span className="text-rose-400">● 语法错误</span>
                      ) : hasWarn ? (
                        <span className="text-amber-400">● 边缘警告</span>
                      ) : (
                        <span className="text-emerald-400">● 校验通过</span>
                      )}
                    </span>
                  </div>

                  <div className="font-mono tabular-nums text-[11px] text-slate-300 bg-black/40 px-2 py-1 rounded truncate">
                    {item.rawText}
                  </div>

                  {item.errors.map((err, i) => (
                    <div key={i} className="text-rose-400 text-[11px] flex items-center space-x-1">
                      <span>✕</span>
                      <span>{err}</span>
                    </div>
                  ))}

                  {item.warnings.map((warn, i) => (
                    <div key={i} className="text-amber-400 text-[11px] flex items-center space-x-1">
                      <span>⚠</span>
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
