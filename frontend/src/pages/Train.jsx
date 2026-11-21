import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  BrainCircuit, 
  UploadCloud, 
  FileArchive, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Terminal, 
  RotateCcw, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react'
import { startTraining, getTrainingStatus, uploadDataset } from '../services/api'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatETA(seconds) {
  if (seconds == null || seconds <= 0) return '< 1 sec'
  if (seconds < 60) return `${Math.round(seconds)} sec`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function now() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false })
}

// ─── Sub-components ─────────────────────────────────────────────────────────

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
        <div key={label} className="rounded-xl glass-pill p-3.5 text-center border border-white/5 bg-slate-950/40">
          <div className="text-xs text-slate-400 mb-1 uppercase font-mono tracking-wider">{label}</div>
          <div className="text-xl font-mono font-bold text-white">{value}</div>
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ pct }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-slate-400">Epoch Training Execution</span>
        <span className="text-white font-bold">{pct.toFixed(0)}%</span>
      </div>
      <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full bg-[var(--color-accent-primary)] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function LogPanel({ logs }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
        <Terminal className="w-3.5 h-3.5 text-blue-400" />
        <span>NEURAL LOG STREAM</span>
      </div>
      <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-4 h-48 overflow-y-auto font-mono text-xs text-slate-300 space-y-1 backdrop-blur-md">
        {logs.length === 0 ? (
          <span className="text-slate-500 italic">Awaiting telemetry stream from backend runner…</span>
        ) : (
          logs.map((line, i) => (
            <div key={i} className="leading-relaxed flex gap-2">
              <span className="text-slate-500 select-none">&gt;</span>
              <span className="text-slate-300">{line}</span>
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
  const [uploadStatus, setUploadStatus] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setUploadStatus({ type: 'error', message: 'Please select a valid .zip archive file.' })
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
    <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-5 shadow-elevation-md">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
            <FileArchive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base [text-wrap:balance]">LFW Background Dataset</h2>
            <p className="text-xs text-slate-400">Required face negative/positive baseline for Siamese network training</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {datasetReady != null && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-mono font-medium border flex items-center gap-1.5 ${
                datasetReady
                  ? 'bg-[var(--color-bg-glass)] text-[var(--color-accent-primary)] border-[var(--color-border-accent)]'
                  : 'bg-[var(--color-bg-glass)] text-[var(--color-accent-alert)] border-[var(--color-border-accent)]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${datasetReady ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {datasetReady ? 'Dataset Verified' : 'Dataset Required'}
            </span>
          )}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={checking}
              className="text-xs px-3 py-1 rounded-xl glass-pill hover:bg-white/10 text-slate-300 transition-colors flex items-center gap-1.5"
              title="Rescan dataset directory"
            >
              <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Scanning…' : 'Rescan'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-300 space-y-4">
        <p className="leading-relaxed [text-wrap:pretty]">
          The Siamese ConvNet learns discriminative face representations from the <strong className="text-white">Labeled Faces in the Wild (LFW)</strong> dataset. If you have the zip on your PC (or downloaded from Kaggle), drop it directly below:
        </p>

        <div>
          <a
            href="https://www.kaggle.com/datasets/jessicali9530/lfw-dataset?resource=download"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold glass-pill hover:bg-white/10 text-slate-200 border border-white/15 transition-all shadow-sm"
          >
            <span>Download LFW Dataset (.zip) from Kaggle</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Dropzone */}
        <div className="rounded-2xl border border-dashed border-white/15 hover:border-slate-500 bg-slate-950/40 p-5 transition-all">
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
              className="flex flex-col items-center justify-center cursor-pointer py-4 space-y-2 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 mb-1">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold text-slate-200">
                Click to browse or drop your dataset <span className="font-mono text-white">.zip</span> archive here
              </div>
              <div className="text-xs text-slate-400">Supports standard Kaggle lfw-dataset.zip format</div>
            </label>
          )}

          {selectedFile && !uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl glass-pill p-3 border border-white/10">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileArchive className="w-5 h-5 text-blue-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-medium text-white truncate">{selectedFile.name}</div>
                    <div className="text-xs font-mono text-slate-400">{formatFileSize(selectedFile.size)}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="text-slate-400 hover:text-rose-400 text-xs px-2 py-1 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload &amp; Decompress Dataset</span>
              </button>
            </div>
          )}

          {uploading && (
            <div className="py-4 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-200 font-semibold">
                <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-accent-primary)]" />
                <span>
                  {uploadProgress < 100
                    ? `Streaming Archive (${uploadProgress}%)…`
                    : 'Decompressing & Mapping Face Directories…'}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="bg-[var(--color-accent-primary)] h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span>Decompressing multi-thousand face images into local storage.</span>
            </div>
          )}

          {uploadStatus && (
            <div
              className={`mt-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                uploadStatus.type === 'success'
                  ? 'bg-[var(--color-bg-glass)] border border-[var(--color-border-accent)] text-[var(--color-accent-primary)]'
                  : 'bg-[var(--color-bg-glass)] border border-[var(--color-border-accent)] text-[var(--color-accent-alert)]'
              }`}
            >
              {uploadStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-primary)] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[var(--color-accent-alert)] shrink-0" />
              )}
              <span>{uploadStatus.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const SSE_URL = '/api/train/stream'
const MAX_LOGS = 100

export default function Train() {
  const [status, setStatus] = useState('idle')
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

  const addLog = useCallback((msg) => {
    setLogs((prev) => {
      const entry = `[${now()}] ${msg}`
      const next = [...prev, entry]
      return next.length > MAX_LOGS ? next.slice(next.length - MAX_LOGS) : next
    })
  }, [])

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
        addLog('Reconnecting to active neural training session…')
        connectSSE()
      }
    } catch {
      // Backend offline
    } finally {
      setCheckingDataset(false)
    }
  }, [addLog, connectSSE])

  useEffect(() => {
    refreshStatus()
    return () => {
      esRef.current?.close()
      esRef.current = null
    }
  }, [refreshStatus])

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
      addLog('Initiating Siamese optimization tensor pipeline…')
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

  const pct = totalEpochs > 0 ? Math.min(100, (currentEpoch / totalEpochs) * 100) : 0

  // ── COMPLETE ─────────────────────────────────────────────────────────────
  if (status === 'complete') {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="rounded-3xl glass-panel p-8 sm:p-10 space-y-6 border border-emerald-500/30 shadow-elevation-md">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight [text-wrap:balance]">Siamese Model Calibrated</h1>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed [text-wrap:pretty]">
                Neural weights exported to <code className="text-slate-200 font-mono">siamesemodel.h5</code>. Real-time one-shot verification is fully armed.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/90 shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Launch Verification</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleRetrain}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs glass-pill text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retrain Architecture</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── RUNNING ───────────────────────────────────────────────────────────────
  if (status === 'running') {
    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight [text-wrap:balance]">Neural Training In Progress</h1>
              <p className="text-xs text-slate-400">Optimizing binary cross-entropy on twin feature vectors</p>
            </div>
          </div>
          {etaSeconds != null && (
            <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono text-slate-200 border border-white/10">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>ETA ~{formatETA(etaSeconds)}</span>
            </div>
          )}
        </div>

        <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6 border border-white/10 shadow-elevation-md">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">
              Epoch <span className="text-white font-bold">{currentEpoch}</span>
              {totalEpochs > 0 && <span className="text-slate-500"> / {totalEpochs}</span>}
            </span>
            <span className="text-slate-400">Adam Optimizer (lr=1e-4)</span>
          </div>

          <ProgressBar pct={pct} />
          <MetricsTable metrics={metrics} />
          <LogPanel logs={logs} />
        </div>
      </div>
    )
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-[var(--color-border-accent)] space-y-5 bg-[var(--color-bg-glass)] shadow-elevation-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-rose-300 [text-wrap:balance]">Training Execution Exception</h1>
              <p className="text-xs text-slate-400">Pipeline encountered a non-recoverable error</p>
            </div>
          </div>

          <p className="text-xs text-slate-200 font-mono bg-[var(--color-bg-glass)] border border-[var(--color-border-accent)] rounded-xl p-3.5 break-all">
            {errorMsg || 'An unknown error occurred during tensor graph compilation.'}
          </p>

          {logs.length > 0 && <LogPanel logs={logs} />}

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleRetrain}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/90 transition-all shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Training</span>
            </button>
          </div>
        </div>

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
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 glass-pill px-3 py-1 rounded-full mb-2">
          <BrainCircuit className="w-3.5 h-3.5 text-blue-400" /> NEURAL CALIBRATION LABORATORY
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
          Train Siamese Neural Network
        </h1>
        <p className="text-sm text-slate-300 mt-1 [text-wrap:pretty]">
          Train the dual convolutional subnets on negative LFW pairs and your positive face vectors.
        </p>
      </div>

      {/* Dataset Uploader */}
      <DatasetInstructionCard
        datasetReady={datasetReady}
        onRefresh={refreshStatus}
        checking={checkingDataset}
      />

      {/* Initiation Control Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 text-center space-y-4 border border-white/10 shadow-elevation-md">
        <p className="text-xs text-slate-300 max-w-md mx-auto [text-wrap:pretty]">
          Training runs in background with live epoch loss, precision, and accuracy telemetry. Requires ~5 minutes on CPU.
        </p>

        <button
          onClick={handleStart}
          disabled={starting}
          className="px-8 py-3.5 rounded-2xl font-semibold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all active:scale-[0.99] inline-flex items-center gap-2.5 mx-auto"
        >
          {starting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Compiling Tensor Graph…</span>
            </>
          ) : (
            <>
              <BrainCircuit className="w-4 h-4 text-white" />
              <span>Initiate Siamese Training</span>
            </>
          )}
        </button>

        <div className="pt-2">
          <Link to="/verify" className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 font-mono">
            <span>Skip to Verification if model exists</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
