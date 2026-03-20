# Tibet Project Research Report

## 1. Executive Summary

This project is a Vite + React single-page application for reading and exploring Tibetan Buddhist material across three main experiences:

- `The Text`: the main prose/text corpus
- `The Prayer`: structured prayer chapters and verses
- `The Chants`: album-style audio collections

At runtime, the app is organized around four layers:

1. `src/main.jsx`: mounts the application in `StrictMode`
2. `src/App.jsx`: assembles providers, router, routes, and the global playback request bus
3. `src/components/Layout.jsx`: persistent shell for header, route outlet, global player, and modals
4. page-level experiences: `Home`, `Text`, `Chapter`, `Album`

The overall design deliberately separates:

- theme state from layout/UI state
- global album playback from verse-level reading playback
- desktop panel geometry from mobile drawer behavior
- page content from shell-level layout framing

The codebase is moderate in size, but it contains a fairly rich interaction model with route-driven reading flows, local storage persistence, modal overlays, responsive side panels, and two distinct audio systems.

## 2. Tech Stack and Build Model

### Core stack

- React 18
- Vite 5
- React Router 6
- Framer Motion
- Tailwind CSS
- Vitest + Testing Library

### Package scripts

From `package.json`, the main scripts are:

- `npm run dev`: Vite dev server
- `npm run build`: production build
- `npm run test`: Vitest
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript check against `tsconfig.json`

There is also a small data-generation toolchain:

- `build:data:book`
- `build:data:prayers`
- `build:data:lexicon`
- `build:data:albums`
- `validate:data`
- `regen:data`

This means the app ships mostly pre-generated JSON data, while the `scripts/` folder contains the transformation and validation logic used to refresh those datasets.

## 3. Top-Level Runtime Architecture

### 3.1 Entry point

`src/main.jsx` is minimal:

- imports global CSS
- mounts `<App />`
- wraps in `StrictMode`

### 3.2 Application assembly

`src/App.jsx` is the real composition root.

It wraps the app in:

- `ThemeProvider`
- `UIProvider`
- `BrowserRouter`

It lazy-loads four route pages:

- `/` -> `Home`
- `/text` -> `Text`
- `/chapter` -> `Chapter`
- `/album` -> `Album`

It also owns one important cross-route state:

- `playbackRequest`

This state is not inside a React context. Instead, it is held directly in `App` and passed into `Layout`, which then exposes `setPlaybackRequest` through `Outlet` context. This is a deliberate choice: global album playback is treated as a route-shell concern rather than general UI context.

### 3.3 Persistent shell

`src/components/Layout.jsx` provides the route shell:

- always renders `Header`
- renders the current page via `<Outlet />`
- always renders `GlobalPlayer`
- lazy-loads three modals:
  - `CompendiumModal`
  - `CommentariesModal`
  - `LexiconModal`

This means the header, player, and modal layer persist while page content changes.

## 4. Providers and Global State

### 4.1 ThemeContext

`src/context/ThemeContext.jsx` is simple and self-contained.

Responsibilities:

- initialize theme from `localStorage('theme')`
- default to `light`
- apply `light` / `dark` classes to `document.documentElement`
- expose `theme` and `toggleTheme()`

This provider is only about theme selection; it does not handle layout, modals, routing, or audio.

### 4.2 UIContext

`src/context/UIContext.jsx` is the main application state container.

It manages:

- mobile left drawer state: `isMobileSidebarOpen`
- mobile right drawer state: `activeMobileRightPanel`
- desktop left panel state: `isDesktopSidebarOpen`
- desktop right panel state: `activeDesktopRightPanel`
- three modal open states:
  - `isCompendiumOpen`
  - `isCommentariesOpen`
  - `isLexiconOpen`
- active prayer verse: `activeVerse`

#### Responsive split

One of the most important design decisions in this project is that mobile and desktop panel states are separate.

This prevents:

- mobile drawer transforms from leaking into desktop panel positioning
- layout calculations from depending on a single ambiguous open flag

The desktop breakpoint is:

- `window.matchMedia('(min-width: 1280px)')`

When the viewport becomes desktop:

- mobile drawer states are automatically cleared

#### Local storage persistence

`UIContext` persists:

- `tibet_desktop_sidebar`
- `tibet_desktop_right_panel`
- `tibet_active_verse`

This gives desktop panel preferences and prayer-page active verse continuity across reloads.

#### Derived layout output

`UIContext` computes:

- `isMobileCommentaryOpen`
- `isDesktopCommentaryOpen`
- `desktopGridColumns`

`desktopGridColumns` comes from `src/components/ui/desktopFrame.js`.

