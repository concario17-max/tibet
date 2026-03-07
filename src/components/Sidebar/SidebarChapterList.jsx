import React from 'react';

const SidebarChapterList = ({ prayers, expandedChapter, toggleChapter, onSelectVerse }) => {
    return (
        <div className={`flex-none overflow-y-auto border-gold-border/40 dark:border-[#222] custom-scrollbar transition-all duration-500 ease-in-out ${expandedChapter ? 'max-h-[45%] border-b shadow-sm' : 'max-h-full h-full'}`}>
            <div className="p-4 bg-transparent sticky top-0 z-10 backdrop-blur-sm hidden lg:block">
                <h2 className="text-[11px] font-bold font-inter tracking-[0.2em] uppercase text-text-primary/70 dark:text-dark-text-primary/60 pl-1">
                    장 (Chapter)
                </h2>
            </div>
            <div className="py-1 px-3 flex flex-col gap-0">
                {prayers && prayers.map((prayer) => {
                    if (prayer.isGroup) {
                        return (
                            <div key={prayer.id} className="mb-1">
                                <div className="px-3 py-1.5 text-text-secondary dark:text-dark-text-secondary text-[14px] font-bold tracking-tight rounded-lg bg-gold-surface/20 dark:bg-dark-bg/20 uppercase">
                                    {prayer.chapterName}
                                </div>
                                <div className="mt-0 flex flex-col gap-0">
                                    {prayer.subchapters.map(subGroup => {
                                        const uniqueId = `${prayer.id}-${subGroup.id}`;
                                        const isExpanded = expandedChapter === uniqueId;
                                        return (
                                            <button
                                                key={subGroup.id}
                                                onClick={() => {
                                                    toggleChapter(uniqueId);
                                                    if (subGroup.verses && subGroup.verses.length > 0) {
                                                        if (onSelectVerse) onSelectVerse(subGroup.verses[0]);
                                                    }
                                                }}
                                                className={`w-full flex items-start justify-between gap-2 px-3 py-1.5 rounded-xl text-left transition-colors pl-6 ${isExpanded
                                                    ? 'bg-white/60 dark:bg-dark-bg/60 shadow-sm border border-gold-primary/20 text-[#1C2B36] dark:text-gold-light'
                                                    : 'text-[#5B7282] dark:text-dark-text-secondary hover:bg-gold-surface/40 dark:hover:bg-dark-bg/40 border border-transparent'
                                                    }`}
                                            >
                                                <div className="flex-1 pr-2 flex flex-col gap-0">
                                                    <span className={`text-[13px] leading-snug font-inter break-keep ${isExpanded ? 'font-bold text-[#1C2B36]' : 'font-medium'}`}>
                                                        {subGroup.chapterName}
                                                    </span>
                                                </div>
                                                <span className={`shrink-0 mt-0 text-[#A68B5C] px-2 py-0 rounded text-[10px] font-bold ${isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                                                    {subGroup.verses.length}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    }

                    const isExpanded = expandedChapter === prayer.id;
                    return (
                        <button
                            key={prayer.id}
                            onClick={() => {
                                toggleChapter(prayer.id);
                                if (prayer.verses && prayer.verses.length > 0) {
                                    if (onSelectVerse) onSelectVerse(prayer.verses[0]);
                                }
                            }}
                            className={`w-full flex items-start justify-between gap-2 px-3 py-2 rounded-xl text-left transition-colors ${isExpanded
                                ? 'bg-white/60 dark:bg-dark-bg/60 shadow-sm border border-gold-primary/20 text-[#1C2B36] dark:text-gold-light'
                                : 'text-[#5B7282] dark:text-dark-text-secondary hover:bg-gold-surface/40 dark:hover:bg-dark-bg/40 border border-transparent'
                                }`}
                        >
                            <div className="flex-1 pr-2 flex flex-col gap-0">
                                <span className={`text-[15px] leading-snug font-inter break-keep pl-1 ${isExpanded ? 'font-bold text-[#1C2B36]' : 'font-bold'}`}>
                                    {prayer.id.startsWith('prayer-') ? `${prayer.id.replace('prayer-', '')}. ` : ''}{prayer.chapterName}
                                </span>
                            </div>
                            <span className={`shrink-0 mt-0 text-[#A68B5C] px-2 py-0 rounded text-xs font-bold ${isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                                {prayer.verses.length}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(SidebarChapterList);
