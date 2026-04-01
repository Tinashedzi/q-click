
## Cognitive DNA Onboarding & Personalization

### Phase 1: Onboarding Flow Component
- Create `src/components/onboarding/CognitiveDNAFlow.tsx` — a full-screen, animated 5-question psychometric probe flow
- Each probe is presented one at a time with Delores as the interviewer
- Options map to cognitive traits from the JSON (Information Processing, Motivational Drivers, Risk & Resilience, Social Dynamics, Emotional Baseline)
- On completion, compute a `cognitive_dna` profile object and store it in `profiles.preferences` JSONB field
- Gate the flow: show on first login if `preferences.cognitive_dna` is null, skip otherwise

### Phase 2: Personalization Engine
- Create `src/engine/cognitive-profile.ts` — utility functions to read the stored DNA and derive:
  - **Learning style** (visual/kinesthetic/auditory/text-based)
  - **Motivation type** (intrinsic/extrinsic/mastery/social)
  - **Challenge tolerance** (high grit vs needs pacing)
  - **Social preference** (lone wolf/collaborator/competitor/mentor)
  - **SEL support level** (high empathy vs high challenge)

### Phase 3: Delores Personalization
- Update the `delores-chat` edge function system prompt to include the user's cognitive DNA traits
- Delores adapts tone: e.g. "High Empathy/Slower Pacing" → gentler language; "High Challenge" → more direct pushes

### Phase 4: Quest & Content Personalization
- Update quest generator to factor in challenge tolerance and motivation type
- Update video feed ordering to prefer content matching the user's learning style (e.g. visual learners see more video-heavy content first)

### Files to create/modify:
- **New**: `src/components/onboarding/CognitiveDNAFlow.tsx`
- **New**: `src/engine/cognitive-profile.ts`
- **Modify**: `src/App.tsx` (gate the DNA flow)
- **Modify**: `supabase/functions/delores-chat/index.ts` (inject DNA into system prompt)
- **Modify**: `supabase/functions/quest-architect/index.ts` (adjust difficulty)
- **Modify**: `src/pages/Index.tsx` (sort video feed by learning style)
