import prayersDataUrl from '../data/prayers.json?url';
import bookDataUrl from '../data/book.json?url';
import { flattenVerses } from '../utils/textUtils';
import { buildSavedNotes, buildVerseMap } from '../utils/commentaryNotes';

/**
 * @param {{
 *   prayersData: Array<{ verses: Array<{ id: string, chapterTitle?: string, title?: string }> }>,
 *   bookData: Array<object>,
 *   storage: Storage
 * }} input
 */
export const buildCommentaryLibrary = ({ prayersData, bookData, storage }) => {
    const prayerVerseMap = buildVerseMap(prayersData.flatMap((chapter) => chapter.verses));
    const bookVerseMap = buildVerseMap(flattenVerses(bookData));

    return {
        prayerVerseMap,
        bookVerseMap,
        savedNotes: buildSavedNotes({ prayerVerseMap, bookVerseMap, storage }),
    };
};

/**
 * @param {Storage} [storage]
 */
export const loadCommentaryLibrary = async (storage = localStorage) => {
    const [prayersResponse, bookResponse] = await Promise.all([fetch(prayersDataUrl), fetch(bookDataUrl)]);

    if (!prayersResponse.ok || !bookResponse.ok) {
        throw new Error('Unable to load commentary library.');
    }

    const [prayersData, bookData] = await Promise.all([prayersResponse.json(), bookResponse.json()]);
    return buildCommentaryLibrary({ prayersData, bookData, storage });
};
