import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';
import bookData from '../data/book.json';
import { flattenVerses } from '../utils/textUtils';

const Text = () => {
    const [activeTextVerse, setActiveTextVerse] = useState(() => {
        try {
            const saved = localStorage.getItem('tibet_active_text_verse');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    // activeTextVerse 변경 시 localStorage 동기화
    useEffect(() => {
        if (activeTextVerse === undefined) return;
        localStorage.setItem('tibet_active_text_verse', JSON.stringify(activeTextVerse));
    }, [activeTextVerse]);

    // 강제 구절 선택 로직 제거, 유저가 직접 선택하도록 유도 (Meta-Design)

    const flatVerses = React.useMemo(() => flattenVerses(bookData), []);

    const handleNavigate = (direction) => {
        if (!activeTextVerse) return;
        const currentIndex = flatVerses.findIndex(v => v.id === activeTextVerse.id);
        if (currentIndex === -1) return;

        if (direction === 'prev' && currentIndex > 0) {
            setActiveTextVerse(flatVerses[currentIndex - 1]);
        } else if (direction === 'next' && currentIndex < flatVerses.length - 1) {
            setActiveTextVerse(flatVerses[currentIndex + 1]);
        }
    };

    const currentIndex = activeTextVerse ? flatVerses.findIndex(v => v.id === activeTextVerse.id) : -1;
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex !== -1 && currentIndex < flatVerses.length - 1;

    // 빈 상태 (Empty State) 컴포넌트
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
        <div className="flex w-full min-h-screen h-screen overflow-hidden bg-sand-primary dark:bg-dark-bg relative z-10 transition-colors duration-500 xl:bg-transparent dark:xl:bg-transparent">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[bottom_1px_center] z-[-1] transition-opacity duration-500"></div>

            <LeftSidebar onSelectVerse={setActiveTextVerse} activeVerseId={activeTextVerse?.id} prayers={bookData} />

            {activeTextVerse ? (
                <>
                    <ReadingPanel
                        key={`text-${activeTextVerse.id}`}
                        verse={activeTextVerse}
                        hideAudio={true}
                        onPrevious={hasPrev ? () => handleNavigate('prev') : null}
                        onNext={hasNext ? () => handleNavigate('next') : null}
                    />
                    <RightSidebar activeVerseId={activeTextVerse.id} storagePrefix="book" />
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
};

export default Text;
