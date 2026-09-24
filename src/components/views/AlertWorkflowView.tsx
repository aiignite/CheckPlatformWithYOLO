import React, { useState } from 'react';
import { 
  BellRing, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Filter, 
  Check,
  Search,
  Download,
  Eye,
  Camera,
  X
} from 'lucide-react';
import { AlertItem, Language } from '../../types/yolo';

interface AlertWorkflowViewProps {
  alerts: AlertItem[];
  language: Language;
  onUpdateAlertStatus: (alertId: string, status: 'pending' | 'investigating' | 'resolved') => void;
}

export const AlertWorkflowView: React.FC<AlertWorkflowViewProps> = ({
  alerts,
  language,
  onUpdateAlertStatus,
}) => {
  const isZh = language === 'zh';
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity !== 'all' && a.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.stationId.toLowerCase().includes(q) ||
        a.cameraName.toLowerCase().includes(q) ||
        a.detail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Station', 'Camera', 'Severity', 'Status', 'Timestamp', 'Title', 'Detail', 'AssignedTo'];
    const rows = alerts.map((a) => [
      a.id,
      a.stationId,
      a.cameraName,
      a.severity,
      a.status,
      a.timestamp,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.detail.replace(/"/g, '""')}"`,
      a.assignedTo || 'Unassigned'
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerts_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAcknowledgeAll = () => {
    alerts
      .filter((a) => a.status === 'pending')
      .forEach((a) => onUpdateAlertStatus(a.id, 'investigating'));
  };

  const getSeverityBadge = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return (
          <span className="text-rose-400 font-semibold flex items-center space-x-1 text-xs">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>{isZh ? '紧急' : 'Critical'}</span>
          </span>
        );
      case 'warning':
        return (
          <span className="text-amber-400 font-semibold flex items-center space-x-1 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{isZh ? '警告' : 'Warning'}</span>
          </span>
        );
      case 'info':
        return (
          <span className="text-cyan-400 font-semibold flex items-center space-x-1 text-xs">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{isZh ? '提示' : 'Info'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-rose-950 border border-rose-500/30 text-rose-400">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">
              {isZh ? '工业告警闭环与工单流转中枢' : 'Industrial Alerts & Closed-Loop Workflow'}
            </h2>
            <p className="text-xs text-slate-400">
              {isZh
                ? '视觉缺陷即时捕获 · 三级严重度分诊 · 责任人流转与现场存证查验'
                : 'Real-time vision alert capture, 3-tier severity triage, DingTalk/WeChat notification & SLA audit.'}
            </p>
          </div>
        </div>

        {/* Global Batch Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAcknowledgeAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isZh ? '一键全部认领' : 'Acknowledge All'}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZh ? '导出工单 CSV' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isZh ? '按工位、缺陷或内容搜索...' : 'Search alerts...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs w-full sm:w-auto overflow-x-auto">
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer capitalize ${
                selectedSeverity === sev
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sev === 'all' ? (isZh ? '全部级别' : 'All') : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-white">
            {isZh ? '告警事件列表' : 'Alert Incident Feed'} ({filteredAlerts.length})
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            SLA响应标准: 严重级≤3分钟响应 · 警告级≤15分钟响应
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              {isZh ? '当前筛选条件下暂无告警记录' : 'No alerts match current filter'}
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCritical = alert.severity === 'critical';
              return (
                <div
                  key={alert.id}
                  className={`p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all cursor-pointer ${
                    isCritical ? 'bg-rose-950/15 hover:bg-rose-950/25' : 'hover:bg-slate-800/40'
                  }`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      {getSeverityBadge(alert.severity)}
                      <span className="text-slate-600">·</span>
                      <span className="font-mono tabular-nums text-xs text-slate-400">[{alert.stationId}]</span>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono tabular-nums text-xs text-cyan-400">{alert.timestamp}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-300">
                        {alert.status === 'resolved' ? (
                          <span className="text-emerald-400 font-medium">● 已处置</span>
                        ) : alert.status === 'investigating' ? (
                          <span className="text-amber-400 font-medium">● 排查中</span>
                        ) : (
                          <span className="text-rose-400 font-medium animate-pulse">● 待认领</span>
                        )}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{alert.detail}</p>

                    <div className="text-[11px] text-slate-400 flex items-center space-x-4 pt-1">
                      <span>来源相机: <strong className="text-slate-200">{alert.cameraName}</strong></span>
                      <span>责任人: <strong className="text-cyan-300">{alert.assignedTo || '待认领'}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-start md:self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isZh ? '现场查验' : 'Inspect'}</span>
                    </button>

                    {alert.status === 'pending' && (
                      <button
                        onClick={() => onUpdateAlertStatus(alert.id, 'investigating')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition cursor-pointer"
                      >
                        {isZh ? '认领排查' : 'Acknowledge'}
                      </button>
                    )}

                    {alert.status === 'investigating' && (
                      <button
                        onClick={() => onUpdateAlertStatus(alert.id, 'resolved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition cursor-pointer flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isZh ? '完成闭环' : 'Resolve'}</span>
                      </button>
                    )}

                    {alert.status === 'resolved' && (
                      <span className="text-emerald-400 text-xs font-medium flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isZh ? '工单已闭环' : 'Closed'}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Alert Details & Evidence Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fadeIn">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getSeverityBadge(selectedAlert.severity)}
                <h3 className="font-bold text-white text-sm">{selectedAlert.title}</h3>
                <span className="text-xs text-slate-400 font-mono tabular-nums">[{selectedAlert.stationId}]</span>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Evidence Snapshot */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                <svg className="w-full h-full text-slate-800" viewBox="0 0 400 225" fill="none">
                  <rect width="400" height="225" fill="#090d16" />
                  <rect x="40" y="30" width="320" height="165" rx="6" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                  <ellipse cx="200" cy="112" rx="20" ry="12" fill="#f43f5e" opacity="0.4" />
                </svg>
                {/* Red Bounding Box on Defect */}
                <div className="absolute inset-x-28 inset-y-16 border-2 border-rose-500 bg-rose-500/15 flex items-start justify-start p-1">
                  <span className="bg-rose-600 text-white font-mono tabular-nums text-[10px] px-1 rounded">
                    DEFECT 96.8%
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] font-mono tabular-nums text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                  TIMESTAMP: {selectedAlert.timestamp} | CAM: {selectedAlert.cameraName}
                </div>
              </div>

              {/* Details & Resolution */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1 font-semibold">异常现象与智能诊断:</span>
                  {selectedAlert.detail}
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-400">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="block text-slate-500 text-[11px]">当前处理状态</span>
                    <strong className="text-white capitalize">{selectedAlert.status}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="block text-slate-500 text-[11px]">责任工程师</span>
                    <strong className="text-cyan-300">{selectedAlert.assignedTo || '待指派'}</strong>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  {isZh ? '关闭' : 'Close'}
                </button>
                {selectedAlert.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      onUpdateAlertStatus(selectedAlert.id, 'resolved');
                      setSelectedAlert(null);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition cursor-pointer"
                  >
                    {isZh ? '确认处置闭环' : 'Mark as Resolved'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
