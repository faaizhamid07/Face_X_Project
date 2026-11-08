import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTrainingStatus } from '../services/api'

const steps = [
  {
    icon: '📸',
    title: 'Register',
    desc: 'Capture 5+ photos of your face via webcam to create your identity profile.',
  },
  {
    icon: '🧠',
    title: 'Train (One-Time)',
    desc: 'Train the Siamese Network with 1 click and watch real-time epoch & accuracy progress.',
  },
  {
    icon: '✅',
    title: 'Verify',
    desc: 'Instant real-time verification and match confidence powered by your trained model.',
  },
]

export default function Home() {
  const [modelReady, setModelReady] = useState(false)

  useEffect(() => {
    getTrainingStatus()
      .then((data) => {
        if (data.state === 'complete' || data.model_exists) {
          setModelReady(true)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="flex flex-col items-center text-center gap-12 py-8">
      {/* Hero */}
      <div className="max-w-2xl">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border bg-gray-900 border-gray-800">
          <span className={`w-2 h-2 rounded-full ${modelReady ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
          <span className="text-gray-300">
            {modelReady ? 'Siamese Model: Trained & Active' : 'Siamese Model: One-time training setup available'}
          </span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          <span className="text-blue-400">Face‑X</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Real-time facial verification powered by a{' '}
          <span className="text-blue-300 font-medium">Siamese Neural Network</span>.
          No passwords. Just your face.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            📸 Register My Face
          </Link>
          <Link
            to="/train"
            className={`px-6 py-3 font-semibold rounded-xl transition-colors shadow-lg ${
              modelReady
                ? 'bg-gray-800 hover:bg-gray-700 text-purple-300 border border-purple-500/30'
                : 'bg-purple-600 hover:bg-purple-500 text-white animate-bounce-subtle'
            }`}
          >
            🧠 {modelReady ? 'Trained (Retrain)' : 'Train Model'}
          </Link>
          <Link
            to="/verify"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors border border-gray-700"
          >
            🔍 Verify Identity
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-200 mb-8">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-blue-500/50 transition-colors"
            >
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                <span className="text-blue-400 mr-2">{i + 1}.</span>
                {s.title}
              </h3>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech note */}
      <p className="text-xs text-gray-600 max-w-lg">
        Uses a one-shot learning Siamese Network that learns to compare faces rather than memorise
        them — meaning new identities can be registered without retraining.
      </p>
    </div>
  )
}

