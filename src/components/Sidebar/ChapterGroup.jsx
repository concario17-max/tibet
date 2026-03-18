import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChapterButton from './ChapterButton';

const ChapterGroup = ({ group, expandedChapter, toggleChapter, onSelectVerse }) => {
    return (
        <motion.div layout className="mb-1">
            <div className="mb-1 rounded-lg bg-gold-surface/30 px-3 py-2 font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-gold-primary/80 dark:bg-dark-bg/30 dark:text-gold-light/70">
                {group.chapterName}
            </div>

            <div className="flex flex-col gap-0">
                <AnimatePresence mode="popLayout">
                    {group.subchapters.map((subGroup) => {
                        const uniqueId = `${group.id}-${subGroup.id}`;
                        const isExpanded = expandedChapter === uniqueId;

                        return (
                            <ChapterButton
                                key={subGroup.id}
                                chapter={subGroup}
                                isExpanded={isExpanded}
                                isSubchapter
                                onClick={() => {
                                    toggleChapter(uniqueId);
                                    if (subGroup.verses?.length > 0 && onSelectVerse) {
                                        onSelectVerse(subGroup.verses[0]);
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

export default React.memo(ChapterGroup);
