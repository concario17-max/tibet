import React, { useEffect } from 'react';
import Player from './Player';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const PlayerContainer = ({ request, onClose }) => {
    const playlist = request?.album?.tracks || [];
    const audio = useAudioPlayer(playlist);

    useEffect(() => {
        if (request && typeof request.trackIndex === 'number') {
            audio.playTrack(request.trackIndex);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request]);

    if (!audio.currentTrack && !request) return null;

    return (
        <Player
            track={audio.currentTrack}
            isPlaying={audio.isPlaying}
            progress={audio.progress}
            onToggle={audio.togglePlay}
            onNext={audio.next}
            onPrev={audio.prev}
            onSeek={audio.seek}
            onClose={() => {
                if (audio.isPlaying) audio.togglePlay();
                onClose();
            }}
        />
    );
};

export default PlayerContainer;
