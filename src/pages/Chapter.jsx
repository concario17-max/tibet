import React, { useMemo } from 'react';
import prayersData from '../data/prayers.json';
import { useUI } from '../context/UIContext';
import { flattenVerses } from '../utils/textUtils';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';

const StatePanel = ({ kicker, title, description }) => (
    <div className="flex h-full w-full flex-1 items-center justify-center p-6 sm:p-8">
        <div className="empty-state-card max-w-lg rounded-[2rem] px-8 py-10 text-center shadow-[0_30px_70px_rgba(120,93,48,0.08)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/35 text-gold-deep shadow-inner">
                <span className="font-serif text-2xl">༄</span>
            </div>
            <p className="mt-5 font-inter text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-deep/72">{kicker}</p>
            <h3 className="mt-4 font-serif text-[1.8rem] leading-tight text-text-primary">{title}</h3>
            <p className="mt-4 font-korean text-[15px] leading-[1.9] text-text-secondary/85">{description}</p>
        </div>
    </div>
);

const Chapter = () => {
    const { activeVerse, setActiveVerse } = useUI() || {};
    const flatVerses = useMemo(() => flattenVerses(prayersData), []);

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
        <div className="relative z-10 flex h-screen min-h-screen w-full overflow-hidden bg-sand-primary transition-colors duration-500 dark:bg-dark-bg xl:bg-transparent dark:xl:bg-transparent lg:h-[100dvh]">
            <div className="fixed inset-0 pointer-events-none bg-grid-slate-900/[0.04] bg-[bottom_1px_center] transition-opacity duration-500 dark:bg-grid-slate-100/[0.03] z-[-1]" />

            <LeftSidebar onSelectVerse={setActiveVerse} activeVerseId={activeVerse?.id} prayers={prayersData} isPrayerPage />

            {activeVerse ? (
                <>
                    <ReadingPanel
                        key={activeVerse.id}
                        verse={activeVerse}
                        globalIndex={currentIndex + 1}
                        hideAudio={false}
                        onPrevious={hasPrev ? () => handleNavigate('prev') : null}
                        onNext={hasNext ? () => handleNavigate('next') : null}
                    />
                    <RightSidebar activeVerseId={activeVerse.id} storagePrefix="prayer" />
                </>
            ) : (
                <StatePanel
                    kicker="Select A Prayer"
                    title="읽고 싶은 기도문을 선택해 주세요"
                    description="왼쪽 메뉴에서 장과 구절을 고르면 티베트어 원문, 번역, 발음, 오디오가 함께 열립니다."
                />
            )}
        </div>
    );
};

export default Chapter;
