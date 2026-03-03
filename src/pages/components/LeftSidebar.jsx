import React, { useState } from 'react';

const LeftSidebar = ({ onSelectVerse, activeVerseId, prayers }) => {
    const [openChapter, setOpenChapter] = useState('prayer-3');

    const activePrayer = prayers?.find(p => p.id === openChapter);

    const formatChapterName = (name) => {
        if (name.includes('몸인 스승')) return name.replace('몸인 스승', '몸인\n스승');
        if (name.includes('보살들께 도움')) return name.replace('보살들께 도움', '보살들께\n도움');
        if (name.includes('곤경에서 구원')) return name.replace('곤경에서 구원', '곤경에서\n구원');
        if (name.includes('두려움으로부터 구원')) return name.replace('두려움으로부터 구원', '두려움으로부터\n구원');
        if (name.includes('전에 드리는')) return name.replace('전에 드리는', '전에\n드리는');
        return name;
    };

    return (
        <aside className="w-[330px] flex-shrink-0 h-[calc(100vh-80px)] border-r border-sand-tertiary bg-sand-primary px-6 py-8 hidden lg:flex flex-col sticky top-20">
            <h3 className="flex-shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-muted mb-6">Chapters</h3>
            <ul className="flex-shrink-0 space-y-1">
                {prayers && prayers.map((prayer, pIndex) => (
                    <li key={prayer.id} className="relative">
                        <div
                            className={`cursor-pointer rounded-xl py-1.5 px-3 transition-colors flex justify-between items-start ${openChapter === prayer.id ? 'border border-sand-tertiary bg-white shadow-sm' : 'hover:bg-sand-secondary/50 text-charcoal-muted'}`}
                            onClick={() => setOpenChapter(openChapter === prayer.id ? null : prayer.id)}
                        >
                            <div className="flex-1 mt-0.5">
                                <h4 className={`text-[14px] font-sans font-semibold tracking-tight whitespace-pre-line leading-relaxed ${openChapter === prayer.id ? 'text-charcoal-main' : ''}`}>
                                    {pIndex + 1}. {formatChapterName(prayer.chapterName)}
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
                <div className="mt-6 pt-4 border-t border-sand-tertiary flex-1 overflow-y-auto scrollbar-hide pb-2">
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
