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
                        <div className="relative pt-16 pb-10 md:pt-24 md:pb-12 shrink-0 bg-sand-secondary border-b border-sand-tertiary">
                            <div
                                className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-5"
                                style={{ backgroundImage: album.coverImage ? `url(${album.coverImage})` : "none" }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sand-primary"></div>

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-sand-primary/80 backdrop-blur-md flex items-center justify-center text-charcoal-main hover:bg-gold-primary hover:text-white transition-colors duration-300 z-10 border border-sand-tertiary shadow-sm"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10 px-8 md:px-12 max-w-5xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-8 md:gap-10">
                                <div className="w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-charcoal-main to-gold-primary/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-sand-tertiary flex flex-col items-center justify-center shrink-0 overflow-hidden rounded-md">
                                    {album.coverImage ? (
                                        <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Music className="text-gold-primary/30 w-16 h-16 stroke-[0.5]" />
                                    )}
                                </div>
                                <div className="space-y-4 text-center sm:text-left pb-2 flex-1">
                                    <p className="text-gold-primary text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold">
                                        {album.artist || "Traditional"}
                                    </p>
                                    <h2 className="serif-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-charcoal-main leading-[1.1] tracking-wide">
                                        {album.title}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Tracklist Area */}
                        <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-10 pb-32">
                            <div className="max-w-3xl mx-auto space-y-8">
                                <p className="text-charcoal-main/90 md:text-lg font-sans font-medium leading-[1.8] tracking-[0.02em] whitespace-pre-line border-l-2 border-gold-primary/40 pl-6 md:pl-8">
                                    {album.description}
                                </p>

                                <div className="space-y-1 pt-6 border-t border-gold-primary/10">
                                    {album.tracks.map((track, index) => (
                                        <div
                                            key={track.id}
                                            onClick={() => onPlayTrack(index)}
                                            className="group flex items-center gap-6 py-4 px-2 hover:bg-sand-secondary/50 rounded-md transition-all duration-300 cursor-pointer border-b border-sand-tertiary/50 last:border-0"
                                        >
                                            <div className="w-8 flex justify-center items-center shrink-0">
                                                <span className="text-gold-primary/40 font-serif text-lg group-hover:hidden transition-colors">{String(index + 1).padStart(2, '0')}</span>
                                                <Play className="hidden group-hover:block text-gold-primary fill-gold-primary transition-transform group-hover:scale-110" size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-charcoal-main text-base md:text-lg group-hover:text-gold-primary transition-colors tracking-wide truncate">
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
