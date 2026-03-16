# Tibet Project Research Report

## 1. Executive Summary

This repository is a Vite + React single-page application that presents Tibetan Buddhist source material in three primary experiences:

- `The Text`: a structured reading interface for the Bardo Thodol main text
- `The Prayer`: a structured reading interface for prayer collections, some with audio and pronunciation
- `The Chants`: an album-style audio library with a persistent global player

The project is fundamentally a static-site content experience. There is no backend, no API layer, no database, and no server-side rendering. All runtime content is shipped as static JSON and media files. User-specific state is stored in `localStorage`.

At a high level:

- Framework/runtime: React 18, React Router 6, Vite 5
- Styling: Tailwind CSS with a custom luxury/editorial visual layer
- Motion: Framer Motion
- Persistence: browser `localStorage`
- Deployment target: Cloudflare Pages

The application is content-heavy and data-driven. Most of the repository complexity is not in business logic, but in turning text/audio source material into JSON files that the frontend can render.

## 2. Repository Shape

Top-level directories and their roles:

- `src/`: frontend application code
- `src/data/`: generated runtime datasets consumed by the app
- `public/`: static assets served directly by Vite/Pages, especially audio files and album covers
- `book/`: source text files used to build `src/data/book.json`
- `Prayer/`: source prayer texts and some prayer-specific audio/pronunciation inputs
- `mp3/`: source audio album directories used to build/copy public audio assets
- `scripts/`: data extraction and transformation scripts
- `PNG/`: reference images/html artifacts, likely supporting/manual assets

Notable top-level files:

- `package.json`: scripts and dependencies
- `vite.config.js`: Vite and Vitest config
- `tailwind.config.js`: theme tokens and typography/color setup
- `postcss.config.js`: Tailwind + Autoprefixer
- `parseLexicon.cjs`, `rebuild_albums.cjs`, `update_album.cjs`, `fix_3_1_mapping.cjs`: one-off and recurring content pipeline scripts

## 3. Build and Tooling

### Package Scripts

From `package.json`:

- `npm run dev`: local Vite dev server
- `npm run build`: production build
- `npm run preview`: local preview of build output
- `npm run lint`: ESLint
- `npm run test`: Vitest

### Dependencies

Runtime dependencies:

- `react`, `react-dom`
- `react-router-dom`
- `framer-motion`
- `lucide-react`

Dev dependencies:

- Vite and `@vitejs/plugin-react`
- Tailwind, PostCSS, Autoprefixer
- ESLint and React-related plugins
- Vitest, Testing Library, JSDOM

### Build Characteristics

The project builds successfully with Vite. The latest build produced:

- `dist/index.html`
- one CSS bundle around 63 KB pre-gzip
- one large JS bundle around 1.4 MB pre-gzip

Vite emitted a chunk-size warning, so the app currently ships as a relatively large mostly-monolithic JS bundle. There is no meaningful route-level code splitting in the current structure.

### Test Status

The test suite currently passes:

- 1 test file
- 3 tests
- all passing

Coverage is narrow and focuses only on the custom `useAudioPlayer` hook.

## 4. Runtime Architecture

### Entry Point

`src/main.jsx` mounts `App` under React `StrictMode`.

### Root App Composition

`src/App.jsx` composes the app in this order:

1. `ThemeProvider`
2. `UIProvider`
3. `PasswordGuard`
4. `BrowserRouter`
5. shared `Layout`

The app maintains one root-level state object:

- `playbackRequest`

This is used to trigger the bottom global player from anywhere that has access to the outlet context, especially the album page.

### Routing

The app has four routes:

- `/` -> `Home`
- `/text` -> `Text`
- `/chapter` -> `Chapter`
- `/album` -> `Album`

There are no route params, loaders, or nested data APIs. The routing model is very simple.

### Layout

`src/components/Layout.jsx` renders:

- `Header`
- nested route content via `Outlet`
- `GlobalPlayer`
- three modal overlays:
  - `CompendiumModal`
  - `CommentariesModal`
  - `LexiconModal`

