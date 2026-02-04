
import React from 'react';
import { Cpu, Brain, Database, ShieldCheck, Zap, Globe, Layers, ArrowRight } from 'lucide-react';

export default function ArchitectureView() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
           <h3 className="text-4xl font-black text-white tracking-tighter">System Blueprint</h3>
           <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.4em]">Gemini 3 Pro Logic Pipeline v6.0</p>
        </div>

        <div className="grid gap-12">
          {/* Phase 1 */}
          <div className="flex flex-col md:flex-row items-center gap-10">
             <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center shrink-0">
                <Layers className="w-10 h-10 text-emerald-500" />
             </div>
             <div className="flex-1 space-y-4 text-center md:text-left">
                <h4 className="text-xl font-bold text-white flex items-center gap-3 justify-center md:justify-start">
                   1. Pattern Perception
                   <span className="text-[10px] bg-slate-900 px-3 py-1 rounded-full text-slate-500 border border-slate-800 uppercase tracking-widest">Gemini 3 Flash</span>
                </h4>
                <p className="text-slate-400 font-light leading-relaxed">
                   High-speed optical neural mapping. We feed raw physical image data into <strong>Gemini 3 Flash</strong> to perform sub-pixel alignment on the 80x12 Hollerith grid. This provides the primary coordinate map of the legacy instruction set.
                </p>
             </div>
          </div>

          <div className="flex justify-center md:justify-start md:pl-10 text-slate-800"><ArrowRight className="w-8 h-8 rotate-90 md:rotate-0" /></div>

          {/* Phase 2 */}
          <div className="flex flex-col md:flex-row items-center gap-10">
             <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center shrink-0">
                <Brain className="w-10 h-10 text-blue-400" />
             </div>
             <div className="flex-1 space-y-4 text-center md:text-left">
                <h4 className="text-xl font-bold text-white flex items-center gap-3 justify-center md:justify-start">
                   2. Neural Synthesis
                   <span className="text-[10px] bg-blue-500/10 px-3 py-1 rounded-full text-blue-400 border border-blue-500/20 uppercase tracking-widest">Gemini 3 Pro</span>
                </h4>
                <p className="text-slate-400 font-light leading-relaxed">
                   The core logical bridge. We leverage <strong>Gemini 3 Pro</strong> with a high <em>Thinking Budget</em> to understand heritage semantics. It reconstructs the intended business logic from ancient instruction sets (EBCDIC/IBM) and transforms it into optimized, cloud-native modern code.
                </p>
             </div>
          </div>

          <div className="flex justify-center md:justify-start md:pl-10 text-slate-800"><ArrowRight className="w-8 h-8 rotate-90 md:rotate-0" /></div>

          {/* Phase 3 */}
          <div className="flex flex-col md:flex-row items-center gap-10">
             <div className="w-24 h-24 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-10 h-10 text-purple-400" />
             </div>
             <div className="flex-1 space-y-4 text-center md:text-left">
                <h4 className="text-xl font-bold text-white flex items-center gap-3 justify-center md:justify-start">
                   3. Post-Restoration Audit
                </h4>
                <p className="text-slate-400 font-light leading-relaxed">
                   Automated structural validation. The synthesized logic is passed through a multi-point audit to identify memory optimizations, modern security vulnerabilities, and logic parity with the original heritage source.
                </p>
             </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[2.5rem] mt-20">
          <div className="flex items-center gap-6 mb-8">
             <Zap className="w-10 h-10 text-emerald-500" />
             <h4 className="text-2xl font-bold text-white">Innovation Spotlight</h4>
          </div>
          <p className="text-slate-400 leading-relaxed font-light mb-8">
             Unlike simple OCR, PunchRevive performs <strong>semantic archaeology</strong>. By combining Gemini's vision and reasoning, we solve the "Black Box" problem of heritage mainframes. Companies can now migrate mission-critical logic from cardstock directly to Kubernetes clusters with full auditability.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { label: 'Latency', val: '<2s' },
               { label: 'Analysis', val: 'Multimodal' },
               { label: 'Security', val: 'AES-GCM' },
               { label: 'Scaling', val: 'Global' }
             ].map((stat, i) => (
               <div key={i} className="text-center p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                  <p className="text-xl font-black text-white">{stat.val}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
