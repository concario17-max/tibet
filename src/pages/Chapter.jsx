import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';
import prayersData from '../data/prayers.json';
import { useUI } from '../context/UIContext';
import { flattenVerses } from '../utils/textUtils';

const Chapter = () => {
    const { activeVerse, setActiveVerse } = useUI() || {};

    // 사용자가 직접 챕터를 선택하기 전까지는 activeVerse를 null로 유지 (Awwwards급 빈 화면 연출)

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

    // 빈 상태 (Empty State) UI 컴포넌트 메타 디자인 적용
    const EmptyState = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-transparent transition-all duration-700 h-full w-full">
            <div className="max-w-md w-full text-center space-y-6 opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards]">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-surface/30 dark:bg-dark-surface/50 border border-gold-border/30 dark:border-dark-border/40 flex items-center justify-center backdrop-blur-md shadow-inner transition-transform hover:scale-105">
                    <svg className="w-8 h-8 text-gold-primary/70 dark:text-gold-light/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-crimson font-bold text-text-primary dark:text-dark-text-primary tracking-wide">
                        원하시는 장을 선택해주세요
                    </h3>
                    <p className="text-sm text-text-secondary/80 dark:text-dark-text-secondary/80 font-inter leading-relaxed max-w-sm mx-auto">
                        좌측 메뉴에서 챕터를 선택하시면<br />해당 구절의 상세 내용을 확인하실 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex w-full min-h-screen h-screen lg:h-[100dvh] overflow-hidden bg-sand-primary dark:bg-dark-bg relative z-10 transition-colors duration-500 xl:bg-transparent dark:xl:bg-transparent">
            {/* 배경 그라데이션 (Gita 스타일 이식) */}
            <div className="fixed inset-0 pointer-events-none bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[bottom_1px_center] z-[-1] transition-opacity duration-500"></div>

            <LeftSidebar onSelectVerse={setActiveVerse} activeVerseId={activeVerse?.id} prayers={prayersData} isPrayerPage={true} />

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
                <EmptyState />
            )}
        </div>
    );
};

export default Chapter;
