import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';
import prayersData from '../data/prayers.json';
import { useUI } from '../context/UIContext';

const Chapter = () => {
    // Default to Prayer 3 - Verse 1, since it has audio
    const [selectedVerse, setSelectedVerse] = useState(prayersData[2].verses[0]);
    const { setActiveVerse } = useUI() || {};

    // Sync local verse to global UI context for Header
    useEffect(() => {
        if (setActiveVerse) {
            setActiveVerse(selectedVerse);
        }
    }, [selectedVerse, setActiveVerse]);

    return (
        <div className="flex w-full min-h-screen h-screen overflow-hidden bg-sand-primary relative z-10 transition-colors duration-500 xl:bg-transparent dark:xl:bg-transparent">
            {/* 배경 그라데이션 (Gita 스타일 이식) */}
            <div className="fixed inset-0 pointer-events-none bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[bottom_1px_center] z-[-1] transition-opacity duration-500"></div>

            <LeftSidebar onSelectVerse={setSelectedVerse} activeVerseId={selectedVerse.id} prayers={prayersData} />
            <ReadingPanel key={selectedVerse.id} verse={selectedVerse} />
            <RightSidebar activeVerseId={selectedVerse.id} />
        </div>
    );
};

export default Chapter;