This means the major modal and audio surfaces are globally mounted and can be toggled without route transitions.

## 5. Global State and Persistence

### Theme State

`src/context/ThemeContext.jsx` manages:

- `theme`
- `toggleTheme()`

Behavior:

- initializes from `localStorage.theme`
- defaults to `light`
- applies `light` or `dark` as a class on `document.documentElement`
- persists back to `localStorage`

### UI State

`src/context/UIContext.jsx` manages UI toggles and shared reading state:

- `isSidebarOpen`
- `isReflectionsOpen`
- `isCompendiumOpen`
- `isCommentariesOpen`
- `isLexiconOpen`
- `activeVerse`

`activeVerse` is the shared selected verse used primarily by the prayer-reading flow and the header navigator. It is persisted to `localStorage` under `tibet_active_verse`.

### Additional Local Persistence

The app also stores:

- `tibet_authorized`: set by the password gate
- `tibet_active_text_verse`: current `/text` selection
- `tibet-prayer-note-<id>`: notes for prayer verses
- `tibet-book-note-<id>`: notes for text verses

The app therefore behaves like a static offline-capable study interface with local-only personalization.

## 6. Access Control

`src/components/PasswordGuard.jsx` blocks the entire app until the correct password is entered.

Behavior:

- checks `localStorage.getItem('tibet_authorized') === 'true'`
- password is hardcoded as `0228`
- if correct, persists authorization in `localStorage`

This is not real security. It is client-side gating only. Anyone with source access or devtools can discover or bypass it. It functions more like a courtesy lock than authentication.

## 7. Page-by-Page Behavior

### Home (`src/pages/Home.jsx`)

The home page is a branded landing page with:

- `HeroSection`
- `HomeNavigation`
- three `NavigationCard` entries linking to the three main experiences

Secondary actions open global modals:

- Compendium
- Lexicon
- Commentaries

### Text (`src/pages/Text.jsx`)

This page is the main-text reading experience using `src/data/book.json`.

Layout:

- `LeftSidebar`
- `ReadingPanel`
- `RightSidebar`

Behavior:

- selected verse is stored separately as `activeTextVerse`
- selection persists in `localStorage` under `tibet_active_text_verse`
- all verses are flattened via `flattenVerses(bookData)`
- previous/next navigation walks the flattened list
- audio is disabled for text entries via `hideAudio={true}`

The `/text` flow is independent from the prayer `activeVerse` in `UIContext`.

### Chapter (`src/pages/Chapter.jsx`)

This page is the prayer-reading experience using `src/data/prayers.json`.

Layout is the same three-column pattern:

- `LeftSidebar`
- `ReadingPanel`
- `RightSidebar`

Key difference:

- it uses `activeVerse` from `UIContext`
- previous/next navigation walks flattened prayer verses
- audio is enabled when `verse.audioUrl` exists

The shared `activeVerse` allows the header chapter navigator and the commentaries modal to coordinate with this page.

### Album (`src/pages/Album.jsx`)

This page renders album cards from `ALBUMS` (`src/data/albums.json`).

Behavior:

- clicking an album opens `AlbumDetail`
- clicking a track inside `AlbumDetail` sends a `playbackRequest`
- `playbackRequest` is passed through outlet context back to `Layout`
- `GlobalPlayer` consumes the request and begins playback

This creates a persistent cross-route audio experience for albums, separate from the inline verse player used in reading pages.

## 8. Reading Experience Internals

### Left Sidebar

`src/pages/components/LeftSidebar.jsx` is responsible for:

- chapter/subchapter expansion
- computing verse indices
- showing grouped chapters and verses
- mobile slide-in behavior

It supports both:

- grouped text data (`book.json` with `subchapters`)
- flat prayer chapter data (`prayers.json` with direct `verses`)

Important detail:

- when `isPrayerPage` is true, verse numbering resets per chapter/subchapter
- when false, text paragraphs are flattened into one continuous numbering sequence

