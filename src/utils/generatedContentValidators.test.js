import { describe, expect, it } from 'vitest';
import {
    collectBookFallbackVerseIds,
    collectPronunciationVerseIds,
    collectSuspiciousLexiconTerms,
    validatePrayerChapterCounts,
} from './generatedContentValidators';

describe('generatedContentValidators', () => {
    it('detects fallback-only book verse titles', () => {
        const book = [
            {
                id: 'group-1',
                isGroup: true,
                subchapters: [
                    {
                        id: 'chapter-1-0',
                        verses: [
                            { id: '1', chapterTitle: 'Verse 1' },
                            { id: '2', chapterTitle: 'Actual English Title' },
                        ],
                    },
                ],
            },
        ];

        expect(collectBookFallbackVerseIds(book)).toEqual(['1']);
    });

    it('validates prayer chapter verse counts', () => {
        const prayers = [
            { id: 'prayer-1', verses: [{ id: '1.1' }] },
            { id: 'prayer-2', verses: [{ id: '2.1' }, { id: '2.2' }] },
        ];

        expect(validatePrayerChapterCounts(prayers, { 'prayer-1': 1, 'prayer-2': 2 })).toEqual([]);
        expect(validatePrayerChapterCounts(prayers, { 'prayer-2': 3 })).toEqual(['prayer-2: expected 3, received 2']);
    });

    it('collects pronunciation-bearing prayer verses', () => {
        const prayers = [
            {
                id: 'prayer-3',
                verses: [
                    { id: '3.1', text: { pronunciation: 'ga te' } },
                    { id: '3.2', text: {} },
                ],
            },
        ];

        expect(collectPronunciationVerseIds(prayers)).toEqual(['3.1']);
    });

    it('flags suspiciously long lexicon terms', () => {
        expect(collectSuspiciousLexiconTerms([
            { term: 'short', definition: 'ok' },
            { term: 'x'.repeat(170), definition: 'too long' },
        ], 160)).toEqual(['x'.repeat(170)]);
    });
});