That makes `UIContext` the bridge between interaction state and concrete layout geometry.

## 5. Desktop Layout System

This project now has an explicit reusable desktop frame model.

### 5.1 Frame helper

`src/components/ui/desktopFrame.js` defines four desktop states:

- left open + right open -> `20% 60% 20%`
- left closed + right open -> `0% 60% 40%`
- left open + right closed -> `20% 80% 0%`
- left closed + right closed -> `0% 100% 0%`

The single exported layout function is:

- `getDesktopFrameColumns(isDesktopSidebarOpen, isDesktopRightPanelOpen)`

This file is the source of truth for desktop width behavior.

### 5.2 AppShell

`src/components/ui/AppShell.jsx` applies the frame.

Responsibilities:

- render the 3-column reading shell on desktop
- keep the reading area in the middle column
- preserve mobile behavior as a simpler stacked/fixed layout
- provide `min-h-0` and `flex` constraints so the central reading area scrolls correctly

Notable detail:

- the middle content wrapper is `flex min-h-0 min-w-0 flex-1 flex-col`

That detail matters because without it, the reading panel's internal `overflow-y-auto` stops working.

### 5.3 SidebarLayout

`src/components/ui/SidebarLayout.jsx` is the shared panel wrapper for left and right sidebars.

It separates:

- mobile behavior: fixed drawer with `translate-x-*`
- desktop behavior: width/opacity/pointer-event-based open/closed state

This is an important correctness layer:

- open desktop panels always resolve to `translate-x-0`
- closed desktop panels collapse without fake offsets

That avoids the “desktop fake gap” problem that can happen when mobile transforms remain active on desktop.

## 6. Header Behavior

`src/components/Header.jsx` is route-aware.

### Hidden routes

The header is hidden on:

- `/`
- `/album`

### Reading-mode routes

The header is active on:

- `/text`
- `/chapter`

### Mobile vs desktop header

- mobile: plain flex row
- desktop reading mode: grid aligned to the reading frame

One important nuance:

- the desktop header is pinned to the default reading frame (`20 / 60 / 20`)
- it does not shift when side panels open or close

So the left cluster and right cluster stay visually anchored to the default reading column edges.

### Header responsibilities

- left button toggles sidebar
- right button toggles commentary panel
- theme toggle is always available where header is shown
- background transparency and blur change when the page scrolls

## 7. Main Pages

### 7.1 Home

`src/pages/Home.jsx` is a landing page composed of:

- `HeroSection`
- `HomeNavigation`
- three `NavigationCard` entries

The purpose of this page is primarily navigation plus modal entry points.

#### HomeNavigation

`src/components/Home/HomeNavigation.jsx` opens:

- Compendium
- Lexicon
- Commentaries

via UIContext setters.

#### Navigation cards

`src/components/Home/NavigationCard.jsx` links to:

- `/text`
- `/chapter`
- `/album`

It uses `usePremiumInteractions` for a 3D tilt/perspective hover effect.

### 7.2 Text page

`src/pages/Text.jsx` is the main text reader.

#### Data source

- loads `src/data/book.json` by `fetch`

#### State

- keeps `activeTextVerse` in page state
- persists it to `localStorage('tibet_active_text_verse')`

#### Selection logic

- flattens the nested book structure with `flattenVerses`
- if stored verse is missing or invalid, auto-selects the first verse

#### Layout

Renders:

- left: `LeftSidebar`
- center: `ReadingPanel`
- right: `RightSidebar`

through `AppShell`.

#### Audio

- hidden on this page
- `ReadingPanel` gets `hideAudio={true}`

### 7.3 Chapter page

`src/pages/Chapter.jsx` is the prayer reader.

#### Data source

- imports `src/data/prayers.json` statically

#### State

- uses `UIContext.activeVerse`

This means prayer selection is shared in global UI state rather than page-local state.

#### Selection logic

- flattens prayers with `flattenVerses`
- if no valid active verse exists, selects the first verse automatically

#### Layout

Uses the same `AppShell + LeftSidebar + ReadingPanel + RightSidebar` structure as `Text`.

#### Audio

- visible on this page
- `ReadingPanel` gets `hideAudio={false}`

### 7.4 Album page

`src/pages/Album.jsx` is the audio collection/gallery experience.

#### Data source

- `ALBUMS` from `src/utils/constants.js`
- which comes from `src/data/albums.json`

#### Runtime flow

- clicking an `AlbumCard` opens `AlbumDetail`
- selecting a track in `AlbumDetail` calls `setPlaybackRequest`
- this updates the global player in the shell

So albums do not reuse the reading-page audio hook; they route playback through the top-level global player system.

