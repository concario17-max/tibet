import fs from 'fs';
const content = fs.readFileSync('c:\\Users\\PT\\Desktop\\Tibet\\book\\5.txt', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Remove [문단 X]
    const cleanLine = line.replace(/\[문단 \d+\]/g, '').trim();
    if (cleanLine.length > 0) {
        // Check if it's NOT Tibetan
        if (/[^\u0F00-\u0FFF\s\d\[\]\(\)\.\,\:\;\!\?\-\+]/.test(cleanLine)) {
            // If it has Korean or English
            console.log(`Line ${i + 1}: ${line.substring(0, 100)}`);
        }
    }
}
