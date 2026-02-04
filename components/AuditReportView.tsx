
import React from 'react';
import { CodeAuditReport } from '../types';
import { ShieldCheck, Zap, Activity, Info } from 'lucide-react';

interface Props {
  reports: CodeAuditReport[];
}

const AuditReportView: React.FC<Props> = ({ reports }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl font-sans">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-500" /> SYSTEM AUDIT LOG
      </h3>
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <Info className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Validation Passed</p>
            <p className="text-[10px] text-slate-600 italic">No structural anomalies detected in code segments.</p>
          </div>
        ) : (
          reports.map((report, idx) => (
            <div key={idx} className="border-l-4 border-emerald-500 pl-6 py-4 space-y-2 bg-slate-950/50 rounded-r-xl group hover:bg-slate-950 transition-colors">
              <div className="flex items-center gap-2 text-emerald-500">
                <Activity className="w-4 h-4" />
                <span className="font-black uppercase tracking-widest text-[10px]">Module: {report.moduleName}</span>
              </div>
              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Detected: {report.issue}</p>
              <div className="flex items-start gap-2 pt-2 text-slate-500">
                <Zap className="w-3.5 h-3.5 mt-0.5 text-emerald-600" />
                <p className="text-xs italic leading-relaxed">Optimization: {report.optimization}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditReportView;
