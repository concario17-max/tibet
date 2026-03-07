import React from 'react';

const ProgressBar = ({ progress, handleSeek }) => {
    return (
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden cursor-pointer relative group/bar mt-2" onClick={handleSeek}>
            <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
            />
            {/* Hover seeker dot */}
            <div
                className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-white rounded-full shadow blur-[1px] opacity-0 group-hover/bar:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 6px)` }}
            />
        </div>
    );
};

export default React.memo(ProgressBar);