### Reading Panel

`src/pages/components/ReadingPanel.jsx` is the central reading surface.

It renders:

- `ReadingHeader`
- `TibetanSection`
- `AudioPill` when audio exists and is not hidden
- `TranslationSection`
- `NavigationPill`

For prayer entries, it creates a one-item playlist from `verse.audioUrl` and uses the `useAudioPlayer` hook. This is a local inline player, separate from the bottom global player used for albums.

### Right Sidebar

`src/pages/components/RightSidebar.jsx` is a note-taking panel.

Capabilities:

- edit current note
- save to `localStorage`
- export current note as text file
- export all notes for that storage prefix as one text file

Prefix-based namespacing:

- `storagePrefix="prayer"` on `/chapter`
- `storagePrefix="book"` on `/text`

This is the app’s only user-generated content feature.

## 9. Audio System

There are effectively two audio systems.

### A. Inline verse audio

Used by prayer reading pages via:

- `ReadingPanel`
- `useAudioPlayer`
- `AudioPill`

Characteristics:

- creates its own `Audio()` object
- supports play/pause
- tracks progress, current time, duration
- supports seeking
- auto-advances within a playlist

In practice, on reading pages the playlist usually contains a single verse track.

### B. Global album audio

Used by album browsing via:

- `Album`
 - `AlbumDetail`
- root `playbackRequest`
- `GlobalPlayer`

Characteristics:

- persistent bottom player
- maintains album and track index
- supports repeat modes:
  - no repeat
  - repeat all
  - repeat one
- supports mute and volume
- survives route transitions because it lives in the global layout

### Supporting Utilities

`src/utils/audioUtils.js` contains `formatTime()`.

### Tests

`src/hooks/useAudioPlayer.test.jsx` validates:

- initial track selection
- play/pause toggling
- direct track selection

## 10. Modal System

### Compendium

`src/components/CompendiumModal.jsx`

Purpose:

- editorial/introductory explanation of the text and its spiritual framing

The content is embedded directly in the component rather than sourced from JSON or markdown.

### Lexicon

`src/components/LexiconModal.jsx`

Purpose:

- searchable glossary

Behavior:

- loads `src/data/lexicon.json`
- filters by term or definition
- sorts alphabetically
- groups by first letter

### Commentaries

`src/components/CommentariesModal.jsx`

Purpose:

- aggregate view of saved notes

Behavior:

- scans `localStorage`
- attempts to list saved reflections
- allows jump-to-verse and deletion

Important architectural note:

- this modal is wired only against prayer data, not book data
- it appears designed around prayer commentary browsing

Important implementation note:

- note key conventions do not fully align with `RightSidebar`
- `RightSidebar` writes keys like `tibet-prayer-note-<id>` and `tibet-book-note-<id>`
- `CommentariesModal` looks for keys starting with `tibet-note-`

Because of that mismatch, the modal likely misses notes created by the current sidebar implementation unless other historical keys still exist in storage.

## 11. Data Model

### Runtime Datasets

The runtime app consumes four generated JSON files:

- `src/data/book.json`
- `src/data/prayers.json`
- `src/data/albums.json`
- `src/data/lexicon.json`

Observed counts:

- `book.json`: 4 top-level groups, 279 verses/paragraphs
- `prayers.json`: 5 prayer chapters, 52 verses
- `prayers.json`: 33 verses with audio
- `prayers.json`: 33 verses with pronunciation
- `albums.json`: 7 albums, 73 tracks
- `lexicon.json`: 532 entries

### Book Data Shape

`book.json` contains grouped sections like:

- top-level group
- `subchapters`
- `verses`

Each verse typically includes:

- `id`
- `title`
- `chapterTitle`
- `text.tibetan`
- `text.english`
- `text.korean` as an array of translator objects

### Prayer Data Shape

`prayers.json` is flatter:

- top-level prayer chapter
- direct `verses`

Each verse may include:

