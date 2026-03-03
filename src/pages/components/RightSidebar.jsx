import React from 'react';

const RightSidebar = () => {
    return (
        <aside className="w-80 flex-shrink-0 h-screen overflow-y-auto border-l border-sand-tertiary bg-white px-6 pt-24 hidden xl:block sticky top-0">
            <h3 className="serif-title text-xl text-charcoal-main mb-6">Reflections</h3>

            <div className="mb-8 relative">
                <textarea
                    className="w-full bg-sand-secondary/50 border border-sand-tertiary rounded-lg p-4 text-sm text-charcoal-main placeholder:text-charcoal-muted focus:ring-1 focus:ring-gold-primary focus:border-gold-primary outline-none transition-colors resize-none h-32"
                    placeholder="Record your insights from this verse..."
                ></textarea>
                <button className="absolute bottom-3 right-3 text-xs font-bold uppercase tracking-widest text-white bg-charcoal-main hover:bg-gold-primary transition-colors px-4 py-1.5 rounded">
                    Save
                </button>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-muted">Recent Notes</h4>
                <button className="text-[10px] uppercase font-bold text-gold-primary hover:text-charcoal-main transition-colors">View All &rarr;</button>
            </div>

            <div className="space-y-4">
                <div className="p-4 border border-sand-tertiary rounded bg-sand-primary/30 hover:bg-sand-primary transition-colors cursor-pointer">
                    <p className="text-xs text-charcoal-muted mb-2">Verse 1.1</p>
                    <p className="text-sm text-charcoal-main line-clamp-3 leading-relaxed">The concept of the bardo is essentially a transitional state. It feels like this verse is preparing the mind for dissolution.</p>
                    <p className="text-[10px] text-charcoal-muted mt-3">2 hours ago</p>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
