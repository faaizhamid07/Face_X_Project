# Verify Page - Design Overrides

## Page Header
- **Badge:** `.glass-pill` with `ScanFace` icon, "LIVE NEURAL INFERENCE" (blue accent)
- **Title:** `--text-3xl`, "Biometric Authentication"
- **Subtitle:** `--text-base`, `--color-fg-secondary`, "Align your face in the optical frame for instantaneous Siamese L1 distance matching."

## Mode Indicator
- **Container:** `.glass-panel`, inline-flex
- **Status Dot:** 10px, pulse animation ONLY when `autoVerify=true`
  - Continuous: Blue dot + pulse, "Continuous Polling"
  - On-Demand: Emerald dot (static), "On-Demand Auth"
- **Toggle:** Custom switch (not native checkbox) - 48px x 28px, accessible
  - Label: "Continuous Surveillance Mode" + "Trigger neural inference every 2.5s"
  - Keyboard: Space/Enter to toggle, focus ring visible

## Camera Studio
- **WebcamCapture:** Same as Register but label "Optical Biometric Sensor Stream"
- **Scanning Line:** Active ONLY during `loading || autoVerify` (real processing indicator)
- **Verify Button:** `.btn-primary`, full width max 420px
  - Idle: `ShieldCheck` + "Verify Identity Now"
  - Loading: `RotateCw` spin + "Evaluating Siamese Distances…"
  - Disabled during loading/autoVerify
- **Continuous Toggle:** Below button, same as header but larger hit area

## Result Card (Active Verification)
- **Container:** `.glass-panel-strong`, border color = status (emerald/rose at 30%)
- **Icon Badge:** 56px, rounded-2xl, bg 10% accent, border 30% accent
  - Verified: `ShieldCheck`, emerald
  - Rejected: `ShieldAlert`, rose
- **Headline:** `--text-xl`, weight 700, status color
- **Status Pill:** `.badge-verified` or `.badge-rejected`, "PASSED"/"REJECTED"
- **Message:** `--text-sm`, `--color-fg-secondary`, `text-wrap: pretty`
- **Confidence Gauge:**
  - Label: "Match Confidence" mono uppercase
  - Value: `--text-metric`, weight 700, mono, status color
  - Bar: 8px height, rounded-full, slate-900 track, status color fill, 700ms ease-out
- **Forensic Metadata Grid:** 3 columns (2 on mobile)
  - Sample Consensus: `Layers` icon + "{match}/{total} images matched"
  - Inference Engine: `Cpu` icon + engine name
  - Decision Metric: "L1 Distance ≤ Threshold" (mono)
- **Reset Action:** `.btn-ghost` with `RotateCw`, "Reset Biometric Sensor"

## Standby State (No Result)
- **Container:** `.glass-panel`, min-height 160px
- **Icon:** `ScanFace` 32px, blue-400
- **Title:** `--text-base`, weight 600, "Biometric Sensor Standby"
- **Copy:** `--text-sm`, `--color-fg-muted`, specific instructions

## Verification Telemetry History
- **Header:** `Clock` icon + "Recent Verification Telemetry" (mono, uppercase)
- **Count Badge:** "LAST {n} ATTEMPTS" mono, muted
- **List Items:** 
  - Container: Border-left 3px status color, bg 10% status, hover bg 15%
  - Icon: `CheckCircle2` (emerald) or `XCircle` (rose), 16px
  - Status: "MATCH CONFIRMED" / "REJECTED" mono weight 600
  - Samples: "({match}/{total} samples)" mono muted
  - Latency: "{ms}ms" mono muted
  - Confidence: Pill badge with % (same as status colors)
  - Timestamp: Mono, muted
- **Max Items:** 5 shown, "View All" link if more (future)
- **Empty:** Not rendered until first attempt

## Anti-Patterns Specific to Verify
- ❌ No "scanning" animation when idle (only during real inference)
- ❌ No fake "analyzing face landmarks" visualization
- ❌ No confidence "meter" that animates up randomly
- ❌ No "security level" badges without definition
- ❌ No emoji in history items
- ❌ Color-only status (always icon + text + color)