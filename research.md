# Tibet Project Research Report

Updated: 2026-03-18
Workspace: `C:\Users\roadsea\Desktop\tibet`

## 1. Executive Summary

This project is a static React/Vite reading and listening app for Tibetan Buddhist source material. It has no backend and no server-side rendering. The app is built around four primary user flows:

1. Home landing page
2. Main text reading (`/text`)
3. Prayer reading (`/chapter`)
4. Chant album browsing and playback (`/album`)

The runtime is relatively simple. Most of the real complexity lives in the data layer:

- `book/*.txt` -> `src/data/book.json`
- `Prayer/*.txt` -> `src/data/prayers.json`
- `Lexicon.txt` -> `src/data/lexicon.json`
- `mp3/*` -> `public/mp3/*` and `src/data/albums.json`

The app is effectively a curated document browser with side notes, modal study tools, and two separate audio systems:

- per-verse local audio player for prayer pages
- persistent global album player for chant playback

## 2. Stack And Build

### Core stack

- React 18
- React Router 6
- Vite 5
- Tailwind CSS 3
- Framer Motion
- Lucide React
- Vitest + Testing Library

### Package scripts

- `npm run dev`: Vite dev server
- `npm run build`: production build
- `npm run test -- --run`: test suite
- `npm run typecheck`: strict JS/JSDoc typecheck for pipeline and validation modules
- `npm run regen:data`: regenerate book, prayer, and lexicon data, then validate output

### Current verification status

Verified during this research pass:

- `npm run build`: passed
- `npm test -- --run`: passed
- `node scripts/extract_prayers.js`: passed
- `node parseLexicon.cjs`: passed

## 3. Project Layout

### Primary runtime folders

- `src/`: app code
- `public/`: deploy-time static assets and Pages headers
- `src/data/`: generated JSON consumed by the app
- `book/`: source text corpus for main text
- `Prayer/`: source text corpus for prayer pages
- `mp3/`: source audio album folders

### Primary script and utility files

- `scripts/parse_book_text.js`
- `scripts/extract_prayers.js`
- `scripts/validate_generated_data.js`
- `parseLexicon.cjs`
- `rebuild_albums.cjs`

### Deployment-related files

- `index.html`
- `public/manifest.json`
- `public/_headers`

`public/_headers` is important: it forces low-cache behavior for `/`, `/index.html`, and `/manifest.json`, which helps Cloudflare Pages serve fresh app shells after deployment.

## 4. Application Entry And Top-Level Flow

### Entry

- `src/main.jsx` mounts `<App />`
- `src/App.jsx` sets up:
  - `ThemeProvider`
  - `UIProvider`
  - `BrowserRouter`
  - route-level `React.lazy` loading for the four pages

The old password gate has already been removed. There is no login/auth flow now.

### Top-level layout

`src/components/Layout.jsx` provides the shared shell:

- `Header`
- routed page content via `Outlet`
- `GlobalPlayer`
- lazy-loaded global modals:
  - `CompendiumModal`
  - `CommentariesModal`
  - `LexiconModal`

This means modals and the album player live outside any single page and persist across route changes.

## 5. Routes And User-Facing Behavior

### `/`

Home landing page in `src/pages/Home.jsx`

Responsibilities:

- hero presentation
- open study modals
- route users into text, prayer, or album sections

The page is heavily motion-driven and mostly presentational.

### `/text`

Main text reader in `src/pages/Text.jsx`

Responsibilities:

- fetch `book.json` lazily via `?url` and `fetch`
- restore current verse from `localStorage`
- render left navigation, reading panel, and right notes sidebar
- allow sequential previous/next navigation over flattened verse order

Persistence key:

- `tibet_active_text_verse`

### `/chapter`

Prayer reader in `src/pages/Chapter.jsx`

Responsibilities:

- import `prayers.json` directly
- use `UIContext.activeVerse` as current prayer verse
- flatten prayer verses for previous/next navigation
- render left navigation, reading panel, and notes sidebar

Prayer pages can expose verse-level audio.

### `/album`

