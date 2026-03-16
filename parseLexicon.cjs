const fs = require('fs');

const raw = fs.readFileSync('Lexicon.txt', 'utf8').replace(/^\uFEFF/, '');
const sourceLines = raw.split(/\r?\n/).map((line) => line.trimRight());

const glossary = [];

const definitionStarters = [
    'A ',
    'An ',
    'According ',
    'Among ',
    'Any ',
    'As ',
    'Based ',
    'Birth ',
    'Both ',
    'Broadly ',
    'Buddhist ',
    'By ',
    'Compassion ',
    'Contrasted ',
    'Derived ',
    'Every ',
    'Finally, ',
    'Following ',
    'Generally, ',
    'Generally ',
    'Here ',
    'From ',
    'In ',
    'Immeasurable ',
    'It ',
    'Meditative ',
    'Male ',
    'Moreover, ',
    'Nothing ',
    'Often ',
    'One ',
    'Our ',
    'Rather, ',
    'See ',
    'Signlessness, ',
    'Spiritual ',
    'States ',
    'The ',
    'There ',
    'These ',
    'This ',
    'Those ',
    'Thus, ',
    'Sometimes ',
    'While ',
    'When ',
    'With ',
];

const sentenceEndPattern = /[.!?]$|[.!?][’'")\]]$/;
const inlineVerbPattern = /\b(?:is|are|refers to|refers|comprises|includes|encompasses|denotes|means|should|may|can|symbolises|symbolizes|embodies|represents|arises|contains|describes)\b/;

const cleanText = (text) => text.replace(/\s+/g, ' ').trim();

const startsLikeDefinition = (line) => {
    return definitionStarters.some((prefix) => line.startsWith(prefix));
};

const startsLikeVerbDefinition = (line) => {
    return /^[A-Z][^\s]{2,}(?: [A-Za-zĀāĪīŪūṚṛṜṝḶḷḸḹṂṃṄṅÑñṬṭḌḍṆṇŚśṢṣḤḥÇçÉéÓóÖöÜüâêîôû`'’.,()[\]/-]+){0,6}\s/.test(line) &&
        inlineVerbPattern.test(line);
};

const endsLikeSentence = (line) => {
    return sentenceEndPattern.test(line.trim());
};

const isLikelyTermLine = (line) => {
    if (!line) return false;
    if (!/^[A-Z]/.test(line)) return false;
    if (startsLikeDefinition(line) || startsLikeVerbDefinition(line)) return false;
    if (line.length > 160) return false;
    return true;
};

const splitInlineTermAndDefinition = (line) => {
    if (!line || !/^[A-Z]/.test(line)) return null;

    for (const starter of definitionStarters) {
        const idx = line.indexOf(` ${starter}`);
        if (idx > 10) {
            const term = cleanText(line.slice(0, idx));
            const definition = cleanText(line.slice(idx + 1));
            if (term && definition) {
                return { term, definition };
            }
        }
    }

    const wordPattern = /[A-Z][A-Za-zĀāĪīŪūṚṛṜṝḶḷḸḹṂṃṄṅÑñṬṭḌḍṆṇŚśṢṣḤḥÇçÉéÓóÖöÜüâêîôû`'’.-]*/g;
    let match;
    while ((match = wordPattern.exec(line)) !== null) {
        if (match.index <= 10) continue;
        const remainder = line.slice(match.index);
        if (!startsLikeVerbDefinition(remainder)) continue;
        const term = cleanText(line.slice(0, match.index));
        const definition = cleanText(remainder);
        if (term && definition) {
            return { term, definition };
        }
    }

    return null;
};

const getNextNonEmptyLine = (lines, startIndex) => {
    for (let i = startIndex; i < lines.length; i++) {
        if (lines[i]) return lines[i];
    }
    return '';
};

const normalizeLines = (lines) => {
    const normalized = [];

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const inline = splitInlineTermAndDefinition(line);
        if (inline) {
            normalized.push(inline.term);
            normalized.push(inline.definition);
            continue;
        }

        normalized.push(line);
    }

    return normalized;
};

const flushEntry = (entry) => {
    if (!entry) return;

    const term = cleanText(entry.termParts.join(' '));
    const definition = cleanText(entry.definitionParts.join(' '));

    if (!term || !definition) return;
    glossary.push({ term, definition });
};

const lines = normalizeLines(sourceLines);

let i = 0;
while (i < lines.length && !lines[i].startsWith('Abhidhrma')) {
    i++;
}

let entry = null;

for (; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = getNextNonEmptyLine(lines, i + 1);

    if (!entry) {
        if (isLikelyTermLine(line)) {
            entry = { termParts: [line], definitionParts: [] };
        }
        continue;
    }

    if (entry.definitionParts.length === 0) {
        if (startsLikeDefinition(line) || startsLikeVerbDefinition(line) || line.length > 180) {
            entry.definitionParts.push(line);
            continue;
        }

        const lineLooksLikeTerm = isLikelyTermLine(line);
        const nextLooksLikeDefinition = startsLikeDefinition(nextLine) || startsLikeVerbDefinition(nextLine);

        if (lineLooksLikeTerm && !nextLooksLikeDefinition) {
            entry.termParts.push(line);
        } else {
            entry.definitionParts.push(line);
        }
        continue;
    }

    const canStartNewEntry =
        isLikelyTermLine(line) &&
        (startsLikeDefinition(nextLine) || startsLikeVerbDefinition(nextLine) || !nextLine || !endsLikeSentence(line)) &&
        endsLikeSentence(entry.definitionParts[entry.definitionParts.length - 1] || '');

    if (canStartNewEntry) {
        flushEntry(entry);
        entry = { termParts: [line], definitionParts: [] };
        continue;
    }

    entry.definitionParts.push(line);
}

flushEntry(entry);

fs.writeFileSync('src/data/lexicon.json', JSON.stringify(glossary, null, 2), 'utf8');
console.log('Successfully wrote', glossary.length, 'terms');
