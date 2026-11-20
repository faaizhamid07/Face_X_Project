import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, RotateCcw, Cpu, Layers } from 'lucide-react'

export default function ResultCard({ result, onReset }) {
  if (!result) return null

  const { verified, score, match_count, total, message, engine } = result
  const pct = Math.round((score || 0) * 100)

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 mt-6 backdrop-blur-2xl border transition-all duration-500 shadow-glass-lg ${
        verified
          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-glow-emerald'
          : 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_25px_-3px_rgba(244,63,94,0.3)]'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${
              verified
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                : 'bg-rose-500/20 border-rose-400/50 text-rose-300'
            }`}
          >
            {verified ? (
              <ShieldCheck className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xl font-extrabold tracking-tight ${
                verified ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                {verified ? 'BIOMETRIC MATCH CONFIRMED' : 'AUTHENTICATION FAILED'}
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                verified
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {verified ? 'PASSED' : 'REJECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-300/80 mt-1">{message}</p>
          </div>
        </div>

        {/* Big percentage badge */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Match Confidence</span>
          <span className={`text-3xl font-black font-mono tracking-tight ${
            verified ? 'text-emerald-300' : 'text-rose-400'
          }`}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Confidence gauge bar */}
      <div className="space-y-1.5 mb-6">
        <div className="h-2.5 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              verified
                ? 'bg-gradient-to-r from-teal-400 to-emerald-400 shadow-[0_0_12px_#34d399]'
                : 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_12px_#f43f5e]'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Forensic Metadata Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-950/40 border border-white/5 mb-6 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Sample Consensus</span>
          <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            {match_count} of {total} images matched
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Inference Engine</span>
          <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            {engine || 'Siamese ConvNet'}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase block">Decision Metric</span>
          <span className="text-slate-200 font-semibold mt-0.5 block truncate">
            L1 Distance ≤ Threshold
          </span>
        </div>
      </div>

      {/* Reset Action */}
      <div className="flex justify-end">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold glass-pill text-slate-300 hover:text-white hover:bg-white/10 border border-white/15 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Biometric Sensor</span>
        </button>
      </div>
    </div>
  )
}
