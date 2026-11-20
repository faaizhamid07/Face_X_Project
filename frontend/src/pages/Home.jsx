import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ScanFace, 
  BrainCircuit, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Cpu, 
  Binary, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Fingerprint
} from 'lucide-react'
import { getTrainingStatus } from '../services/api.js'

export default function Home() {
  const [status, setStatus] = useState({
    model_exists: false,
    dataset_ready: false,
    state: 'idle',
    loading: true
  })

  useEffect(() => {
    getTrainingStatus()
      .then((data) => {
        setStatus({
          model_exists: Boolean(data.model_exists || data.state === 'complete'),
          dataset_ready: Boolean(data.dataset_ready),
          state: data.state || 'idle',
          loading: false
        })
      })
      .catch(() => {
        setStatus(prev => ({ ...prev, loading: false }))
      })
  }, [])

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-white/10 shadow-glass-lg">
        {/* Glow behind hero */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-white/10 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status.model_exists ? 'bg-emerald-400' : 'bg-cyan-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                status.model_exists ? 'bg-emerald-500' : 'bg-cyan-500'
              }`} />
            </span>
            <span className="text-slate-200 font-medium">
              {status.model_exists 
                ? 'Production Siamese Model Active & Ready' 
                : 'Siamese Architecture Initialized (Training Lab Standby)'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Next-Gen Biometrics with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Zero Passwords.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal max-w-2xl">
            Face‑X combines one-shot learning Siamese Neural Networks with L1 distance metrics to verify identity in milliseconds with sub-millimeter biometric precision.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-glow-cyan transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-200" />
              <span>Launch Verification</span>
              <ArrowRight className="w-4 h-4 text-cyan-200/80" />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-200 glass-pill hover:bg-white/10 hover:text-white border border-white/15 transition-all duration-300"
            >
              <UserCheck className="w-4 h-4 text-slate-300" />
              <span>Enroll Face Profile</span>
            </Link>

            <Link
              to="/train"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-indigo-300 glass-pill hover:bg-indigo-950/40 hover:text-indigo-200 border border-indigo-500/30 transition-all duration-300"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>Neural Training Lab</span>
            </Link>
          </div>
        </div>

        {/* Floating Quick Stats / Spec Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-8 border-t border-white/10">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Architecture</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Siamese ConvNet
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Distance Metric</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-indigo-400" /> L1 Absolute Norm
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Model Weights</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> 
              {status.model_exists ? 'siamesemodel.h5' : 'Ready to train'}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Inference Speed</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> &lt; 45ms Latency
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: 3 Step Journey */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              The Biometric Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Streamlined enrollment to neural verification</p>
          </div>
          <span className="text-xs font-mono text-cyan-400/80 glass-pill px-3 py-1 rounded-full border border-cyan-500/20">
            3-STEP WORKFLOW
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <Link
            to="/register"
            className="group relative rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform duration-300">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-black text-white/10 group-hover:text-cyan-400/30 transition-colors">
                  01
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  1. Identity Enrollment
                </h3>
                <p className="text-xs text-slate-300/80 leading-relaxed mt-1.5">
                  Capture reference face images via webcam. Crops to standardized 100×100 px biometric vectors stored in your secure local vault.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-cyan-300">
              <span>Open Enrollment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Step 2 */}
          <Link
            to="/train"
            className="group relative rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform duration-300">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-black text-white/10 group-hover:text-indigo-400/30 transition-colors">
                  02
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  2. Siamese Training Lab
                </h3>
                <p className="text-xs text-slate-300/80 leading-relaxed mt-1.5">
                  Drop in your LFW dataset zip file and trigger real-time epoch training with live loss, precision, and recall streaming telemetry.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-indigo-300">
              <span>Enter Training Lab</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Step 3 */}
          <Link
            to="/verify"
            className="group relative rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-black text-white/10 group-hover:text-emerald-400/30 transition-colors">
                  03
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  3. Live Authentication
                </h3>
                <p className="text-xs text-slate-300/80 leading-relaxed mt-1.5">
                  Point webcam and verify in real time against enrolled profile images with confidence scores and adjustable matching thresholds.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span>Start Auth Scanner</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Deep Architecture Card */}
      <section className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-300 glass-pill px-3 py-1 rounded-full">
              <Cpu className="w-3.5 h-3.5" /> ARCHITECTURAL HIGHLIGHT
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Why Siamese Networks for One-Shot Verification?
            </h2>
            <p className="text-sm text-slate-300/90 leading-relaxed">
              Standard classification networks require retraining for every new person. In contrast, Face‑X uses twin subnetworks sharing identical weights to learn a semantic embedding space.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Zero retraining required when registering new users</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>L1 distance layer calculates absolute feature delta</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sigmoid activation produces calibrated [0.0 - 1.0] probability</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-slate-950/60 border border-white/10 p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400">
              <span>Siamese ConvNet Topology</span>
              <span className="text-[10px] text-cyan-400 font-semibold">TENSORFLOW 2.x</span>
            </div>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex justify-between py-1 px-2 rounded bg-white/[0.03]">
                <span className="text-slate-400">Input Image (A, B):</span>
                <span className="text-cyan-300 font-semibold">100 × 100 × 3</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-white/[0.03]">
                <span className="text-slate-400">Conv2D Block 1:</span>
                <span className="text-slate-200">64 filters (10×10), ReLU + MaxPool</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-white/[0.03]">
                <span className="text-slate-400">Conv2D Block 2:</span>
                <span className="text-slate-200">128 filters (7×7), ReLU + MaxPool</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-white/[0.03]">
                <span className="text-slate-400">Conv2D Block 3:</span>
                <span className="text-slate-200">128 filters (4×4), ReLU + MaxPool</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-white/[0.03]">
                <span className="text-slate-400">Dense Embedding:</span>
                <span className="text-indigo-300 font-semibold">4096-dim Vector</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
                <span>Distance &amp; Classifier:</span>
                <span className="font-semibold">|E_A - E_B| → Dense(1, Sigmoid)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
