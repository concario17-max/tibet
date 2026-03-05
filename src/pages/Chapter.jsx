import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';
import prayersData from '../data/prayers.json';
import { useUI } from '../context/UIContext';
import { flattenVerses } from '../utils/textUtils';

const Chapter = () => {
    const { activeVerse, setActiveVerse } = useUI() || {};

    // Defaults to Prayer 1 - Verse 1. If global activeVerse is unset, set it initially.
    useEffect(() => {
        if (!activeVerse && setActiveVerse) {
            setActiveVerse(prayersData[0].verses[0]);
        }
    }, [activeVerse, setActiveVerse]);

    const flatVerses = React.useMemo(() => flattenVerses(prayersData), []);

    const handleNavigate = (direction) => {
        if (!activeVerse || !setActiveVerse) return;
        const currentIndex = flatVerses.findIndex(v => v.id === activeVerse.id);
        if (currentIndex === -1) return;

        if (direction === 'prev' && currentIndex > 0) {
            setActiveVerse(flatVerses[currentIndex - 1]);
        } else if (direction === 'next' && currentIndex < flatVerses.length - 1) {
            setActiveVerse(flatVerses[currentIndex + 1]);
        }
    };

    const currentIndex = activeVerse ? flatVerses.findIndex(v => v.id === activeVerse.id) : -1;
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex !== -1 && currentIndex < flatVerses.length - 1;

    if (!activeVerse) return null;

    return (
        <div className="flex w-full min-h-screen h-screen overflow-hidden bg-sand-primary dark:bg-dark-bg relative z-10 transition-colors duration-500 xl:bg-transparent dark:xl:bg-transparent">
            {/* 배경 그라데이션 (Gita 스타일 이식) */}
            <div className="fixed inset-0 pointer-events-none bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[bottom_1px_center] z-[-1] transition-opacity duration-500"></div>

            <LeftSidebar onSelectVerse={setActiveVerse} activeVerseId={activeVerse.id} prayers={prayersData} />
            <ReadingPanel
                key={activeVerse.id}
                verse={activeVerse}
                hideAudio={false}
                onPrevious={hasPrev ? () => handleNavigate('prev') : null}
                onNext={hasNext ? () => handleNavigate('next') : null}
            />
            <RightSidebar activeVerseId={activeVerse.id} storagePrefix="prayer" />
        </div>
    );
};

export default Chapter;
