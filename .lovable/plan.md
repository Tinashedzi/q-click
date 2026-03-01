

## Plan: Add Delores Emotional Matrix — Implicit Detection & Recommendations

Extend the existing Delores system with implicit emotional state detection (engagement, confusion, frustration, curiosity, confidence) tracked from user interaction patterns, plus an adaptive recommendation engine.

### New Files

**1. `src/types/delores-matrix.ts`** — EmotionalState interface
- Full `EmotionalState` type with `selfReported`, `detected` (5 implicit signals), and `recommendation` fields

**2. `src/engine/delores-matrix.ts`** — Detection engine
- `EmotionalMatrixEngine` class that:
  - Tracks interaction events (clicks, hesitations, quiz results, navigation patterns) in memory
  - Computes implicit signals: engagement (interaction frequency), confusion (repeated views, hesitation), frustration (rapid exits, failures), curiosity (exploration breadth), confidence (speed + accuracy)
  - Combines self-reported mood + implicit signals to generate a recommendation (`simplify`, `challenge`, `encourage`, `redirect`, `break`, `celebrate`)
  - Persists state snapshots to localStorage (`sensage-emotional-matrix`)
  - Exports `trackEvent(type, metadata)` for other components to call

**3. `src/components/delores/EmotionalMatrix.tsx`** — Matrix visualization
- Radar/spider chart (recharts RadarChart) showing 5 implicit signals
- Current recommendation card with action + message
- History of recent emotional state snapshots

### Modified Files

**4. `src/data/deloresResponses.ts`**
- Add `detected` fields to `MoodEntry` interface
- Add recommendation generation logic mapping combined state → action

**5. `src/components/delores/MoodCheckIn.tsx`**
- After mood submission, also snapshot implicit signals from the engine
- Save combined `EmotionalState` alongside existing `MoodEntry`

**6. `src/components/delores/EmotionalDashboard.tsx`**
- Add implicit signals radar chart section
- Show current Delores recommendation with action badge
- Display engagement/confusion/frustration trends over time

**7. `src/pages/Delores.tsx`**
- Add third tab: "Matrix" showing the EmotionalMatrix component
- Initialize the matrix engine on mount

