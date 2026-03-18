/**
 * @typedef {{ id: string, title: string, tibetan: string[], english: string[], korean: string[] }} PrayerSection
 */

export const PRAYER_FILES = ['1.txt', '2.txt', '3.txt', '4.txt', '5.txt'];

/** @type {Record<string, string>} */
export const PRAYER_TITLE_MAP = {
    '1.txt': '붓다의 세 몸에 대한 기도',
    '2.txt': '붓다와 보살에게 구원을 청하는 기도',
    '3.txt': '중간계의 공포에서 구원을 청하는 기도',
    '4.txt': '중간계 수행자를 위한 기도',
    '5.txt': '삶의 중간계에 들어가기 전에 드리는 기도',
};

export const EXPECTED_PRAYER_VERSE_COUNTS = {
    'prayer-1': 8,
    'prayer-2': 11,
    'prayer-3': 12,
    'prayer-4': 14,
    'prayer-5': 7,
};

/**
 * @param {string} text
 * @returns {boolean}
 */
const isTibetan = (text) => /[\u0F00-\u0FFF]/.test(text);

/**
 * @param {string} text
 * @returns {boolean}
 */
const isKorean = (text) => /[\u3131-\uD79D]/.test(text);

/**
 * @param {string} text
 * @returns {boolean}
 */
const isEnglish = (text) => /[a-zA-Z]/.test(text) && !isTibetan(text) && !isKorean(text);

/**
 * @param {string} text
 * @returns {{ number: string, title: string } | null}
 */
export const parseSectionHeader = (text) => {
    const trimmed = text.trim();
    const patterns = [
        /^\[\s*제\s*(\d+)연\s*\]\s*(.+)$/,
        /^(\d+)\.\s*(.+)$/,
        /^(\d+)\s+(.+)$/,
    ];

    for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match) {
            return {
                number: match[1],
                title: match[2].trim(),
            };
        }
    }

    return null;
};

/**
 * @param {string} fileName
 * @param {string} fileContents
 * @returns {PrayerSection[]}
 */
export const parsePrayerFileContents = (fileName, fileContents) => {
    const lines = fileContents.replace(/^\uFEFF/, '').split(/\r?\n/);
    /** @type {PrayerSection[]} */
    const sections = [];
    /** @type {PrayerSection | null} */
    let currentSection = null;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const header = parseSectionHeader(line);
        if (header) {
            if (currentSection) sections.push(currentSection);

            currentSection = {
                id: `${fileName.replace('.txt', '')}.${header.number}`,
                title: header.title,
                tibetan: [],
                english: [],
                korean: [],
            };
            continue;
        }

        if (!currentSection) continue;

        if (isTibetan(line)) {
            currentSection.tibetan.push(line);
        } else if (isKorean(line)) {
            currentSection.korean.push(line);
        } else if (isEnglish(line)) {
            currentSection.english.push(line);
        }
    }

    if (currentSection) sections.push(currentSection);
    return sections;
};

/**
 * @param {Record<string, string>} prayerFileMap
 * @returns {Array<{ id: string, chapterName: string, verses: Array<{ id: string, title: string, chapterTitle: string, text: { tibetan: string, english: string, korean: string }, audioUrl: string | null }> }>}
 */
export const buildPrayerResults = (prayerFileMap) => {
    return PRAYER_FILES.flatMap((file) => {
        const fileContents = prayerFileMap[file];
        if (!fileContents) return [];

        const sections = parsePrayerFileContents(file, fileContents);
        return [{
            id: `prayer-${file.replace('.txt', '')}`,
            chapterName: PRAYER_TITLE_MAP[file] || `Prayer ${file.replace('.txt', '')}`,
            verses: sections.map((section) => {
                const tibetanExcerpt = section.tibetan[0]
                    ? `${section.tibetan[0].slice(0, 40)}...`
                    : section.title;
                const verseNumber = section.id.split('.')[1];
                const chapterNumber = file.replace('.txt', '');
                const audioUrl = ['3', '4', '5'].includes(chapterNumber)
                    ? `/mp3/Prayer/${chapterNumber}-${verseNumber}.mp3`
                    : null;

                return {
                    id: section.id,
                    title: `${section.id} ${tibetanExcerpt}`,
                    chapterTitle: section.title,
                    text: {
                        tibetan: section.tibetan.join('\n'),
                        english: section.english.join('\n'),
                        korean: section.korean.join('\n'),
                    },
                    audioUrl,
                };
            }),
        }];
    });
};
