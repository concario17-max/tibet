import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import PlayerContainer from './PlayerContainer';

const Layout = ({ playbackRequest, setPlaybackRequest }) => {
    return (
        <div className="min-h-screen selection:bg-primary/20 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased flex flex-col relative overflow-x-hidden">
            <Header />

            <main className="flex-1">
                <Outlet context={{ setPlaybackRequest }} />
            </main>

            {/* Global Audio Player Overlay */}
            <PlayerContainer
                request={playbackRequest}
                onClose={() => setPlaybackRequest(null)}
            />

            <footer className="mt-auto border-t border-champagne dark:border-slate-800 py-12">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-muted-gold">auto_stories</span>
                        <span className="serif-title text-sm tracking-widest">The Bardo Thodol</span>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-muted-gold hover:text-primary transition-colors">Foundation</a>
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-muted-gold hover:text-primary transition-colors">Archival Texts</a>
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-muted-gold hover:text-primary transition-colors">Privacy</a>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-gold/60">
                        © MMXXIV Sacred Texts Library
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
