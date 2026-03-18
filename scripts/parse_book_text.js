import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildFinalResult, BOOK_PATHS, parseContent, parseKorean2, parseKorean3, parseStructure, parseTibetan } from './lib/bookPipeline.js';
import { collectBookFallbackVerseIds } from '../src/utils/generatedContentValidators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

/**
 * @param {string} relativePath
 * @returns {string}
 */
const resolveProjectPath = (relativePath) => path.join(projectRoot, relativePath);

const run = () => {
    try {
        console.log('[Book-Pipeline] Building book.json from source texts...');

        const structureSource = fs.readFileSync(resolveProjectPath(BOOK_PATHS.doc1), 'utf8');
        const englishSource = fs.readFileSync(resolveProjectPath(BOOK_PATHS.doc2), 'utf8');
        const koreanTwoSource = fs.readFileSync(resolveProjectPath(BOOK_PATHS.doc3), 'utf8');
        const koreanThreeSource = fs.readFileSync(resolveProjectPath(BOOK_PATHS.doc4), 'utf8');
        const tibetanSource = fs.readFileSync(resolveProjectPath(BOOK_PATHS.doc5), 'utf8');

        const structure = parseStructure(structureSource);
        let paragraphs = parseContent(englishSource);
        paragraphs = parseKorean2(koreanTwoSource, paragraphs);
        paragraphs = parseKorean3(koreanThreeSource, paragraphs);
        paragraphs = parseTibetan(tibetanSource, paragraphs);

        const result = buildFinalResult(structure, paragraphs);
        const fallbackVerseIds = collectBookFallbackVerseIds(result);

        if (fallbackVerseIds.length > 0) {
            throw new Error(`Book generation left English fallbacks in verses: ${fallbackVerseIds.join(', ')}`);
        }

        fs.writeFileSync(resolveProjectPath(BOOK_PATHS.output), JSON.stringify(result, null, 2));
        console.log(`[Book-Pipeline] Success: ${result.length} chapter groups written to ${BOOK_PATHS.output}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[Book-Pipeline] Failed: ${message}`);
        process.exit(1);
    }
};

run();
