import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    collectBookFallbackVerseIds,
    collectPronunciationVerseIds,
    collectSuspiciousLexiconTerms,
    validatePrayerChapterCounts,
} from '../src/utils/generatedContentValidators.js';
import { EXPECTED_PRAYER_VERSE_COUNTS } from './lib/prayerPipeline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

/**
 * @param {string} relativePath
 * @returns {string}
 */
const readJsonString = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8').replace(/^\uFEFF/, '');

/**
 * @returns {import('../src/utils/generatedContentValidators.js').GeneratedGroup[]}
 */
const readBook = () => JSON.parse(readJsonString('src/data/book.json'));

/**
 * @returns {import('../src/utils/generatedContentValidators.js').GeneratedChapter[]}
 */
const readPrayers = () => JSON.parse(readJsonString('src/data/prayers.json'));

/**
 * @returns {import('../src/utils/generatedContentValidators.js').LexiconEntry[]}
 */
const readLexicon = () => JSON.parse(readJsonString('src/data/lexicon.json'));

const run = () => {
    const book = readBook();
    const prayers = readPrayers();
    const lexicon = readLexicon();

    const fallbackVerseIds = collectBookFallbackVerseIds(book);
    const prayerCountIssues = validatePrayerChapterCounts(prayers, EXPECTED_PRAYER_VERSE_COUNTS);
    const suspiciousTerms = collectSuspiciousLexiconTerms(lexicon);
    const pronunciationVerseIds = collectPronunciationVerseIds(prayers);

    if (fallbackVerseIds.length > 0) {
        throw new Error(`Book dataset still contains English fallback verses: ${fallbackVerseIds.join(', ')}`);
    }

    if (prayerCountIssues.length > 0) {
        throw new Error(`Prayer dataset verse counts do not match expectations: ${prayerCountIssues.join('; ')}`);
    }

    if (suspiciousTerms.length > 0) {
        throw new Error(`Lexicon still contains suspiciously long terms: ${suspiciousTerms.slice(0, 10).join(' | ')}`);
    }

    if (pronunciationVerseIds.length > 0) {
        console.log(`[Generated-Data] Pronunciation present for verses: ${pronunciationVerseIds.join(', ')}`);
    } else {
        console.log('[Generated-Data] Pronunciation data is intentionally absent in the current prayer dataset.');
    }

    console.log('[Generated-Data] Validation passed.');
};

run();