Album browser in `src/pages/Album.jsx`

Responsibilities:

- render album cards from `ALBUMS`
- open album detail modal
- send playback requests to the global player

When a track is selected, the album modal closes and the global bottom player becomes the active playback surface.

## 6. State Management

There is no Redux, Zustand, or server state library. State is handled through React local state plus two contexts.

### `ThemeContext`

File: `src/context/ThemeContext.jsx`

Responsibilities:

- store `light` or `dark`
- persist to `localStorage`
- apply theme class to `document.documentElement`

Persistence key:

- `theme`

### `UIContext`

File: `src/context/UIContext.jsx`

Responsibilities:

- left sidebar open/close
- right reflections drawer open/close
- Compendium modal open/close
- Commentaries modal open/close
- Lexicon modal open/close
- active prayer verse persistence

Persistence key:

- `tibet_active_verse`

Important design note:

- prayer active verse is global in `UIContext`
- main text active verse is managed separately inside `Text.jsx`

This split is intentional but creates two navigation systems that must stay manually consistent.

## 7. Reading Experience Architecture

The reading experience is composed from three page-level pieces:

- `LeftSidebar`
- `ReadingPanel`
- `RightSidebar`

### Left sidebar

File: `src/pages/components/LeftSidebar.jsx`

Responsibilities:

- chapter/subchapter expansion logic
- mobile slide-out behavior
- active verse highlighting
- verse numbering map generation

It supports two shapes of data:

- flat chapter-with-verses (`prayers.json`)
- grouped chapter -> subchapter -> verses (`book.json`)

### Reading panel

File: `src/pages/components/ReadingPanel.jsx`

Responsibilities:

- render one verse at a time
- compute one-track playlist for prayer audio
- compose:
  - `ReadingHeader`
  - `TibetanSection`
  - `AudioPill`
  - `TranslationSection`
  - `NavigationPill`

### Right sidebar

File: `src/pages/components/RightSidebar.jsx`

Responsibilities:

- verse note editing
- save/export current note
- export all notes for one storage prefix

Persistence keys:

- prayer notes: `tibet-prayer-note-{verseId}`
- text notes: `tibet-book-note-{verseId}`

## 8. Audio Architecture

This app has two different audio stacks.

### A. Verse-level reader audio

Used inside `ReadingPanel` through `useAudioPlayer`.

Files:

- `src/hooks/useAudioPlayer.js`
- `src/components/Reading/AudioPill.jsx`

Behavior:

- one `Audio` instance per mounted reading panel
- single-track playlist for a prayer verse
- local controls for play/pause/progress

This is only used when the verse has `audioUrl`, mainly in prayer content.

### B. Global album player

Files:

- `src/components/GlobalPlayer.jsx`
- `src/pages/Album.jsx`

Behavior:

- persistent bottom-fixed player
- track switching across album tracks
- repeat modes
- mute/volume/progress
- survives page navigation because it lives in `Layout`

Playback is triggered via a `playbackRequest` object stored in `App.jsx` and passed down through route outlet context.

## 9. Modal System

Three global modals are lazy-loaded in `Layout`.

### `CompendiumModal`

Static informational modal. Mostly descriptive content.

### `CommentariesModal`

Aggregates saved notes from `localStorage`.

Important behavior:

- loads both prayer and book datasets on open
- constructs verse maps
- displays saved note cards
- can jump directly to the source verse
- can delete stored notes

The earlier note-key mismatch has already been fixed. It now reads:

- `tibet-prayer-note-*`
- `tibet-book-note-*`

### `LexiconModal`

Lazily fetches `lexicon.json`, groups entries alphabetically, and filters them via a client-side search field.

## 10. Data Assets And Scale

Current generated data counts:

### Prayer corpus

- chapters: 5
- verses: 52
- verses with audio: 33
- verses with pronunciation field: 0

Important note:

Prayer pronunciation support has been intentionally removed from the active runtime path. The current prayer experience exposes original text, translation, and audio only.

### Main text corpus

