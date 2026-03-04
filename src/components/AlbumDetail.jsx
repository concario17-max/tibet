import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Music } from 'lucide-react';

const AlbumDetail = ({ album, isOpen, onClose, onPlayTrack }) => {
    // Lock scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && album && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 bg-charcoal-main/80 backdrop-blur-lg z-40"
                        onClick={onClose}
                    />

                    {/* Sliding Panel */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 top-[5vh] md:top-[10vh] max-w-5xl mx-auto bg-sand-primary rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col border border-gold-primary/10"
                    >
                        {/* Header Image Area */}
                        <div className="relative h-64 md:h-80 shrink-0 bg-charcoal-main border-b border-sand-tertiary">
                            <div
                                className="absolute inset-0 bg-cover bg-center grayscale mix-blend-screen opacity-10"
                                style={{ backgroundImage: album.coverImage ? `url(${album.coverImage})` : "url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2574&auto=format&fit=crop')" }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-sand-primary to-transparent"></div>

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-charcoal-main/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-gold-primary hover:text-white transition-colors duration-300 z-10 border border-gold-primary/20"
                            >
                                <X size={20} />
                            </button>

                            <div className="absolute bottom-8 left-8 md:left-12 flex items-end gap-6 max-w-3xl">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-charcoal-main to-gold-primary/10 shadow-lg border border-gold-primary/20 flex flex-col items-center justify-center shrink-0 overflow-hidden">
                                    {album.coverImage ? (
                                        <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Music className="text-gold-primary/30 w-16 h-16 stroke-[0.5]" />
                                    )}
                                </div>
                                <div className="space-y-3 pb-2 text-shadow-sm">
                                    <p className="text-gold-primary text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold">
                                        {album.artist}
                                    </p>
                                    <h2 className="serif-title text-4xl md:text-5xl text-charcoal-main leading-tight">
                                        {album.title}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Tracklist Area */}
                        <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-10 pb-32">
                            <div className="max-w-3xl mx-auto space-y-8">
                                <p className="text-charcoal-muted text-sm md:text-base font-light leading-relaxed italic border-l border-gold-primary/30 pl-6">
                                    {album.description}
                                </p>

                                <div className="space-y-2 pt-6">
                                    {album.tracks.map((track, index) => (
                                        <div
                                            key={track.id}
                                            onClick={() => onPlayTrack(index)}
                                            className="group flex items-center gap-4 p-4 rounded-lg hover:bg-sand-secondary border border-transparent hover:border-gold-primary/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="w-8 text-center">
                                                <span className="text-sand-tertiary font-serif text-lg group-hover:hidden">{index + 1}</span>
                                                <Play className="hidden group-hover:inline-block text-gold-primary fill-gold-primary/30" size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-charcoal-main font-medium group-hover:text-gold-primary transition-colors tracking-wide">
                                                    {track.title}
                                                </h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AlbumDetail;
