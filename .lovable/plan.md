

## Plan: Creator's Forge, Gamification Engines, and Library Aggregator

This is a massive feature set spanning 3 major systems with ~16 sub-features. Since there's no backend (Lovable Cloud/Supabase) connected yet, all features will use localStorage for persistence and mock/template data. AI-powered features (Concept Forge, Wikipedia summaries, arXiv summaries) will show placeholder UIs ready for future Lovable AI integration.

### Architecture Overview

```text
src/
├── pages/
│   ├── Forge.tsx              (replaces Placeholder, tabbed Forge dashboard)
│   ├── Library.tsx            (new page for Library Aggregator)
│   └── Gamification.tsx       (new page or section in Index)
├── components/
│   ├── forge/
│   │   ├── ConceptForge.tsx   (topic → concept map generator)
│   │   ├── ScriptForge.tsx    (concept → atomic reveal script editor)
│   │   ├── VideoForge.tsx     (script → video preview placeholder)
│   │   ├── GameForge.tsx      (learning game builder with templates)
│   │   ├── PathForge.tsx      (learning path designer)
│   │   └── ForgeDashboard.tsx (creations overview + analytics)
│   ├── gamification/
│   │   ├── PointsEngine.tsx   (points display + rules admin)
│   │   ├── AchievementEngine.tsx (badges + achievement discovery)
│   │   ├── BeltEngine.tsx     (belt progression visualization)
│   │   ├── TournamentEngine.tsx (challenge creation + leaderboards)
│   │   └── StreakEngine.tsx    (streak tracking + streak guardian)
│   └── library/
│       ├── WikipediaSearch.tsx (search + summarize articles)
│       ├── GutenbergSearch.tsx (book search + reader)
│       ├── ArxivSearch.tsx     (paper search + summaries)
│       ├── YouTubeSearch.tsx   (curated playlists)
│       ├── GovernmentPortal.tsx(curated professional content)
│       └── PersonalLibrary.tsx (saved content manager)
├── data/
│   ├── gamificationData.ts    (point rules, achievements, belts, templates)
│   └── libraryData.ts         (sample curated content for each source)
```

### Implementation Steps

**1. Creator's Forge page + sub-components**
- Replace the `/forge` Placeholder route with a real `Forge.tsx` page using tabs: Concept, Script, Video, Game, Path, Dashboard
- `ConceptForge.tsx`: Form with topic input → generates a mock concept card (universal meaning + 5 translations + examples) using template logic. Shows "Connect AI for auto-generation" prompt
- `ScriptForge.tsx`: Select a concept → editable 4-section script (hook/split/radiation/fallout) with text + visual style fields. Export as JSON button
- `VideoForge.tsx`: Takes a script, shows placeholder animation preview with sections. "Connect Kling/Veo" banner. Batch mode toggle
- `GameForge.tsx`: Template selector (matching, ordering, construction, simulation) with drag-drop-style card arrangement. Preview mode
- `PathForge.tsx`: Sequence concepts into a learning path with milestones and quiz placeholders. Save to localStorage
- `ForgeDashboard.tsx`: Grid of all creations from localStorage with mock analytics (views, completions, ratings)

**2. Gamification Engines**
- Add a "Progress" or gamification section accessible from the home page or header
- `PointsEngine.tsx`: Define point rules (action → points with conditions). Display running total. Store in localStorage
- `AchievementEngine.tsx`: Achievement cards with lock/unlock state, triggers, rewards. Discover achievements through actions
- `BeltEngine.tsx`: Circular progress visualization showing belt level (White → Yellow → Green → Blue → Black). Celebration animation on level-up
- `TournamentEngine.tsx`: Create time-bound challenges with topic, scoring rules, leaderboard. Mock bracket display
- `StreakEngine.tsx`: Calendar heatmap showing consecutive days. Streak freeze mechanic using points. Animated "streak guardian" pet

**3. Library Aggregator**
- New `/library` route and page with tabs for each source
- `WikipediaSearch.tsx`: Search input → fetch Wikipedia API (public, no key needed) → display summaries → "Add to Glossa" button
- `GutenbergSearch.tsx`: Search Project Gutenberg API (public) → book list → in-browser reader with word-click Glossa lookup
- `ArxivSearch.tsx`: Search arXiv API (public) → paper list with abstracts → "AI Summary" placeholder → save to reading list
- `YouTubeSearch.tsx`: Curated playlist display (static data, no API key needed) → links + mock interactive transcripts
- `GovernmentPortal.tsx`: Curated static content cards for nursing, coding, construction categories
- `PersonalLibrary.tsx`: Saved items from all sources, organized into collections, with progress tracking

**4. Navigation + routing updates**
- Update `TabNav.tsx`: Add Library tab with `BookMarked` icon
- Update `App.tsx`: Add `/library` and `/gamification` routes, replace Forge placeholder
- Update `Index.tsx`: Add Library and Gamification cards to feature grid
- Update Header to show streak count alongside Wisdom Points

### Technical Notes
- All external API calls (Wikipedia, Gutenberg, arXiv) use their public REST APIs directly from the client — no API keys required
- AI-powered features (concept generation, article summarization) will show template/mock output with a banner: "Enable Lovable Cloud + AI for intelligent generation"
- localStorage keys namespaced as `sensage-forge-*`, `sensage-gamification-*`, `sensage-library-*`
- This creates ~18 new component files, 2 new data files, 2 new pages, and edits to 4 existing files

