import { useRef, useState, useEffect } from 'react'
import { 
  Camera, 
  Save, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Shield, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react'
import WebcamCapture from '../components/WebcamCapture.jsx'
import { captureRegister, getRegisterStatus, resetRegistration } from '../services/api.js'

const MIN_IMAGES = 5

export default function Register() {
  const webcamRef = useRef(null)
  const [captures, setCaptures] = useState([])
  const [savedCount, setSavedCount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    getRegisterStatus()
      .then(d => setSavedCount(d.registered || 0))
      .catch(() => {})
  }, [])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  function handleCapture() {
    const src = webcamRef.current?.getScreenshot()
    if (!src) return

    // Camera flash animation
    setFlash(true)
    setTimeout(() => setFlash(false), 200)

    setCaptures(prev => [...prev, src])
  }

  function removeCapture(index) {
    setCaptures(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (captures.length === 0) return
    setSaving(true)
    try {
      let lastCount = savedCount
      for (const src of captures) {
        const res = await fetch(src)
        const blob = await res.blob()
        const data = await captureRegister(blob)
        lastCount = data.total_registered
      }
      setSavedCount(lastCount)
      setCaptures([])
      showToast(`Biometric vault updated! Successfully enrolled ${captures.length} face vector(s). Total: ${lastCount}`)
    } catch (err) {
      showToast(`Enrollment failed: ${err.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleReset() {
    if (!confirm('Erase all enrolled face vectors from the local biometric vault?')) return
    try {
      await resetRegistration()
      setSavedCount(0)
      setCaptures([])
      showToast('Biometric vault reset. All registered profiles cleared.')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const total = savedCount + captures.length
  const progress = Math.min(100, Math.round((total / MIN_IMAGES) * 100))
  const isReady = total >= MIN_IMAGES

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 glass-pill px-3 py-1 rounded-full mb-2">
            <UserCheck className="w-3.5 h-3.5" /> BIOMETRIC VAULT ENROLLMENT
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Register Identity Profile
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Capture multiple angles (neutral, smile, slight turn) to optimize Siamese embedding variance.
          </p>
        </div>

        {/* Saved Count Badge */}
        <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 self-start border border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="text-xs">
            <span className="text-slate-400 block font-mono uppercase text-[10px]">Vault Storage</span>
            <span className="font-semibold text-white">{savedCount} Profile Image{savedCount === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-3 backdrop-blur-xl border transition-all animate-fade-in ${
            toast.type === 'error'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Progress & Quota Card */}
      <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-slate-300 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Enrollment Quota ({total} / {MIN_IMAGES} recommended minimum)
          </span>
          <span className={`font-mono font-bold ${isReady ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {isReady ? 'READY FOR VERIFICATION' : `${progress}% COMPLETED`}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isReady 
                ? 'bg-gradient-to-r from-teal-400 to-emerald-400 shadow-[0_0_10px_#34d399]' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Webcam Capture Studio */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4">
          <div className="relative w-full">
            <WebcamCapture webcamRef={webcamRef} label="Active Sensor Stream (100×100 Biometric Crop)" />
            {flash && (
              <div className="absolute inset-0 bg-white/40 rounded-3xl pointer-events-none transition-opacity duration-200" />
            )}
          </div>

          <button
            onClick={handleCapture}
            className="w-full max-w-[420px] py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-glow-cyan transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2.5"
          >
            <Camera className="w-4 h-4 text-cyan-100" />
            <span>Capture Biometric Frame</span>
          </button>
        </div>

        {/* Right: Staged Captures & Vault Actions */}
        <div className="lg:col-span-7 flex flex-col gap-5 rounded-3xl glass-panel p-6 border border-white/10 min-h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Staged Vector Frames
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {captures.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Images pending commit to server storage</p>
            </div>

            {savedCount > 0 && (
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl glass-pill hover:bg-rose-950/30 border border-rose-500/20 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge Vault</span>
              </button>
            )}
          </div>

          {/* Staged Image Gallery */}
          {captures.length === 0 ? (
            <div className="flex-1 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center bg-slate-950/30">
              <Camera className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-300">No new frames captured in this session</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Align your face in the camera viewport and click "Capture Biometric Frame" to stage reference photos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {captures.map((src, i) => (
                <div 
                  key={i} 
                  className="group relative rounded-xl overflow-hidden glass-panel border border-white/15 aspect-square"
                >
                  <img src={src} alt={`frame-${i}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-1 left-2 text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    #{i + 1}
                  </span>
                  <button
                    onClick={() => removeCapture(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Vault Commit Actions */}
          <div className="pt-4 mt-auto border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={captures.length === 0 || saving}
              className="flex-1 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-glow-emerald transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Encrypting & Saving…' : `Commit ${captures.length} Frame(s) to Vault`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
