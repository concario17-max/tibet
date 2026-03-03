import React, { useState } from 'react';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';
import prayersData from '../data/prayers.json';

const Chapter = () => {
    // Default to Prayer 3 - Verse 1, since it has audio
    const [selectedVerse, setSelectedVerse] = useState(prayersData[2].verses[0]);

    return (
        <div className="flex w-full min-h-screen h-screen overflow-hidden bg-sand-primary relative z-10">
            <LeftSidebar onSelectVerse={setSelectedVerse} activeVerseId={selectedVerse.id} prayers={prayersData} />
            <ReadingPanel key={selectedVerse.id} verse={selectedVerse} />
            <RightSidebar />
        </div>
    );
};

export default Chapter;
