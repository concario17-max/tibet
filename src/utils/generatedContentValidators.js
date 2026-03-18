/**
 * @typedef {{ id: string, chapterName?: string, verses?: GeneratedVerse[] }} GeneratedChapter
 * @typedef {{ id: string, chapterTitle?: string, title?: string, text?: { pronunciation?: string, english?: string } }} GeneratedVerse
 * @typedef {{ id: string, chapterName?: string, isGroup?: boolean, subchapters?: GeneratedSubchapter[], verses?: GeneratedVerse[] }} GeneratedGroup
 * @typedef {{ id: string, chapterName?: string, verses?: GeneratedVerse[] }} GeneratedSubchapter
 * @typedef {{ term: string, definition: string }} LexiconEntry
 */

/**
 * @param {GeneratedGroup[]} data
 * @returns {GeneratedVerse[]}
 */
export const flattenBookVerses = (data) => {
    /** @type {GeneratedVerse[]} */
    const verses = [];

    for (const group of data) {
        if (Array.isArray(group.verses)) {
            verses.push(...group.verses);
            continue;
        }

        for (const subchapter of group.subchapters || []) {
            verses.push(...(subchapter.verses || []));
        }
    }

    return verses;
};

/**
 * @param {GeneratedChapter[]} prayers
 * @returns {GeneratedVerse[]}
 */
export const flattenPrayerVerses = (prayers) => prayers.flatMap((chapter) => chapter.verses || []);

/**
 * @param {GeneratedGroup[]} data
 * @returns {string[]}
 */
export const collectBookFallbackVerseIds = (data) => {
    return flattenBookVerses(data)
        .filter((verse) => /^Verse \d+$/.test(verse.chapterTitle || ''))
        .map((verse) => verse.id);
};

/**
 * @param {GeneratedChapter[]} prayers
 * @param {Record<string, number>} expectedCounts
 * @returns {string[]}
 */
export const validatePrayerChapterCounts = (prayers, expectedCounts) => {
    /** @type {string[]} */
    const issues = [];

    for (const chapter of prayers) {
        const expected = expectedCounts[chapter.id];
        if (expected === undefined) continue;

        const actual = chapter.verses?.length || 0;
        if (actual !== expected) {
            issues.push(`${chapter.id}: expected ${expected}, received ${actual}`);
        }
    }

    return issues;
};

/**
 * @param {GeneratedChapter[]} prayers
 * @returns {string[]}
 */
export const collectPronunciationVerseIds = (prayers) => {
    return flattenPrayerVerses(prayers)
        .filter((verse) => Boolean(verse.text?.pronunciation))
        .map((verse) => verse.id);
};

/**
 * @param {LexiconEntry[]} entries
 * @param {number} maxLength
 * @returns {string[]}
 */
export const collectSuspiciousLexiconTerms = (entries, maxLength = 160) => {
    return entries
        .filter((entry) => entry.term.length > maxLength)
        .map((entry) => entry.term);
};
