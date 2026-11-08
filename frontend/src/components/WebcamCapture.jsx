import { useRef, useCallback } from 'react'
import ReactWebcam from 'react-webcam'

const VIDEO_CONSTRAINTS = {
  width: 400,
  height: 400,
  facingMode: 'user',
}

/**
 * Reusable webcam component.
 * Exposes a `capture()` function via the `webcamRef` prop.
 *
 * Usage:
 *   const webcamRef = useRef(null)
 *   <WebcamCapture webcamRef={webcamRef} />
 *   const imageSrc = webcamRef.current.getScreenshot()
 */
export default function WebcamCapture({ webcamRef, label = 'Live Camera' }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl">
        <ReactWebcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={VIDEO_CONSTRAINTS}
          mirrored={true}
          className="w-[400px] h-[400px] object-cover"
        />
        {/* Overlay corner guides */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-lg" />
        </div>
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