## 8. Reading Experience Internals

### 8.1 ReadingPanel

`src/pages/components/ReadingPanel.jsx` is the central verse renderer.

Responsibilities:

- animate in verse content
- derive a one-track playlist from `verse.audioUrl`
- wire the verse-level audio hook
- render the five main reading sections

Render order:

1. `ReadingHeader`
2. `TibetanSection`
3. `AudioPill` (optional)
4. `TranslationSection`
5. `NavigationPill`

#### Layout detail

Inner width is constrained to:

- `max-w-[980px]`
- `px-4 sm:px-8`

This means even when the middle desktop column expands, the text body remains readable and not too wide.

### 8.2 ReadingHeader

`src/components/Reading/ReadingHeader.jsx` converts `verse.id` into display labels such as:

- `Chapter X`
- `Prayer N`
- `Paragraph N`

It is the layer that turns internal IDs into user-facing section and entry badges.

### 8.3 TibetanSection

`src/components/Reading/TibetanSection.jsx` renders the Tibetan original when present.

Behavior:

- returns `null` if `tibetan` is missing
- normalizes line breaks into spaces
- renders a decorative divider after the section

The section is presentation-heavy and assumes Tibetan text is shown as a single continuous reading block rather than line-preserved verse typography.

### 8.4 TranslationSection

`src/components/Reading/TranslationSection.jsx` is more nuanced than it first appears.

It supports:

- English as a plain single string
- Korean as either:
  - one string
  - an array of translator entries

If Korean is an array, entries are sorted by `TRANSLATOR_ORDER`.

This is a sign that the text dataset supports multiple translation variants for some entries.

### 8.5 AudioPill and verse audio hook

`ReadingPanel` uses `src/hooks/useAudioPlayer.js`.

This hook:

- creates its own `Audio` object
- tracks play state, progress, time, duration
- supports:
  - toggle play
  - play specific track
  - next and previous
  - seek

Since `ReadingPanel` usually creates a one-item playlist, next and previous are mostly generic reuse behavior rather than a major UX focus.

Important design choice:

- reading-page audio is local to the current verse panel
- it is independent from the global album player

`src/components/Reading/AudioPill.jsx` is the presentation layer for that hook:

- play/pause button
- current time
- duration
- progress bar with click-to-seek
- disabled state if `audioUrl` is absent

### 8.6 NavigationPill

`src/components/Reading/NavigationPill.jsx` is purely controlled by page-level callbacks.

That means:

- verse ordering is decided outside the component
- UI is stateless

This is a clean separation: the page decides sequence, and the component renders controls.

## 9. Sidebar System

### 9.1 LeftSidebar

`src/pages/components/LeftSidebar.jsx` is used by both `Text` and `Chapter`.

Responsibilities:

- compute verse numbering for the current data source
- determine which chapter or subchapter should be expanded based on active verse
- render chapter list and verse list together

#### Prayer-specific numbering

When `isPrayerPage` is true:

- numbering resets per prayer section

That gives prayer content a different counting model from the main text.

### 9.2 SidebarChapterList

`src/components/Sidebar/SidebarChapterList.jsx` shows:

- top chapter and subchapter list
- collapses to 30% height when a chapter is expanded
- otherwise occupies full height

This is effectively the chapter chooser region.

Notable detail:

- clicking a chapter also selects its first verse immediately

So expanding a chapter is also a navigation action.

### 9.3 ChapterGroup

`src/components/Sidebar/ChapterGroup.jsx` handles grouped book structure.

The main text data has grouped sections with nested subchapters, so this component bridges the grouped JSON structure into reusable chapter buttons.

### 9.4 ChapterButton

`src/components/Sidebar/ChapterButton.jsx` renders chapter or subchapter rows.

Features:

- animated appearance and hover motion
- count badge showing verse count
- different spacing and weight for subchapters

For prayer chapters whose IDs start with `prayer-`, it prepends a numeric label derived from the ID.

### 9.5 SidebarVerseList

`src/components/Sidebar/SidebarVerseList.jsx` renders the verse list for the active chapter.

Behavior:

- clicking a verse selects it
- mobile view closes the drawer if viewport width is below `1280px`

This component relies on the parent to pass in:

- active verse
- verse numbering map
- selected chapter

### 9.6 RightSidebar

`src/pages/components/RightSidebar.jsx` is now both a current-passage note editor and a saved-note browser.

#### Open-time behavior

When the panel opens:

- fetches `prayers.json`
- fetches `book.json`
- builds verse maps
- reads local storage notes
- builds normalized note cards
- hydrates the current verse note draft from local storage

#### Note actions

