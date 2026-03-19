import React, { useEffect, useMemo, useState } from 'react';
import bookDataUrl from '../data/book.json?url';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';
import { flattenVerses } from '../utils/textUtils';

const StatePanel = ({ kicker, title, description }) => (
    <div className="flex h-full w-full flex-1 items-center justify-center p-6 sm:p-8">
        <div className="empty-state-card max-w-lg rounded-[2rem] px-8 py-10 text-center shadow-[0_30px_70px_rgba(120,93,48,0.08)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/35 text-gold-deep shadow-inner">
                <span className="font-serif text-2xl">✦</span>
            </div>
            <p className="mt-5 font-inter text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-deep/72">{kicker}</p>
            <h3 className="mt-4 font-serif text-[1.8rem] leading-tight text-text-primary">{title}</h3>
            <p className="mt-4 font-korean text-[15px] leading-[1.9] text-text-secondary/85">{description}</p>
        </div>
    </div>
);

const Text = () => {
    const [bookData, setBookData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTextVerse, setActiveTextVerse] = useState(() => {
        try {
            const saved = localStorage.getItem('tibet_active_text_verse');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    useEffect(() => {
        let isMounted = true;

        const loadBook = async () => {
            try {
                const response = await fetch(bookDataUrl);
                const data = await response.json();
                if (!isMounted) return;
                setBookData(data);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadBook();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (activeTextVerse === undefined) return;
        localStorage.setItem('tibet_active_text_verse', JSON.stringify(activeTextVerse));
    }, [activeTextVerse]);

    const flatVerses = useMemo(() => flattenVerses(bookData), [bookData]);

    useEffect(() => {
        if (isLoading || flatVerses.length === 0) return;

        const hasValidActiveVerse = activeTextVerse && flatVerses.some((verse) => verse.id === activeTextVerse.id);
        if (!hasValidActiveVerse) {
            setActiveTextVerse(flatVerses[0]);
        }
    }, [activeTextVerse, flatVerses, isLoading]);

    const handleNavigate = (direction) => {
        if (!activeTextVerse) return;
        const currentIndex = flatVerses.findIndex((verse) => verse.id === activeTextVerse.id);
        if (currentIndex === -1) return;

        if (direction === 'prev' && currentIndex > 0) {
            setActiveTextVerse(flatVerses[currentIndex - 1]);
        } else if (direction === 'next' && currentIndex < flatVerses.length - 1) {
            setActiveTextVerse(flatVerses[currentIndex + 1]);
        }
    };

    const currentIndex = activeTextVerse ? flatVerses.findIndex((verse) => verse.id === activeTextVerse.id) : -1;
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex !== -1 && currentIndex < flatVerses.length - 1;

    return (
        <div className="relative z-10 flex h-screen min-h-screen w-full overflow-hidden bg-sand-primary transition-colors duration-500 dark:bg-dark-bg xl:bg-transparent dark:xl:bg-transparent">
            <div className="fixed inset-0 pointer-events-none bg-grid-slate-900/[0.04] bg-[bottom_1px_center] transition-opacity duration-500 dark:bg-grid-slate-100/[0.03] z-[-1]" />

            <LeftSidebar onSelectVerse={setActiveTextVerse} activeVerseId={activeTextVerse?.id} prayers={bookData} isPrayerPage={false} />

            {isLoading ? (
                <StatePanel
                    kicker="Loading Text"
                    title="본문을 준비하고 있습니다"
                    description="긴 읽기 흐름을 위해 본문 데이터와 번역을 차분히 불러오고 있습니다."
                />
            ) : activeTextVerse ? (
                <>
                    <ReadingPanel
                        key={`text-${activeTextVerse.id}`}
                        verse={activeTextVerse}
                        globalIndex={currentIndex + 1}
                        hideAudio={true}
                        onPrevious={hasPrev ? () => handleNavigate('prev') : null}
                        onNext={hasNext ? () => handleNavigate('next') : null}
                    />
                    <RightSidebar activeVerseId={activeTextVerse.id} storagePrefix="book" />
                </>
            ) : (
                <StatePanel
                    kicker="Select A Passage"
                    title="읽고 싶은 구절을 선택해 주세요"
                    description="왼쪽 메뉴에서 장과 구절을 고르면 본문, 번역, 메모 영역이 하나의 호흡으로 열립니다."
                />
            )}
        </div>
    );
};

export default Text;
