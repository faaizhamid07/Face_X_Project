import { useRef, useState, useEffect, useCallback } from 'react'
import WebcamCapture from '../components/WebcamCapture.jsx'
import ResultCard from '../components/ResultCard.jsx'
import { verifyFace, getRegisterStatus } from '../services/api.js'

export default function Verify() {
  const webcamRef = useRef(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [autoVerify, setAutoVerify] = useState(false)
  const [regStatus, setRegStatus] = useState(null)
  const [history, setHistory] = useState([])
  const intervalRef = useRef(null)

  // Load registration status on mount
  useEffect(() => {
    getRegisterStatus()
      .then(d => setRegStatus(d))
      .catch(() => {})
  }, [])

  const runVerify = useCallback(async () => {
    if (loading) return
    const src = webcamRef.current?.getScreenshot()
    if (!src) return

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(src)
      const blob = await res.blob()
      const data = await verifyFace(blob)
      setResult(data)
      // Push to history (keep last 5)
      setHistory(prev => [
        { ...data, timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4),
      ])
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }, [loading])

  // Auto-verify interval
  useEffect(() => {
    if (autoVerify) {
      intervalRef.current = setInterval(runVerify, 2500)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [autoVerify, runVerify])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Verify Identity</h1>
        <p className="text-gray-400">
          Point your face at the camera and press{' '}
          <strong className="text-white">🔍 Verify Me</strong>.
        </p>
      </div>

      {/* Registration warning */}
      {regStatus && !regStatus.ready && (
        <div className="px-4 py-3 rounded-xl bg-yellow-900/30 border border-yellow-500/30 text-yellow-300 text-sm">
          ⚠️ You have {regStatus.registered} reference image(s) registered. Go to{' '}
          <a href="/register" className="underline font-medium">Register</a> and add at least 5.
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Webcam + controls */}
        <div className="flex flex-col items-center gap-4">
          <WebcamCapture webcamRef={webcamRef} label="Face the camera clearly" />

          <button
            onClick={runVerify}
            disabled={loading || autoVerify}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Verifying…
              </span>
            ) : '🔍 Verify Me'}
          </button>

          {/* Auto-verify toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setAutoVerify(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                autoVerify ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  autoVerify ? 'translate-x-5' : ''
                }`}
              />
            </div>
            <span className="text-sm text-gray-400">
              Auto-verify every 2.5s
            </span>
          </label>
        </div>

        {/* Result + History */}
        <div className="flex-1 flex flex-col gap-6">
          <ResultCard result={result} onReset={() => { setResult(null); setError(null) }} />

          {history.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Recent Attempts
              </h2>
              <div className="flex flex-col gap-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm border ${
                      h.verified
                        ? 'border-green-500/20 bg-green-950/20'
                        : 'border-red-500/20 bg-red-950/20'
                    }`}
                  >
                    <span>{h.verified ? '✅ Verified' : '❌ Rejected'}</span>
                    <span className="text-gray-500 text-xs">
                      {Math.round((h.score || 0) * 100)}% — {h.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

