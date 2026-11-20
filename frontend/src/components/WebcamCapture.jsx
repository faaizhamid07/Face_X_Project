import { useRef, useCallback } from 'react'
import ReactWebcam from 'react-webcam'
import { Camera, Radio, Scan } from 'lucide-react'

const VIDEO_CONSTRAINTS = {
  width: 400,
  height: 400,
  facingMode: 'user',
}

export default function WebcamCapture({ 
  webcamRef, 
  label = 'Optical Biometric Sensor',
  scanning = false 
}) {
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[420px]">
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass-panel p-2 border border-white/15 shadow-glass-lg group">
        {/* Inner video wrapper */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950/80 border border-white/10">
          <ReactWebcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={VIDEO_CONSTRAINTS}
            mirrored={true}
            className="w-full h-full object-cover"
          />

          {/* Futuristic Biometric HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner Brackets */}
            <div className="reticle-bracket reticle-tl border-cyan-400/80" />
            <div className="reticle-bracket reticle-tr border-cyan-400/80" />
            <div className="reticle-bracket reticle-bl border-cyan-400/80" />
            <div className="reticle-bracket reticle-br border-cyan-400/80" />

            {/* Center Biometric Target Reticle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-44 h-56 rounded-full border border-cyan-500/30 flex items-center justify-center">
                <div className="absolute inset-x-0 h-[1px] bg-cyan-400/20" />
                <div className="absolute inset-y-0 w-[1px] bg-cyan-400/20" />
                <div className="w-4 h-4 rounded-full border border-cyan-400/60" />
              </div>
            </div>

            {/* Scanning Laser Beam Effect */}
            {scanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan" />
            )}

            {/* Top HUD Feed Tag */}
            <div className="absolute top-3 inset-x-4 flex items-center justify-between text-[10px] font-mono font-medium text-cyan-300">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>LIVE FEED</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300">
                100×100 px
              </div>
            </div>

            {/* Bottom HUD Align Message */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center text-[10px] font-mono text-cyan-200/90">
              <div className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 flex items-center gap-1.5">
                <Scan className="w-3 h-3 text-cyan-400" />
                <span>ALIGN FACE WITHIN OVAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Camera className="w-3.5 h-3.5 text-cyan-400/80" />
        <span>{label}</span>
      </div>
    </div>
  )
}
