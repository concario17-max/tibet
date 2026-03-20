import React, { useEffect, useMemo, useState } from 'react';
import { useUI } from '../../context/UIContext';
import SidebarHeader from '../../components/Sidebar/SidebarHeader';
import SidebarChapterList from '../../components/Sidebar/SidebarChapterList';
import SidebarVerseList from '../../components/Sidebar/SidebarVerseList';
import SidebarLayout from '../../components/ui/SidebarLayout';

const LeftSidebar = ({ prayers, onSelectVerse, activeVerseId, isPrayerPage = false }) => {
    const uiContext = useUI() || { isMobileSidebarOpen: false, setIsMobileSidebarOpen: () => {}, isDesktopSidebarOpen: true };
    const { isMobileSidebarOpen, setIsMobileSidebarOpen, isDesktopSidebarOpen } = uiContext;

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
        <SidebarLayout
            isOpen={isMobileSidebarOpen}
            isDesktopOpen={isDesktopSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            position="left"
            mobileWidthClass="w-80"
            desktopClassName="xl:w-full"
        >
            <div className="flex h-full flex-col">
                <SidebarHeader setIsSidebarOpen={setIsMobileSidebarOpen} />

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
                    setIsSidebarOpen={setIsMobileSidebarOpen}
                />
            </div>
        </SidebarLayout>
    );
};

export default React.memo(LeftSidebar, (previousProps, nextProps) => (
    previousProps.activeVerseId === nextProps.activeVerseId &&
    previousProps.prayers === nextProps.prayers
));
