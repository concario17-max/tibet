import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, X, Music } from 'lucide-react';

const Player = ({ track, isPlaying, progress, onToggle, onNext, onPrev, onSeek, onClose }) => {
    if (!track) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-[100] px-8 py-6 animate-in slide-in-from-bottom duration-700">
            <div className="max-w-7xl mx-auto glass-panel p-6 shadow-2xl flex flex-col md:flex-row items-center gap-8 border-gold-primary/10 bg-[#080808]/90">

                {/* Track Info */}
                <div className="flex items-center space-x-6 w-full md:w-1/4">
                    <div className="w-12 h-12 bg-gold-primary/5 border border-gold-primary/20 flex items-center justify-center rounded-sm">
                        <Music className="text-gold-primary/80" size={20} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] tracking-widest text-gold-primary uppercase font-medium">Listening Now</p>
                        <h4 className="text-sm font-serif text-[#e2e8f0] truncate uppercase tracking-wide">{track.title}</h4>
                    </div>
                </div>

                {/* Controls & Progress */}
                <div className="flex-1 w-full space-y-4">
                    <div className="flex items-center justify-center space-x-10">
                        <button onClick={onPrev} className="text-text-primary/40 hover:text-gold-primary transition-colors">
                            <SkipBack size={20} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={onToggle}
                            className="w-12 h-12 rounded-full border border-gold-primary/70 flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-[#080808] transition-all duration-500"
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                        </button>
                        <button onClick={onNext} className="text-text-primary/40 hover:text-gold-primary transition-colors">
                            <SkipForward size={20} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="relative group">
                        <div
                            className="w-full h-[2px] bg-white-soft/10 cursor-pointer relative"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const p = ((e.clientX - rect.left) / rect.width) * 100;
                                onSeek(p);
                            }}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-gold-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold-primary opacity-0 group-hover:opacity-100 scale-150 transition-all"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Volume & Close */}
                <div className="w-full md:w-1/4 flex items-center justify-end space-x-6 text-text-primary/40">
                    <Volume2 size={18} strokeWidth={1.5} hover="text-gold-primary transition-colors" />
                    <div className="w-24 h-px bg-white-soft/10 relative">
                        <div className="absolute left-0 top-0 h-full bg-gold-primary/60 w-2/3"></div>
                    </div>
                    <button onClick={onClose} className="hover:text-gold-primary transition-colors">
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Player;
