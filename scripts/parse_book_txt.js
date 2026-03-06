import fs from 'fs';
import { JSDOM } from 'jsdom';

// 1. Parse 2.txt line by line
const txt2 = fs.readFileSync('../book/2.txt', 'utf8').split('\n');
const paragraphs = {};
let currentP = null;

for (let line of txt2) {
    line = line.trim();
    if (!line) continue;

    let m = line.match(/^\[문단\s+(\d+)\]/i);
    if (m) {
        currentP = parseInt(m[1]);
        if (!paragraphs[currentP]) paragraphs[currentP] = { id: currentP.toString(), text: {} };
    } else if (currentP) {
        if (line.startsWith('* English:')) {
            paragraphs[currentP].text.english = line.replace('* English:', '').trim();
        } else if (line.startsWith('* Korean:')) {
            paragraphs[currentP].text.korean = line.replace('* Korean:', '').trim();
        } else {
            if (paragraphs[currentP].text.korean && !line.startsWith('*')) {
                paragraphs[currentP].text.korean += ' ' + line;
            } else if (paragraphs[currentP].text.english && !line.startsWith('*') && !paragraphs[currentP].text.korean) {
                paragraphs[currentP].text.english += ' ' + line;
            }
        }
    }
}

// 2. Parse 3.html using DOM (Unchanged fallback)
const html3 = fs.readFileSync('../book/3.html', 'utf8');
const doc3 = new JSDOM(html3).window.document;
let currentP3 = null;
doc3.body.childNodes.forEach(node => {
    if (node.tagName === 'P') {
        const text = node.textContent.trim();
        const match = text.match(/\[문단 (\d+)\](.*)/i);
        if (match) {
            currentP3 = parseInt(match[1]);
            if (!paragraphs[currentP3]) paragraphs[currentP3] = { id: currentP3.toString(), text: {} };
            const temp = doc3.createElement('div');
            temp.innerHTML = node.innerHTML.replace(/<strong>\[문단 \d+\]<\/strong>/i, '').replace(/\[문단 \d+\]/i, '').trim();
            const existingText = paragraphs[currentP3].text.korean2 || '';
            paragraphs[currentP3].text.korean2 = existingText ? existingText + '\n\n' + temp.textContent.trim() : temp.textContent.trim();
        } else if (currentP3 && !text.includes('다음') && !text.includes('진행') && text.length > 5) {
            const temp = doc3.createElement('div');
            temp.innerHTML = node.innerHTML;
            paragraphs[currentP3].text.korean2 += '\n\n' + temp.textContent.trim();
        }
    } else if (node.tagName === 'OL' && currentP3) {
        node.childNodes.forEach(li => {
            if (li.tagName === 'LI') {
                paragraphs[currentP3].text.korean2 += '\n\n' + li.textContent.trim();
            }
        });
    }
});

// 3. Parse hierarchy from 1.txt
const txt1 = fs.readFileSync('../book/1.txt', 'utf8').split('\n');
const chapters = [];
let currentChapterGroup = null;

for (let line of txt1) {
    line = line.trim();
    if (!line) continue;

    const matchVerse = line.match(/(.*?)\s*\((\d+)\s*-\s*(\d+)\)$/);
    if (matchVerse) {
        const name = matchVerse[1].replace(/^[-0-9\)]+\s*/, '').trim();
        const start = parseInt(matchVerse[2]);
        const end = parseInt(matchVerse[3]);

        if (!currentChapterGroup) {
            currentChapterGroup = { id: `group-0`, chapterName: "기본 안내", isGroup: true, subchapters: [] };
            chapters.push(currentChapterGroup);
        }

        const chap = {
            id: `chapter-${currentChapterGroup.subchapters.length}`,
            chapterName: name,
            verses: []
        };

        for (let i = start; i <= end; i++) {
            if (paragraphs[i]) {
                const enText = paragraphs[i].text.english || '';
                let titlePreview = enText.substring(0, 45) + (enText.length > 45 ? '...' : '');
                let koreanTranslators = [];
                if (paragraphs[i].text.korean) {
                    koreanTranslators.push({ translator: "정창영", text: paragraphs[i].text.korean });
                }
                if (paragraphs[i].text.korean2) {
                    koreanTranslators.push({ translator: "중암 선혜", text: paragraphs[i].text.korean2 });
                }

                chap.verses.push({
                    id: String(i),
                    title: titlePreview,
                    chapterTitle: enText,
                    text: { tibetan: "", english: enText, korean: koreanTranslators }
                });
            }
        }
        if (chap.verses.length > 0) {
            currentChapterGroup.subchapters.push(chap);
        }
    } else {
        let cleanName = line.replace(/^[0-9]+\.\s*/, '').replace(/^[0-9]+\)\s*/, '').replace(/^-\s*/, '').trim();
        currentChapterGroup = {
            id: `group-${chapters.length}`,
            chapterName: cleanName,
            isGroup: true,
            subchapters: []
        };
        chapters.push(currentChapterGroup);
    }
}

const finalChapters = chapters.filter(c => c.subchapters.length > 0);
fs.writeFileSync('../src/data/book.json', JSON.stringify(finalChapters, null, 2));
console.log('Successfully generated book.json with ' + finalChapters.length + ' chapter groups.');
