

# Add Voice Selector for Natural Delores Voice

## What We're Building
A voice selector dropdown in the Delores chat header so users can choose which browser voice Delores speaks with — picking from all available system voices. This makes Delores sound more natural by letting users select high-quality voices (e.g., "Google UK English Female", "Samantha", etc.) instead of relying on auto-detection which sometimes picks a robotic default.

**Credit cost: 0** — browser-native Web Speech API, no AI credits used.

## Changes

### 1. Update `useSpeech.ts` — Accept a voice URI parameter
- Add `voiceURI` option to `UseSpeechOptions`
- When `voiceURI` is provided, use that specific voice instead of auto-detecting
- Add a static `getVoices()` helper to load available voices

### 2. Update `DeloresChat.tsx` — Add voice selector UI
Adopt the voice selector pattern from the uploaded `DeloresAgenticAGI.ts` (lines 596-611):
- Add state for `voices` list and `selectedVoiceURI`
- Load voices on mount using `speechSynthesis.getVoices()` + `voiceschanged` event
- Add a `<select>` dropdown in the voice controls header bar (next to existing Voice/Hands-free toggles)
- Pass `selectedVoiceURI` through to the `useSpeech` hook

### Files Modified
1. `src/hooks/useSpeech.ts` — add `voiceURI` param support
2. `src/components/delores/DeloresChat.tsx` — add voice picker dropdown, wire to speech hook

