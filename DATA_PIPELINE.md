# Data Pipeline Guide

Updated: 2026-03-18

## Purpose

This project treats the files in `src/data/` as generated artifacts. The human-edited source material lives in `book/`, `Prayer/`, `Lexicon.txt`, and `mp3/`.

## Source Of Truth

### Main text

- structure: [book/1.txt](C:\Users\roadsea\Desktop\tibet\book\1.txt)
- English + first Korean translation: [book/2.txt](C:\Users\roadsea\Desktop\tibet\book\2.txt)
- second Korean translation: [book/3.txt](C:\Users\roadsea\Desktop\tibet\book\3.txt)
- third Korean translation: [book/4..txt](C:\Users\roadsea\Desktop\tibet\book\4..txt)
- Tibetan: [book/5.txt](C:\Users\roadsea\Desktop\tibet\book\5.txt)

Generated output:

- [src/data/book.json](C:\Users\roadsea\Desktop\tibet\src\data\book.json)

### Prayers

- [Prayer/1.txt](C:\Users\roadsea\Desktop\tibet\Prayer\1.txt)
- [Prayer/2.txt](C:\Users\roadsea\Desktop\tibet\Prayer\2.txt)
- [Prayer/3.txt](C:\Users\roadsea\Desktop\tibet\Prayer\3.txt)
- [Prayer/4.txt](C:\Users\roadsea\Desktop\tibet\Prayer\4.txt)
- [Prayer/5.txt](C:\Users\roadsea\Desktop\tibet\Prayer\5.txt)

Generated output:

- [src/data/prayers.json](C:\Users\roadsea\Desktop\tibet\src\data\prayers.json)

### Lexicon

- [Lexicon.txt](C:\Users\roadsea\Desktop\tibet\Lexicon.txt)

Generated output:

- [src/data/lexicon.json](C:\Users\roadsea\Desktop\tibet\src\data\lexicon.json)

### Albums

- source folders under [mp3](C:\Users\roadsea\Desktop\tibet\mp3)

Generated outputs:

- [src/data/albums.json](C:\Users\roadsea\Desktop\tibet\src\data\albums.json)
- copied public audio under [public/mp3](C:\Users\roadsea\Desktop\tibet\public\mp3)
- copied cover art under [public/album-covers](C:\Users\roadsea\Desktop\tibet\public\album-covers)

## Canonical Commands

### Full regeneration

```bash
npm run regen:data
```

This runs:

1. `npm run build:data:book`
2. `npm run build:data:prayers`
3. `npm run build:data:lexicon`
4. `npm run validate:data`

### Individual generators

```bash
npm run build:data:book
npm run build:data:prayers
npm run build:data:lexicon
npm run build:data:albums
```

### Validation

```bash
npm run validate:data
```

Validation currently checks:

- no `Verse {n}` English fallback remains in `book.json`
- prayer chapter verse counts match expected output
- lexicon terms are not suspiciously long

## Required Verification After Regeneration

After changing source text or parser logic, always run:

```bash
npm run typecheck
npm test -- --run
npm run build
```

## Important Notes

### Pronunciation data

Prayer pronunciation is intentionally not part of the current runtime pipeline.

- old ad-hoc patch scripts were removed
- UI copy no longer promises pronunciation guides
- if pronunciation support is reintroduced later, it should return as a documented generator, not as a one-off patch

### Book English fallbacks

If the book generator leaves `Verse {id}` as the final English title, the build-data script should be treated as failed. This is a regression signal, not a harmless fallback.

### Prayer verse counts

The prayer generator expects:

- `prayer-1`: 8 verses
- `prayer-2`: 11 verses
- `prayer-3`: 12 verses
- `prayer-4`: 14 verses
- `prayer-5`: 7 verses

If any count changes unexpectedly, inspect the source file format before accepting the new output.

## Source-Control Policy

These generated artifacts are intentionally committed:

- [src/data/book.json](C:\Users\roadsea\Desktop\tibet\src\data\book.json)
- [src/data/prayers.json](C:\Users\roadsea\Desktop\tibet\src\data\prayers.json)
- [src/data/lexicon.json](C:\Users\roadsea\Desktop\tibet\src\data\lexicon.json)
- [src/data/albums.json](C:\Users\roadsea\Desktop\tibet\src\data\albums.json)

Do not hand-edit these unless you are debugging and immediately following up by fixing the generator.
