import React, { useState } from 'react';

const LeftSidebar = ({ onSelectVerse, activeVerseId, prayers }) => {
    const [openChapter, setOpenChapter] = useState('prayer-3');

    const activePrayer = prayers?.find(p => p.id === openChapter);

    return (
        <aside className="w-[300px] flex-shrink-0 h-screen border-r border-sand-tertiary bg-sand-primary px-6 pt-24 hidden lg:flex flex-col sticky top-0">
            <h3 className="flex-shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-muted mb-6">Chapters</h3>
            <ul className="flex-shrink-0 space-y-1">
                {prayers && prayers.map((prayer, pIndex) => (
                    <li key={prayer.id} className="relative">
                        <div
                            className={`cursor-pointer rounded-xl py-1.5 px-3 transition-colors flex justify-between items-start ${openChapter === prayer.id ? 'border border-sand-tertiary bg-white shadow-sm' : 'hover:bg-sand-secondary/50 text-charcoal-muted'}`}
                            onClick={() => setOpenChapter(openChapter === prayer.id ? null : prayer.id)}
                        >
                            <div className="flex-1 mt-0.5">
                                <h4 className={`text-[14px] font-sans font-semibold tracking-tight leading-relaxed break-keep pr-2 ${openChapter === prayer.id ? 'text-charcoal-main' : ''}`}>
                                    {pIndex + 1}. {prayer.chapterName}
                                </h4>
                            </div>
                            <span className="text-[11px] font-bold text-gold-dim pt-1 ml-3">
                                {prayer.verses.length}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            {activePrayer && activePrayer.verses.length > 0 && (
                <div className="mt-6 pt-4 border-t border-sand-tertiary flex-1 overflow-y-auto scrollbar-hide mask-image-bottom">
                    <ul className="space-y-1">
                        {activePrayer.verses.map(v => (
                            <li
                                key={v.id}
                                className={`cursor-pointer transition-colors p-4 rounded-xl text-[13px] flex items-start gap-4 ${activeVerseId === v.id ? 'border border-sand-tertiary bg-white shadow-sm font-medium' : 'hover:bg-sand-secondary/50 text-charcoal-muted'}`}
                                onClick={() => onSelectVerse(v)}
                            >
                                <span className="font-bold text-gold-dim min-w-[30px]">{v.id}</span>
                                <span className={`leading-relaxed ${activeVerseId === v.id ? 'text-charcoal-main' : ''} truncate block w-full`}>{v.title.replace(v.id + ' ', '')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </aside>
    );
};

export default LeftSidebar;
