import React from 'react';
import { motion } from 'framer-motion';

/**
 * ChapterButton - 개별 챕터 선택 버튼 (원자 컴포넌트)
 * @param {Object} chapter - 챕터 데이터
 * @param {boolean} isExpanded - 확장 여부
 * @param {function} onClick - 클릭 핸들러
 * @param {boolean} isSubchapter - 서브챕터 여부 (들여쓰기 적용)
 */
const ChapterButton = ({ chapter, isExpanded, onClick, isSubchapter = false }) => {
    return (
        <motion.button
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full flex items-start justify-between gap-2 px-3 py-2 rounded-xl text-left transition-all duration-300 ${isSubchapter ? 'pl-6' : 'pl-4'
                } ${isExpanded
                    ? 'bg-white/60 dark:bg-dark-bg/60 shadow-sm border border-gold-primary/20 text-[#1C2B36] dark:text-gold-light'
                    : 'text-[#5B7282] dark:text-dark-text-secondary hover:bg-gold-surface/40 dark:hover:bg-dark-bg/40 border border-transparent'
                }`}
        >
            <div className="flex-1 pr-2 flex flex-col gap-0">
                <span className={`leading-snug font-inter break-keep ${isExpanded ? 'font-bold text-[#1C2B36] dark:text-gold-light' : 'font-bold'
                    } ${isSubchapter ? 'text-[13px] font-medium' : 'text-[15px]'} ${chapter.chapterName.includes('몸밖에서')
                        ? 'text-gold-primary/80 dark:text-gold-light/70 text-[11px] font-bold tracking-[0.2em] rounded-lg bg-gold-surface/30 dark:bg-dark-bg/30 uppercase !py-2 !px-3 w-fit mb-1 block'
                        : ''}`}>
                    {!isSubchapter && chapter.id.startsWith('prayer-')
                        ? `${chapter.id.replace('prayer-', '')}. `
                        : ''}
                    {chapter.chapterName}
                </span>
            </div>
            <motion.span
                animate={{ opacity: isExpanded ? 1 : 0.7 }}
                className="shrink-0 mt-0 text-[#A68B5C] px-2 py-0 rounded text-xs font-bold"
            >
                {chapter.verses?.length || 0}
            </motion.span>
        </motion.button>
    );
};

export default React.memo(ChapterButton);
