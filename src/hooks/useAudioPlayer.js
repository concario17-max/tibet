import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = (playlist) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(new Audio());

    const currentTrack = playlist[currentTrackIndex];

    const togglePlay = useCallback(() => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const loadTrack = useCallback((index) => {
        const track = playlist[index];
        if (track) {
            audioRef.current.src = track.url;
            audioRef.current.load();
            if (isPlaying) audioRef.current.play();
            setCurrentTrackIndex(index);
        }
    }, [playlist, isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            const p = (audio.currentTime / audio.duration) * 100;
            setProgress(isNaN(p) ? 0 : p);
        };

        const handleEnded = () => {
            if (currentTrackIndex < playlist.length - 1) {
                loadTrack(currentTrackIndex + 1);
            } else {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentTrackIndex, playlist.length, loadTrack]);

    return {
        currentTrack,
        isPlaying,
        progress,
        togglePlay,
        next: () => loadTrack((currentTrackIndex + 1) % playlist.length),
        prev: () => loadTrack((currentTrackIndex - 1 + playlist.length) % playlist.length),
        seek: (p) => {
            const time = (p / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
        }
    };
};
