# Tibet Cleanup Plan

## Goal

Address the concrete problems identified during research without changing behavior blindly. The completed work prioritizes correctness, text quality, maintainability, and duplication reduction.

## Todo List

- [x] Validate the research report against the current codebase one more time before implementation starts.
- [x] Make a file-by-file inventory of user-visible corrupted text.
- [x] Separate true source-data corruption from terminal-only display artifacts.
- [x] Audit all pages, modals, and reading components for broken copy, separators, and labels.
- [x] Decide whether damaged text should be repaired in source JSON, in component copy, or in both.

- [x] Review `src/data/book.json` for corrupted English, Korean, and Tibetan strings.
- [x] Review `src/data/prayers.json` for corrupted chapter names, titles, and verse text.
- [x] Review `src/data/albums.json` for corrupted descriptions and labels.
- [x] Review `src/data/lexicon.json` for malformed terms or definitions.
- [x] Define a safe normalization strategy for data files before bulk edits.

- [x] Audit `src/index.css` for broken pseudo-content and typography-related text artifacts.
- [x] Audit reading UI components for damaged decorative strings:
  - `src/components/Reading/ReadingHeader.jsx`
  - `src/components/Reading/TibetanSection.jsx`
  - `src/components/Reading/TranslationSection.jsx`
- [x] Audit empty-state copy in:
  - `src/pages/Text.jsx`
  - `src/pages/Chapter.jsx`
  - `src/components/CommentariesModal.jsx`
  - `src/components/CompendiumModal.jsx`
  - `src/components/LexiconModal.jsx`

- [x] Trace the current note-writing path end to end.
- [x] Confirm whether note creation still exists in live UI or only note browsing remains.
- [x] If note creation is dead, decide whether to restore it or remove dormant editor components.
- [x] Audit `src/components/Sidebar/NoteEditor.jsx` and `src/components/Sidebar/ReflectionActions.jsx` for live dependencies.
- [x] Remove or reconnect dead note-editing code only after confirming intended product behavior.

- [x] Compare `src/pages/components/RightSidebar.jsx` and `src/components/CommentariesModal.jsx`.
- [x] Extract shared note-loading logic if duplication is purely mechanical.
- [x] Keep presentation differences while consolidating shared data-fetching and localStorage parsing.
- [x] Remove unused props from `RightSidebar` call sites if they are no longer needed.

- [x] Audit `src/components/PlayerContainer.jsx` and `src/components/Header/ChapterNavigator.jsx` for true dead-code status.
- [x] Search imports and runtime references before deleting or refactoring dormant files.
- [x] Decide whether each unused component should be removed, documented, or revived.

- [x] Recheck desktop and mobile panel behavior after any text or component cleanup.
- [x] Recheck header alignment against the default reading frame after cleanup.
- [x] Recheck reading-panel scroll behavior after cleanup.
- [x] Recheck saved-note navigation from sidebar and modal.
- [x] Recheck album playback request flow into `GlobalPlayer`.

- [x] Run `npm run build` after each major cleanup batch.
- [x] Run targeted tests for utility changes:
  - `src/utils/commentaryNotes.test.js`
  - `src/utils/textUtils.test.js`
  - `src/utils/generatedContentValidators.test.js`
  - `src/hooks/useAudioPlayer.test.jsx`
- [x] If data files are edited, run `scripts/validate_generated_data.js` or the equivalent package script.

- [x] Write a short post-cleanup summary documenting:
  - what text issues were fixed
  - what dead code was removed or retained
  - what duplication was consolidated
  - what risks remain

## Implementation Order

1. Text and encoding audit
2. Data-source cleanup strategy
3. UI copy and label repair
4. Note-system path audit
5. Duplicate note-loading refactor
6. Dead-code audit and cleanup
7. Regression verification
8. Final documentation update

## Completion Notes

- Local UI copy and decorative separator damage were repaired in the reading header, Tibetan divider, translation divider, modal copy, empty states, note editor, and `index.css`.
- The current-verse note-writing flow was restored inside the right commentary panel, using the passed `activeVerseId` and `storagePrefix` to save and clear notes.
- Shared note-loading logic now lives in `src/lib/commentaryLibrary.js` and is reused by both `RightSidebar` and `CommentariesModal`.
- Truly unused components were removed: `src/components/PlayerContainer.jsx`, `src/components/Header/ChapterNavigator.jsx`, and `src/components/Sidebar/ReflectionActions.jsx`.
- `src/components/Sidebar/NoteEditor.jsx` was retained and reconnected to live UI.
- Generated JSON datasets were reviewed and found to contain broader content-quality and encoding issues. Because they are generated artifacts and the corruption is widespread, this pass intentionally avoided unsafe bulk edits and instead limited source fixes to confirmed local UI strings.
- Verification completed with repeated `tsc --noEmit`, `npm run build`, and `npm test -- --run`.
