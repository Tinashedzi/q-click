

# Delores Voice-First + Memory Dashboard Upgrade

## Summary
Make Delores voice-interactive (speak and listen with auto-read responses) and add a Memory Dashboard so users can see/manage what Delores remembers. Voice is the priority.

---

## Current State
- **Speech recognition**: `MicButton` in `DeloresChat.tsx` uses Web Speech API — works but only fills input, doesn't auto-send
- **Text-to-speech**: `useSpeech.ts` hook exists with Web Speech API (pitch 1.1, rate 0.9) — only plays when user manually clicks the speaker icon per message
- **Memory**: `delores_memory`, `delores_sessions`, `delores_tools` tables exist with full RLS. `delores-memory` edge function supports `get_context` and `consolidate` actions
- **Credits**: 5 daily credits on Explorer tier. Each chat message costs 1 credit. Voice features use the same credit gate (no extra cost for TTS/STT since Web Speech API is free/browser-native)

## Phase 1: Voice-First Chat (Priority)

### 1A. Auto-speak Delores responses
**File: `src/components/delores/DeloresChat.tsx`**
- Add a `voiceEnabled` toggle state (default: true) with a visible speaker icon in the chat header
- After streaming completes, automatically call `speak(cleanedText)` if voice is enabled
- Show a pulsing audio wave animation on DeloresAvatar while speaking
- Stop speaking when user starts recording (mic pressed)

### 1B. Hands-free voice loop
**File: `src/components/delores/DeloresChat.tsx`**
- When mic transcript arrives, auto-send immediately (already partially done)
- After Delores finishes speaking, optionally re-activate mic for continuous conversation mode
- Add a "Hands-free" toggle that enables this loop: Listen → Send → AI responds → Speak → Listen again

### 1C. Voice indicator on Delores avatar
**File: `src/components/delores/DeloresAvatar.tsx`**
- Add a `speaking` prop that triggers a rhythmic pulse/glow animation (amber rings)
- Pass `isSpeaking` state from chat component

### 1D. Improve useSpeech hook
**File: `src/hooks/useSpeech.ts`**
- Add `onEnd` callback so chat knows when speech finishes (to re-enable mic in hands-free mode)
- Add voice selection logic: prefer female English voices for Delores's persona
- Expose `speaking` reactive state via a ref-based approach

## Phase 2: Memory Dashboard

### 2A. New Memory Dashboard component
**File: `src/components/delores/MemoryDashboard.tsx`**
- Fetches memories via `delores-memory` edge function (`get_context` action)
- Displays:
  - Total memory count + session count header
  - Memory cards grouped by type (insights, consolidations, interactions)
  - Each card shows: content summary, importance score (star rating), tags as badges, date
  - Delete button per memory (calls Supabase delete on `delores_memory`)
- Recent sessions list with summaries and topics

### 2B. Add Memory Dashboard as Delores activity
**File: `src/pages/Delores.tsx`**
- Add "Delores Memory" to the activities list with action `'memory'`
- Render `MemoryDashboard` when that activity is selected

## Credit Impact
- Voice features (Web Speech API) = **0 credits** (browser-native, free)
- Chat messages = **1 credit each** (unchanged)
- Memory dashboard viewing = **0 credits** (just reads data)
- With 5 daily credits: user gets 5 voice conversations per day

## Technical Details

### Files to modify:
1. `src/hooks/useSpeech.ts` — add `onEnd` callback, `speaking` state
2. `src/components/delores/DeloresChat.tsx` — auto-speak, voice toggle, hands-free mode
3. `src/components/delores/DeloresAvatar.tsx` — speaking animation prop
4. `src/pages/Delores.tsx` — add Memory activity card

### Files to create:
1. `src/components/delores/MemoryDashboard.tsx` — memory viewing/management UI

### No database changes needed — all tables already exist with proper RLS.

