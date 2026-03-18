/**
 * @typedef {{ id: string, chapterTitle?: string, title?: string }} VerseReference
 * @typedef {{ id: string, type: 'prayer' | 'book', noteKey: string, content: string, title: string }} SavedNote
 */

export const NOTE_PREFIXES = {
    prayer: 'tibet-prayer-note-',
    book: 'tibet-book-note-',
};

export const NOTE_META = {
    prayer: {
        label: 'Prayer',
        emptyHint: '기도문 읽기 화면에서 남긴 메모가 이곳에 모입니다.',
    },
    book: {
        label: 'Text',
        emptyHint: '본문 읽기 화면에서 남긴 메모가 이곳에 모입니다.',
    },
};

/**
 * @param {VerseReference[]} verses
 * @returns {Map<string, VerseReference>}
 */
export const buildVerseMap = (verses) => new Map(verses.map((verse) => [verse.id, verse]));

/**
 * @param {{
 *   prayerVerseMap: Map<string, VerseReference>,
 *   bookVerseMap: Map<string, VerseReference>,
 *   storage: Pick<Storage, 'getItem'> & { [key: string]: string | ((key: string) => string | null) | number | null | undefined }
 * }} input
 * @returns {SavedNote[]}
 */
export const buildSavedNotes = ({ prayerVerseMap, bookVerseMap, storage }) => {
    /** @type {SavedNote[]} */
    const notes = [];
    const keys = Object.keys(storage);

    for (const [type, prefix] of Object.entries(NOTE_PREFIXES)) {
        keys
            .filter((key) => key.startsWith(prefix))
            .sort((left, right) => left.localeCompare(right))
            .forEach((key) => {
                const id = key.replace(prefix, '');
                const content = storage.getItem(key);
                const verse = type === 'prayer' ? prayerVerseMap.get(id) : bookVerseMap.get(id);

                if (!content || !content.trim()) return;

                notes.push({
                    id,
                    type: /** @type {'prayer' | 'book'} */ (type),
                    noteKey: key,
                    content,
                    title: verse?.chapterTitle || verse?.title || 'Untitled',
                });
            });
    }

    return notes.sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true }));
};