- `id` like `3.1`
- `title`
- `chapterTitle`
- `text.tibetan`
- `text.english`
- `text.korean`
- optional `text.pronunciation`
- optional `audioUrl`

### Album Data Shape

`albums.json` entries include:

- `id`
- `title`
- `artist`
- `description`
- `coverImage`
- `tracks[]`

Track entries include:

- `id`
- `title`
- `url`

### Lexicon Data Shape

`lexicon.json` is a simple list:

- `term`
- `definition`

## 12. Content Pipeline and Generation Scripts

This repo contains a real content pipeline, even though runtime is static.

### Book Pipeline

Primary script:

- `scripts/parse_book_text.js`

Source files:

- `book/1.txt`
- `book/2.txt`
- `book/3.txt`
- `book/4..txt`
- `book/5.txt`

Behavior:

- parses chapter/subchapter structure from one file
- parses English/Korean translation blocks from another
- merges additional Korean translations
- merges Tibetan text
- emits `src/data/book.json`

Important detail:

- there is also an older `scripts/parse_book_txt.js`
- this older version uses `jsdom` and HTML parsing
- it looks like a superseded pipeline kept in the repo for fallback/history

### Prayer Pipeline

Primary scripts:

- `scripts/extract_prayers.js`
- `scripts/add_romanized.js`

Behavior:

- parses prayer source text files in `Prayer/`
- classifies lines into Tibetan / English / Korean heuristically
- writes `src/data/prayers.json`
- then enriches specific chapters with pronunciation blocks and audio URLs

Audio/pronunciation enrichment covers:

- Prayer 3
- Prayer 4
- Prayer 5

There is also:

- `fix_3_1_mapping.cjs`

This appears to be a targeted repair script for a chapter-3 pronunciation mapping problem.

### Lexicon Pipeline

Primary script:

- `parseLexicon.cjs`

Behavior:

- reads `Lexicon.txt`
- heuristically decides which lines are terms vs definitions
- assembles a glossary array
- writes `src/data/lexicon.json`

This parser is stateful and heuristic-heavy, which explains some malformed entries in the output.

### Album Pipeline

Primary script:

- `rebuild_albums.cjs`

Behavior:

- scans subfolders in `mp3/`
- copies images into `public/album-covers`
- copies audio into `public/mp3`
- generates `src/data/albums.json`
- derives album title/artist from folder names
- imports descriptions from `INTRO.txt` or similar text files

There is also:

- `update_album.cjs`

This looks like a one-off script written for a specific Bhutan Volume 2 import/update path, rather than part of the normalized pipeline.

## 13. Styling and Visual Language

The visual system is strong and intentionally atmospheric.

Characteristics:

- warm paper-and-gold palette for light mode
- dark ink-like palette for dark mode
- serif-heavy editorial typography with supporting sans fonts
- glassmorphism panels, blur, noise overlays, gradients
- Framer Motion entrance animations

Primary styling sources:

- `tailwind.config.js`
- `src/index.css`

Notable design choices:

- custom color tokens such as `sand-*`, `gold-*`, `dark-*`
- a large amount of handcrafted CSS on top of Tailwind utilities
- home page background image pulled from a remote Unsplash URL

The UI direction is not generic dashboard/application design. It is closer to a curated reading installation or museum-like study interface.

## 14. Encoding and Data Quality Observations

One of the most important findings in this repository is that several files show mojibake or encoding corruption.

Visible symptoms:

- many Korean strings render as broken glyph sequences in code and JSON
- some album titles/descriptions contain malformed punctuation like `竊?`
- some JSON values appear to include BOM or encoding artifacts
- some inline component labels are visibly corrupted

This affects:

- `src/data/prayers.json`
- `src/data/albums.json`
- `src/data/lexicon.json`
- portions of React component source files
- some Tailwind comments and UI strings

Probable cause:

- text passed through mismatched UTF-8 / CP949 / UTF-16 or similar conversions during source preparation or editing

Operational consequence:

