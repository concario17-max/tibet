import React from 'react';

const LeftSidebar = () => {
    return (
        <aside className="w-64 flex-shrink-0 h-[calc(100vh-80px)] overflow-y-auto border-r border-sand-tertiary bg-sand-primary px-6 py-8 hidden lg:block sticky top-20">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-muted mb-8">Chapters</h3>
            <ul className="space-y-4">
                <li className="text-sm font-medium text-charcoal-main hover:text-gold-primary cursor-pointer transition-colors relative pl-3">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold-primary"></span>
                    Chapter 1: Chikhai Bardo
                    <ul className="mt-3 ml-2 space-y-3 border-l border-sand-tertiary pl-4">
                        <li className="text-xs text-charcoal-muted hover:text-gold-primary cursor-pointer transition-colors">Verse 1.1: The Primary Light</li>
                        <li className="text-xs text-charcoal-muted hover:text-gold-primary cursor-pointer transition-colors">Verse 1.2: The Secondary Light</li>
                        <li className="text-xs text-charcoal-muted hover:text-gold-primary cursor-pointer transition-colors">Verse 1.3: The Fall</li>
                    </ul>
                </li>
                <li className="text-sm font-medium text-charcoal-muted hover:text-gold-primary cursor-pointer transition-colors pl-3">Chapter 2: Chonyid Bardo</li>
                <li className="text-sm font-medium text-charcoal-muted hover:text-gold-primary cursor-pointer transition-colors pl-3">Chapter 3: Sidpa Bardo</li>
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
