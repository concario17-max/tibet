import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { formatTime } from '../utils/audioUtils';
import TrackInfo from './Player/TrackInfo';
import ProgressBar from './Player/ProgressBar';
import PlayerControls from './Player/PlayerControls';
import VolumeControl from './Player/VolumeControl';

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
    const [volume, setVolume] = useState(1);

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

    const togglePlay = useCallback(() => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleSeek = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const time = percentage * audioRef.current.duration;
        audioRef.current.currentTime = time;
        setProgress(percentage * 100);
    }, []);

    const handleVolumeSeek = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        setVolume(percentage);
        if (isMuted && percentage > 0) setIsMuted(false);
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(!isMuted);
    }, [isMuted]);

    const cycleRepeat = useCallback(() => {
        setRepeatMode((prev) => (prev + 1) % 3);
    }, []);

    const handleTrackPrev = useCallback(() => {
        if (!album) return;
        handleTrackChange((currentTrackIndex - 1 + album.tracks.length) % album.tracks.length);
    }, [album, currentTrackIndex, handleTrackChange]);

    const handleTrackNext = useCallback(() => {
        if (!album) return;
        handleTrackChange((currentTrackIndex + 1) % album.tracks.length);
    }, [album, currentTrackIndex, handleTrackChange]);

    const currentTrack = album?.tracks[currentTrackIndex];

    if (!isVisible || !currentTrack) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 transform translate-y-0 transition-transform duration-500 ease-in-out px-2 sm:px-4 pb-2 sm:pb-4">
            <div className="max-w-4xl mx-auto bg-charcoal-main/95 backdrop-blur-xl border border-gold-primary/20 rounded-xl sm:rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 relative overflow-hidden group">
                {/* Background glow matching cover image logic */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/5 to-transparent opacity-50 pointer-events-none"></div>

                <button
                    onClick={() => {
                        setIsVisible(false);
                        if (audioRef.current) audioRef.current.pause();
                        setIsPlaying(false);
                        setPlaybackRequest(null);
                    }}
                    className="absolute top-2 right-2 text-gold-primary/50 hover:text-gold-primary transition-colors p-1 z-10"
                >
                    <X size={16} />
                </button>

                {/* Track Information Area */}
                <div className="w-full sm:w-auto">
                    <TrackInfo
                        album={album}
                        currentTrack={currentTrack}
                        currentTime={currentTime}
                        duration={duration}
                        formatTime={formatTime}
                    />
                </div>

                {/* Main Control & Progress Area */}
                <div className="flex-1 w-full flex flex-col gap-1">
                    <ProgressBar
                        progress={progress}
                        handleSeek={handleSeek}
                    />
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5 shrink-0">
                    <PlayerControls
                        repeatMode={repeatMode}
                        cycleRepeat={cycleRepeat}
                        handleTrackPrev={handleTrackPrev}
                        togglePlay={togglePlay}
                        isPlaying={isPlaying}
                        handleTrackNext={handleTrackNext}
                    />

                    <div className="hidden sm:block w-px h-6 bg-gold-primary/20 mx-1"></div>

                    <div className="hidden xs:block sm:block">
                        <VolumeControl
                            isMuted={isMuted}
                            volume={volume}
                            toggleMute={toggleMute}
                            handleVolumeSeek={handleVolumeSeek}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalPlayer;
