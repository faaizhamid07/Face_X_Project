# Train Page - Design Overrides

## Page Header
- **Badge:** `.glass-pill` with `Cpu` icon, "NEURAL NETWORK TRAINING"
- **Title:** `--text-3xl`, "Train Siamese Network"
- **Subtitle:** `--text-base`, `--color-fg-secondary`, "Upload dataset zip → Auto-extract → Train embeddings → Persist model"

## Dataset Upload Section
- **Dropzone:** `.glass-panel`, dashed border `--color-border`, 2px
  - Drag active: Border `--color-accent-primary`, bg `--color-accent-primary` at 5%
  - Icon: `Upload` 32px, `--color-fg-muted`
  - Text: "Drag & drop dataset.zip or click to browse" (mono)
  - Hint: "Expected: folder/class/image.jpg structure, min 2 classes, 5+ images/class"
- **File Input:** Hidden, triggered by click
- **Validation:** 
  - Accept: `.zip` only
  - Max: 500MB
  - Error toast with specific reason (wrong format, too large, invalid structure)
- **Progress:** Per-file progress bars during extraction, then overall training progress

## Training Configuration (Optional Advanced)
- **Collapsible:** Default closed, `ChevronDown` toggle
- **Fields:** Epochs (number), Batch size (number), Learning rate (number), Threshold (number)
- **Defaults:** Sensible values pre-filled, mono inputs

## SSE Training Stream
- **Container:** `.glass-panel`, max-height 400px, overflow-auto
- **Log Lines:** Monospace, `--text-mono-xs`, color-coded:
  - Epoch: `--color-fg-primary`
  - Loss: `--color-accent-warning` (decreasing = good)
  - Accuracy: `--color-accent-primary` (increasing = good)
  - Time: `--color-fg-muted`
  - Error: `--color-accent-alert`
- **Auto-scroll:** Toggle (default ON), respects reduced motion
- **Copy Button:** `Copy` icon, copies full log to clipboard

## Metrics Table
- **Headers:** Sticky top, mono, uppercase, tracking-wider, `--color-fg-muted`
- **Columns:** Epoch | Loss | Val Loss | Accuracy | Val Acc | Time/epoch
- **Numbers:** Right-aligned, mono, `--text-mono-sm`
- **Best Row:** Highlighted with `--color-accent-primary` left border (3px)
- **Trend Indicators:** Small arrow icons (up/down) for loss/acc trends
- **Mobile:** Horizontal scroll, sticky Epoch column

## Model Status Card
- **States:** 
  - Untrained: "No model trained" + ghost CTA to train
  - Training: Spinner + "Training in progress..." + progress %
  - Trained: `.badge-verified` "Model Ready" + stats (params, dim, threshold, last trained)
  - Error: `.badge-rejected` + error message + retry button
- **Actions:** Download model (.pth), Reset (danger), Deploy to Verify

## Anti-Patterns Specific to Train
- ❌ No fake "neural network" visualization animations
- ❌ No generic "brain" or "neuron" illustrations
- ❌ No progress bars that animate without real backend data
- ❌ No "AI training complete" confetti
- ❌ No placeholder metrics (all from real SSE stream)