import fs from 'fs';
import { JSDOM } from 'jsdom';

const html1 = fs.readFileSync('../book/1.html', 'utf8');
const html2 = fs.readFileSync('../book/2.html', 'utf8');

const doc1 = new JSDOM(html1).window.document;
const doc2 = new JSDOM(html2).window.document;

const paragraphs = {};
let currentP = null;

doc2.body.childNodes.forEach(node => {
    if (node.tagName === 'P') {
        const text = node.textContent.trim();
        const match = text.match(/\[문단 (\d+)\]/i);
        if (match) {
            currentP = parseInt(match[1]);
            paragraphs[currentP] = { id: currentP.toString(), text: {} };
        }
    } else if (node.tagName === 'UL' && currentP) {
        node.childNodes.forEach(li => {
            if (li.tagName === 'LI') {
                const liHtml = li.innerHTML;
                let enMatch = liHtml.match(/<strong>English:<\/strong>(.*)/);
                let koMatch = liHtml.match(/<strong>Korean:<\/strong>(.*)/);
                if (enMatch) {
                    const temp = doc2.createElement('div');
                    temp.innerHTML = enMatch[1];
                    paragraphs[currentP].text.english = temp.textContent.trim();
                } else if (koMatch) {
                    const temp = doc2.createElement('div');
                    temp.innerHTML = koMatch[1];
                    paragraphs[currentP].text.korean = temp.textContent.trim();
                }
            }
        });
    }
});

const CUSTOM_CHAPTERS = [
    "0. 듣고 이해함으로써 절대 자유에 이르는 위대한 가르침 배경 / 서론",
    "1. 죽음 중간계 및 자애로운 모습의 붓다와 보살들이 나타나는 저승 중간계에 대한 해설 / 서론",
    "1-1. 죽음 중간계에서 경험하는 투명한 빛 / 근원적인 투명한 빛에 대한 안내)",
    "1-2. 길의 투명한 빛에 대한 안내 / 몸 밖에서 투명한 빛을 경험하는 중간계",
    "1-3. 저승 중간계 길 안내",
    "2. 무서운 모습의 붓다와 보살들이 나타나는 저승 중간계에 대한 해설 / 서론",
    "2-1. 본론&결론",
    "3. 탄생 중간계에 대한 해설 / 정신적인 몸에 대한 서론",
    "3-1. 자궁으로 들어가는 것을 막음",
    "3-2. 자궁을 선택하는 법",
    "3-3. 결론"
];

const chapters = [];
let chapterIdCounter = -1;

function parseCategories(ulNode, currentChapterObj) {
    if (!ulNode || ulNode.tagName !== 'UL') return;

    Array.from(ulNode.children).forEach(li => {
        if (li.tagName === 'LI') {
            const temp = doc1.createElement('div');
            temp.innerHTML = li.innerHTML;
            const childUls = temp.querySelectorAll('ul');
            childUls.forEach(u => u.remove());
            const label = temp.textContent.trim();

            const matchRange = label.match(/\[문단 (\d+)\s*~\s*(?:문단 )?(\d+)(?:\s*내외)?\]\s*:\s*(.*)/i);
            if (matchRange) {
                const start = parseInt(matchRange[1]);
                const end = parseInt(matchRange[2]);
                chapterIdCounter++;
                const actualChapterName = CUSTOM_CHAPTERS[chapterIdCounter] || currentChapterObj;

                const chap = {
                    id: `chapter-${chapterIdCounter}`,
                    chapterName: actualChapterName,
                    verses: []
                };

                for (let i = start; i <= end; i++) {
                    if (paragraphs[i]) {
                        const enText = paragraphs[i].text.english || '';
                        let titlePreview = enText.substring(0, 45) + (enText.length > 45 ? '...' : '');
                        chap.verses.push({
                            id: i.toString(),
                            title: titlePreview,
                            chapterTitle: enText, // Use the full english as requested
                            text: {
                                tibetan: "",
                                english: paragraphs[i].text.english || "",
                                korean: [{
                                    translator: "정창영",
                                    text: paragraphs[i].text.korean || ""
                                }]
                            },
                        });
                    }
                }
                if (chap.verses.length > 0) {
                    chapters.push(chap);
                }
            } else {
                let cleanLabel = label.replace(/ \(.*/, '').trim();
                if (cleanLabel.includes(':')) {
                    cleanLabel = cleanLabel.split(':')[1].trim();
                }
                const subUl = li.querySelector('ul');
                if (subUl) {
                    parseCategories(subUl, cleanLabel);
                }
            }
        }
    });
}
const rootUl = doc1.body.querySelector('ul');
if (rootUl) {
    parseCategories(rootUl, null);
}

fs.writeFileSync('../src/data/book.json', JSON.stringify(chapters, null, 2));
console.log('Successfully generated book.json with ' + chapters.length + ' chapters.');
