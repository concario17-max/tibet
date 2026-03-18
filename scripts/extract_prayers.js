import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildPrayerResults, EXPECTED_PRAYER_VERSE_COUNTS, PRAYER_FILES } from './lib/prayerPipeline.js';
import { validatePrayerChapterCounts } from '../src/utils/generatedContentValidators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const inputDir = path.join(projectRoot, 'Prayer');
const outputFile = path.join(projectRoot, 'src/data/prayers.json');

const run = () => {
    try {
        console.log('[Prayer-Pipeline] Building prayers.json from source texts...');

        /** @type {Record<string, string>} */
        const prayerFileMap = {};
        for (const file of PRAYER_FILES) {
            const fullPath = path.join(inputDir, file);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`Missing prayer source file: ${file}`);
            }
            prayerFileMap[file] = fs.readFileSync(fullPath, 'utf8');
        }

        const results = buildPrayerResults(prayerFileMap);
        const countIssues = validatePrayerChapterCounts(results, EXPECTED_PRAYER_VERSE_COUNTS);
        if (countIssues.length > 0) {
            throw new Error(`Prayer chapter counts do not match expectations: ${countIssues.join('; ')}`);
        }

        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
        console.log(`[Prayer-Pipeline] Success: ${results.length} chapters written to ${outputFile}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[Prayer-Pipeline] Failed: ${message}`);
        process.exit(1);
    }
};

run();
