import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../Prayer');
const outputFile = path.join(__dirname, '../src/data/prayers.json');

const files = ['1.txt', '2.txt', '3.txt', '4.txt', '5.txt'];

const titleMap = {
    '1.txt': '붓다의 세 몸에 대한 기도',
    '2.txt': '붓다와 보살에게 구원을 청하는 기도',
    '3.txt': '중간계의 공포에서 구원을 청하는 기도',
    '4.txt': '중간계 수행자를 위한 기도',
    '5.txt': '삶의 중간계에 들어가기 전에 드리는 기도',
};

const isTibetan = (text) => /[\u0F00-\u0FFF]/.test(text);
const isKorean = (text) => /[\u3131-\uD79D]/.test(text);
const isEnglish = (text) => /[a-zA-Z]/.test(text) && !isTibetan(text) && !isKorean(text);
const isSectionHeader = (text) => {
    return /^(\[제\s*\d+연\]|(?:\d+)\.)\s*/.test(text.trim());
};

const parseFile = (fileName) => {
    const fullPath = path.join(inputDir, fileName);
    if (!fs.existsSync(fullPath)) return null;

    const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
    const sections = [];
    let currentSection = null;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const sectionMatch = line.match(/^(?:\[제\s*(\d+)연\]|(\d+)\.)\s*(.*)$/);
        if (sectionMatch) {
            if (currentSection) sections.push(currentSection);

            const num = sectionMatch[1] || sectionMatch[2];
            const titlePart = sectionMatch[3]?.trim() || '';

            currentSection = {
                id: `${fileName.replace('.txt', '')}.${num}`,
                title: titlePart,
                tibetan: [],
                english: [],
                korean: [],
            };
            continue;
        }

        if (!currentSection) continue;

        if (isTibetan(line)) {
            currentSection.tibetan.push(line);
            continue;
        }

        if (isKorean(line)) {
            currentSection.korean.push(line);
            continue;
        }

        if (isEnglish(line) || !isSectionHeader(line)) {
            currentSection.english.push(line);
        }
    }

    if (currentSection) sections.push(currentSection);
    return sections;
};

const results = files.flatMap((file) => {
    const sections = parseFile(file);
    if (!sections) return [];

    return [{
        id: `prayer-${file.replace('.txt', '')}`,
        chapterName: titleMap[file] || `Prayer ${file.replace('.txt', '')}`,
        verses: sections.map((section) => {
            const tibetanExcerpt = section.tibetan[0]
                ? `${section.tibetan[0].slice(0, 40)}...`
                : section.title;

            const num = section.id.split('.')[1];
            const audioUrl = ['3', '4', '5'].includes(file.replace('.txt', ''))
                ? `/mp3/Prayer/${file.replace('.txt', '')}-${num}.mp3`
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

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
console.log(`Generated ${outputFile} with ${results.length} chapters parsed.`);