- the app still runs because the JSON is syntactically valid enough for JavaScript parsing
- however, content fidelity is degraded in multiple places
- some tooling, such as PowerShell `ConvertFrom-Json`, fails on at least part of the dataset because of malformed string content

This is one of the highest-value cleanup opportunities in the codebase.

## 15. Architectural Oddities and Technical Debt

### 1. Duplicate or superseded scripts

There are clearly old and new versions of some content-processing logic living side by side.

Examples:

- `scripts/parse_book_text.js`
- `scripts/parse_book_txt.js`
- targeted repair scripts like `fix_3_1_mapping.cjs`
- one-off importer `update_album.cjs`

This suggests an evolving manual pipeline rather than a clean single-source process.

### 2. Mixed note-key conventions

The note editor and commentaries modal do not agree on `localStorage` key prefixes.

This likely makes the “My Reflections” modal incomplete or stale.

### 3. Hardcoded password gate

The gate is purely cosmetic from a security standpoint.

### 4. Large JS bundle

The current build emits a large main chunk and no meaningful route-level code splitting.

### 5. Runtime content embedded in components

Some long-form explanatory content lives directly in JSX instead of external content files, which makes editorial updates more cumbersome.

### 6. Potential dead or legacy components

`src/components/PlayerContainer.jsx` and older player abstractions suggest the audio system may have gone through refactors, leaving some code paths semi-detached from the current layout-driven player design.

## 16. How the App Actually Works End-to-End

### Reading flow for `/chapter`

1. User passes `PasswordGuard`
2. `Chapter` loads `prayers.json`
3. `LeftSidebar` lists prayer chapters and verses
4. User selects a verse
5. `activeVerse` is saved into shared UI context and `localStorage`
6. `ReadingPanel` renders Tibetan, pronunciation, English, Korean, and optional audio
7. `RightSidebar` lets the user save/export reflections
8. `Header` chapter navigator reads the same `activeVerse` and can change it

### Reading flow for `/text`

1. `Text` loads `book.json`
2. Selected text paragraph is maintained separately from prayer state
3. `LeftSidebar` presents grouped subchapters
4. `ReadingPanel` renders text without audio
5. `RightSidebar` stores notes under the `book` namespace

### Album flow

1. `Album` renders cards from `albums.json`
2. User opens `AlbumDetail`
3. User clicks a track
4. Page calls `setPlaybackRequest`
5. Global layout-level player receives request
6. `GlobalPlayer` loads the album track and continues across route changes

### Lexicon flow

1. User opens the global lexicon modal
2. Static `lexicon.json` is filtered in memory
3. Grouped results render alphabetically

## 17. Verification Performed During Research

I verified the following directly:

- repository structure
- package configuration
- app routing and component tree
- context and persistence behavior
- reading/audio/modal flows
- data generation scripts
- production build success
- test suite success
- current dataset counts

Commands effectively validated:

- project build: passed
- test suite: passed

## 18. Recommended Next Cleanup Areas

If this project is going to be maintained actively, the best next investments would be:

1. Normalize text encoding across source files and generated JSON
2. Unify the note/commentary `localStorage` key scheme
3. Consolidate content pipeline scripts into one documented workflow per dataset
4. Add route-level code splitting to reduce the giant JS bundle
5. Move long-form modal prose into content files instead of hardcoded JSX
6. Add more tests around reading navigation, note persistence, and global player behavior

## 19. Final Assessment

This is a static but carefully art-directed spiritual reading/listening application with a surprisingly substantial content-preparation pipeline behind it. The frontend runtime is relatively simple: route-based pages over static JSON, modals, local persistence, and two distinct audio playback models. The real complexity is in content assembly and the quality of the text/audio datasets.

The project is already deployable and functional, but it carries visible signs of iterative manual curation: encoding issues, one-off patch scripts, overlapping parser generations, and some state/key mismatches. Those are not fatal, but they are the main factors that would slow future maintenance if left unaddressed.
