import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = (playlist) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    const currentTrack = playlist[currentTrackIndex];

    const loadTrack = useCallback((index) => {
        const track = playlist[index];
        if (track && audioRef.current) {
            // Only update src if it has actually changed to avoid interrupting playback if same
            if (!audioRef.current.src.endsWith(track.url)) {
                audioRef.current.src = track.url;
                audioRef.current.load();
            }
            if (isPlaying) {
                audioRef.current.play().catch(e => console.warn('Audio play prevented:', e));
            }
            setCurrentTrackIndex(index);
        }
    }, [playlist, isPlaying]);

    // Automatically load track source when playlist updates (like Verse change)
    useEffect(() => {
        if (playlist && playlist.length > 0 && audioRef.current) {
            const track = playlist[currentTrackIndex] || playlist[0];
            if (!audioRef.current.src || !audioRef.current.src.endsWith(track.url)) {
                audioRef.current.src = track.url;
                audioRef.current.load();
                setCurrentTrackIndex(currentTrackIndex < playlist.length ? currentTrackIndex : 0);
            }
        }
    }, [playlist, currentTrackIndex]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Ensure source is loaded before playing
            if (!audioRef.current.src && playlist.length > 0) {
                audioRef.current.src = playlist[currentTrackIndex].url;
                audioRef.current.load();
            }
            audioRef.current.play().catch(e => console.warn('Audio play prevented:', e));
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying, playlist, currentTrackIndex]);

    const playTrack = useCallback((index) => {
        if (index >= 0 && index < playlist.length) {
            loadTrack(index);
            if (!isPlaying) {
                setIsPlaying(true);
                if (audioRef.current) {
                    audioRef.current.play().catch(e => console.warn('Audio play prevented:', e));
                }
            }
        }
    }, [playlist, loadTrack, isPlaying]);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
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

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    return {
        currentTrack,
        isPlaying,
        progress,
        togglePlay,
        playTrack,
        next: () => loadTrack((currentTrackIndex + 1) % playlist.length),
        prev: () => loadTrack((currentTrackIndex - 1 + playlist.length) % playlist.length),
        seek: (p) => {
            const time = (p / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
        }
    };
};
