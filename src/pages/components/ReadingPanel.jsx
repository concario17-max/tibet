import React, { useEffect, useState } from 'react';
import { Play, Pause, Bookmark } from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

// Mock verse audio data
const VERSE_AUDIO = [
    {
        id: 'v1.1',
        title: 'Verse 1.1 Reading',
        url: '/mp3/Bardo Prayers - Tibetan Book of the Dead/2. Wake Up Prayer Kyema Kyhud.mp3'
    }
];

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

const ReadingPanel = () => {
    const { isPlaying, progress, togglePlay, playTrack, seek, getDuration, getCurrentTime } = useAudioPlayer(VERSE_AUDIO);
    const [duration, setDuration] = useState(0);
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
                <span>Chapter 1</span>
            </div>

            <article className="prose prose-slate max-w-none">
                <h1 className="serif-title text-4xl mb-4 text-charcoal-main font-serif">Verse 1.1: The Primary Light</h1>
                <p className="text-sm text-charcoal-muted italic mb-12 border-l-2 border-gold-primary pl-4">The moment of death and the first experience of reality.</p>

                <div className="flex flex-col md:flex-row gap-8 mb-16">
                    <div className="flex-1">
                        <h4 className="text-xs uppercase tracking-widest text-gold-dim mb-4 font-bold">Tibetan</h4>
                        <p className="text-[15px] leading-8 text-charcoal-main font-serif">
                            O nobly-born, the time hath now come for thee to seek the Path. Thy breathing is about to cease.
                            Thy guru hath set thee face to face before with the Clear Light; and now thou art about to experience it in its Reality in the Bardo state.
                        </p>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xs uppercase tracking-widest text-gold-dim mb-4 font-bold">Korean</h4>
                        <p className="text-[15px] leading-8 text-charcoal-main font-serif">
                            오 고귀하게 태어난 자여, 이제 길을 찾을 때가 왔다. 너의 호흡이 곧 멎을 것이다.
                            너의 스승이 이전에 맑은 빛과 마주하게 하였으니, 이제 너는 바르도 상태에서 그 실재를 경험하게 될 것이다.
                        </p>
                    </div>
                </div>

                {/* Inline Audio Player Wrapper */}
                <div className="mt-16 bg-sand-secondary border border-sand-tertiary rounded-lg p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 rounded-full bg-gold-primary text-white flex items-center justify-center hover:bg-charcoal-main transition-colors shadow-md"
                        >
                            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                        </button>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-muted">Vocal Instruction</p>
                            <p className="text-sm text-charcoal-main font-medium mt-1">Verse 1.1 Reading</p>
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
                        <span className="text-xs text-charcoal-muted w-10">Live</span>
                    </div>
                </div>
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
        </main>
    );
};

export default ReadingPanel;
