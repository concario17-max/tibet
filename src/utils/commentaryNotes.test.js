import { describe, expect, it } from 'vitest';
import { buildSavedNotes, buildVerseMap } from './commentaryNotes';

/**
 * @param {Record<string, string>} entries
 */
const createStorage = (entries) => ({
    ...entries,
    /**
     * @param {string} key
     */
    getItem(key) {
        return Object.prototype.hasOwnProperty.call(entries, key) ? entries[key] : null;
    },
});

describe('commentaryNotes', () => {
    it('builds a title-aware note list for prayer and book notes', () => {
        const prayerVerseMap = buildVerseMap([{ id: '4.1', chapterTitle: 'Prayer Chapter Title' }]);
        const bookVerseMap = buildVerseMap([{ id: '261', chapterTitle: 'Book Chapter Title' }]);
        const storage = createStorage({
            'tibet-prayer-note-4.1': 'Prayer note',
            'tibet-book-note-261': 'Book note',
        });

        expect(buildSavedNotes({ prayerVerseMap, bookVerseMap, storage })).toEqual([
            {
                id: '4.1',
                type: 'prayer',
                noteKey: 'tibet-prayer-note-4.1',
                content: 'Prayer note',
                title: 'Prayer Chapter Title',
            },
            {
                id: '261',
                type: 'book',
                noteKey: 'tibet-book-note-261',
                content: 'Book note',
                title: 'Book Chapter Title',
            },
        ]);
    });

    it('ignores empty note payloads', () => {
        const prayerVerseMap = buildVerseMap([{ id: '4.1', chapterTitle: 'Prayer Chapter Title' }]);
        const bookVerseMap = buildVerseMap([]);
        const storage = createStorage({
            'tibet-prayer-note-4.1': '   ',
        });

        expect(buildSavedNotes({ prayerVerseMap, bookVerseMap, storage })).toEqual([]);
    });
});
