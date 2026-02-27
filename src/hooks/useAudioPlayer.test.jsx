import { renderHook, act } from '@testing-library/react';
import { useAudioPlayer } from './useAudioPlayer';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('useAudioPlayer hook', () => {
    const mockPlaylist = [
        { id: '1', title: 'Track 1', url: '/t1.mp3' },
        { id: '2', title: 'Track 2', url: '/t2.mp3' },
        { id: '3', title: 'Track 3', url: '/t3.mp3' },
    ];

    beforeEach(() => {
        // Mock Audio API correctly as a constructor
        global.Audio = class {
            constructor() {
                this.play = vi.fn().mockResolvedValue(undefined);
                this.pause = vi.fn();
                this.load = vi.fn();
                this.addEventListener = vi.fn();
                this.removeEventListener = vi.fn();
                this.src = '';
                this.currentTime = 0;
                this.duration = 100;
            }
        };
    });

    it('should initialize with the first track', () => {
        const { result } = renderHook(() => useAudioPlayer(mockPlaylist));
        expect(result.current.currentTrack).toEqual(mockPlaylist[0]);
        expect(result.current.isPlaying).toBe(false);
    });

    it('should toggle play/pause state', () => {
        const { result } = renderHook(() => useAudioPlayer(mockPlaylist));

        act(() => {
            result.current.togglePlay();
        });
        expect(result.current.isPlaying).toBe(true);

        act(() => {
            result.current.togglePlay();
        });
        expect(result.current.isPlaying).toBe(false);
    });

    it('should successfully play a specific track index directly', () => {
        const { result } = renderHook(() => useAudioPlayer(mockPlaylist));

        act(() => {
            result.current.playTrack(1);
        });

        expect(result.current.currentTrack).toEqual(mockPlaylist[1]);
        expect(result.current.isPlaying).toBe(true);
    });
});
