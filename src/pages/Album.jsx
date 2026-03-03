import React, { useState, useCallback } from 'react';
import AlbumCard from '../components/AlbumCard';
import AlbumDetail from '../components/AlbumDetail';
import { ALBUMS } from '../utils/constants';
import { useOutletContext } from 'react-router-dom';

const Album = () => {
    const { setPlaybackRequest } = useOutletContext();
    const [viewingAlbum, setViewingAlbum] = useState(null);

    const handleAlbumSelect = useCallback((album) => {
        setViewingAlbum(album);
    }, []);

    const handlePlayTrack = useCallback((trackIndex) => {
        setPlaybackRequest({
            album: viewingAlbum,
            trackIndex,
            timestamp: Date.now()
        });
    }, [viewingAlbum, setPlaybackRequest]);

    return (
        <div className="flex flex-col min-h-screen pt-32 pb-20">
            <section id="gallery" className="py-20 px-8 relative flex-1">
                <div className="absolute inset-0 bg-background-light dark:bg-background-dark pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none" />

                <div className="relative max-w-7xl mx-auto space-y-32">
                    <div className="text-center space-y-6">
                        <p className="text-primary text-[10px] tracking-[0.4em] uppercase">Sacred Collections</p>
                        <h2 className="text-5xl md:text-6xl font-serif text-slate-900 dark:text-slate-100 uppercase tracking-widest font-light">Ritual Library</h2>
                        <div className="w-8 h-px bg-primary/20 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-16">
                        {ALBUMS.map((album) => (
                            <AlbumCard
                                key={album.id}
                                album={album}
                                onSelect={handleAlbumSelect}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <AlbumDetail
                album={viewingAlbum}
                isOpen={!!viewingAlbum}
                onClose={() => setViewingAlbum(null)}
                onPlayTrack={handlePlayTrack}
            />
        </div>
    );
};

export default Album;
