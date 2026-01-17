
import React from 'react';
import { ExorcismReport } from '../types';
import { ShieldAlert, Sparkles, Skull } from 'lucide-react';

interface Props {
  reports: ExorcismReport[];
}

const ExorcismReportView: React.FC<Props> = ({ reports }) => {
  return (
    <div className="bg-[#001a00] border-2 border-[#00ff00] p-6 rounded-lg font-mono">
      <h3 className="text-2xl creepster text-[#00ff00] mb-4 flex items-center gap-2">
        <Skull className="w-6 h-6" /> EXORCISM REPORT
      </h3>
      <div className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-sm italic opacity-60">No demons detected. The code was remarkably pure.</p>
        ) : (
          reports.map((report, idx) => (
            <div key={idx} className="border-l-4 border-[#00ff00] pl-4 py-2 space-y-1 bg-[#002200]">
              <div className="flex items-center gap-2 text-[#00ff00]">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-bold uppercase tracking-widest text-xs">Entity: {report.demonName}</span>
              </div>
              <p className="text-sm font-bold text-red-400">Violation: {report.bug}</p>
              <div className="flex items-start gap-2 pt-1 opacity-80">
                <Sparkles className="w-3 h-3 mt-1 text-green-300" />
                <p className="text-xs italic">Rite of Purging: {report.remedy}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExorcismReportView;
