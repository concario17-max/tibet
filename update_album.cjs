const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'mp3', 'Tibetan Buddhist Rites From The Monasteries Of Bhutan Volume 2 Sacred Dances And Rituals Of The Nyingmapa And Drukpa Orders');
const destDir = path.join(__dirname, 'public', 'mp3', 'Tibetan Buddhist Rites From The Monasteries Of Bhutan Volume 2 Sacred Dances And Rituals Of The Nyingmapa And Drukpa Orders');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// 1. Move files
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.mp3'));
files.forEach(f => {
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
});

// 2. Build Album Object
const tracks = files.map((f, i) => {
    // Strip leading numbers and underscores e.g., "03_Rise_Up_Padma" -> "Rise Up Padma"
    const cleanedTitle = f.replace('.mp3', '').replace(/^\d+_?/, '').replace(/_/g, ' ');
    return {
        id: `tbr-${i + 1}`,
        title: cleanedTitle,
        url: `/mp3/Tibetan Buddhist Rites From The Monasteries Of Bhutan Volume 2 Sacred Dances And Rituals Of The Nyingmapa And Drukpa Orders/${f}`
    };
});

const newAlbum = {
    id: 'album-02',
    title: 'Tibetan Buddhist Rites Volume 2',
    artist: 'Sacred Dances And Rituals Of The Nyingmapa And Drukpa Orders',
    coverImage: '/album-covers/tbr-v2.jpg', // Placeholder
    tracks: tracks
};

// 3. Update JSON
const jsonPath = path.join(__dirname, 'src', 'data', 'albums.json');
let albums = [];
if (fs.existsSync(jsonPath)) {
    albums = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    // Prevent duplicate adds
    if (!albums.find(a => a.id === 'album-02')) {
        albums.push(newAlbum);
        fs.writeFileSync(jsonPath, JSON.stringify(albums, null, 4));
        console.log('Successfully updated albums.json');
    } else {
        console.log('Album already exists in albums.json');
    }
} else {
    albums.push(newAlbum);
    fs.writeFileSync(jsonPath, JSON.stringify(albums, null, 4));
    console.log('Created albums.json');
}

console.log('Successfully copied ' + files.length + ' mp3 files.');
