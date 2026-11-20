import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { startTraining, getTrainingStatus, uploadDataset } from '../services/api'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatETA(seconds) {
  if (seconds == null || seconds <= 0) return '< 1 sec'
  if (seconds < 60) return `${Math.round(seconds)} sec`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return s > 0 ? `${m} min ${s} sec` : `${m} min`
}

function now() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false })
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Card({ children, className = '' }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}

function MetricsTable({ metrics }) {
  const fmt = (v) => (v == null ? '—' : typeof v === 'number' ? v.toFixed(4) : v)
  const fmtPct = (v) => (v == null ? '—' : `${(v * 100).toFixed(1)}%`)

  const cells = [
    { label: 'Loss', value: fmt(metrics?.loss) },
    { label: 'Val Loss', value: fmt(metrics?.val_loss) },
    { label: 'Accuracy', value: fmtPct(metrics?.accuracy) },
    { label: 'Val Accuracy', value: fmtPct(metrics?.val_accuracy) },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cells.map(({ label, value }) => (
        <div key={label} className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{label}</div>
          <div className="text-lg font-mono font-semibold text-blue-300">{value}</div>
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ pct }) {
  return (
    <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
        {pct.toFixed(0)}%
      </span>
    </div>
  )
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin align-middle" />
  )
}

function LogPanel({ logs }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="mt-4">
      <div className="text-sm font-semibold text-gray-300 mb-2">📋 Training Log</div>
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 h-48 overflow-y-auto font-mono text-xs text-gray-400 space-y-0.5">
        {logs.length === 0 ? (
          <span className="text-gray-600">Waiting for log output…</span>
        ) : (
          logs.map((line, i) => (
            <div key={i} className="leading-5">
              {line}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function DatasetInstructionCard({ datasetReady, onRefresh, checking }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null) // { type: 'success' | 'error', message: string }
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setUploadStatus({ type: 'error', message: 'Please select a valid .zip file.' })
      return
    }
    setSelectedFile(file)
    setUploadStatus(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setUploadProgress(0)
    setUploadStatus(null)
    try {
      const res = await uploadDataset(selectedFile, (pct) => {
        setUploadProgress(pct)
      })
      setUploadStatus({
        type: 'success',
        message: res.message || 'Dataset uploaded and extracted successfully!',
      })
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (onRefresh) onRefresh()
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message:
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Failed to upload dataset zip file.',
      })
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const mb = bytes / (1024 * 1024)
    if (mb >= 1) return `${mb.toFixed(1)} MB`
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return (
    <Card className="border-blue-900/50 bg-blue-950/20 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">📦</span>
          <div>
            <h2 className="font-semibold text-blue-300 text-base">LFW Training Dataset</h2>
            <p className="text-xs text-gray-400">Required background face dataset for Siamese network training</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {datasetReady != null && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                datasetReady
                  ? 'bg-green-950/70 text-green-400 border-green-800'
                  : 'bg-yellow-950/70 text-yellow-300 border-yellow-800'
              }`}
            >
              {datasetReady ? '✓ Dataset Detected' : '⚠️ Dataset Missing'}
            </span>
          )}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={checking}
              className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors"
              title="Check dataset directory"
            >
              {checking ? 'Checking…' : '🔄 Check'}
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-300 space-y-4">
        <p>
          The Siamese Neural Network requires the <strong>Labeled Faces in the Wild (LFW)</strong> dataset. You can download the zip file from Kaggle and upload it directly below:
        </p>

        <div>
          <a
            href="https://www.kaggle.com/datasets/jessicali9530/lfw-dataset?resource=download"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/90 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors shadow group"
          >
            <span>⬇️</span>
            <span>Download LFW Dataset (.zip) from Kaggle</span>
            <span className="text-xs text-blue-200 group-hover:translate-x-0.5 transition-transform">↗</span>
          </a>
        </div>

        {/* Upload ZIP File Area */}
        <div className="border border-dashed border-gray-700 hover:border-blue-500/70 bg-gray-950/60 rounded-xl p-4 transition-colors">
          <input
            type="file"
            accept=".zip"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="dataset-zip-upload"
          />

          {!selectedFile && !uploading && (
            <label
              htmlFor="dataset-zip-upload"
              className="flex flex-col items-center justify-center cursor-pointer py-3 space-y-2 text-center"
            >
              <div className="text-3xl">📁</div>
              <div className="text-sm font-medium text-blue-300">
                Click to browse or drop your dataset <span className="font-mono text-xs">.zip</span> file here
              </div>
              <div className="text-xs text-gray-500">Supports Kaggle lfw-dataset.zip</div>
            </label>
          )}

          {selectedFile && !uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-xl">🗜️</span>
                  <div className="truncate">
                    <div className="text-xs font-medium text-white truncate">{selectedFile.name}</div>
                    <div className="text-[11px] text-gray-500">{formatFileSize(selectedFile.size)}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="text-gray-400 hover:text-red-400 text-xs px-2 py-1 rounded transition-colors"
                >
                  ✕ Remove
                </button>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors shadow flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>Upload & Extract Dataset</span>
              </button>
            </div>
          )}

          {uploading && (
            <div className="py-3 space-y-2 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-blue-300 font-medium">
                <Spinner />
                <span>
                  {uploadProgress < 100
                    ? `Uploading dataset (${uploadProgress}%)…`
                    : 'Extracting dataset into project…'}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500">Please keep this window open while processing.</p>
            </div>
          )}

          {uploadStatus && (
            <div
              className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                uploadStatus.type === 'success'
                  ? 'bg-green-950/60 border border-green-800 text-green-300'
                  : 'bg-red-950/60 border border-red-800 text-red-300'
              }`}
            >
              <span>{uploadStatus.type === 'success' ? '✅' : '❌'}</span>
              <span>{uploadStatus.message}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const SSE_URL = '/api/train/stream'
const MAX_LOGS = 100

export default function Train() {
  const [status, setStatus] = useState('idle') // idle | running | complete | error
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [totalEpochs, setTotalEpochs] = useState(0)
  const [metrics, setMetrics] = useState(null)
  const [logs, setLogs] = useState([])
  const [etaSeconds, setEtaSeconds] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [starting, setStarting] = useState(false)
  const [datasetReady, setDatasetReady] = useState(null)
  const [datasetDir, setDatasetDir] = useState('')
  const [checkingDataset, setCheckingDataset] = useState(false)

  const esRef = useRef(null)

  // ── Log helper ──────────────────────────────────────────────────────────
  const addLog = useCallback((msg) => {
    setLogs((prev) => {
      const entry = `[${now()}] ${msg}`
      const next = [...prev, entry]
      return next.length > MAX_LOGS ? next.slice(next.length - MAX_LOGS) : next
    })
  }, [])

  // ── Open SSE ────────────────────────────────────────────────────────────
  const connectSSE = useCallback(() => {
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }

    const es = new EventSource(SSE_URL)
    esRef.current = es

    es.addEventListener('epoch', (e) => {
      try {
        const d = JSON.parse(e.data)
        setCurrentEpoch(d.epoch ?? 0)
        setTotalEpochs(d.total_epochs ?? 0)
        setMetrics({
          loss: d.loss,
          val_loss: d.val_loss,
          accuracy: d.accuracy,
          val_accuracy: d.val_accuracy,
        })
        if (d.eta_seconds != null) setEtaSeconds(d.eta_seconds)
        if (d.message) addLog(d.message)
      } catch {}
    })

    es.addEventListener('log', (e) => {
      try {
        const d = JSON.parse(e.data)
        addLog(d.message ?? e.data)
      } catch {
        addLog(e.data)
      }
    })

    es.addEventListener('complete', (e) => {
      try {
        const d = JSON.parse(e.data)
        if (d.message) addLog(d.message)
      } catch {}
      setStatus('complete')
      es.close()
      esRef.current = null
    })

    es.addEventListener('error_event', (e) => {
      try {
        const d = JSON.parse(e.data)
        setErrorMsg(d.message ?? 'Unknown training error')
      } catch {
        setErrorMsg('Training stream error')
      }
      setStatus('error')
      es.close()
      esRef.current = null
    })

    es.onerror = () => {
      // Only treat as fatal if we haven't already finished
      setStatus((prev) => {
        if (prev === 'running') {
          setErrorMsg('Lost connection to training stream.')
          es.close()
          esRef.current = null
          return 'error'
        }
        return prev
      })
    }

    es.addEventListener('message', (e) => {
      try {
        const d = JSON.parse(e.data)
        if (d.type === 'epoch') {
          setCurrentEpoch(d.epoch ?? 0)
          setTotalEpochs(d.total_epochs ?? 0)
          setMetrics({
            loss: d.loss,
            val_loss: d.val_loss,
            accuracy: d.accuracy,
            val_accuracy: d.val_accuracy,
          })
          if (d.eta_seconds != null) setEtaSeconds(d.eta_seconds)
          if (d.message) addLog(d.message)
        } else if (d.type === 'complete') {
          if (d.message) addLog(d.message)
          setStatus('complete')
          es.close()
          esRef.current = null
        } else if (d.type === 'error') {
          setErrorMsg(d.message ?? 'Unknown training error')
          setStatus('error')
          es.close()
          esRef.current = null
        } else if (d.message) {
          addLog(d.message)
        }
      } catch {}
    })
  }, [addLog])

  // ── Refresh training & dataset status ────────────────────────────────────
  const refreshStatus = useCallback(async () => {
    setCheckingDataset(true)
    try {
      const data = await getTrainingStatus()
      if (data.dataset_ready != null) setDatasetReady(data.dataset_ready)
      if (data.dataset_dir) setDatasetDir(data.dataset_dir)
      if (data.state === 'complete' || (data.model_exists && data.state !== 'running')) {
        setStatus('complete')
      } else if (data.state === 'running') {
        setStatus('running')
        addLog('Reconnecting to running training session…')
        connectSSE()
      }
    } catch {
      // Backend not reachable — stay idle
    } finally {
      setCheckingDataset(false)
    }
  }, [addLog, connectSSE])

  // ── On mount: check status ───────────────────────────────────────────────
  useEffect(() => {
    refreshStatus()
    return () => {
      esRef.current?.close()
      esRef.current = null
    }
  }, [refreshStatus])

  // ── Start training ───────────────────────────────────────────────────────
  async function handleStart() {
    setStarting(true)
    setErrorMsg('')
    setLogs([])
    setCurrentEpoch(0)
    setTotalEpochs(0)
    setMetrics(null)
    setEtaSeconds(null)
    try {
      await startTraining()
      addLog('Training started — connecting to stream…')
      setStatus('running')
      connectSSE()
    } catch (err) {
      const msg =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        err?.message ??
        'Failed to start training'
      setErrorMsg(msg)
      setStatus('error')
    } finally {
      setStarting(false)
    }
  }

  // ── Retrain ──────────────────────────────────────────────────────────────
  function handleRetrain() {
    esRef.current?.close()
    esRef.current = null
    setStatus('idle')
    setCurrentEpoch(0)
    setTotalEpochs(0)
    setMetrics(null)
    setLogs([])
    setEtaSeconds(null)
    setErrorMsg('')
    refreshStatus()
  }

  // ── Derived ──────────────────────────────────────────────────────────────
  const pct = totalEpochs > 0 ? Math.min(100, (currentEpoch / totalEpochs) * 100) : 0

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════

  // ── COMPLETE ─────────────────────────────────────────────────────────────
  if (status === 'complete') {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <Card className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h1 className="text-3xl font-extrabold text-green-400">Model Trained Successfully!</h1>
          <p className="text-gray-400 max-w-sm mx-auto">
            Your Siamese Network has been trained and loaded. You can now verify your identity using
            your face.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-2">
            <Link
              to="/verify"
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors shadow-lg"
            >
              🔍 Go Verify →
            </Link>
            <button
              onClick={handleRetrain}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors border border-gray-700"
            >
              🔄 Retrain
            </button>
          </div>
        </Card>
      </div>
    )
  }

  // ── RUNNING ───────────────────────────────────────────────────────────────
  if (status === 'running') {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Spinner />
          <h1 className="text-2xl font-extrabold text-white">Training in Progress…</h1>
        </div>

        <Card className="space-y-5">
          {/* Epoch + ETA */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-lg font-semibold text-gray-200">
              Epoch{' '}
              <span className="text-blue-400 font-bold">{currentEpoch}</span>
              {totalEpochs > 0 && (
                <span className="text-gray-500"> / {totalEpochs}</span>
              )}
            </span>
            {etaSeconds != null && (
              <span className="text-sm text-gray-400">
                ⏱ ~<span className="text-white font-medium">{formatETA(etaSeconds)}</span> remaining
              </span>
            )}
          </div>

          {/* Progress bar */}
          <ProgressBar pct={pct} />

          {/* Metrics */}
          <MetricsTable metrics={metrics} />

          {/* Log */}
          <LogPanel logs={logs} />
        </Card>
      </div>
    )
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <Card className="border-red-900/50 space-y-4">
          <div className="text-4xl">❌</div>
          <h1 className="text-2xl font-bold text-red-400">Training Failed</h1>
          <p className="text-sm text-red-300 font-mono bg-red-950/40 border border-red-900/40 rounded-xl p-3 break-all">
            {errorMsg || 'An unknown error occurred.'}
          </p>
          {logs.length > 0 && <LogPanel logs={logs} />}
          <div className="flex gap-4 flex-wrap pt-1">
            <button
              onClick={handleRetrain}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg"
            >
              🔄 Try Again
            </button>
          </div>
        </Card>

        {/* Dataset Instructions */}
        <DatasetInstructionCard
          datasetReady={datasetReady}
          onRefresh={refreshStatus}
          checking={checkingDataset}
        />
      </div>
    )
  }

  // ── IDLE (default) ────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2">🧠 Train Your Model</h1>
        <p className="text-gray-400">
          Train the Siamese Network on your registered face images. This only needs to be done once.
        </p>
      </div>

      {/* Prerequisites */}
      <Card className="border-yellow-900/40 bg-yellow-950/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">⚠️</span>
          <div>
            <h2 className="font-semibold text-yellow-300 mb-2">Prerequisites</h2>
            <ul className="space-y-1.5 text-sm text-yellow-200/70 list-none">
              <li>
                • Register at least 5 face images in the{' '}
                <Link to="/register" className="text-yellow-300 underline hover:text-yellow-100 font-medium">
                  Register
                </Link>{' '}
                page
              </li>
              <li>• Upload the LFW dataset .zip file below (or download it from Kaggle)</li>
              <li>• Training takes ~5–15 minutes on CPU</li>
              <li>• Keep this tab open during training</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Dataset Instructions */}
      <DatasetInstructionCard
        datasetReady={datasetReady}
        onRefresh={refreshStatus}
        checking={checkingDataset}
      />

      {/* CTA */}
      <Card className="text-center space-y-4">
        <p className="text-gray-400 text-sm">
          Click the button below to begin training. The model will be automatically loaded once
          complete.
        </p>
        <button
          onClick={handleStart}
          disabled={starting}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-lg text-lg flex items-center gap-2 mx-auto"
        >
          {starting ? (
            <>
              <Spinner /> Starting…
            </>
          ) : (
            '🚀 Start Training'
          )}
        </button>
        <p className="text-xs text-gray-600">
          Already have a trained model?{' '}
          <Link to="/verify" className="text-blue-400 hover:underline">
            Go to Verify
          </Link>
        </p>
      </Card>
    </div>
  )
}