- top-level groups: 4
- subchapters: 25
- verses: 279
- english fallback verses (`Verse n`): 0

### Lexicon

- entries: 513

### Album library

- albums: 7
- total tracks: 73
- covers present: 7

## 11. Data Pipeline Details

This is the most important subsystem in the repository.

### A. Main text pipeline

Script: `scripts/parse_book_text.js`

Input files:

- `book/1.txt`: structure and ranges
- `book/2.txt`: English + Korean translator 1
- `book/3.txt`: Korean translator 2
- `book/4..txt`: Korean translator 3
- `book/5.txt`: Tibetan

Output:

- `src/data/book.json`

Observed behavior:

- `book/1.txt` defines section ranges
- paragraph blocks are keyed by numbered markers
- English parsing now supports both `* English:` and `English:`
- fallback title logic is still present: if English is missing, it falls back to Korean preview or `Verse {id}`

This fallback is useful defensively, but it can hide source parsing regressions unless explicitly audited.

### B. Prayer pipeline

Script: `scripts/extract_prayers.js`

Input files:

- `Prayer/1.txt` through `Prayer/5.txt`

Output:

- `src/data/prayers.json`

Observed behavior:

- supports three header styles:
  - `1. title`
  - `[제 1연] title`
  - `1 title`
- classifies lines into Tibetan / English / Korean
- attaches audio for chapters 3, 4, and 5
- validates expected verse counts before writing output

This pipeline was recently critical: chapter 4 disappeared because the script did not properly handle the `1 title` format.

### C. Lexicon pipeline

Script: `parseLexicon.cjs`

Input:

- `Lexicon.txt`

Output:

- `src/data/lexicon.json`

Observed behavior:

- heuristic parser
- identifies likely term lines
- splits inline `term + definition`
- groups following definition lines until a new term is detected

This is not a schema-driven parser. It is a best-effort text parser over irregular source material.

### D. Album pipeline

Script: `rebuild_albums.cjs`

Inputs:

- folder structure under `mp3/`
- optional cover images
- optional txt descriptions

Outputs:

- copied audio into `public/mp3/`
- copied cover art into `public/album-covers/`
- `src/data/albums.json`

## 12. Performance Characteristics

The project has already been partly optimized.

### Positive changes already in place

- route-level lazy loading for main pages
- modal lazy loading
- large datasets are served as JSON assets and fetched on demand
  - `book.json`
  - `lexicon.json`
  - modal-driven `prayers.json` loads

### Current build shape

- largest JS chunk: about 344 kB before gzip
- `book.json` remains the biggest payload at about 1.3 MB before gzip

Interpretation:

- code splitting is meaningfully improved
- data size, not JS code, is now the main payload concern

## 13. Persistence Model

The app relies heavily on browser storage.

### Known keys

- `theme`
- `tibet_active_verse`
- `tibet_active_text_verse`
- `tibet-prayer-note-{id}`
- `tibet-book-note-{id}`

There is no backend sync, no login, and no cloud persistence. Notes are entirely device-local.

## 14. Design System And Styling Direction

The visual system is defined through:

- `src/index.css`
- `tailwind.config.js`

Current design direction:

- light sand / gold palette
- optional dark mode
- serif headline typography via `Cormorant Garamond`
- sans/UI text via `Inter`
- Korean body font via `Pretendard Variable`
- glassmorphism and layered parchment surfaces

Shared visual primitives include:

- `.modal-backdrop`
- `.modal-shell`
- `.modal-header`
- `.modal-body`
- `.empty-state-card`
- `.serif-title`

## 15. Cloudflare/Deploy Posture

This is a static-site deployment shape and is suitable for Cloudflare Pages.

Important deploy behavior:

- app shell served from Vite build output
- static JSON and media served from built assets/public
- `_headers` file reduces stale HTML/manifest caching

There is no server runtime in the app itself.

## 16. Test Coverage And Gaps

Current automated coverage is still modest, but no longer minimal.

Current test files:

