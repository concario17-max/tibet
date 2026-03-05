import React, { useState, useCallback } from 'react';
import AlbumCard from '../components/AlbumCard';
import AlbumDetail from '../components/AlbumDetail';
import { ALBUMS } from '../utils/constants';
import { useOutletContext, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
        <div className="flex flex-col min-h-screen pb-20 bg-sand-primary relative">
            {/* Elegant Floating Back Button */}
            <Link
                to="/"
                className="fixed top-6 left-6 sm:top-8 sm:left-10 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 border border-gold-border/20 shadow-sm backdrop-blur-md text-charcoal-muted hover:text-gold-primary hover:border-gold-primary/40 hover:-translate-x-1 transition-all duration-300"
                aria-label="Return to Home"
            >
                <ArrowLeft className="w-5 h-5" />
            </Link>

            <section id="gallery" className="pt-12 pb-20 px-8 relative flex-1">
                <div className="absolute inset-0 bg-sand-primary pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/10 to-transparent pointer-events-none" />

                <div className="relative max-w-7xl mx-auto space-y-32">
                    <div className="text-center space-y-6">
                        <p className="text-gold-primary text-[10px] tracking-[0.4em] uppercase font-bold">Sacred Collections</p>
                        <h2 className="text-5xl md:text-6xl font-serif text-charcoal-main uppercase tracking-widest font-light">Ritual Library</h2>
                        <div className="w-8 h-px bg-gold-primary/20 mx-auto" />
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
