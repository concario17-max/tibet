/**
 * Script to extract Prayer texts and output src/data/prayers.json
 * Rules:
 * Section starts with digit(s) dot space title.
 * Each section has Tibetan, English, and Korean lines.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../Prayer');
const outputFile = path.join(__dirname, '../src/data/prayers.json');

const files = ['1.txt', '2.txt', '3.txt', '4.txt', '5.txt'];

const isTibetan = (text) => /[\u0F00-\u0FFF]/.test(text);
const isKorean = (text) => /[\u3131-\uD79D]/.test(text);
const isEnglish = (text) => /[a-zA-Z]/.test(text) && !isTibetan(text) && !isKorean(text);

const results = [];

const parseFile = (fileName) => {
    const fullPath = path.join(inputDir, fileName);
    if (!fs.existsSync(fullPath)) return null;

    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split(/\r?\n/);

    // Split by sections. A section starts with a number followed by a dot, like "1. " or "2. "
    const sections = [];
    let currentSection = null;

    for (const line of lines) {
        if (/^\d+\.\s/.test(line.trim())) {
            if (currentSection) {
                sections.push(currentSection);
            }
            const trimmedLine = line.trim();
            currentSection = {
                id: fileName.replace('.txt', '') + '-' + trimmedLine.match(/^(\d+)/)[1],
                title: trimmedLine.replace(/^\d+\.\s*/, '').trim(),
                tibetan: [],
                english: [],
                korean: []
            };
        } else if (currentSection && line.trim()) {
            const t = line.trim();
            if (isTibetan(t)) {
                currentSection.tibetan.push(t);
            } else if (isKorean(t)) {
                currentSection.korean.push(t);
            } else {
                currentSection.english.push(t);
            }
        }
    }
    if (currentSection) {
        sections.push(currentSection);
    }
    return sections;
};

files.forEach(file => {
    const sections = parseFile(file);
    if (sections) {
        // Add specific mp3 paths for File 3
        if (file === '3.txt') {
            sections.forEach((sec, idx) => {
                sec.audioUrl = `/mp3/Prayer/3/${sec.id.split('-')[1]}.mp3`; // Changed slightly to match filename if needed, wait files are 3-1.mp3... so 3-X.mp3. Which is file name "3-" + id[1]. But `sec.id` is `3-X`. So just `/mp3/Prayer/${sec.id}.mp3`.
                sec.audioUrl = `/mp3/Prayer/${sec.id}.mp3`;
            });
        }
        results.push({
            id: 'prayer-' + file.replace('.txt', ''),
            chapterName: `Prayer ${file.replace('.txt', '')}`,
            verses: sections.map(s => ({
                id: s.id,
                title: s.title,
                text: {
                    tibetan: s.tibetan.join('\n'),
                    english: s.english.join('\n'),
                    korean: s.korean.join('\n')
                },
                audioUrl: s.audioUrl || null
            }))
        });
    }
});

// Ensure data directory exists
const dataDir = path.dirname(outputFile);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
console.log(`Generated ${outputFile} with ${results.length} files parsed.`);
