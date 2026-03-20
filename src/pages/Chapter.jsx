import React, { useEffect, useMemo } from 'react';
import prayersData from '../data/prayers.json';
import { useUI } from '../context/UIContext';
import AppShell from '../components/ui/AppShell';
import { flattenVerses } from '../utils/textUtils';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';

const StatePanel = ({ kicker, title, description }) => (
    <div className="flex h-full w-full flex-1 items-center justify-center p-6 sm:p-8">
        <div className="empty-state-card max-w-lg rounded-[2rem] px-8 py-10 text-center shadow-[0_30px_70px_rgba(120,93,48,0.08)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/35 text-gold-deep shadow-inner">
                <span className="font-serif text-2xl">P</span>
            </div>
            <p className="mt-5 font-inter text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-deep/72">{kicker}</p>
            <h3 className="mt-4 font-serif text-[1.8rem] leading-tight text-text-primary">{title}</h3>
            <p className="mt-4 font-korean text-[15px] leading-[1.9] text-text-secondary/85">{description}</p>
        </div>
    </div>
);

const Chapter = () => {
    const { activeVerse, setActiveVerse, desktopGridColumns } = useUI() || {};
    const flatVerses = useMemo(() => flattenVerses(prayersData), []);

    useEffect(() => {
        if (!setActiveVerse || flatVerses.length === 0) return;

        const hasValidActiveVerse = activeVerse && flatVerses.some((verse) => verse.id === activeVerse.id);
        if (!hasValidActiveVerse) {
            setActiveVerse(flatVerses[0]);
        }
    }, [activeVerse, flatVerses, setActiveVerse]);

    const handleNavigate = (direction) => {
        if (!activeVerse || !setActiveVerse) return;
        const currentIndex = flatVerses.findIndex((verse) => verse.id === activeVerse.id);
        if (currentIndex === -1) return;

        if (direction === 'prev' && currentIndex > 0) {
            setActiveVerse(flatVerses[currentIndex - 1]);
        } else if (direction === 'next' && currentIndex < flatVerses.length - 1) {
            setActiveVerse(flatVerses[currentIndex + 1]);
        }
    };

    const currentIndex = activeVerse ? flatVerses.findIndex((verse) => verse.id === activeVerse.id) : -1;
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex !== -1 && currentIndex < flatVerses.length - 1;

    return (
        <AppShell
            sidebar={<LeftSidebar onSelectVerse={setActiveVerse} activeVerseId={activeVerse?.id} prayers={prayersData} isPrayerPage />}
            rightPanel={<RightSidebar activeVerseId={activeVerse?.id} storagePrefix="prayer" />}
            desktopGridColumns={desktopGridColumns}
        >
            {activeVerse ? (
                <ReadingPanel
                    key={activeVerse.id}
                    verse={activeVerse}
                    globalIndex={currentIndex + 1}
                    hideAudio={false}
                    onPrevious={hasPrev ? () => handleNavigate('prev') : null}
                    onNext={hasNext ? () => handleNavigate('next') : null}
                />
            ) : (
                <StatePanel
                    kicker="Select A Prayer"
                    title="Choose a prayer to begin"
                    description="Open a chapter from the left panel to start reading, then move through the prayers one verse at a time."
                />
            )}
        </AppShell>
    );
};

export default Chapter;
