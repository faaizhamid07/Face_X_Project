import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  ScanFace, 
  UserPlus, 
  BrainCircuit, 
  ShieldCheck, 
  Layers, 
  Activity,
  Sparkles,
  ExternalLink
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
      <nav className="max-w-6xl mx-auto rounded-2xl glass-panel px-4 py-2.5 flex items-center justify-between border border-white/10 shadow-glass">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/30 to-purple-500/20 border border-cyan-400/30 text-cyan-400 shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
            <ScanFace className="w-5 h-5 text-cyan-300" />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm -z-10 group-hover:bg-cyan-400/20 transition-colors" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-1.5">
              Face‑X <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold tracking-wider">v2.0</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide">Deep Siamese Biometrics</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1 bg-slate-900/40 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Engine status indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                modelStatus === 'ready'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : modelStatus === 'training'
                  ? 'bg-amber-400 animate-ping shadow-[0_0_8px_#fbbf24]'
                  : modelStatus === 'offline'
                  ? 'bg-rose-500'
                  : 'bg-indigo-400 shadow-[0_0_8px_#818cf8]'
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
    <div className="min-h-screen relative flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background glows for realistic Glassmorphism refraction */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Deep mesh orbs */}
        <div className="absolute -top-[15%] left-[20%] w-[550px] h-[550px] rounded-full bg-indigo-600/15 blur-[120px] animate-float-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[130px] animate-float-reverse" />
        <div className="absolute -bottom-[20%] left-[10%] w-[600px] h-[600px] rounded-full bg-purple-700/15 blur-[140px] animate-float-slow" />
        
        {/* Subtle dot matrix overlay for depth */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/train" element={<Train />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </main>

      {/* Subtle footer */}
      <footer className="w-full border-t border-white/5 py-5 px-6 mt-12 text-center text-xs text-slate-400 glass-pill">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Face‑X Biometric Architecture</span>
            <span className="text-slate-600">•</span>
            <span>One-Shot Siamese Network &amp; LFW DeepFunneled</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Cosine Similarity &amp; L1 Distance</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-cyan-400/80">100×100 Input Tensor</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
