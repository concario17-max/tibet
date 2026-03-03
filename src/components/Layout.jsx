import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = ({ playbackRequest, setPlaybackRequest }) => {
    return (
        <div className="min-h-screen selection:bg-gold-primary/20 bg-sand-primary font-serif text-charcoal-main antialiased flex flex-col relative overflow-x-hidden">
            <Header />

            <main className="flex-1">
                <Outlet context={{ setPlaybackRequest }} />
            </main>

            <footer className="mt-auto border-t border-sand-tertiary py-12">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gold-muted">auto_stories</span>
                        <span className="serif-title text-sm tracking-widest text-charcoal-main">The Bardo Thodol</span>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted hover:text-gold-primary transition-colors">Foundation</a>
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted hover:text-gold-primary transition-colors">Archival Texts</a>
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted hover:text-gold-primary transition-colors">Privacy</a>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted/60">
                        © MMXXIV Sacred Texts Library
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
