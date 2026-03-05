import fs from 'fs';
import path from 'path';

// Load prayers.json
const prayersPath = path.resolve('src/data/prayers.json');
const prayers = JSON.parse(fs.readFileSync(prayersPath, 'utf8'));

// Helper to parse text divided by double newlines into blocks
function parseBlocks(filePath) {
    const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    return content.split(/\n{2,}/).map(b => b.trim()).filter(b => b.length > 0);
}

// 1. Process Prayer 3
if (fs.existsSync('Prayer/3/3.txt')) {
    const blocks3 = parseBlocks('Prayer/3/3.txt');
    // Each block in 3.txt has a number on the first line, and then the text on the rest
    const prayer3 = prayers.find(p => p.id === 'prayer-3');
    if (prayer3) {
        for (let i = 0; i < blocks3.length; i += 2) {
            const num = blocks3[i].trim();
            const text = blocks3[i + 1] ? blocks3[i + 1].trim() : '';
            const verse = prayer3.verses.find(v => v.id === `3.${num}`);
            if (verse) {
                verse.text.pronunciation = text;
            }
        }
    }
}

// 2. Process Prayer 4
if (fs.existsSync('Prayer/4/4.txt')) {
    const blocks4 = parseBlocks('Prayer/4/4.txt');
    const prayer4 = prayers.find(p => p.id === 'prayer-4');
    if (prayer4 && blocks4.length === prayer4.verses.length) {
        prayer4.verses.forEach((verse, i) => {
            verse.text.pronunciation = blocks4[i];
        });
    }
}

// 3. Process Prayer 5
if (fs.existsSync('Prayer/5/5.txt')) {
    const blocks5 = parseBlocks('Prayer/5/5.txt');
    const prayer5 = prayers.find(p => p.id === 'prayer-5');
    if (prayer5 && blocks5.length === prayer5.verses.length) {
        prayer5.verses.forEach((verse, i) => {
            verse.text.pronunciation = blocks5[i];
        });
    }
}

// Ensure the audio urls match since they were missing for Prayer 3, 4, 5
const prayer3 = prayers.find(p => p.id === 'prayer-3');
if (prayer3) {
    prayer3.verses.forEach(v => {
        const num = v.id.split('.')[1];
        v.audioUrl = `/mp3/Prayer/3-${num}.mp3`;
    });
}

const prayer4 = prayers.find(p => p.id === 'prayer-4');
if (prayer4) {
    prayer4.verses.forEach(v => {
        const num = v.id.split('.')[1];
        v.audioUrl = `/mp3/Prayer/4-${num}.mp3`;
    });
}

const prayer5 = prayers.find(p => p.id === 'prayer-5');
if (prayer5) {
    prayer5.verses.forEach(v => {
        const num = v.id.split('.')[1];
        v.audioUrl = `/mp3/Prayer/5-${num}.mp3`;
    });
}

// Save back to prayers.json
fs.writeFileSync(prayersPath, JSON.stringify(prayers, null, 2));
console.log('Successfully updated prayers.json with pronunciations.');
