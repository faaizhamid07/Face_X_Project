# Register Page - Design Overrides

## Page Header
- **Badge:** `.glass-pill` with `UserCheck` icon, "BIOMETRIC VAULT ENROLLMENT"
- **Title:** `--text-3xl`, "Register Identity Profile"
- **Subtitle:** `--text-base`, `--color-fg-secondary`, specific guidance on capture angles
- **Vault Status:** `.glass-panel` badge showing enrolled count, blue indicator dot

## Webcam Capture Studio
- **Container:** Max-width 420px, centered, aspect-square
- **Video:** 400x400 constraints, mirrored, object-cover
- **HUD Overlay (Functional, not decorative):**
  - Corner brackets: Reticle brackets - indicate 100x100 crop region
  - Center reticle: Elliptical face alignment guide (w-44 h-56)
  - Crosshairs: Horizontal/vertical center lines at 15% opacity
  - Center dot: 16px reference point
  - Scanning line: ONLY during active capture/processing (not continuous)
  - Top HUD: "LIVE FEED" + "100×100 px" - monospace, glass pills
  - Bottom HUD: "ALIGN FACE WITHIN FRAME" - monospace, glass pill
- **Flash Animation:** White overlay 150ms on capture (confirms shutter)
- **Capture Button:** `.btn-primary`, full width, `Camera` icon, "Capture Biometric Frame"
- **Label:** Below video, mono, "Active Sensor Stream (100×100 Biometric Crop)"

## Staged Frames Gallery
- **Header:** "Staged Vector Frames" + count badge (mono, slate bg)
- **Empty State:** `Camera` icon 40px, descriptive copy, centered
- **Grid:** `grid-cols-3 sm:grid-cols-4 gap-3`, max-height 300px, scrollable
- **Frame Card:**
  - Aspect-square, `overflow-hidden`, `.glass-panel` border
  - Image: `object-cover`, full bleed
  - Hover overlay: `bg-slate-950/60` with frame number `#{n}`
  - Delete: Top-right, `X` icon, rose-600, appears on hover/focus
  - Focus: Visible ring on delete button, frame card has focus outline
- **Purge Vault Button:** Only if `savedCount > 0`, rose ghost style, `Trash2` icon

## Progress & Quota Card
- **Label:** "Enrollment Quota" + Layers icon, mono
- **Progress Bar:** 2px height, slate-900 track, emerald-500 fill
- **Status Text:** 
  - `< 5`: "`{progress}% COMPLETED`" in blue-400
  - `>= 5`: "`READY FOR VERIFICATION`" in emerald-400, weight 700
- **Threshold:** Clear "5 minimum" - not arbitrary percentage

## Vault Commit Actions
- **Commit Button:** `.btn-primary` full width, `Save` icon
  - Loading: "Encrypting & Saving…" with spinner
  - Default: "Commit {n} Frame(s) to Vault"
  - Disabled: No captures or saving
- **Toast Notifications:** 
  - Success: Emerald bg, `CheckCircle2`, 4s auto-dismiss
  - Error: Rose bg, `AlertCircle`, 4s auto-dismiss
  - Position: Top of page, stacked

## Anti-Patterns Specific to Register
- ❌ No "smile for the camera" cutesy copy
- ❌ No decorative particle effects on webcam
- ❌ No arbitrary "quality score" per frame without explanation
- ❌ No infinite scanning line when idle
- ❌ No emoji in toast messages