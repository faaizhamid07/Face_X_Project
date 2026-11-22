import { ShieldCheck, ShieldAlert, RotateCcw, Cpu, Layers } from 'lucide-react'

export default function ResultCard({ result, onReset }) {
  if (!result) return null

  const { verified, score, match_count, total, message, engine } = result
  const pct = Math.round((score || 0) * 100)

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 mt-6 border transition-all duration-300 shadow-elevation-md ${verified
        ? 'bg-[var(--color-bg-glass)] border-[var(--color-border-accent)]'
        : 'bg-[var(--color-bg-glass)] border-[var(--color-border-accent)]'}`
    }>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
              verified
                ? 'bg-[var(--color-bg-glass)] var(--color-accent-primary)'
                : 'bg-[var(--color-bg-glass)] var(--color-accent-alert)'}`}
          >
            {verified ? (
              <ShieldCheck className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xl font-bold tracking-tight [text-wrap:balance] ${verified ? 'var(--color-accent-primary)' : 'var(--color-accent-alert)'}`}>
                {verified ? 'Biometric Match Confirmed' : 'Authentication Failed'}
              </h3>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${verified
                ? 'bg-[var(--color-bg-glass)] var(--color-accent-primary)]'
                : 'bg-[var(--color-bg-glass)] var(--color-accent-alert)]'}`}>
                {verified ? 'PASSED' : 'REJECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 [text-wrap:pretty]">{message}</p>
          </div>
        </div>

        {/* Confidence Percentage */}
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Match Confidence</span>
          <span className={`text-3xl font-bold font-mono tracking-tight ${verified ? 'var(--color-accent-primary)' : 'var(--color-accent-alert)'}`}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Confidence gauge bar */}
      <div className="space-y-1.5 mb-6">
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, background: verified ? 'var(--color-accent-primary)' : 'var(--color-accent-alert)' }}
          />
        </div>
      </div>

      {/* Flattened Forensic Metadata (divided by top border, no nested card) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 mb-6 text-xs font-mono">
        <div>
          <span className="text-slate-400 uppercase block">Sample Consensus</span>
          <span className="text-slate-200 font-semibold flex items-center gap-1.5 mt-1">
            <Layers className="w-4 h-4" />
            {match_count} of {total} images matched
          </span>
        </div>
        <div>
          <span className="text-slate-400 uppercase block">Inference Engine</span>
          <span className="text-slate-200 font-semibold flex items-center gap-1.5 mt-1">
            <Cpu className="w-4 h-4" />
            {engine || 'Siamese ConvNet'}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-slate-400 uppercase block">Decision Metric</span>
          <span className="text-slate-200 font-semibold mt-1 block truncate">
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