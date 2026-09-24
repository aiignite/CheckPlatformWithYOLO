import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Target, 
  Activity,
  Download,
  Calendar
} from 'lucide-react';
import { Language } from '../../types/yolo';

interface MesAnalyticsViewProps {
  language: Language;
}

export const MesAnalyticsView: React.FC<MesAnalyticsViewProps> = ({ language }) => {
  const isZh = language === 'zh';
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const stationStats = [
    {
      stationId: 'SMT-01 贴片工位',
      stdCycleTime: 18.0,
      actualCycleTime: 17.2,
      oee: 86.4,
      yieldRate: 98.8,
      status: 'normal',
      dailyOutput: 1840,
    },
    {
      stationId: 'ASSY-02 机械手装配',
      stdCycleTime: 19.8,
      actualCycleTime: 23.4,
      oee: 74.2,
      yieldRate: 97.5,
      status: 'bottleneck',
      dailyOutput: 1420,
    },
    {
      stationId: 'TEST-03 综合电气检测',
      stdCycleTime: 15.0,
      actualCycleTime: 14.8,
      oee: 89.1,
      yieldRate: 99.2,
      status: 'normal',
      dailyOutput: 1890,
    },
    {
      stationId: 'PACK-04 仓储自动包装',
      stdCycleTime: 12.0,
      actualCycleTime: 11.6,
      oee: 92.5,
      yieldRate: 99.9,
      status: 'normal',
      dailyOutput: 2100,
    }
  ];

  const handleExportCsv = () => {
    const headers = ['Station', 'StdCycleTime(s)', 'ActualCycleTime(s)', 'OEE(%)', 'YieldRate(%)', 'DailyOutput(pcs)', 'Status'];
    const rows = stationStats.map((st) => [
      st.stationId,
      st.stdCycleTime,
      st.actualCycleTime,
      st.oee,
      st.yieldRate,
      st.dailyOutput,
      st.status
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes_oee_report_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">
              {isZh ? '生产效率与 MES / OEE 决策看板' : 'MES Production Efficiency & OEE Analytics'}
            </h2>
            <p className="text-xs text-slate-400">
              {isZh
                ? '工序节拍 (Cycle Time) 实时对比 · 产线瓶颈工位智能诊断 · OEE 综合设备效率'
                : 'Real-time cycle time benchmarks, bottleneck identification, and OEE performance indicators.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            {[
              { id: 'today', labelZh: '今日实时', labelEn: 'Today' },
              { id: 'week', labelZh: '近7天', labelEn: '7 Days' },
              { id: 'month', labelZh: '本月度', labelEn: 'Month' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as any)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  timeRange === t.id
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isZh ? t.labelZh : t.labelEn}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZh ? '导出报表' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{isZh ? '综合设备效率 (OEE)' : 'Overall OEE'}</span>
            <span className="text-emerald-400 text-[11px] font-mono tabular-nums font-semibold">标杆达成</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">82.3%</div>
          <div className="text-[11px] text-slate-500">可用率 94.2% × 表现 88.5%</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{isZh ? '累计产出总量' : 'Total Output'}</span>
            <span className="text-cyan-400 text-[11px] font-mono tabular-nums font-semibold">+12.4%</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-cyan-300">
            7,250 <span className="text-xs text-slate-400 font-normal">件</span>
          </div>
          <div className="text-[11px] text-slate-500">计划完成率 96.6%</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{isZh ? '综合直通良品率' : 'First Pass Yield'}</span>
            <span className="text-emerald-400 text-[11px] font-mono tabular-nums font-semibold">达标</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">98.85%</div>
          <div className="text-[11px] text-slate-500">缺陷拦截 13 件 (零流出)</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{isZh ? '平均单件生产节拍' : 'Average Cycle Time'}</span>
            <span className="text-amber-400 text-[11px] font-mono tabular-nums font-semibold">+3.1% 漂移</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-300">
            16.7 <span className="text-xs text-slate-400 font-normal">秒</span>
          </div>
          <div className="text-[11px] text-slate-500">设计标准节拍 16.2 秒</div>
        </div>
      </div>

      {/* Station Cycle Time Comparison & Bottleneck Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{isZh ? '产线各工序节拍 (Cycle Time) 对比与瓶颈定位' : 'Station Cycle Time Benchmarks'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              设计标准节拍 vs 视觉实测节拍
            </span>
          </div>

          <div className="space-y-4">
            {stationStats.map((st) => {
              const isBottleneck = st.status === 'bottleneck';
              const diff = st.actualCycleTime - st.stdCycleTime;

              return (
                <div key={st.stationId} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-bold text-white">
                      <span>{st.stationId}</span>
                      {isBottleneck && (
                        <span className="text-rose-400 font-semibold flex items-center space-x-1 text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>产线瓶颈工位</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 font-mono tabular-nums">
                      <span className="text-slate-400">标准: {st.stdCycleTime}s</span>
                      <span className={`font-bold ${isBottleneck ? 'text-rose-400' : 'text-cyan-300'}`}>
                        实测: {st.actualCycleTime}s ({diff > 0 ? `+${diff.toFixed(1)}s` : `${diff.toFixed(1)}s`})
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Comparison */}
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isBottleneck ? 'bg-gradient-to-r from-rose-600 to-amber-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (st.actualCycleTime / 25) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>当日工件过站: <span className="font-mono tabular-nums text-slate-200">{st.dailyOutput}</span> pcs</span>
                    <span className="text-slate-600">·</span>
                    <span>良品率: <strong className="text-emerald-400 font-mono tabular-nums">{st.yieldRate}%</strong></span>
                    <span className="text-slate-600">·</span>
                    <span>工位 OEE: <strong className="text-cyan-300 font-mono tabular-nums">{st.oee}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Bottleneck Diagnostics Recommendation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2 text-amber-400">
              <Zap className="w-4 h-4" />
              <span>{isZh ? '视觉智能瓶颈归因分析' : 'AI Bottleneck Diagnosis'}</span>
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-amber-200">
                <strong>诊断发现:</strong> ASSY-02 机械手装配工位在进行第 3 工步（二极管吸取对位）时，平均停留耗时 5.3s，超出标杆 1.8s。
              </p>

              <div>
                <strong className="text-white block mb-1">推荐优化行动指南:</strong>
                <ul className="space-y-1.5 list-disc list-inside text-slate-400 text-[11px]">
                  <li>优化真空吸嘴负压传感阈值，减少多次复吸等待；</li>
                  <li>下发标准化视频施教操作片段给 2 号装配岛操作员；</li>
                  <li>将 SMT-01 缓冲区容积临时调整为 15 件以消除线体阻滞。</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>诊断更新时间:</span>
                <span className="font-mono tabular-nums text-cyan-300">刚刚 (实时计算)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