- `Save Note`: writes the current passage note back to local storage
- `Open`: navigate back to the originating page and restore verse selection
- `Delete`: remove note from local storage after confirmation
- `Clear`: removes the current verse note when one exists

#### Data origin

Notes are built from local storage key prefixes:

- `tibet-prayer-note-*`
- `tibet-book-note-*`

`RightSidebar` consumes the page-provided `activeVerseId` and `storagePrefix` props to decide which local-storage key to read and write for the current passage.

## 10. Modal System

Three modal families exist at the shell level.

### 10.1 CompendiumModal

`src/components/CompendiumModal.jsx`

Purpose:

- explanatory and study-companion content
- mostly static content

Behavior:

- controlled by `isCompendiumOpen`
- locks body scroll while open
- uses Framer Motion for entry and exit

### 10.2 LexiconModal

`src/components/LexiconModal.jsx`

Purpose:

- searchable term and definition glossary

Behavior:

- fetches `lexicon.json` lazily when first opened
- stores lexicon data in local component state
- filters by term or definition
- groups results alphabetically

This modal is effectively a lightweight in-app glossary browser.

### 10.3 CommentariesModal

`src/components/CommentariesModal.jsx`

Purpose:

- full-screen note collection modal
- broader version of the right sidebar note idea

Behavior:

- loads saved notes when opened
- allows jumping back into text and prayer pages
- allows deleting notes
- locks body scroll while open

This overlaps conceptually with the right sidebar, but it is presented as a modal-accessible note library from the home page.

## 11. Audio Systems

This project has two separate audio pathways.

### 11.1 Global album player

Files:

- `src/App.jsx`
- `src/components/Layout.jsx`
- `src/components/GlobalPlayer.jsx`
- `src/pages/Album.jsx`

Flow:

1. an album track is selected in `AlbumDetail`
2. `Album.jsx` calls `setPlaybackRequest`
3. `Layout` keeps `GlobalPlayer` mounted
4. `GlobalPlayer` reacts to the request and updates a shared audio element

Capabilities:

- play and pause
- previous and next
- seek
- volume
- mute
- repeat mode:
  - none
  - repeat all
  - repeat one

This player is persistent across route changes.

### 11.2 Verse-level audio

Files:

- `src/pages/components/ReadingPanel.jsx`
- `src/hooks/useAudioPlayer.js`

Flow:

1. current verse has `audioUrl`
2. `ReadingPanel` builds a local playlist
3. `useAudioPlayer` manages a local `Audio` object
4. `AudioPill` renders controls

This player is local to the verse being read and is destroyed with component lifecycle.

## 12. Data Sources

The project ships with prebuilt data under `src/data`.

Observed counts:

- book groups: `4`
- total book verses or paragraphs: `279`
- prayer chapters: `5`
- total prayer verses: `52`
- lexicon entries: `513`
- albums: `7`
- total album tracks: `73`

### File roles

- `book.json`: main text content, grouped into sections and subchapters
- `prayers.json`: structured prayer chapters and verses
- `lexicon.json`: term-definition glossary
- `albums.json`: chant collections and track URLs

### Data shape observations

`book.json`:

- nested grouped structure
- some entries contain arrays of Korean translations

`prayers.json`:

- flatter chapter-to-verses structure
- `audioUrl` appears present only for some prayer sections

`albums.json`:

- album metadata plus explicit track URLs

## 13. Utility Layer

### 13.1 textUtils

`src/utils/textUtils.js`

- exports `flattenVerses`
- flattens either:
  - direct `verses`
  - grouped `subchapters[].verses`

This utility is foundational for both reading pages.

### 13.2 commentaryNotes

`src/utils/commentaryNotes.js`

Responsibilities:

- note key prefix definitions
- note metadata labels
- build verse lookup maps
- build normalized saved-note arrays from local storage

This utility is the translation layer between raw local storage and UI-ready note cards.

### 13.3 audioUtils

`src/utils/audioUtils.js`

- currently just `formatTime`

Small utility, but used by both reading and player UI.

### 13.4 generatedContentValidators

`src/utils/generatedContentValidators.js`

These functions are not primarily for runtime UI; they support data validation and generation workflows.

They validate things like:

- fallback verse titles still present in book data
- prayer verse counts
- pronunciation-bearing verses
- suspicious lexicon term lengths

## 14. Data Generation and Build Scripts

Scripts of note:

- `scripts/parse_book_text.js`
- `scripts/parse_book_txt.js`
- `scripts/extract_prayers.js`
- `scripts/lib/bookPipeline.js`
- `scripts/lib/prayerPipeline.js`
- `scripts/validate_generated_data.js`

