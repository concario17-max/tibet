import React from 'react';

const Text = () => {
    return (
        <div className="flex w-full min-h-[100dvh] h-screen overflow-hidden bg-sand-primary dark:bg-dark-bg relative z-10 transition-colors duration-500 xl:bg-transparent dark:xl:bg-transparent">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[bottom_1px_center] z-[-1] transition-opacity duration-500"></div>

            {/* Left Sidebar Placeholder */}
            <div className="hidden md:flex w-[380px] shrink-0 border-r border-gold-primary/10 bg-sand-primary dark:bg-dark-bg h-full items-center justify-center pt-24">
                <p className="text-charcoal-muted tracking-widest uppercase text-sm font-bold">Text Index (Coming Soon)</p>
            </div>

            {/* Main Reading Panel Placeholder */}
            <div className="flex-1 h-full overflow-y-auto pt-32 pb-32 px-12 xl:px-32 relative bg-sand-secondary dark:bg-dark-surface flex flex-col items-center justify-center">
                <h1 className="text-4xl md:text-5xl serif-title text-charcoal-main dark:text-dark-text-primary mb-6 text-center">The Bardo Thodol Text</h1>
                <p className="text-charcoal-muted dark:text-dark-text-secondary text-center max-w-lg leading-relaxed font-serif text-lg">
                    티벳 사자의 서 본문 탐색 기능은 현재 준비 중입니다.
                    <br /><br />
                    The core text explorer is currently under construction.
                </p>
            </div>

            {/* Right Sidebar Placeholder */}
            <div className="hidden xl:flex w-[380px] shrink-0 border-l border-gold-primary/10 bg-sand-primary dark:bg-dark-bg h-full flex-col items-center justify-center pt-24">
                <p className="text-charcoal-muted tracking-widest uppercase text-sm font-bold">Commentaries (Coming Soon)</p>
            </div>
        </div>
    );
};

export default Text;
