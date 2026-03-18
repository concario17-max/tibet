import React, { useEffect, useMemo, useState } from 'react';
import { useUI } from '../../context/UIContext';
import SidebarHeader from '../../components/Sidebar/SidebarHeader';
import SidebarChapterList from '../../components/Sidebar/SidebarChapterList';
import SidebarVerseList from '../../components/Sidebar/SidebarVerseList';

const LeftSidebar = ({ prayers, onSelectVerse, activeVerseId, isPrayerPage = false }) => {
    const uiContext = useUI() || { isSidebarOpen: true, setIsSidebarOpen: () => {} };
    const { isSidebarOpen, setIsSidebarOpen } = uiContext;

    const verseGlobalIndices = useMemo(() => {
        const map = {};
        let count = 1;

        prayers?.forEach((chapter) => {
            if (isPrayerPage) count = 1;

            if (chapter.isGroup && chapter.subchapters) {
                chapter.subchapters.forEach((subchapter) => {
                    if (isPrayerPage) count = 1;
                    subchapter.verses?.forEach((verse) => {
                        map[verse.id] = count;
                        count += 1;
                    });
                });
            } else {
                chapter.verses?.forEach((verse) => {
                    map[verse.id] = count;
                    count += 1;
                });
            }
        });

        return map;
    }, [isPrayerPage, prayers]);

    const [expandedChapter, setExpandedChapter] = useState(() => {
        if (!activeVerseId || !prayers) return null;

        for (const prayer of prayers) {
            if (prayer.isGroup && prayer.subchapters) {
                const subchapter = prayer.subchapters.find((chapter) => chapter.verses?.some((verse) => verse.id === activeVerseId));
                if (subchapter) return `${prayer.id}-${subchapter.id}`;
            } else if (prayer.verses?.some((verse) => verse.id === activeVerseId)) {
                return prayer.id;
            }
        }

        return null;
    });

    useEffect(() => {
        if (!activeVerseId || !prayers) return;

        let targetChapterId = null;
        for (const prayer of prayers) {
            if (prayer.isGroup && prayer.subchapters) {
                const subchapter = prayer.subchapters.find((chapter) => chapter.verses?.some((verse) => verse.id === activeVerseId));
                if (subchapter) {
                    targetChapterId = `${prayer.id}-${subchapter.id}`;
                    break;
                }
            } else if (prayer.verses?.some((verse) => verse.id === activeVerseId)) {
                targetChapterId = prayer.id;
                break;
            }
        }

        if (targetChapterId && targetChapterId !== expandedChapter) {
            setExpandedChapter(targetChapterId);
        }
    }, [activeVerseId, expandedChapter, prayers]);

    return (
        <>
            {isSidebarOpen ? (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm opacity-100 transition-opacity duration-300 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            ) : null}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-full w-80 flex-col bg-white/80 font-inter backdrop-blur-xl transition-transform duration-500 dark:bg-dark-bg/95 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : '-translate-x-full'
                } border-r border-gold-primary/20 dark:border-dark-border/50`}
            >
                <SidebarHeader setIsSidebarOpen={setIsSidebarOpen} />

                <SidebarChapterList
                    prayers={prayers}
                    expandedChapter={expandedChapter}
                    toggleChapter={(chapterId) => setExpandedChapter((current) => (current === chapterId ? null : chapterId))}
                    onSelectVerse={onSelectVerse}
                />

                <SidebarVerseList
                    prayers={prayers}
                    expandedChapter={expandedChapter}
                    activeVerseId={activeVerseId}
                    verseGlobalIndices={verseGlobalIndices}
                    onSelectVerse={onSelectVerse}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </aside>
        </>
    );
};

export default React.memo(LeftSidebar, (previousProps, nextProps) => (
    previousProps.activeVerseId === nextProps.activeVerseId &&
    previousProps.prayers === nextProps.prayers
));
