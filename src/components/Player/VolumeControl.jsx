import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const VolumeControl = ({ isMuted, volume, toggleMute, handleVolumeSeek }) => {
    return (
        <div className="hidden sm:flex items-center gap-3 group/vol relative cursor-pointer px-2 py-1 rounded-full hover:bg-white/5 transition-all duration-300">
            <button
                onClick={toggleMute}
                className="text-gold-primary/60 hover:text-gold-primary transition-all duration-300 shrink-0 transform active:scale-90"
            >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div
                className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex items-center h-6"
                onClick={handleVolumeSeek}
            >
                <div className="h-1 w-full bg-white/10 rounded-full relative overflow-hidden border border-white/5">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-primary via-gold-light to-white rounded-full shadow-[0_0_10px_rgba(166,139,92,0.5)]"
                        initial={false}
                        animate={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(VolumeControl);
