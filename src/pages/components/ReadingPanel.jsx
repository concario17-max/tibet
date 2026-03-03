import React, { useEffect, useState } from 'react';
import { Play, Pause, Bookmark } from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

const ReadingPanel = ({ verse }) => {
    // Dynamically format audio URL for the hook if it exists
    const audioPlaylist = verse.audioUrl ? [{ id: verse.id, title: verse.title, url: verse.audioUrl }] : [];

    const { isPlaying, progress, togglePlay, playTrack, seek } = useAudioPlayer(audioPlaylist);
    const [currentTime, setCurrentTime] = useState(0);

    // Initialize the track on mount
    useEffect(() => {
        playTrack(0);
        // Pause immediately to just load it
        setTimeout(() => {
            if (isPlaying) togglePlay();
        }, 50);
    }, []);

    // Effect to grab duration and time (approximate via progress since hook doesn't export them directly yet)
    useEffect(() => {
        // A simple workaround if we don't want to modify useAudioPlayer yet:
        // Assume a static duration for UI purposes if true metadata isn't piped out
        // In a real app, useAudioPlayer should return currentTime and duration.
        // For UI fidelity to the PNG:
    }, [progress]);

    return (
        <main className="flex-1 max-w-3xl mx-auto px-6 lg:px-12 py-10 min-h-screen pb-32">
            <div className="flex items-center space-x-2 text-xs text-charcoal-muted font-medium mb-12">
                <span>The Bardo Thodol</span>
                <span>/</span>
                <span>Prayers</span>
                <span>/</span>
                <span>{verse.id}</span>
            </div>

            <article className="prose prose-slate max-w-none">
                <h1 className="serif-title text-4xl mb-12 text-charcoal-main font-serif whitespace-pre-line leading-tight">{verse.title}</h1>

                <div className="flex flex-col gap-12 mb-16">
                    {verse.text.tibetan && (
                        <div className="flex-1 bg-sand-secondary/50 p-6 rounded-lg border border-sand-tertiary/50">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-dim mb-4 font-bold">Tibetan</h4>
                            <p className="text-[15px] leading-9 text-charcoal-main font-serif whitespace-pre-line">
                                {verse.text.tibetan}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8">
                        {verse.text.english && (
                            <div className="flex-1">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-dim mb-4 font-bold">English</h4>
                                <p className="text-[14px] leading-8 text-charcoal-muted font-serif whitespace-pre-line">
                                    {verse.text.english}
                                </p>
                            </div>
                        )}
                        {verse.text.korean && (
                            <div className="flex-1">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-dim mb-4 font-bold">Korean</h4>
                                <p className="text-[14px] leading-8 text-charcoal-main font-serif whitespace-pre-line">
                                    {verse.text.korean}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {verse.audioUrl && (
                    <div className="mt-16 bg-sand-secondary border border-sand-tertiary rounded-lg p-6 flex items-center justify-between shadow-sm">
                        {/* Inline Audio Player Wrapper */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={togglePlay}
                                className="w-12 h-12 rounded-full bg-gold-primary text-white flex items-center justify-center hover:bg-charcoal-main transition-colors shadow-md"
                            >
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                            </button>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-muted">Vocal Instruction</p>
                                <p className="text-sm text-charcoal-main font-medium mt-1">{verse.title}</p>
                            </div>
                        </div>
                        <div className="hidden md:flex flex-1 mx-8 items-center space-x-4">
                            <span className="text-xs text-charcoal-muted w-10 text-right">{Math.floor(progress)}%</span>
                            <div
                                className="h-1.5 flex-1 bg-sand-tertiary rounded-full overflow-hidden cursor-pointer relative group"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const p = ((e.clientX - rect.left) / rect.width) * 100;
                                    seek(p);
                                }}
                            >
                                <div
                                    className="h-full bg-gold-primary transition-all duration-300 relative"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-charcoal-main opacity-0 group-hover:opacity-100 scale-150 transition-all"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </article>

            {/* Core Lexicon Grid */}
            <div className="mt-20 border-t border-sand-tertiary pt-10">
                <h3 className="serif-title text-xl mb-6 text-charcoal-main">Core Lexicon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border border-sand-tertiary rounded shadow-sm bg-white hover:border-gold-primary transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-charcoal-main group-hover:text-gold-primary transition-colors">Bardo (바르도)</h4>
                            <Bookmark size={16} className="text-sand-tertiary group-hover:text-gold-primary" />
                        </div>
                        <p className="text-xs text-charcoal-muted leading-relaxed">The intermediate state between death and rebirth.</p>
                    </div>
                    <div className="p-5 border border-sand-tertiary rounded shadow-sm bg-white hover:border-gold-primary transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-charcoal-main group-hover:text-gold-primary transition-colors">Dharmakaya (법신)</h4>
                            <Bookmark size={16} className="text-sand-tertiary group-hover:text-gold-primary" />
                        </div>
                        <p className="text-xs text-charcoal-muted leading-relaxed">The truth body, the unmanifested state of ultimate reality.</p>
                    </div>
                </div>
            </div>
        </main >
    );
};

export default ReadingPanel;
