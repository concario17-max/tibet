import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ray Standard: Pure Functional Data Pipeline for Bardo Thodol Parsing
 * 명확한 책임 분리 및 불변성 유지를 목표로 함
 */

const projectRoot = path.join(__dirname, '..');
const paths = {
    doc1: path.join(projectRoot, 'book', '1.html'),
    doc2: path.join(projectRoot, 'book', '2.html'),
    doc3: path.join(projectRoot, 'book', '3.html'),
    output: path.join(projectRoot, 'src', 'data', 'book.json')
};

const CUSTOM_CHAPTERS = [
    { chapterName: "11장. 듣고 이해함으로써 절대 자유에 이르는 위대한 가르침 배경", subchapters: ["1) 서론"] },
    { chapterName: "1부. 죽음 중간계 및 자애로운 모습의 붓다와 보살들이 나타나는 저승 중간계에 대한 해설", subchapters: ["1) 서론", "2) 죽음 중간계에서 경험하는 투명한 빛 / 근원적인 투명한 빛에 대한 안내", "3) 길의 투명한 빛에 대한 안내 / 몸 밖에서 투명한 빛을 경험하는 중간계", "4) 저승 중간계 길 안내"] },
    { chapterName: "2부. 무서운 모습의 붓다와 보살들이 나타나는 저승 중간계에 대한 해설", subchapters: ["1) 서론", "2) 본론&결론"] },
    { chapterName: "3부. 탄생 중간계에 대한 해설", subchapters: ["1) 정신적인 몸에 대한 서론", "2) 자궁으로 들어가는 것을 막음", "3) 자궁을 선택하는 법", "4) 결론"] }
];

// HTML 로딩 및 DOM 초기화
const loadDocs = () => Object.fromEntries(
    Object.entries(paths).slice(0, 3).map(([key, path]) => [
        key, new JSDOM(fs.readFileSync(path, 'utf8')).window.document
    ])
);

// 2.html 파싱: 기본 본문 (English, Korean)
const parseDoc2 = (doc) => {
    let currentP = null;
    const data = {};

    Array.from(doc.body.childNodes).forEach(node => {
        if (node.tagName === 'P') {
            const match = node.textContent.trim().match(/\[문단 (\d+)\]/i);
            if (match) currentP = parseInt(match[1]);
        } else if (node.tagName === 'UL' && currentP) {
            const item = { english: '', korean: '' };
            Array.from(node.children).forEach(li => {
                const liHtml = li.innerHTML;
                if (liHtml.includes('English:')) item.english = li.textContent.replace('English:', '').trim();
                if (liHtml.includes('Korean:')) item.korean = li.textContent.replace('Korean:', '').trim();
            });
            data[currentP] = { ...data[currentP], ...item };
        }
    });
    return data;
};

// 3.html 파싱: 추가 번역 (Korean2 by 중암 선혜)
const parseDoc3 = (doc, initialData) => {
    let currentP = null;
    const data = { ...initialData };

    Array.from(doc.body.childNodes).forEach(node => {
        if (node.tagName === 'P') {
            const text = node.textContent.trim();
            const match = text.match(/\[문단 (\d+)\](.*)/i);
            if (match) {
                currentP = parseInt(match[1]);
                const content = node.innerHTML.replace(/<[^>]+>\[문단 \d+\]<\/[^>]+>/i, '').replace(/\[문단 \d+\]/i, '').trim();
                const temp = doc.createElement('div');
                temp.innerHTML = content;
                data[currentP] = {
                    ...data[currentP],
                    korean2: (data[currentP]?.korean2 ? data[currentP].korean2 + '\n\n' : '') + temp.textContent.trim()
                };
            } else if (currentP && !/다음|진행/.test(text) && text.length > 5) {
                data[currentP].korean2 += '\n\n' + text;
            }
        } else if (node.tagName === 'OL' && currentP) {
            Array.from(node.children).forEach(li => {
                data[currentP].korean2 += '\n\n' + li.textContent.trim();
            });
        }
    });
    return data;
};

// 최종 구조 생성 (Doc1의 카테고리 기반)
const buildFinalStructure = (doc, paragraphs) => {
    const chapters = [];
    let globalSectionCounter = -1;

    const parseCategories = (ulNode) => {
        Array.from(ulNode.children).forEach(li => {
            const matchRange = li.textContent.trim().match(/\[문단 (\d+)\s*~\s*(?:문단 )?(\d+)[^\]]*\]\s*:\s*(.*)/i);

            if (matchRange) {
                const start = parseInt(matchRange[1]);
                const end = parseInt(matchRange[2]);
                globalSectionCounter++;

                // 챕터 매핑 로직
                let currentCount = 0;
                let actualParentName = "", actualSubName = "";
                for (const parent of CUSTOM_CHAPTERS) {
                    if (globalSectionCounter < currentCount + parent.subchapters.length) {
                        actualParentName = parent.chapterName;
                        actualSubName = parent.subchapters[globalSectionCounter - currentCount];
                        break;
                    }
                    currentCount += parent.subchapters.length;
                }

                let parentChap = chapters.find(c => c.chapterName === actualParentName);
                if (!parentChap) {
                    parentChap = { id: `group-${chapters.length}`, chapterName: actualParentName, isGroup: true, subchapters: [] };
                    chapters.push(parentChap);
                }

                const verses = Array.from({ length: end - start + 1 }, (_, i) => start + i)
                    .filter(id => paragraphs[id])
                    .map(id => {
                        const p = paragraphs[id];
                        const korean = [{ translator: "정창영", text: p.korean || "" }];
                        if (p.korean2) korean.push({ translator: "중암 선혜", text: p.korean2 });

                        return {
                            id: id.toString(),
                            title: p.english?.substring(0, 45) + (p.english?.length > 45 ? '...' : ''),
                            chapterTitle: p.english || "",
                            text: { tibetan: "", english: p.english || "", korean }
                        };
                    });

                if (verses.length > 0) {
                    parentChap.subchapters.push({ id: `chapter-${globalSectionCounter}`, chapterName: actualSubName, verses });
                }
            } else if (li.querySelector('ul')) {
                parseCategories(li.querySelector('ul'));
            }
        });
    };

    const rootUl = doc.body.querySelector('ul');
    if (rootUl) parseCategories(rootUl);
    return chapters;
};

// Main Execution
const run = () => {
    try {
        const docs = loadDocs();
        const paragraphs = parseDoc3(docs.doc3, parseDoc2(docs.doc2));
        const result = buildFinalStructure(docs.doc1, paragraphs);

        fs.writeFileSync(paths.output, JSON.stringify(result, null, 2));
        console.log(`[Ray-Data-Pipeline] Success: ${result.length} groups processed.`);
    } catch (error) {
        console.error('[Ray-Data-Pipeline] Failed:', error);
        process.exit(1);
    }
};

run();
