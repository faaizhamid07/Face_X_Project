import { useRef } from 'react'
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
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-[var(--color-bg-glass)] border border-[var(--color-border-accent)] shadow-elevation-md">
        <ReactWebcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={VIDEO_CONSTRAINTS}
          mirrored={true}
          className="w-full h-full object-cover"
        />

          {/* Biometric HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner Brackets */}
            <div className="reticle-bracket reticle-tl" />
            <div className="reticle-bracket reticle-tr" />
            <div className="reticle-bracket reticle-bl" />
            <div className="reticle-bracket reticle-br" />

            {/* Center Target Reticle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-44 h-56 rounded-full border border-white/20 flex items-center justify-center">
                <div className="absolute inset-x-0 h-[1px] bg-white/15" />
                <div className="absolute inset-y-0 w-[1px] bg-white/15" />
                <div className="w-4 h-4 rounded-full border border-white/40" />
              </div>
            </div>

            {/* Scanning Line */}
            {scanning && (
              <div className="absolute inset-x-0 top-0 h-0.5 opacity-80 animate-scan" style={{ background: "var(--color-accent-primary)" }} />
            )}

            {/* Top HUD Feed Tag */}
            <div className="absolute top-3 inset-x-4 flex items-center justify-between text-xs font-mono font-medium text-slate-200">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10">
                <Radio className="w-3.5 h-3.5" style={{ color: "var(--color-accent-primary)" }} />
                <span>LIVE FEED</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-slate-300">
                100×100 px
              </div>
            </div>

            {/* Bottom HUD Align Message */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center text-xs font-mono text-slate-200">
              <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 flex items-center gap-2">
                <Scan className="w-3.5 h-3.5" style={{ color: "var(--color-accent-primary)" }} />
                <span>ALIGN FACE WITHIN FRAME</span>
              </div>
            </div>
          </div>
        </div>

      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Camera className="w-3.5 h-3.5 text-slate-400" />
        <span>{label}</span>
      </div>
    </div>
  )
}
