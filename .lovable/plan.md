## Goal
Make Delores's mic auto-send the user's message after a noticeable pause in speech (silence detection), instead of relying on the browser's unreliable end-of-speech trigger or the user manually tapping the mic again.

## Problem
In `src/components/delores/DeloresChat.tsx`, the `InlineMicButton` configures Web Speech API with `continuous = false`, then only commits the transcript inside `rec.onend`. On desktop Chrome this often:
- Cuts off too early (before the user finishes a sentence), or
- Hangs without firing `onend` until the user taps the mic again,
- And in hands-free mode, never auto-restarts the listen → respond → speak → listen loop reliably.

## Fix

### 1. Rebuild `InlineMicButton` with explicit pause-based silence detection
File: `src/components/delores/DeloresChat.tsx` (the inline `InlineMicButton` component, ~lines 69–230)

- Set `recognition.continuous = true` and `recognition.interimResults = true` so the API keeps streaming until we tell it to stop.
- Maintain a `finalTranscriptRef` that accumulates final results across multiple `onresult` events.
- On every `onresult` (final or interim), reset a `pauseTimeoutRef` timer. When the timer fires (default ~1500 ms of silence), call `recognition.stop()`. This is the "long pause → respond" trigger.
- In `onend`, if `finalTranscriptRef.current` (falling back to the latest interim) is non-empty, call `onTranscript(text)` exactly once, then clear refs.
- In `onerror`, handle `no-speech` and `aborted` gracefully (just stop, don't surface as an error toast).
- Expose a `pauseThreshold` prop (default `1500`) so hands-free mode can tune it.

### 2. Tune the hands-free auto-restart loop
Same file, around the `autoStart` effect and the chat's `onListeningChange` / `speaking` handlers.

- After Delores finishes speaking (`speaking` flips false in hands-free mode), wait ~400 ms and call `startListening` again so the loop continues without user interaction.
- Make sure `startListening` is a no-op while `speaking` is true (prevents the mic capturing Delores's own voice).

### 3. Visual feedback
- Keep the existing waveform animation while listening.
- When the silence timer is armed (i.e. user has spoken and we're counting down to auto-send), briefly show "Sending…" under the mic so users understand why it auto-submits.

## Out of scope
- No changes to the edge function `delores-voice-harness`.
- No changes to TTS (`useSpeech.ts`).
- No new dependencies.

## Files touched
- `src/components/delores/DeloresChat.tsx` (only the `InlineMicButton` component and the small hands-free auto-restart effect)
