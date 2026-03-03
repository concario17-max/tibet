import React, { useState } from 'react';

const LeftSidebar = ({ onSelectVerse, activeVerseId, prayers }) => {
    const [openChapter, setOpenChapter] = useState('prayer-3');

    return (
        <aside className="w-64 flex-shrink-0 h-[calc(100vh-80px)] overflow-y-auto border-r border-sand-tertiary bg-sand-primary px-6 py-8 hidden lg:block sticky top-20 scrollbar-hide">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-muted mb-8">Chapters</h3>
            <ul className="space-y-4">
                {prayers && prayers.map((prayer) => (
                    <li key={prayer.id} className="text-sm font-medium text-charcoal-main hover:text-gold-primary transition-colors relative pl-3">
                        {openChapter === prayer.id && <span className="absolute left-0 top-3 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold-primary"></span>}
                        <div className="cursor-pointer" onClick={() => setOpenChapter(openChapter === prayer.id ? null : prayer.id)}>
                            {prayer.chapterName}
                        </div>
                        {openChapter === prayer.id && prayer.verses.length > 0 && (
                            <ul className="mt-3 ml-2 space-y-3 border-l border-sand-tertiary pl-4">
                                {prayer.verses.map(v => (
                                    <li
                                        key={v.id}
                                        className={`text-[11px] leading-relaxed cursor-pointer transition-colors ${activeVerseId === v.id ? 'text-gold-primary font-bold' : 'text-charcoal-muted hover:text-gold-primary'}`}
                                        onClick={() => onSelectVerse(v)}
                                    >
                                        {v.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-muted mt-12 mb-6">Study Guides</h3>
            <ul className="space-y-4">
                <li className="text-sm font-medium text-charcoal-muted hover:text-gold-primary cursor-pointer transition-colors pl-3">Lexicon of Afterlife</li>
                <li className="text-sm font-medium text-charcoal-muted hover:text-gold-primary cursor-pointer transition-colors pl-3">Meditation Forms</li>
            </ul>
        </aside>
    );
};

export default LeftSidebar;
