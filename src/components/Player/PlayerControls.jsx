import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Repeat, Repeat1 } from 'lucide-react';

const PlayerControls = ({
    repeatMode,
    cycleRepeat,
    handleTrackPrev,
    togglePlay,
    isPlaying,
    handleTrackNext
}) => {
    return (
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button onClick={cycleRepeat} className="text-sand-primary/50 hover:text-gold-primary transition-colors" title="Repeat Mode">
                {repeatMode === 0 ? <Repeat size={18} className="opacity-40" /> :
                    repeatMode === 1 ? <Repeat size={18} className="text-gold-primary drop-shadow-[0_0_5px_rgba(166,139,92,0.5)]" /> :
                        <Repeat1 size={18} className="text-gold-primary drop-shadow-[0_0_5px_rgba(166,139,92,0.5)]" />}
            </button>

            <button
                onClick={handleTrackPrev}
                className="text-sand-primary/80 hover:text-white transition-colors"
            >
                <SkipBack size={20} className="fill-current" />
            </button>

            <button
                onClick={togglePlay}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-primary text-charcoal-main rounded-full flex items-center justify-center hover:scale-105 hover:bg-gold-light transition-all shadow-[0_0_15px_rgba(166,139,92,0.3)]"
            >
                {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
            </button>

            <button
                onClick={handleTrackNext}
                className="text-sand-primary/80 hover:text-white transition-colors"
            >
                <SkipForward size={20} className="fill-current" />
            </button>
        </div>
    );
};

export default React.memo(PlayerControls);
