import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ray Standard: High-Performance Text-Based Data Pipeline
 * No Monolith, Immutable approach, Zero jsdom dependency.
 */

const projectRoot = path.join(__dirname, '..');
const paths = {
    doc1: path.join(projectRoot, 'book', '1.txt'),
    doc2: path.join(projectRoot, 'book', '2.txt'),
    doc3: path.join(projectRoot, 'book', '3.txt'),
    doc4: path.join(projectRoot, 'book', '4..txt'),
    doc5: path.join(projectRoot, 'book', '5.txt'),
    output: path.join(projectRoot, 'src', 'data', 'book.json')
};

const CUSTOM_CHAPTERS = [
    { id: 1, chapterName: "1부. 저승 중간계에서 드리는 기도" },
    { id: 2, chapterName: "2부. 자애로운 모습의 붓다와 보살들이 나타나는 저승 중간계" },
    { id: 3, chapterName: "3부. 무서운 모습의 붓다와 보살들이 나타나는 저승 중간계" },
    { id: 4, chapterName: "4부. 탄생 중간계 길 안내" }
];

// 1.txt 파싱: 챕터별 문단 범위 추출
const parseStructure = (text) => {
    const lines = text.split('\n');
    const structure = [];
    const rangeRegex = /(.*?)\s*\((\d+)-(\d+)\)/;

    let currentMainChapter = 0;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const mainMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (mainMatch) {
            currentMainChapter = parseInt(mainMatch[1]);
            return;
        }

        const match = trimmed.match(rangeRegex);
        if (match) {
            structure.push({
                mainId: currentMainChapter,
                start: parseInt(match[2]),
                end: parseInt(match[3]),
                title: match[1].replace(/^[\d\)\-\s]+/, '').trim()
            });
        }
    });
    return structure;
};

// 2.txt 파싱: 문단별 English/Korean 추출
const parseContent = (text) => {
    const paragraphs = {};
    const blocks = text.split(/\[?문단\s+(\d+)\]?/);

    for (let i = 1; i < blocks.length; i += 2) {
        const id = parseInt(blocks[i]);
        const content = blocks[i + 1];
        if (!content) continue;

        const englishMatch = content.match(/\* English:\s*([\s\S]*?)(?=\* Korean:|$)/);
        const koreanMatch = content.match(/\* Korean:\s*([\s\S]*?)$/);

        paragraphs[id] = {
            english: englishMatch ? englishMatch[1].trim() : "",
            korean: koreanMatch ? koreanMatch[1].trim() : ""
        };
    }
    return paragraphs;
};

// 3.txt 파싱: 문단별 korean2 추출
const parseKorean2 = (text, paragraphs) => {
    const blocks = text.split(/\[?문단\s+(\d+)\]?/);

    for (let i = 1; i < blocks.length; i += 2) {
        const id = parseInt(blocks[i]);
        const content = blocks[i + 1]?.trim() || "";

        if (paragraphs[id]) {
            paragraphs[id].korean2 = content;
        } else {
            paragraphs[id] = { english: "", korean: "", korean2: content, korean3: "", tibetan: "" };
        }
    }
    return paragraphs;
};

// 4..txt 파싱: 문단별 korean3 (류시화) 추출
const parseKorean3 = (text, paragraphs) => {
    const blocks = text.split(/\[?문단\s+(\d+)\]?/);

    for (let i = 1; i < blocks.length; i += 2) {
        const id = parseInt(blocks[i]);
        const content = blocks[i + 1]?.trim() || "";

        if (paragraphs[id]) {
            paragraphs[id].korean3 = content;
        } else {
            paragraphs[id] = { english: "", korean: "", korean2: "", korean3: content, tibetan: "" };
        }
    }
    return paragraphs;
};

// 5.txt 파싱: 문단별 tibetan 추출
const parseTibetan = (text, paragraphs) => {
    const blocks = text.split(/\[?문단\s+(\d+)\]?/);

    for (let i = 1; i < blocks.length; i += 2) {
        const id = parseInt(blocks[i]);
        const content = blocks[i + 1]?.trim() || "";

        if (paragraphs[id]) {
            paragraphs[id].tibetan = content;
        } else {
            paragraphs[id] = { english: "", korean: "", korean2: "", korean3: "", tibetan: content };
        }
    }
    return paragraphs;
};


// 최종 JSON 구조 빌드
const buildFinalResult = (structure, paragraphs) => {
    const chapters = [];

    CUSTOM_CHAPTERS.forEach((parent) => {
        const chapterGroup = {
            id: `group-${parent.id}`,
            chapterName: parent.chapterName,
            isGroup: true,
            subchapters: []
        };

        const sections = structure.filter(s => s.mainId === parent.id);

        sections.forEach((section, sIdx) => {
            const verses = [];
            for (let id = section.start; id <= section.end; id++) {
                const p = paragraphs[id];
                if (!p) continue;

                const koreanTranslators = [];
                if (p.korean) koreanTranslators.push({ translator: "정창영", text: p.korean });
                if (p.korean2) koreanTranslators.push({ translator: "중암 선혜", text: p.korean2 });
                if (p.korean3) koreanTranslators.push({ translator: "류시화", text: p.korean3 });

                // Fallback title if english is missing
                const enText = p.english || (p.korean ? p.korean.substring(0, 30) : `Verse ${id}`);

                verses.push({
                    id: id.toString(),
                    title: enText.substring(0, 45) + (enText.length > 45 ? '...' : ''),
                    chapterTitle: enText,
                    text: {
                        tibetan: p.tibetan || "",
                        english: enText,
                        korean: koreanTranslators
                    }
                });
            }

            if (verses.length > 0) {
                chapterGroup.subchapters.push({
                    id: `chapter-${parent.id}-${sIdx}`,
                    chapterName: section.title,
                    verses: verses
                });
            }
        });

        if (chapterGroup.subchapters.length > 0) {
            chapters.push(chapterGroup);
        }
    });

    return chapters;
};

const run = () => {
    try {
        console.log('[Ray-Data-Pipeline] Starting multi-translator parsing including Tibetan...');

        const txt1 = fs.readFileSync(paths.doc1, 'utf8');
        const txt2 = fs.readFileSync(paths.doc2, 'utf8');
        const txt3 = fs.readFileSync(paths.doc3, 'utf8');
        const txt4 = fs.readFileSync(paths.doc4, 'utf8');
        const txt5 = fs.readFileSync(paths.doc5, 'utf8');

        const structure = parseStructure(txt1);
        let paragraphs = parseContent(txt2);
        paragraphs = parseKorean2(txt3, paragraphs);
        paragraphs = parseKorean3(txt4, paragraphs);
        paragraphs = parseTibetan(txt5, paragraphs);

        const result = buildFinalResult(structure, paragraphs);

        fs.writeFileSync(paths.output, JSON.stringify(result, null, 2));
        console.log(`[Ray-Data-Pipeline] Success: ${result.length} chapters processed into book.json`);
    } catch (error) {
        console.error('[Ray-Data-Pipeline] Critical Error:', error);
        process.exit(1);
    }
};

run();

