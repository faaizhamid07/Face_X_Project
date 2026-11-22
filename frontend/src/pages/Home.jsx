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
  BrainCircuit,
  RotateCw,
  ShieldAlert
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
      {/* Hero Section - Asymmetric Split */}
      <section className="relative rounded-3xl glass-panel p-8 sm:p-12 border border-white/10 shadow-elevation-lg overflow-hidden">
        {/* Background Radial Gradient */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(5,150,105,0.08) 0%, transparent 70%)'
          }}
        />

        <div className="grid lg:grid-cols-[60%_40%] gap-12 items-center">
          {/* Content Left */}
          <div className="max-w-2xl space-y-6">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-white/10 text-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-pulse-subtle absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  status.model_exists ? 'var(--color-accent-primary)' : 'bg-[var(--color-bg-glass)]'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  status.model_exists ? 'var(--color-accent-primary)' : 'bg-[var(--color-bg-glass)]'
                }`} />
              </span>
              <span className="text-slate-200 font-medium">
                {status.model_exists
                  ? 'Production Siamese Model Active & Ready'
                  : 'Siamese Architecture Initialized (Training Lab Standby)'}
              </span>
            </div>

            <h1 className="font-extrabold tracking-tight text-white leading-tight [text-wrap:balance]" style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
              Next-Gen Biometrics with Zero Passwords.
            </h1>

            <p className="text-base leading-relaxed font-normal max-w-xl [text-wrap:pretty]" style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)' }}>
              Face‑X combines one-shot learning Siamese Neural Networks with L1 distance metrics to verify identity in milliseconds with sub-millimeter biometric precision.
            </p>

            {/* Action CTAs - Primary + Ghost hierarchy */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/verify"
                className="btn btn-primary"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Launch Verification</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </Link>

              <Link
                to="/register"
                className="btn btn-ghost"
              >
                <UserCheck className="w-4 h-4" style={{ color: 'var(--color-fg-secondary)' }} />
                <span>Enroll Face Profile</span>
              </Link>

              <Link
                to="/train"
                className="btn btn-ghost"
              >
                <BrainCircuit className="w-4 h-4" style={{ color: 'var(--color-fg-secondary)' }} />
                <span>Neural Training Lab</span>
              </Link>
            </div>
          </div>

          {/* Visual Right - Biometric Visualization */}
          <div className="relative lg:block hidden">
            <div className="relative aspect-square max-w-sm mx-auto">
              {/* Outer reticle frame */}
              <div className="absolute inset-0 border border-white/10 rounded-2xl" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)' }}>
                {/* Corner brackets */}
                <div className="reticle-bracket reticle-tl" style={{ borderColor: 'var(--color-accent-primary)' }} />
                <div className="reticle-bracket reticle-tr" style={{ borderColor: 'var(--color-accent-primary)' }} />
                <div className="reticle-bracket reticle-bl" style={{ borderColor: 'var(--color-accent-primary)' }} />
                <div className="reticle-bracket reticle-br" style={{ borderColor: 'var(--color-accent-primary)' }} />

                {/* Center crosshairs */}
                <div className="reticle-center-h" />
                <div className="reticle-center-v" />
                <div className="reticle-center-dot" style={{ borderColor: 'var(--color-accent-primary)' }} />

                {/* Scanning line - subtle idle state */}
                <div className="scan-line animate-scan" style={{ animationDuration: '4s', opacity: 0.3 }} />

                {/* Center content - model visualization */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                      <span style={{ color: 'var(--color-accent-primary)' }}>SIAMESE</span>
                      <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">EMBEDDING SPACE</span>
                    </div>
                    <div className="text-3xl font-bold text-white font-mono tracking-tighter" style={{ color: 'var(--color-fg-primary)' }}>
                      4096-D
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Latent Vector Dimension</div>
                  </div>
                </div>
              </div>

              {/* Floating stat indicators */}
              <div className="absolute -top-4 -right-4 w-28 h-28 glass-panel-strong rounded-xl p-3 border border-[var(--color-accent-primary)]/30 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="var(--color-accent-primary) font-mono text-lg font-bold text-center">L1 DISTANCE</div>
                <div className="text-white font-mono text-2xl font-bold text-center mt-1">0.000</div>
                <div className="text-slate-500 text-xs text-center mt-0.5">Threshold: 0.5</div>
              </div>

              <div className="absolute -bottom-4 -left-4 w-28 h-28 glass-panel-strong rounded-xl p-3 border border-[var(--color-accent-secondary)]/30 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="var(--color-accent-secondary) font-mono text-lg font-bold text-center">INFERENCE</div>
                <div className="text-white font-mono text-2xl font-bold text-center mt-1">{'<'} 45ms</div>
                <div className="text-slate-500 text-xs text-center mt-0.5">End-to-End Latency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid - Mobile visibility */}
        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Architecture</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4" style={{ color: 'var(--color-accent-info)' }} /> Siamese ConvNet
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Distance Metric</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Binary className="w-4 h-4" style={{ color: 'var(--color-accent-info)' }} /> L1 Absolute Norm
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Model Weights</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
              {status.model_exists ? 'siamesemodel.h5' : 'Ready to train'}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Inference Speed</span>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span className="w-4 h-4 inline-flex items-center justify-center" style={{ color: 'var(--color-accent-warning)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v12a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5H8M18 13l-5 5-5-5" /></svg>
              </span> 45ms Latency
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Journey - Workflow Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 [text-wrap:balance]">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} />
              The Biometric Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Streamlined enrollment to neural verification</p>
          </div>
          <span className="text-xs font-mono text-slate-300 glass-pill px-3 py-1 rounded-full border border-white/10">
            3-STEP WORKFLOW
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step Connectors (Desktop only) */}
          <div className="hidden lg:block absolute top-[60px] left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent pointer-events-none" />

          {/* Step 1 */}
          <Link
            to="/register"
            className="group relative rounded-2xl glass-panel p-6 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-500/30"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl glass-panel-strong flex items-center justify-center" style={{ color: 'var(--color-accent-primary)' }}>
                  <Fingerprint className="w-6 h-6" style={{ strokeWidth: 1.5 }} />
                </div>
                <span className="font-mono text-3xl font-bold" style={{ color: 'rgba(5,150,105,0.3)' }}>
                  01
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors [text-wrap:balance]" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                  1. Identity Enrollment
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mt-1.5 [text-wrap:pretty]" style={{ fontSize: 'var(--text-base)', color: 'var(--color-fg-secondary)' }}>
                  Capture reference face images via webcam. Crops to standardized 100×100 px biometric vectors stored in your secure local vault.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--color-accent-primary)' }}>
              <span>Open Enrollment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Step 2 */}
          <Link
            to="/train"
            className="group relative rounded-2xl glass-panel p-6 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-500/30"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl glass-panel-strong flex items-center justify-center" style={{ color: 'var(--color-accent-primary)' }}>
                  <BrainCircuit className="w-6 h-6" style={{ strokeWidth: 1.5 }} />
                </div>
                <span className="font-mono text-3xl font-bold" style={{ color: 'rgba(5,150,105,0.3)' }}>
                  02
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors [text-wrap:balance]" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                  2. Siamese Training Lab
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mt-1.5 [text-wrap:pretty]" style={{ fontSize: 'var(--text-base)', color: 'var(--color-fg-secondary)' }}>
                  Drop in your LFW dataset zip file and trigger real-time epoch training with live loss, precision, and recall streaming telemetry.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--color-accent-primary)' }}>
              <span>Enter Training Lab</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Step 3 */}
          <Link
            to="/verify"
            className="group relative rounded-2xl glass-panel p-6 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-500/30"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl glass-panel-strong flex items-center justify-center" style={{ color: 'var(--color-accent-primary)' }}>
                  <ShieldCheck className="w-6 h-6" style={{ strokeWidth: 1.5 }} />
                </div>
                <span className="font-mono text-3xl font-bold" style={{ color: 'rgba(5,150,105,0.3)' }}>
                  03
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors [text-wrap:balance]" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                  3. Live Authentication
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mt-1.5 [text-wrap:pretty]" style={{ fontSize: 'var(--text-base)', color: 'var(--color-fg-secondary)' }}>
                  Point webcam and verify in real time against enrolled profile images with confidence scores and adjustable matching thresholds.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--color-accent-primary)' }}>
              <span>Start Auth Scanner</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Architecture Specs Table - Flattened, Mono Font */}
      <section className="rounded-3xl glass-panel p-8 border border-white/10 shadow-elevation-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 glass-pill px-3 py-1 rounded-full">
              <Cpu className="w-3.5 h-3.5" style={{ color: 'var(--color-accent-primary)' }} /> ARCHITECTURAL HIGHLIGHT
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight [text-wrap:balance]">
              Why Siamese Networks for One-Shot Verification?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed [text-wrap:pretty]">
              Standard classification networks require retraining for every new person. In contrast, Face‑X uses twin subnetworks sharing identical weights to learn a semantic embedding space.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-accent-primary)' }} />
                <span>Zero retraining required when registering new users</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-accent-primary)' }} />
                <span>L1 distance layer calculates absolute feature delta</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-accent-primary)' }} />
                <span>Sigmoid activation produces calibrated [0.0 - 1.0] probability</span>
              </li>
            </ul>
          </div>

          {/* Clean flattened specs list (no nested card container) */}
          <div className="space-y-0 font-mono text-xs pt-1 lg:border-l lg:border-white/10 lg:pl-8 overflow-x-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 sticky top-0 bg-black/50 backdrop-blur-sm z-10">
              <span className="text-slate-300 font-semibold" style={{ fontSize: 'var(--text-mono-sm)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-fg-muted)' }}>Siamese ConvNet Topology</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--color-accent-primary)' }}>TENSORFLOW 2.x</span>
            </div>

            <div className="space-y-0">
              <div className="flex justify-between py-2 border-b border-white/5 bg-white/[0.005] hover:bg-white/[0.015] transition-colors">
                <span className="text-slate-400 pr-4" style={{ color: 'var(--color-fg-muted)' }}>Input Image (A, B):</span>
                <span className="text-white font-semibold text-right min-w-[140px]" style={{ color: 'var(--color-fg-primary)', fontSize: 'var(--text-mono-base)' }}>100 × 100 × 3</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 bg-white/[0.002] hover:bg-white/[0.015] transition-colors">
                <span className="text-slate-400 pr-4" style={{ color: 'var(--color-fg-muted)' }}>Conv2D Block 1:</span>
                <span className="text-slate-200 text-right min-w-[140px]" style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-mono-base)' }}>64 filters (10×10), ReLU + MaxPool</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 bg-white/[0.005] hover:bg-white/[0.015] transition-colors">
                <span className="text-slate-400 pr-4" style={{ color: 'var(--color-fg-muted)' }}>Conv2D Block 2:</span>
                <span className="text-slate-200 text-right min-w-[140px]" style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-mono-base)' }}>128 filters (7×7), ReLU + MaxPool</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 bg-white/[0.002] hover:bg-white/[0.015] transition-colors">
                <span className="text-slate-400 pr-4" style={{ color: 'var(--color-fg-muted)' }}>Conv2D Block 3:</span>
                <span className="text-slate-200 text-right min-w-[140px]" style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-mono-base)' }}>128 filters (4×4), ReLU + MaxPool</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 bg-white/[0.005] hover:bg-white/[0.015] transition-colors">
                <span className="text-slate-400 pr-4" style={{ color: 'var(--color-fg-muted)' }}>Dense Embedding:</span>
                <span className="text-white font-semibold text-right min-w-[140px]" style={{ color: 'var(--color-fg-primary)', fontSize: 'var(--text-mono-base)' }}>4096-dim Vector</span>
              </div>
              <div className="flex justify-between py-2 text-sky-300 font-medium bg-white/[0.002] hover:bg-white/[0.015] transition-colors">
                <span className="pr-4" style={{ color: 'var(--color-accent-info)' }}>Distance Metric:</span>
                <span className="font-semibold text-right min-w-[140px]" style={{ color: 'var(--color-fg-primary)', fontSize: 'var(--text-mono-base)' }}>|E_A - E_B| → Dense(1, Sigmoid)</span>
              </div>
            </div>

            {/* Mobile scroll indicator */}
            <div className="lg:hidden mt-4 p-4 bg-gradient-to-r from-[var(--color-bg-glass)] to-transparent border border-[var(--color-border-accent)] rounded-lg">
              <p className="text-xs font-mono text-center var(--color-accent-primary)">← Swipe to view full architecture specs →</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}