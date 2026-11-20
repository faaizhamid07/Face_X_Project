import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  ScanFace, 
  UserPlus, 
  BrainCircuit, 
  ShieldCheck, 
  Layers
} from 'lucide-react'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Verify from './pages/Verify.jsx'
import Train from './pages/Train.jsx'
import { getTrainingStatus } from './services/api.js'

function Navbar() {
  const { pathname } = useLocation()
  const [modelStatus, setModelStatus] = useState('checking')

  useEffect(() => {
    let mounted = true
    getTrainingStatus()
      .then((data) => {
        if (!mounted) return
        if (data.state === 'training') setModelStatus('training')
        else if (data.model_exists || data.state === 'complete') setModelStatus('ready')
        else setModelStatus('untrained')
      })
      .catch(() => {
        if (mounted) setModelStatus('offline')
      })
    return () => { mounted = false }
  }, [pathname])

  const navItems = [
    { to: '/', label: 'Overview', icon: Layers },
    { to: '/register', label: 'Enroll Face', icon: UserPlus },
    { to: '/train', label: 'Siamese Lab', icon: BrainCircuit, badge: modelStatus === 'training' ? 'TRAINING' : null },
    { to: '/verify', label: 'Biometric Auth', icon: ShieldCheck },
  ]

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 pb-2">
      <nav className="max-w-6xl mx-auto rounded-2xl glass-panel px-4 py-3 flex items-center justify-between border border-white/10 shadow-elevation-md">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 shadow-sm group-hover:border-slate-600 transition-colors">
            <ScanFace className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">
                Face‑X
              </span>
              <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                v2.0
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Deep Siamese Biometrics</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'text-white bg-slate-800 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Engine status indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                modelStatus === 'ready'
                  ? 'bg-emerald-400'
                  : modelStatus === 'training'
                  ? 'bg-amber-400 animate-pulse'
                  : modelStatus === 'offline'
                  ? 'bg-rose-500'
                  : 'bg-slate-400'
              }`}
            />
            <span className="text-slate-300 font-medium">
              {modelStatus === 'ready'
                ? 'Model Online'
                : modelStatus === 'training'
                ? 'Model Training'
                : modelStatus === 'offline'
                ? 'Backend Offline'
                : 'Model Standby'}
            </span>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-screen relative flex flex-col bg-[#0b0f17]">
      {/* Intentional, neutral architectural canvas */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10" 
        style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(30, 41, 59, 0.35) 0%, rgba(11, 15, 23, 1) 85%)'
        }}
      />

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/train" element={<Train />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </main>

      {/* Subtle, accessible footer */}
      <footer className="w-full border-t border-white/5 py-5 px-6 mt-12 text-center text-xs text-slate-400 glass-pill">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Face‑X Biometric Architecture</span>
            <span className="text-slate-400">•</span>
            <span>One-Shot Siamese Network &amp; LFW DeepFunneled</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Cosine Similarity &amp; L1 Distance</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-slate-300">100×100 Input Tensor</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
