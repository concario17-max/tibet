import React from 'react';

const TrackInfo = ({ album, currentTrack, currentTime, duration, formatTime }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1 min-w-0">
            {/* Cover Image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-gold-primary/30 shadow-md">
                {album.coverImage ? (
                    <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-charcoal-main to-gold-primary/10 flex items-center justify-center">
                        <span className="text-gold-primary/50 text-xs">No Art</span>
                    </div>
                )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
                <div className="flex justify-between items-end mb-1">
                    <div className="truncate pr-4">
                        <h4 className="text-sand-primary font-medium text-sm sm:text-base truncate">{currentTrack.title}</h4>
                        <p className="text-gold-primary/70 text-[10px] sm:text-xs truncate tracking-wider uppercase">{album.title}</p>
                    </div>
                    <div className="text-[10px] text-sand-primary/50 tabular-nums shrink-0 font-medium">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(TrackInfo);
