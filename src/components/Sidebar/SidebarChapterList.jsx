import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChapterButton from './ChapterButton';
import ChapterGroup from './ChapterGroup';

const SidebarChapterList = ({ prayers, expandedChapter, toggleChapter, onSelectVerse }) => {
    return (
        <motion.div
            layout
            className={`flex-none overflow-y-auto border-gold-border/40 dark:border-[#222] custom-scrollbar transition-all duration-500 ease-in-out ${
                expandedChapter ? 'h-[30%] min-h-[30%] border-b shadow-sm' : 'h-full max-h-full'
            }`}
        >
            <div className="sticky top-0 z-10 hidden bg-transparent p-4 backdrop-blur-sm lg:block">
                <h2 className="pl-1 font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-text-primary/70 dark:text-dark-text-primary/60">
                    장 (Chapter)
                </h2>
            </div>

            <div className="flex flex-col gap-0 px-3 py-1">
                <AnimatePresence mode="popLayout" initial={false}>
                    {prayers?.map((prayer) => {
                        if (prayer.isGroup) {
                            return (
                                <ChapterGroup
                                    key={prayer.id}
                                    group={prayer}
                                    expandedChapter={expandedChapter}
                                    toggleChapter={toggleChapter}
                                    onSelectVerse={onSelectVerse}
                                />
                            );
                        }

                        const isExpanded = expandedChapter === prayer.id;
                        return (
                            <ChapterButton
                                key={prayer.id}
                                chapter={prayer}
                                isExpanded={isExpanded}
                                onClick={() => {
                                    toggleChapter(prayer.id);
                                    if (prayer.verses?.length > 0 && onSelectVerse) {
                                        onSelectVerse(prayer.verses[0]);
                                    }
                                }}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default React.memo(SidebarChapterList);
