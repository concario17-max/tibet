/**
 * @typedef {{ english: string, korean: string, korean2?: string, korean3?: string, tibetan?: string }} BookParagraph
 * @typedef {{ mainId: number, start: number, end: number, title: string }} BookSection
 */

export const BOOK_PATHS = {
    doc1: 'book/1.txt',
    doc2: 'book/2.txt',
    doc3: 'book/3.txt',
    doc4: 'book/4..txt',
    doc5: 'book/5.txt',
    output: 'src/data/book.json',
};

export const CUSTOM_CHAPTERS = [
    { id: 1, chapterName: '1부. 저승 중간계에서 드리는 기도' },
    { id: 2, chapterName: '2부. 자애로운 모습의 붓다와 보살들이 나타나는 저승 중간계' },
    { id: 3, chapterName: '3부. 무서운 모습의 붓다와 보살들이 나타나는 저승 중간계' },
    { id: 4, chapterName: '4부. 탄생 중간계 길 안내' },
];

/**
 * @param {string} text
 * @returns {BookSection[]}
 */
export const parseStructure = (text) => {
    const lines = text.split('\n');
    /** @type {BookSection[]} */
    const structure = [];
    const rangeRegex = /(.*?)\s*\((\d+)-(\d+)\)/;

    let currentMainChapter = 0;

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const mainMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (mainMatch) {
            currentMainChapter = Number.parseInt(mainMatch[1], 10);
            return;
        }

        const match = trimmed.match(rangeRegex);
        if (!match) return;

        structure.push({
            mainId: currentMainChapter,
            start: Number.parseInt(match[2], 10),
            end: Number.parseInt(match[3], 10),
            title: match[1].replace(/^[\d)\-\s]+/, '').trim(),
        });
    });

    return structure;
};

/**
 * @param {string} text
 * @returns {Record<number, BookParagraph>}
 */
export const parseContent = (text) => {
    /** @type {Record<number, BookParagraph>} */
    const paragraphs = {};
    const blocks = text.split(/\[?문단\s+(\d+)\]?/);

    for (let index = 1; index < blocks.length; index += 2) {
        const id = Number.parseInt(blocks[index], 10);
        const content = blocks[index + 1];
        if (!content) continue;

        const englishMatch = content.match(/(?:^|\n)\*?\s*English:\s*([\s\S]*?)(?=(?:\n\*?\s*Korean:)|$)/);
        const koreanMatch = content.match(/(?:^|\n)\*?\s*Korean:\s*([\s\S]*?)$/);

        paragraphs[id] = {
            english: englishMatch ? englishMatch[1].trim() : '',
            korean: koreanMatch ? koreanMatch[1].trim() : '',
        };
    }

    return paragraphs;
};

/**
 * @param {string} text
 * @param {Record<number, BookParagraph>} paragraphs
 * @param {'korean2' | 'korean3' | 'tibetan'} field
 * @returns {Record<number, BookParagraph>}
 */
const mergeBlockField = (text, paragraphs, field) => {
    const blocks = text.split(/\[?문단\s+(\d+)\]?/);

    for (let index = 1; index < blocks.length; index += 2) {
        const id = Number.parseInt(blocks[index], 10);
        const content = blocks[index + 1]?.trim() || '';
        const current = paragraphs[id] || { english: '', korean: '' };
        paragraphs[id] = { ...current, [field]: content };
    }

    return paragraphs;
};

/**
 * @param {string} text
 * @param {Record<number, BookParagraph>} paragraphs
 * @returns {Record<number, BookParagraph>}
 */
export const parseKorean2 = (text, paragraphs) => mergeBlockField(text, paragraphs, 'korean2');

/**
 * @param {string} text
 * @param {Record<number, BookParagraph>} paragraphs
 * @returns {Record<number, BookParagraph>}
 */
export const parseKorean3 = (text, paragraphs) => mergeBlockField(text, paragraphs, 'korean3');

/**
 * @param {string} text
 * @param {Record<number, BookParagraph>} paragraphs
 * @returns {Record<number, BookParagraph>}
 */
export const parseTibetan = (text, paragraphs) => mergeBlockField(text, paragraphs, 'tibetan');

/**
 * @typedef {{ id: string, chapterName: string, isGroup: true, subchapters: Array<{ id: string, chapterName: string, verses: Array<{ id: string, title: string, chapterTitle: string, text: { tibetan: string, english: string, korean: Array<{ translator: string, text: string }> } }> }> }} BookChapterGroup
 */

/**
 * @param {BookSection[]} structure
 * @param {Record<number, BookParagraph>} paragraphs
 * @returns {BookChapterGroup[]}
 */
export const buildFinalResult = (structure, paragraphs) => {
    /** @type {BookChapterGroup[]} */
    const chapters = [];

    CUSTOM_CHAPTERS.forEach((parent) => {
        /** @type {BookChapterGroup} */
        const chapterGroup = {
            id: `group-${parent.id}`,
            chapterName: parent.chapterName,
            isGroup: true,
            subchapters: [],
        };

        const sections = structure.filter((section) => section.mainId === parent.id);

        sections.forEach((section, sectionIndex) => {
            /** @type {BookChapterGroup['subchapters'][number]['verses']} */
            const verses = [];

            for (let paragraphId = section.start; paragraphId <= section.end; paragraphId += 1) {
                const paragraph = paragraphs[paragraphId];
                if (!paragraph) continue;

                const koreanTranslators = [];
                if (paragraph.korean) koreanTranslators.push({ translator: '정창영', text: paragraph.korean });
                if (paragraph.korean2) koreanTranslators.push({ translator: '중암 선혜', text: paragraph.korean2 });
                if (paragraph.korean3) koreanTranslators.push({ translator: '류시화', text: paragraph.korean3 });

                const englishText = paragraph.english || (paragraph.korean ? paragraph.korean.slice(0, 30) : `Verse ${paragraphId}`);

                verses.push({
                    id: String(paragraphId),
                    title: englishText.slice(0, 45) + (englishText.length > 45 ? '...' : ''),
                    chapterTitle: englishText,
                    text: {
                        tibetan: paragraph.tibetan || '',
                        english: englishText,
                        korean: koreanTranslators,
                    },
                });
            }

            if (verses.length > 0) {
                chapterGroup.subchapters.push({
                    id: `chapter-${parent.id}-${sectionIndex}`,
                    chapterName: section.title,
                    verses,
                });
            }
        });

        if (chapterGroup.subchapters.length > 0) {
            chapters.push(chapterGroup);
        }
    });

    return chapters;
};
