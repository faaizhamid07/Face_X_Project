import { useRef, useState, useEffect } from 'react'
import WebcamCapture from '../components/WebcamCapture.jsx'
import { captureRegister, getRegisterStatus, resetRegistration } from '../services/api.js'

const MIN_IMAGES = 5

export default function Register() {
  const webcamRef = useRef(null)
  const [captures, setCaptures] = useState([])      // local base64 thumbnails
  const [savedCount, setSavedCount] = useState(0)   // images already on the server
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  // Load current registration status on mount
  useEffect(() => {
    getRegisterStatus()
      .then(d => setSavedCount(d.registered))
      .catch(() => {})
  }, [])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function handleCapture() {
    const src = webcamRef.current?.getScreenshot()
    if (!src) return
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
        // Convert base64 data-URL to Blob
        const res = await fetch(src)
        const blob = await res.blob()
        const data = await captureRegister(blob)
        lastCount = data.total_registered
      }
      setSavedCount(lastCount)
      setCaptures([])
      showToast(`✅ ${captures.length} image(s) saved! Total: ${lastCount}`)
    } catch (err) {
      showToast(`❌ Failed to save: ${err.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleReset() {
    if (!confirm('Clear all registered face images?')) return
    try {
      await resetRegistration()
      setSavedCount(0)
      setCaptures([])
      showToast('🗑️ Registration cleared.')
    } catch (err) {
      showToast(`❌ ${err.message}`, 'error')
    }
  }

  const total = savedCount + captures.length
  const progress = Math.min(100, Math.round((total / MIN_IMAGES) * 100))
  const isReady = total >= MIN_IMAGES

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Register Your Face</h1>
        <p className="text-gray-400">
          Capture at least <strong className="text-white">{MIN_IMAGES} photos</strong> so the model
          can recognise you.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            toast.type === 'error'
              ? 'bg-red-900/50 border border-red-500/40 text-red-200'
              : 'bg-green-900/50 border border-green-500/40 text-green-200'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress ({total}/{MIN_IMAGES} minimum)</span>
          <span className={isReady ? 'text-green-400 font-medium' : ''}>{isReady ? '✅ Ready!' : `${progress}%`}</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isReady ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {savedCount > 0 && (
          <p className="text-xs text-gray-500 mt-1">{savedCount} image(s) already saved on server</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Webcam */}
        <div className="flex flex-col items-center gap-4">
          <WebcamCapture webcamRef={webcamRef} label="Position your face in the frame" />
          <button
            onClick={handleCapture}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors w-full"
          >
            📸 Capture Photo
          </button>
        </div>

        {/* Thumbnails + actions */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-200">
            Captured ({captures.length})
          </h2>

          {captures.length === 0 ? (
            <div className="flex-1 border border-dashed border-gray-700 rounded-2xl flex items-center justify-center min-h-[200px]">
              <p className="text-gray-600 text-sm">No captures yet. Click "Capture Photo".</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {captures.map((src, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-700">
                  <img src={src} alt={`capture-${i}`} className="w-full h-28 object-cover" />
                  <button
                    onClick={() => removeCapture(i)}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-auto pt-4">
            <button
              onClick={handleSave}
              disabled={captures.length === 0 || saving}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {saving ? 'Saving…' : `✅ Save ${captures.length} Image(s)`}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-gray-800 hover:bg-red-900/50 hover:border-red-500/40 text-gray-400 hover:text-red-300 font-medium rounded-xl border border-gray-700 transition-colors"
            >
              🗑️ Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

