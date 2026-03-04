const fs = require('fs');
const path = require('path');

const srcBase = path.join(__dirname, 'mp3');
const destAudioBase = path.join(__dirname, 'public', 'mp3');
const destImageBase = path.join(__dirname, 'public', 'album-covers');
const dataFile = path.join(__dirname, 'src', 'data', 'albums.json');

// Dynamically find all subdirectories in the mp3 folder to process
const targetFolders = fs.readdirSync(srcBase, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

if (!fs.existsSync(destAudioBase)) fs.mkdirSync(destAudioBase, { recursive: true });
if (!fs.existsSync(destImageBase)) fs.mkdirSync(destImageBase, { recursive: true });

const albums = [];

targetFolders.forEach((folderName, index) => {
    const srcFolder = path.join(srcBase, folderName);

    // If exact name matching fails (due to unicode hyphen differences etc), fallback search
    let actualFolderName = folderName;
    if (!fs.existsSync(srcFolder)) {
        const allDirs = fs.readdirSync(srcBase, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
        const matched = allDirs.find(d => d.includes("Volume 1"));
        if (matched && folderName.includes("Volume 1")) {
            actualFolderName = matched;
        } else {
            console.warn("Folder not found:", srcFolder);
            return;
        }
    }

    const trueSrcFolder = path.join(srcBase, actualFolderName);
    const files = fs.readdirSync(trueSrcFolder);

    const mp3Files = files.filter(f => f.toLowerCase().endsWith('.mp3'));
    const imageFile = files.find(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpeg'));

    const albumId = `album-${String(index + 1).padStart(2, '0')}`;

    // Process Image
    let coverImagePath = '';
    if (imageFile) {
        const ext = path.extname(imageFile);
        const newImageName = `${albumId}-cover${ext}`;
        fs.copyFileSync(path.join(trueSrcFolder, imageFile), path.join(destImageBase, newImageName));
        coverImagePath = `/album-covers/${newImageName}`;
    }

    // Process MP3s
    const destFolder = path.join(destAudioBase, actualFolderName);
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

    const tracks = mp3Files.map((f, i) => {
        fs.copyFileSync(path.join(trueSrcFolder, f), path.join(destFolder, f));

        let cleanedTitle = f.replace(/\.mp3$/i, '').replace(/^\d+[\._-]?\s*/, '').replace(/_/g, ' ');
        return {
            id: `${albumId}-t${i + 1}`,
            title: cleanedTitle,
            url: `/mp3/${actualFolderName}/${f}`
        };
    });

    // Find TXT description
    const txtFiles = files.filter(f => f.toLowerCase().endsWith('.txt'));
    let description = 'Sacred teachings and rituals from the Himalayas.'; // Default description
    if (txtFiles.length > 0) {
        const txtSourcePath = path.join(trueSrcFolder, txtFiles[0]);
        description = fs.readFileSync(txtSourcePath, 'utf8').trim();
    }

    albums.push({
        id: albumId,
        title: actualFolderName.split(' (')[0].split(' \u2013 ')[0],
        artist: actualFolderName.includes('(') ? actualFolderName.split('(')[1].replace(')', '') : 'Traditional',
        description: description, // Added description field
        coverImage: coverImagePath, // Now properly linked
        tracks: tracks
    });
});

fs.writeFileSync(dataFile, JSON.stringify(albums, null, 4));
console.log(`Successfully built albums.json with ${albums.length} albums.`);

