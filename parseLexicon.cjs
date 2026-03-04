const fs = require('fs');

const raw = fs.readFileSync('Lexicon.txt', 'utf8');
const lines = raw.split('\n').map(l => l.trimRight());

const glossary = [];
let currentTerm = null;
let currentDefinition = [];

// Helper to determine if a line looks like a term
function isTermLine(line, prevLine) {
    if (!line) return false;
    // Definitions always end with a period '.', '?', or '"' generally.
    // If the previous line is empty or ends with a sentence ender, this might be a term.
    const isAfterSentenceEnd = prevLine === undefined || prevLine.trim() === '' || /[.!?”"']$/.test(prevLine.trim());

    // A term line doesn't end with a period usually.
    const endsWithPeriod = line.trim().endsWith('.');

    // A term line usually starts with a Capital letter (English term) or is mostly short.
    const startsWithCapital = /^[A-Z]/.test(line.trim());

    // Some lines are continuing the term name, e.g.
    // Coemergent 
    // Delight 
    // sahajasukha/sahajānanda

    return isAfterSentenceEnd && !endsWithPeriod && startsWithCapital && line.length < 150;
}

let i = 0;
// skip header
while (i < lines.length && !lines[i].startsWith('Abhidhrma')) {
    i++;
}

let prevLine = '';

// Because terms can span multiple lines (as seen with Coemergent Delight), we need a state machine.
let state = 'TERM'; // TERM or DEF
let tempTermLines = [];

for (; i < lines.length; i++) {
    let line = lines[i];

    if (line.trim() === '') {
        prevLine = line;
        continue;
    }

    if (state === 'TERM') {
        const isNextLineCapital = i + 1 < lines.length && /^[A-Z]/.test(lines[i + 1].trim());
        const isNextLineUsuallyDef = i + 1 < lines.length && (/^The /.test(lines[i + 1].trim()) || /^A /.test(lines[i + 1].trim()) || /^[A-Z]/.test(lines[i + 1].trim()));

        // Let's just collect until we hit a clear sentence start.
        // Actually, looking at the text, the definition lines generally form paragraphs.

        if (tempTermLines.length === 0) {
            tempTermLines.push(line.trim());
        } else {
            // Is this line part of the term or start of def?
            // "sahajasukha/sahajānanda" is lowercase, part of term.
            // "The coemergent delight is..." is uppercase, part of def!
            if (/^[a-z_/'’`-]+$/.test(line.trim().split(' ')[0]) || /^Skt\./.test(line.trim()) || line.trim().startsWith('lhan-cig')) {
                tempTermLines.push(line.trim());
            } else if (line.trim().startsWith('See ')) {
                // "See something." is a definition (cross reference)
                if (currentTerm) {
                    glossary.push({ term: currentTerm.join(' '), definition: currentDefinition.join(' ') });
                }
                currentTerm = tempTermLines;
                currentDefinition = [line.trim()];
                tempTermLines = [];
                state = 'DEF';
            } else if (/^[A-Z]/.test(line.trim()) && line.trim().length > 30) {
                // Looks like the start of a definition
                if (currentTerm) {
                    glossary.push({ term: currentTerm.join(' '), definition: currentDefinition.join(' ') });
                }
                currentTerm = tempTermLines;
                currentDefinition = [line.trim()];
                tempTermLines = [];
                state = 'DEF';
            } else {
                tempTermLines.push(line.trim());
            }
        }
    } else if (state === 'DEF') {
        // We are reading definition. We remain in DEF until we find a new term.
        // A new term line starts with Capital, is usually short, and the previous line ends with a period.
        if (isTermLine(line, prevLine)) {
            tempTermLines.push(line.trim());
            state = 'TERM';
        } else {
            currentDefinition.push(line.trim());
        }
    }

    prevLine = line;
}

if (currentTerm) {
    glossary.push({ term: currentTerm.join(' '), definition: currentDefinition.join(' ') });
}

// Clean up the JSON
const finalGlossary = glossary.map(item => {
    return {
        term: item.term.replace(/\s+/g, ' ').trim(),
        definition: item.definition.replace(/\s+/g, ' ').trim()
    };
});

fs.writeFileSync('src/data/lexicon.json', JSON.stringify(finalGlossary, null, 2), 'utf8');
console.log('Successfully wrote', finalGlossary.length, 'terms');
