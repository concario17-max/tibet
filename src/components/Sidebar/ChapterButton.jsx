import React from 'react';
import { motion } from 'framer-motion';

const ChapterButton = ({ chapter, isExpanded, onClick, isSubchapter = false }) => {
    return (
        <motion.button
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full items-start justify-between gap-2 rounded-xl px-3 py-1.5 text-left transition-all duration-300 ${
                isSubchapter ? 'pl-6' : 'pl-4'
            } ${
                isExpanded
                    ? 'border border-gold-primary/20 bg-white/60 text-[#1C2B36] shadow-sm dark:bg-dark-bg/60 dark:text-gold-light'
                    : 'border border-transparent text-[#5B7282] hover:bg-gold-surface/40 dark:text-dark-text-secondary dark:hover:bg-dark-bg/40'
            }`}
        >
            <div className="flex flex-1 flex-col gap-0 pr-2">
                <span
                    className={`break-keep font-inter text-[11px] font-bold leading-snug ${
                        isExpanded ? 'text-[#1C2B36] dark:text-gold-light' : ''
                    } ${isSubchapter ? 'font-medium tracking-wide' : 'tracking-tight'}`}
                >
                    {!isSubchapter && chapter.id.startsWith('prayer-') ? `${chapter.id.replace('prayer-', '')}. ` : ''}
                    {chapter.chapterName}
                </span>
            </div>
            <motion.span animate={{ opacity: isExpanded ? 1 : 0.7 }} className="mt-0 shrink-0 rounded px-2 py-0 text-xs font-bold text-[#A68B5C]">
                {chapter.verses?.length || 0}
            </motion.span>
        </motion.button>
    );
};

export default React.memo(ChapterButton);