- `src/hooks/useAudioPlayer.test.jsx`
- `src/utils/textUtils.test.js`
- `src/utils/commentaryNotes.test.js`
- `src/utils/generatedContentValidators.test.js`
- `src/utils/pipelineParsers.test.js`

Covered behaviors now include:

- audio hook initialization and track control
- flattening flat and grouped verse structures
- note-key aggregation for prayer and book notes
- detection of fallback English verses
- prayer count validation
- parser support for mixed `English:` / `* English:` formats
- parser support for three prayer section-header formats

## 17. Important Risks And Weak Spots

### 1. Source text inputs are still parser-sensitive

The biggest ongoing reliability risk is still the input format of the source text corpus.

Even after hardening, the book and prayer generators remain dependent on recognizable human-edited markers such as:

- paragraph labels
- section headers
- range declarations
- translator label markers

### 2. Data generation is heuristic and brittle

Both the book and lexicon pipelines depend on loose text parsing rather than strongly structured source inputs.

This means minor source format changes can silently break output.

Recent real examples:

- prayer chapter 4 vanishing because of header format mismatch
- main text English falling back to `Verse {id}` because label format changed

### 3. Prayer pronunciation is intentionally absent

This is no longer an accidental gap. The obsolete pronunciation patch scripts were removed, UI copy was updated, and the current canonical prayer experience is:

- Tibetan original
- English rendering
- Korean translation
- optional prayer audio

### 4. `book.json` remains large

Code splitting is now reasonable, but the main text JSON payload is still large enough to affect first-use load time on `/text`.

### 5. The runtime still depends heavily on localStorage

This is functional, but it means note persistence and active verse recovery remain device-local and are worth regression testing whenever navigation logic changes.

## 18. How The App Actually Works End-To-End

### Text page flow

1. User opens `/text`
2. app fetches `book.json`
3. left sidebar shows grouped chapter structure
4. selecting a verse stores it in `localStorage`
5. reading panel renders Tibetan + English + Korean
6. right sidebar stores local notes for the verse

### Prayer page flow

1. User opens `/chapter`
2. prayer data is already bundled/imported
3. left sidebar selects a prayer verse
4. active verse is stored in `UIContext` and persisted
5. reading panel renders Tibetan, optional audio, English, Korean
6. notes are saved under prayer-specific keys

### Album flow

1. User opens `/album`
2. selects an album card
3. album detail modal opens
4. selects a track
5. `setPlaybackRequest` updates root state
6. `GlobalPlayer` receives request and begins playback
7. player persists while routes change

## 19. Practical Maintenance Notes

If someone needed to maintain this codebase safely, the highest-value habits would be:

1. Treat `src/data/*.json` as generated artifacts, not primary sources.
2. Verify parser scripts after any change to source text formatting.
3. Audit for `Verse n` fallbacks whenever book data is regenerated.
4. Audit prayer verse counts whenever `prayers.json` is regenerated.
5. Expect localStorage to be part of functional behavior, not just preference storage.

## 20. Recommended Next Work

Highest-impact cleanup items from an engineering perspective:

1. Keep cleaning residual source comments and labels when they are touched.
2. If pronunciation support is ever needed again, reintroduce it as a documented generator rather than an ad-hoc patch.
3. Add regression checks for:
   - missing book English
   - missing prayer chapter verses
   - broken note key lookups
4. Keep the documented regeneration workflow in [DATA_PIPELINE.md](C:\Users\roadsea\Desktop\tibet\DATA_PIPELINE.md) aligned with the actual scripts.
5. Consider breaking `book.json` into smaller route- or chapter-level assets.

## 21. Final Assessment

This is a content-heavy static application with a clear aesthetic identity and a workable runtime architecture. The React app itself is straightforward. The real engineering challenge is content ingestion, data integrity, and keeping generated assets aligned with UI assumptions.

In short:

- runtime architecture: moderate complexity
- data pipeline complexity: high relative to app size
- backend complexity: none
- maintenance risk: mainly data parsing and source encoding

The project is functional, deployable, and coherent, but long-term reliability depends more on fixing the text/data toolchain than on changing the React UI layer.
