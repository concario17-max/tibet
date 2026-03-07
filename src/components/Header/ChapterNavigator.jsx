import React from 'react';
import prayersData from '../../data/prayers.json';

const ChapterNavigator = ({
    capsuleRef,
    isChapterMenuOpen,
    setIsChapterMenuOpen,
    isSutraMenuOpen,
    setIsSutraMenuOpen,
    activeVerse,
    setActiveVerse
}) => {
    return (
        <div ref={capsuleRef} className="hidden sm:flex items-center bg-white dark:bg-dark-surface border border-gold-border/40 dark:border-[#333] rounded-full px-5 py-2 shadow-sm relative group">

            {/* 챕터 선택 부분 */}
            <div className="relative">
                <span
                    onClick={() => { setIsChapterMenuOpen(!isChapterMenuOpen); setIsSutraMenuOpen(false); }}
                    className="text-[12px] font-bold tracking-[0.1em] text-[#9A7B4F] uppercase mr-3 cursor-pointer hover:text-gold-primary transition-colors flex items-center"
                >
                    CHAPTER {activeVerse ? activeVerse.id.split('.')[0] : '-'}
                    <span className={`material-symbols-outlined text-[14px] align-middle ml-1 transition-transform ${isChapterMenuOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                </span>

                {/* 챕터 드롭다운 메뉴 */}
                {isChapterMenuOpen && (
                    <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-dark-surface border border-gold-border/20 dark:border-dark-border/50 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {prayersData.map((prayer) => (
                                <button
                                    key={prayer.id}
                                    onClick={() => {
                                        if (prayer.verses.length > 0) setActiveVerse(prayer.verses[0]);
                                        setIsChapterMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-xs font-bold font-inter tracking-wide transition-colors ${activeVerse?.id.startsWith(prayer.id.replace('prayer-', '')) ? 'bg-gold-surface/50 dark:bg-dark-bg/50 text-[#9A7B4F]' : 'text-text-primary dark:text-dark-text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}
                                >
                                    CH {prayer.id.replace('prayer-', '')}. {prayer.chapterName}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-[1px] h-3 bg-gold-border/30 mx-1"></div>

            {/* 수트라(구절) 선택 부분 */}
            <div className="relative">
                <span
                    onClick={() => { setIsSutraMenuOpen(!isSutraMenuOpen); setIsChapterMenuOpen(false); }}
                    className="text-[12px] font-bold tracking-[0.1em] text-text-secondary/60 dark:text-dark-text-secondary/60 uppercase ml-3 cursor-pointer hover:text-text-primary dark:hover:text-dark-text-primary transition-colors flex items-center"
                >
                    SUTRA {activeVerse ? activeVerse.id.split('.')[1] : '-'}
                    <span className={`material-symbols-outlined text-[14px] align-middle ml-1 transition-transform ${isSutraMenuOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                </span>

                {/* 수트라 드롭다운 메뉴 */}
                {isSutraMenuOpen && activeVerse && (
                    <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-dark-surface border border-gold-border/20 dark:border-dark-border/50 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {prayersData.find(p => p.id.replace('prayer-', '') === activeVerse.id.split('.')[0])?.verses.map((verse) => (
                                <button
                                    key={verse.id}
                                    onClick={() => {
                                        setActiveVerse(verse);
                                        setIsSutraMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-xs font-medium font-inter tracking-wide transition-colors truncate ${activeVerse.id === verse.id ? 'bg-gold-surface/50 dark:bg-dark-bg/50 text-[#9A7B4F] font-bold' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-black/5 dark:hover:bg-white/5'}`}
                                >
                                    {verse.id} {verse.chapterTitle || verse.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ChapterNavigator);
