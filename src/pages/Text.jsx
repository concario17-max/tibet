import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import ReadingPanel from './components/ReadingPanel';
import RightSidebar from './components/RightSidebar';
import bookData from '../data/book.json';
import { flattenVerses } from '../utils/textUtils';

const Text = () => {
    const [activeTextVerse, setActiveTextVerse] = useState(null);

    useEffect(() => {
        if (!activeTextVerse && bookData && bookData.length > 0) {
            let firstVerse = null;
            // Iterate until we find the first verse
            for (const item of bookData) {
                if (item.verses && item.verses.length > 0) {
                    firstVerse = item.verses[0];
                    break;
                } else if (item.isGroup && item.subchapters && item.subchapters.length > 0) {
                    for (const sub of item.subchapters) {
                        if (sub.verses && sub.verses.length > 0) {
                            firstVerse = sub.verses[0];
                            break;
                        }
                    }
                }
                if (firstVerse) break;
            }
            if (firstVerse) {
                setActiveTextVerse(firstVerse);
            }
        }
    }, [activeTextVerse]);

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

    if (!activeTextVerse) return null;

    return (
        <div className="flex w-full min-h-screen h-screen overflow-hidden bg-sand-primary dark:bg-dark-bg relative z-10 transition-colors duration-500 xl:bg-transparent dark:xl:bg-transparent">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[bottom_1px_center] z-[-1] transition-opacity duration-500"></div>

            <LeftSidebar onSelectVerse={setActiveTextVerse} activeVerseId={activeTextVerse.id} prayers={bookData} />
            <ReadingPanel
                key={`text-${activeTextVerse.id}`}
                verse={activeTextVerse}
                hideAudio={true}
                onPrevious={hasPrev ? () => handleNavigate('prev') : null}
                onNext={hasNext ? () => handleNavigate('next') : null}
            />
            <RightSidebar activeVerseId={activeTextVerse.id} storagePrefix="book" />
        </div>
    );
};

export default Text;
