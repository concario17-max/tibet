# Tibet Remediation Plan

Updated: 2026-03-18
Status: completed

## Goal

Stabilize the project so that content rendering, data regeneration, and future maintenance are reliable.

## Workstreams

### 1. Source Encoding Cleanup

- [x] Audit user-facing copy and corrupted source labels
- [x] Normalize reading-page empty states and prayer copy
- [x] Normalize modal copy where the app still referenced removed or corrupted content
- [x] Clean sidebar source files that still contained corrupted labels or comments
- [x] Verify the major reading flows no longer expose mojibake in the touched components

### 2. Book Data Pipeline Hardening

- [x] Review `book/2.txt` label formats and confirm mixed `English:` / `* English:` input
- [x] Refactor book parsing logic into a reusable pipeline module
- [x] Preserve multi-translator and Tibetan merge behavior
- [x] Add fallback-verse detection so `Verse {n}` output fails validation
- [x] Rebuild `src/data/book.json`
- [x] Validate zero fallback English verses remain

### 3. Prayer Data Pipeline Hardening

- [x] Review prayer section header formats across `Prayer/*.txt`
- [x] Refactor prayer parsing logic into a reusable pipeline module
- [x] Normalize prayer title labels in generator source
- [x] Add expected prayer verse-count validation
- [x] Rebuild `src/data/prayers.json`
- [x] Verify chapter 4 and all other prayer chapters generate expected verse counts

### 4. Prayer Pronunciation Pipeline Reconciliation

- [x] Inspect obsolete pronunciation patch scripts
- [x] Decide on canonical behavior: pronunciation intentionally removed from runtime
- [x] Remove obsolete pronunciation patch files
- [x] Remove pronunciation UI rendering path and copy promises
- [x] Document the current pronunciation stance in the pipeline docs

### 5. Lexicon Parser Reliability

- [x] Keep current lexicon parser as canonical generator
- [x] Add validation for suspiciously long lexicon terms
- [x] Rebuild `src/data/lexicon.json`
- [x] Verify lexicon validation passes

### 6. Notes And Local Persistence QA

- [x] Extract note aggregation logic into a reusable utility
- [x] Add automated coverage for prayer/book note key aggregation
- [x] Keep prayer/text note prefixes aligned with the reading sidebars
- [x] Add load-error handling to `CommentariesModal`
- [x] Verify note aggregation, title lookup, and jump metadata through tests and runtime review

### 7. UI Consistency And Copy Pass

- [x] Review empty states for reading screens
- [x] Review loading-state copy for `/text`
- [x] Remove pronunciation claims from prayer-related copy
- [x] Keep modal and reading copy aligned with current feature set

### 8. Regression Test Expansion

- [x] Add tests for `flattenVerses`
- [x] Add tests for note-key aggregation logic
- [x] Add tests for fallback-verse detection and prayer-count validation
- [x] Add tests for mixed English label parsing in the book pipeline
- [x] Add tests for prayer section-header parsing and prayer audio URL generation
- [x] Keep the existing audio hook tests passing

### 9. Regeneration Workflow Documentation

- [x] Expose regeneration tasks in `package.json`
- [x] Add `typecheck` script
- [x] Add `validate:data` script
- [x] Add `regen:data` script chain
- [x] Document source-of-truth inputs, outputs, and regeneration order in `DATA_PIPELINE.md`
- [x] Document that generated JSON files are source-controlled artifacts

### 10. Final Verification And Release Prep

- [x] Run `npm run typecheck`
- [x] Run `npm run regen:data`
- [x] Run `npm test -- --run`
- [x] Run `npm run build`
- [x] Update `research.md` to match the current implementation
- [x] Prepare the repository for final commit and push

## Summary Of What Changed

- Book and prayer parsing now live in reusable pipeline modules under `scripts/lib/`
- Generated data now has explicit validation instead of silent fallback behavior
- Prayer pronunciation is intentionally out of scope for the current runtime
- Notes aggregation is extracted into a reusable utility with tests
- Typecheck, regeneration, and validation are first-class npm scripts
- Pipeline documentation now lives in `DATA_PIPELINE.md`

## Done Definition

- [x] No touched user-facing flow still exposes known corrupted copy
- [x] `book.json` regenerates without fallback-only verses
- [x] `prayers.json` regenerates without missing chapters or empty verse sets
- [x] Pronunciation behavior is intentionally removed and documented
- [x] Notes and commentaries logic is regression-tested
- [x] Typecheck, tests, regeneration, and build all pass