This implies the checked-in JSON datasets are generated artifacts, not purely hand-authored source.

### Validation script

`scripts/validate_generated_data.js`:

- reads book, prayer, and lexicon JSON
- checks for fallback titles
- validates expected prayer counts
- checks suspicious lexicon entries
- logs pronunciation coverage

So the repo has a real content-quality gate, not just UI code.

## 15. Testing Coverage

There is focused unit coverage in Vitest.

### Covered areas

- `useAudioPlayer`
- `commentaryNotes`
- `textUtils`
- `generatedContentValidators`
- parser and pipeline behavior via `pipelineParsers.test.js`

### What tests emphasize

- audio hook state changes
- note list normalization
- verse flattening correctness
- generated data sanity
- parser compatibility for source text formats

The tests mostly target data logic and hooks rather than large UI rendering flows.

## 16. Notable Design Patterns

### Good separations

- album playback separated from reading playback
- theme state separated from layout and UI state
- shell and layout separated from page content
- desktop frame rules centralized

### Data and UI coupling strategy

The app tends to:

- keep data normalization in utilities
- keep layout state in context
- keep page-specific selection state local unless it benefits from persistence or reuse

For example:

- text active verse is page-local plus local storage
- prayer active verse is in `UIContext`

That difference is intentional and reflects how the app treats those two reading journeys.

## 17. Known Rough Edges and Risks

### 17.1 Encoding and text-quality issues

A noticeable number of strings appear damaged or inconsistent in source files:

- some UI text
- some Korean labels
- some decorative separator strings
- some modal and empty-state copy

This is visible directly in the checked-in source, not just terminal output, and it affects presentation quality and maintainability.

### 17.2 Legacy or currently unused components

The earlier dead-code candidates have now diverged into two groups:

- removed because they had no live imports:
  - `src/components/PlayerContainer.jsx`
  - `src/components/Header/ChapterNavigator.jsx`
  - `src/components/Sidebar/ReflectionActions.jsx`
- retained because they are live again:
  - `src/components/Sidebar/NoteEditor.jsx`

### 17.3 Note-system refactor status

The stale `RightSidebar` prop path has been completed:

- `activeVerseId` and `storagePrefix` now drive current-note editing
- the sidebar and note modal share the same note-loading helper
- local-storage note browsing and note writing are now part of the same live flow

### 17.4 UI overlap between sidebar notes and modal notes

Both `RightSidebar` and `CommentariesModal` still present saved notes, but the data-fetching and local-storage parsing logic is now consolidated into one shared helper. The remaining overlap is presentational rather than mechanical.

## 18. End-to-End User Journeys

### 18.1 Reading the main text

1. User enters `/text`
2. `book.json` loads
3. saved active verse is restored or first verse is selected
4. `AppShell` renders left sidebar, main reading panel, and right notes panel
5. user picks chapters or verses from the left sidebar
6. `ReadingPanel` updates with animated content
7. user may open saved notes from the right panel

### 18.2 Reading prayers

1. User enters `/chapter`
2. `prayers.json` is already imported
3. `activeVerse` from `UIContext` is validated or first verse is chosen
4. the same shell structure renders
5. user can also play verse-level audio where available

### 18.3 Listening to chants

1. User enters `/album`
2. album gallery renders from `albums.json`
3. user opens album detail modal
4. choosing a track sends a playback request upward
5. global player appears and persists across routes

### 18.4 Using study tools

1. User opens home
2. uses top buttons for:
   - Compendium
   - Lexicon
   - Commentaries
3. modal state is controlled centrally in `UIContext`

## 19. Overall Assessment

This is a thoughtfully layered reading and listening application rather than a generic content viewer.

Its most important architectural qualities are:

- a persistent shell with route-specific content
- explicit responsive panel state separation
- dual audio systems for different content domains
- generated data pipeline with validation
- reading-centered layout and typography decisions

The biggest maintainability risks are not architectural complexity, but:

- generated data quality and encoding cleanup
- a remaining split between sidebar and modal note surfaces at the UX level
- the absence of browser-level regression coverage in the automated test suite

If someone needed to continue development, the most important files to understand first would be:

- `src/App.jsx`
- `src/components/Layout.jsx`
- `src/context/UIContext.jsx`
- `src/components/Header.jsx`
- `src/components/ui/AppShell.jsx`
- `src/pages/Text.jsx`
- `src/pages/Chapter.jsx`
- `src/pages/components/ReadingPanel.jsx`
- `src/pages/components/LeftSidebar.jsx`
- `src/pages/components/RightSidebar.jsx`

Those files describe the real runtime heart of the application.
