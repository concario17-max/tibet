import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Repeat, Repeat1, Volume2, VolumeX, X } from 'lucide-react';

const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const GlobalPlayer = ({ playbackRequest, setPlaybackRequest }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [album, setAlbum] = useState(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Repeat mode: 0 = No Repeat, 1 = Repeat All, 2 = Repeat One
    const [repeatMode, setRepeatMode] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef(null);

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
            const p = (audio.currentTime / audio.duration) * 100;
            setProgress(isNaN(p) ? 0 : p);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateTime);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateTime);
        };
    }, []);

    // Handle incoming playback requests from anywhere in the app
    useEffect(() => {
        if (playbackRequest && playbackRequest.album) {
            setAlbum(playbackRequest.album);
            setCurrentTrackIndex(playbackRequest.trackIndex || 0);
            setIsVisible(true);

            if (audioRef.current) {
                audioRef.current.src = playbackRequest.album.tracks[playbackRequest.trackIndex || 0].url;
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(e => console.warn('Audio play error:', e));
            }
        }
    }, [playbackRequest]);

    // Handle track ending and repeat logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            if (!album) return;

            if (repeatMode === 2) { // Repeat One
                audio.currentTime = 0;
                audio.play();
            } else if (repeatMode === 1) { // Repeat All
                const nextIndex = (currentTrackIndex + 1) % album.tracks.length;
                handleTrackChange(nextIndex);
            } else { // No Repeat
                if (currentTrackIndex < album.tracks.length - 1) {
                    handleTrackChange(currentTrackIndex + 1);
                } else {
                    setIsPlaying(false);
                }
            }
        };

        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [currentTrackIndex, album, repeatMode]);

    const handleTrackChange = useCallback((index) => {
        if (!album || !album.tracks[index]) return;

        setCurrentTrackIndex(index);
        if (audioRef.current) {
            audioRef.current.src = album.tracks[index].url;
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(e => console.warn('Audio play error:', e));
        }
    }, [album]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const time = percentage * audioRef.current.duration;
        audioRef.current.currentTime = time;
        setProgress(percentage * 100);
    };

    const toggleMute = () => {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const cycleRepeat = () => {
        setRepeatMode((prev) => (prev + 1) % 3);
    };

    const currentTrack = album?.tracks[currentTrackIndex];

    if (!isVisible || !currentTrack) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 transform translate-y-0 transition-transform duration-500 ease-in-out px-4 pb-4">
            <div className="max-w-4xl mx-auto bg-charcoal-main/95 backdrop-blur-xl border border-gold-primary/20 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative overflow-hidden group">

                {/* Background glow matching cover image logic */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/5 to-transparent opacity-50 pointer-events-none"></div>

                <button
                    onClick={() => {
                        setIsVisible(false);
                        if (audioRef.current) audioRef.current.pause();
                        setIsPlaying(false);
                        setPlaybackRequest(null);
                    }}
                    className="absolute top-2 right-2 text-gold-primary/50 hover:text-gold-primary transition-colors p-1"
                >
                    <X size={16} />
                </button>

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

                {/* Track Info & Progress */}
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

                    {/* Progress Bar */}
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
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    <button onClick={cycleRepeat} className="text-sand-primary/50 hover:text-gold-primary transition-colors" title="Repeat Mode">
                        {repeatMode === 0 ? <Repeat size={18} className="opacity-40" /> :
                            repeatMode === 1 ? <Repeat size={18} className="text-gold-primary drop-shadow-[0_0_5px_rgba(166,139,92,0.5)]" /> :
                                <Repeat1 size={18} className="text-gold-primary drop-shadow-[0_0_5px_rgba(166,139,92,0.5)]" />}
                    </button>

                    <button
                        onClick={() => handleTrackChange((currentTrackIndex - 1 + album.tracks.length) % album.tracks.length)}
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
                        onClick={() => handleTrackChange((currentTrackIndex + 1) % album.tracks.length)}
                        className="text-sand-primary/80 hover:text-white transition-colors"
                    >
                        <SkipForward size={20} className="fill-current" />
                    </button>

                    <div className="w-px h-6 bg-gold-primary/20 mx-1 hidden sm:block"></div>

                    <button onClick={toggleMute} className="text-sand-primary/60 hover:text-gold-primary transition-colors hidden sm:block">
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalPlayer;
