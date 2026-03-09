const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\PT\\Desktop\\Tibet\\book\\5.txt', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (/[a-zA-Z]/.test(lines[i])) {
        console.log(`Line ${i + 1}: ${lines[i].substring(0, 100)}`);
        if (i > 100) break; // Limit
    }
}
