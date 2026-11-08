/**
 * ResultCard — displays the verification result with animated styling.
 *
 * Props:
 *   result: { verified, score, match_count, total, message, engine }
 *   onReset: () => void
 */
export default function ResultCard({ result, onReset }) {
  if (!result) return null

  const { verified, score, match_count, total, message, engine } = result
  const pct = Math.round((score || 0) * 100)

  return (
    <div
      className={`rounded-2xl border p-6 mt-6 animate-fade-in transition-all ${
        verified
          ? 'border-green-500/40 bg-green-950/30'
          : 'border-red-500/40 bg-red-950/30'
      }`}
    >
      {/* Icon + Status */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-5xl">{verified ? '✅' : '❌'}</span>
        <div>
          <p className={`text-xl font-bold ${verified ? 'text-green-400' : 'text-red-400'}`}>
            {verified ? 'Identity Verified' : 'Identity Rejected'}
          </p>
          <p className="text-sm text-gray-400">{message}</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Confidence Score</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              verified ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex gap-6 text-sm text-gray-400 mb-4">
        <div>
          <span className="text-gray-200 font-medium">{match_count}</span>/{total} images matched
        </div>
        <div>
          Engine: <span className="text-gray-200 font-medium">{engine}</span>
        </div>
      </div>

      <button
        onClick={onReset}
        className="text-sm text-gray-400 hover:text-white underline underline-offset-2 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

