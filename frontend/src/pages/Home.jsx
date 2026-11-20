import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Cpu, 
  Binary, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Zap,
  Fingerprint,
  BrainCircuit
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
      <section className="relative rounded-3xl glass-panel p-8 sm:p-12 border border-white/10 shadow-elevation-lg">
        <div className="max-w-3xl space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-white/10 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status.model_exists ? 'bg-emerald-400' : 'bg-blue-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                status.model_exists ? 'bg-emerald-500' : 'bg-blue-500'
              }`} />
            </span>
            <span className="text-slate-200 font-medium">
              {status.model_exists 
                ? 'Production Siamese Model Active & Ready' 
                : 'Siamese Architecture Initialized (Training Lab Standby)'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight [text-wrap:balance]">
            Next-Gen Biometrics with Zero Passwords.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl [text-wrap:pretty]">
            Face‑X combines one-shot learning Siamese Neural Networks with L1 distance metrics to verify identity in milliseconds with sub-millimeter biometric precision.
          </p>

          {/* Action CTAs with high contrast */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Launch Verification</span>
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-200 glass-pill hover:bg-white/10 hover:text-white border border-white/15 transition-all"
            >
              <UserCheck className="w-4 h-4 text-slate-300" />
              <span>Enroll Face Profile</span>
            </Link>

            <Link
              to="/train"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-200 glass-pill hover:bg-white/10 hover:text-white border border-white/15 transition-all"
            >
              <BrainCircuit className="w-4 h-4 text-slate-300" />
              <span>Neural Training Lab</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Architecture</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" /> Siamese ConvNet
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Distance Metric</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Binary className="w-4 h-4 text-blue-400" /> L1 Absolute Norm
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Model Weights</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" /> 
              {status.model_exists ? 'siamesemodel.h5' : 'Ready to train'}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Inference Speed</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> &lt; 45ms Latency
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Journey */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 [text-wrap:balance]">
              <Sparkles className="w-5 h-5 text-blue-400" />
              The Biometric Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Streamlined enrollment to neural verification</p>
          </div>
          <span className="text-xs font-mono text-slate-300 glass-pill px-3 py-1 rounded-full border border-white/10">
            3-STEP WORKFLOW
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <Link
            to="/register"
            className="group relative rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 group-hover:border-slate-600 transition-colors">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                  01
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors [text-wrap:balance]">
                  1. Identity Enrollment
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1.5 [text-wrap:pretty]">
                  Capture reference face images via webcam. Crops to standardized 100×100 px biometric vectors stored in your secure local vault.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-blue-400">
              <span>Open Enrollment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Step 2 */}
          <Link
            to="/train"
            className="group relative rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 group-hover:border-slate-600 transition-colors">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                  02
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors [text-wrap:balance]">
                  2. Siamese Training Lab
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1.5 [text-wrap:pretty]">
                  Drop in your LFW dataset zip file and trigger real-time epoch training with live loss, precision, and recall streaming telemetry.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-blue-400">
              <span>Enter Training Lab</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Step 3 */}
          <Link
            to="/verify"
            className="group relative rounded-2xl glass-panel-interactive p-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 group-hover:border-slate-600 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                  03
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors [text-wrap:balance]">
                  3. Live Authentication
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1.5 [text-wrap:pretty]">
                  Point webcam and verify in real time against enrolled profile images with confidence scores and adjustable matching thresholds.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-blue-400">
              <span>Start Auth Scanner</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Flattened Architecture Section (No nested card anti-pattern) */}
      <section className="rounded-3xl glass-panel p-8 border border-white/10 shadow-elevation-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 glass-pill px-3 py-1 rounded-full">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> ARCHITECTURAL HIGHLIGHT
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight [text-wrap:balance]">
              Why Siamese Networks for One-Shot Verification?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed [text-wrap:pretty]">
              Standard classification networks require retraining for every new person. In contrast, Face‑X uses twin subnetworks sharing identical weights to learn a semantic embedding space.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero retraining required when registering new users</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>L1 distance layer calculates absolute feature delta</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sigmoid activation produces calibrated [0.0 - 1.0] probability</span>
              </li>
            </ul>
          </div>

          {/* Clean flattened specs list (no nested card container) */}
          <div className="space-y-2.5 font-mono text-xs pt-1 lg:border-l lg:border-white/10 lg:pl-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-slate-300 font-semibold">Siamese ConvNet Topology</span>
              <span className="text-xs text-blue-400 font-semibold">TENSORFLOW 2.x</span>
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Input Image (A, B):</span>
                <span className="text-white font-semibold">100 × 100 × 3</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Conv2D Block 1:</span>
                <span className="text-slate-200">64 filters (10×10), ReLU + MaxPool</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Conv2D Block 2:</span>
                <span className="text-slate-200">128 filters (7×7), ReLU + MaxPool</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Conv2D Block 3:</span>
                <span className="text-slate-200">128 filters (4×4), ReLU + MaxPool</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Dense Embedding:</span>
                <span className="text-white font-semibold">4096-dim Vector</span>
              </div>
              <div className="flex justify-between py-1.5 text-blue-300 font-medium">
                <span>Distance Metric:</span>
                <span className="font-semibold">|E_A - E_B| → Dense(1, Sigmoid)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
