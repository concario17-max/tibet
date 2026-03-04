const fs = require('fs');

const txt = fs.readFileSync('Prayer/3-1.txt', 'utf8');
const jsonStr = fs.readFileSync('src/data/prayers.json', 'utf8');
const json = JSON.parse(jsonStr);

// Split blocks correctly accommodating \r\n and optional spaces
const regex = /(?:^|\r\n|\n)\d+(?:\r\n|\n)+/;
const rawBlocks = txt.split(regex);

// Filter out empty blocks
const blocks = rawBlocks.map(s => s.trim()).filter(Boolean);

const ch3 = json.find(p => p.id === 'prayer-3');
if (ch3) {
    if (blocks.length === 12) {
        blocks.forEach((block, i) => {
            if (ch3.verses[i]) {
                ch3.verses[i].text.pronunciation = block;
            }
        });

        // Remove trailing commas in the last properties if necessary by simply using standard JSON.stringify
        fs.writeFileSync('src/data/prayers.json', JSON.stringify(json, null, 4));
        console.log('Successfully patched prayers.json for Chapter 3 across all 12 verses.');
    } else {
        console.log('Error: Expected 12 blocks, but got ' + blocks.length);
        console.log(blocks);
    }
} else {
    console.log('Chapter 3 not found');
}
