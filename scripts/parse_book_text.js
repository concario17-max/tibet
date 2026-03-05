import fs from 'fs';
import { JSDOM } from 'jsdom';

const html1 = fs.readFileSync('../book/1.html', 'utf8');
const html2 = fs.readFileSync('../book/2.html', 'utf8');
const html3 = fs.readFileSync('../book/3.html', 'utf8');

const doc1 = new JSDOM(html1).window.document;
const doc2 = new JSDOM(html2).window.document;
const doc3 = new JSDOM(html3).window.document;

const paragraphs = {};
let currentP = null;

doc2.body.childNodes.forEach(node => {
    if (node.tagName === 'P') {
        const text = node.textContent.trim();
        const match = text.match(/\[문단 (\d+)\]/i);
        if (match) {
            currentP = parseInt(match[1]);
            if (!paragraphs[currentP]) paragraphs[currentP] = { id: currentP.toString(), text: {} };
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

let currentP3 = null;
doc3.body.childNodes.forEach(node => {
    if (node.tagName === 'P') {
        const text = node.textContent.trim();
        const match = text.match(/\[문단 (\d+)\](.*)/i);
        if (match) {
            currentP3 = parseInt(match[1]);
            const content = match[2].trim();
            if (!paragraphs[currentP3]) paragraphs[currentP3] = { id: currentP3.toString(), text: {} };

            // Extract strong tags or formatting if there is any, otherwise text
            const temp = doc3.createElement('div');
            temp.innerHTML = node.innerHTML.replace(/<strong>\[문단 \d+\]<\/strong>/i, '').replace(/\[문단 \d+\]/i, '').trim();

            // Append if there's multiple paragraphs for the same verse in 3.html
            const existingText = paragraphs[currentP3].text.korean2 || '';
            paragraphs[currentP3].text.korean2 = existingText ? existingText + '\n\n' + temp.textContent.trim() : temp.textContent.trim();
        } else if (currentP3 && !text.includes('다음') && !text.includes('진행') && text.length > 5) {
            const temp = doc3.createElement('div');
            temp.innerHTML = node.innerHTML;
            const content = temp.textContent.trim();
            paragraphs[currentP3].text.korean2 += '\n\n' + content;
        }
    } else if (node.tagName === 'OL' && currentP3) {
        node.childNodes.forEach(li => {
            if (li.tagName === 'LI') {
                paragraphs[currentP3].text.korean2 += '\n\n' + li.textContent.trim();
            }
        });
    }
});

const CUSTOM_CHAPTERS = [
    {
        chapterName: "11장. 듣고 이해함으로써 절대 자유에 이르는 위대한 가르침 배경",
        subchapters: [
            "1) 서론"
        ]
    },
    {
        chapterName: "1부. 죽음 중간계 및 자애로운 모습의 붓다와 보살들이 나타나는 저승 중간계에 대한 해설",
        subchapters: [
            "1) 서론",
            "2) 죽음 중간계에서 경험하는 투명한 빛 / 근원적인 투명한 빛에 대한 안내",
            "3) 길의 투명한 빛에 대한 안내 / 몸 밖에서 투명한 빛을 경험하는 중간계",
            "4) 저승 중간계 길 안내"
        ]
    },
    {
        chapterName: "2부. 무서운 모습의 붓다와 보살들이 나타나는 저승 중간계에 대한 해설",
        subchapters: [
            "1) 서론",
            "2) 본론&결론"
        ]
    },
    {
        chapterName: "3부. 탄생 중간계에 대한 해설",
        subchapters: [
            "1) 정신적인 몸에 대한 서론",
            "2) 자궁으로 들어가는 것을 막음",
            "3) 자궁을 선택하는 법",
            "4) 결론"
        ]
    }
];

const chapters = [];
let globalSectionCounter = -1;

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
                globalSectionCounter++;

                // Find which parent this global section counter belongs to
                let currentCount = 0;
                let actualParentName = "";
                let actualSubName = "";

                for (const parent of CUSTOM_CHAPTERS) {
                    if (globalSectionCounter < currentCount + parent.subchapters.length) {
                        actualParentName = parent.chapterName;
                        actualSubName = parent.subchapters[globalSectionCounter - currentCount];
                        break;
                    }
                    currentCount += parent.subchapters.length;
                }

                // If it's a new parent group, push a parent-level object
                let parentChap = chapters.find(c => c.chapterName === actualParentName);
                if (!parentChap) {
                    parentChap = {
                        id: `group-${chapters.length}`,
                        chapterName: actualParentName,
                        isGroup: true,
                        subchapters: []
                    };
                    chapters.push(parentChap);
                }

                const chap = {
                    id: `chapter-${globalSectionCounter}`,
                    chapterName: actualSubName,
                    verses: []
                };

                for (let i = start; i <= end; i++) {
                    if (paragraphs[i]) {
                        const enText = paragraphs[i].text.english || '';
                        let titlePreview = enText.substring(0, 45) + (enText.length > 45 ? '...' : '');
                        let koreanTranslators = [{
                            translator: "정창영",
                            text: paragraphs[i].text.korean || ""
                        }];

                        if (paragraphs[i].text.korean2) {
                            koreanTranslators.push({
                                translator: "중암 선혜",
                                text: paragraphs[i].text.korean2
                            });
                        }

                        chap.verses.push({
                            id: i.toString(),
                            title: titlePreview,
                            chapterTitle: enText, // Use the full english as requested
                            text: {
                                tibetan: "",
                                english: paragraphs[i].text.english || "",
                                korean: koreanTranslators
                            }
                        });
                    }
                }
                if (chap.verses.length > 0) {
                    parentChap.subchapters.push(chap);
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
