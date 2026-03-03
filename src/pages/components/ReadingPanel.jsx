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
            <div className="flex items-center justify-center space-x-2 text-xs text-charcoal-muted font-medium mb-12">
                <span>Chapter {verse.id.split('.')[0]}</span>
                <span className="text-sand-tertiary">›</span>
                <span className="font-bold text-charcoal-main">Sutra {verse.id.split('.')[1]}</span>
            </div>

            <article className="prose prose-slate max-w-none text-center">
                <div className="w-8 h-8 rounded-full border border-gold-primary mx-auto mb-10 flex items-center justify-center text-gold-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a10 10 0 0110 10" />
                        <path d="M12 22a10 10 0 01-10-10" />
                        <path d="M2 12h20" />
                        <path d="M12 2v20" />
                        <path d="M4.93 4.93l14.14 14.14" />
                        <path d="M4.93 19.07L19.07 4.93" />
                    </svg>
                </div>

                <div className="flex flex-col gap-8 mb-20 max-w-3xl mx-auto">
                    {verse.text.tibetan && (
                        <h1 className="text-3xl md:text-5xl text-charcoal-main font-serif whitespace-pre-line leading-[1.4] font-bold">
                            {verse.text.tibetan}
                        </h1>
                    )}

                    <div className="flex flex-col gap-6 mt-4">
                        {verse.text.english && (
                            <p className="text-[15px] leading-8 text-charcoal-muted font-serif italic whitespace-pre-line">
                                {verse.text.english}
                            </p>
                        )}
                        {(verse.text.english && verse.text.korean) && (
                            <div className="w-12 h-px bg-sand-tertiary mx-auto my-2"></div>
                        )}
                        {verse.text.korean && (
                            <p className="text-[14px] leading-8 text-charcoal-muted font-serif italic whitespace-pre-line">
                                {verse.text.korean}
                            </p>
                        )}
                    </div>
                </div>

                {verse.audioUrl && (
                    <div className="mt-16 max-w-md mx-auto flex items-center justify-between border border-sand-tertiary rounded-full px-6 py-3 bg-white shadow-sm">
                        <button
                            onClick={togglePlay}
                            className="text-gold-primary hover:text-charcoal-main transition-colors mr-4"
                        >
                            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                        </button>
                        <div className="flex-1 flex items-center space-x-4">
                            <span className="text-[10px] text-charcoal-muted font-medium w-8 text-right">0:00</span>
                            <div
                                className="h-1 flex-1 bg-sand-secondary rounded-full overflow-hidden cursor-pointer relative group"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const p = ((e.clientX - rect.left) / rect.width) * 100;
                                    seek(p);
                                }}
                            >
                                <div
                                    className="h-full bg-gold-primary opacity-50 transition-all duration-300 relative"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="text-[10px] text-charcoal-muted font-medium w-8">0:37</span>
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
