import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Verify from './pages/Verify.jsx'
import Train from './pages/Train.jsx'

function Navbar() {
  const { pathname } = useLocation()
  const link = (to, label) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        pathname === to
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link to="/" className="text-xl font-bold text-blue-400 tracking-tight mr-4">
          Face‑X
        </Link>
        {link('/', 'Home')}
        {link('/register', 'Register')}
        {link('/train', '🧠 Train')}
        {link('/verify', 'Verify')}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/train" element={<Train />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </main>
    </div>
  )
}
