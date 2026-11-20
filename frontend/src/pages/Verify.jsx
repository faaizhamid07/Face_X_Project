import { useRef, useState, useEffect, useCallback } from 'react'
import { 
  ShieldCheck, 
  ShieldAlert, 
  ScanFace, 
  Activity, 
  Sparkles, 
  RotateCw, 
  AlertTriangle, 
  Clock, 
  Layers,
  CheckCircle2,
  XCircle,
  Cpu
} from 'lucide-react'
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
    const startTime = performance.now()
    try {
      const res = await fetch(src)
      const blob = await res.blob()
      const data = await verifyFace(blob)
      const latency = Math.round(performance.now() - startTime)
      setResult(data)
      setHistory(prev => [
        { 
          ...data, 
          latency, 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
        },
        ...prev.slice(0, 4),
      ])
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }, [loading])

  useEffect(() => {
    if (autoVerify) {
      intervalRef.current = setInterval(runVerify, 2500)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [autoVerify, runVerify])

  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 glass-pill px-3 py-1 rounded-full mb-2">
            <ScanFace className="w-3.5 h-3.5" /> LIVE NEURAL INFERENCE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Biometric Authentication
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Align your face in the optical frame for instantaneous Siamese L1 distance matching.
          </p>
        </div>

        {/* Live mode indicator */}
        <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 self-start border border-white/10">
          <div className={`w-2.5 h-2.5 rounded-full ${autoVerify ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`} />
          <div className="text-xs">
            <span className="text-slate-400 block font-mono uppercase text-[10px]">Sensor Engine</span>
            <span className="font-semibold text-white">{autoVerify ? 'Continuous Polling' : 'On-Demand Auth'}</span>
          </div>
        </div>
      </div>

      {/* Warnings & Alerts */}
      {regStatus && !regStatus.ready && (
        <div className="px-5 py-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-center gap-3 backdrop-blur-xl">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Only {regStatus.registered} profile frame(s) detected in the local vault. For high-fidelity verification, please{' '}
            <a href="/register" className="underline font-bold text-amber-300 hover:text-white">
              enroll at least 5 frames here
            </a>.
          </span>
        </div>
      )}

      {error && (
        <div className="px-5 py-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-3 backdrop-blur-xl">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Authentication Error: {error}</span>
        </div>
      )}

      {/* Main Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Camera Studio */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4">
          <WebcamCapture 
            webcamRef={webcamRef} 
            label="Optical Biometric Sensor Stream" 
            scanning={loading || autoVerify}
          />

          {/* Trigger Button */}
          <button
            onClick={runVerify}
            disabled={loading || autoVerify}
            className="w-full max-w-[420px] py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-cyan transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 text-cyan-200 animate-spin" />
                <span>Evaluating Siamese Distances…</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-cyan-200" />
                <span>Verify Identity Now</span>
              </>
            )}
          </button>

          {/* Continuous Auth Switch */}
          <div 
            onClick={() => setAutoVerify(v => !v)}
            className="w-full max-w-[420px] flex items-center justify-between p-3.5 rounded-2xl glass-panel border border-white/10 cursor-pointer select-none hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-center gap-2.5 text-xs">
              <Activity className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-white block">Continuous Surveillance Mode</span>
                <span className="text-[11px] text-slate-400">Trigger neural inference every 2.5s</span>
              </div>
            </div>

            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 p-0.5 border ${
                autoVerify 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400/50' 
                  : 'bg-slate-800 border-white/10'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  autoVerify ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right: Verification Output & Audit Log */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Active Result Card */}
          {result ? (
            <ResultCard result={result} onReset={() => { setResult(null); setError(null) }} />
          ) : (
            <div className="rounded-3xl glass-panel p-8 border border-white/10 flex flex-col items-center justify-center text-center min-h-[220px]">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-3 shadow-glow-cyan">
                <ScanFace className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Biometric Sensor Standby</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Point your face towards the optical sensor and press "Verify Identity Now" to calculate real-time embedding distances.
              </p>
            </div>
          )}

          {/* Audit Telemetry History */}
          {history.length > 0 && (
            <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Recent Verification Telemetry
                </h3>
                <span className="text-[10px] font-mono text-slate-500">LAST {history.length} ATTEMPTS</span>
              </div>

              <div className="space-y-2">
                {history.map((h, i) => {
                  const pass = h.verified
                  const pct = Math.round((h.score || 0) * 100)
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono border transition-all ${
                        pass
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                          : 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {pass ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-bold">{pass ? 'MATCH CONFIRMED' : 'REJECTED'}</span>
                        <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                          ({h.match_count}/{h.total} samples)
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {h.latency && (
                          <span className="text-[10px] text-slate-400">{h.latency}ms</span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                          pass
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                        }`}>
                          {pct}%
                        </span>
                        <span className="text-[10px] text-slate-500">{h.timestamp}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
