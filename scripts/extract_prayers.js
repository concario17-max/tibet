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

const titleMap = {
    '1.txt': '붓다의 세 몸인 스승에 대한 기도',
    '2.txt': '붓다와 보살들께 도움을 청하는 기도',
    '3.txt': '중간계의 곤경에서 구원을 청하는 기도',
    '4.txt': '중간계 여행의 두려움으로부터 구원을 청하는 기도',
    '5.txt': '여섯 중간계에 들어가기 전에 드리는 기도'
};

const parseFile = (fileName) => {
    const fullPath = path.join(inputDir, fileName);
    if (!fs.existsSync(fullPath)) return null;

    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split(/\r?\n/);

    // Split by sections. A section starts with a number followed by a dot, like "1. " or "2. "
    const sections = [];
    let currentSection = null;

    for (const line of lines) {
        // Match standard "1. Title", or "1 Title", or "[제 1연] Title"
        const sectionMatch = line.trim().match(/^(?:\[제\s*(\d+)연\]|(\d+)\.|\s*(\d+)\s+)\s*(.*)/);

        if (sectionMatch && sectionMatch[0].trim().length > 0) {
            if (currentSection) {
                sections.push(currentSection);
            }
            const trimmedLine = line.trim();
            // Find which group captured the number
            const num = sectionMatch[1] || sectionMatch[2] || sectionMatch[3];
            const titlePart = sectionMatch[4] ? sectionMatch[4].trim() : '';

            currentSection = {
                id: fileName.replace('.txt', '') + '.' + num,
                title: titlePart,
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
                const num = sec.id.split('.')[1];
                sec.audioUrl = `/mp3/Prayer/3-${num}.mp3`;
            });
        }
        results.push({
            id: 'prayer-' + file.replace('.txt', ''),
            chapterName: titleMap[file] || `Prayer ${file.replace('.txt', '')}`,
            verses: sections.map((s, index) => {
                // Use the first Tibetan line as the excerpt/title, fallback to original if none
                const tibetanExcerpt = s.tibetan.length > 0 ? s.tibetan[0].substring(0, 40) + '...' : s.title;
                const titleWithIndex = `${s.id} ${tibetanExcerpt}`;

                return {
                    id: s.id,
                    title: titleWithIndex,
                    chapterTitle: s.title, // Keep original title just in case it's needed for reading panel
                    text: {
                        tibetan: s.tibetan.join('\n'),
                        english: s.english.join('\n'),
                        korean: s.korean.join('\n')
                    },
                    audioUrl: s.audioUrl || null
                };
            })
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
