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
                        className="fixed inset-x-0 bottom-0 top-[5vh] md:top-[10vh] max-w-5xl mx-auto glass-panel rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col border border-gold-primary/20 backdrop-blur-[32px]"
                    >
                        <div className="noise-overlay" />

                        {/* Header Image Area */}
                        <div className="relative pt-10 pb-6 md:pt-14 md:pb-8 shrink-0 bg-transparent border-b border-gold-primary/10">
                            <div
                                className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10"
                                style={{ backgroundImage: album.coverImage ? `url(${album.coverImage})` : "none" }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-gold-primary hover:text-black transition-all duration-300 z-20 border border-white/20 shadow-xl"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-6 md:gap-8">
                                <motion.div
                                    whileHover={{ perspective: 1000, rotateX: 5, rotateY: -5, scale: 1.05 }}
                                    className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-charcoal-main to-gold-primary/10 shadow-2xl border border-gold-primary/20 flex flex-col items-center justify-center shrink-0 overflow-hidden rounded-lg cursor-pointer preserve-3d"
                                >
                                    {album.coverImage ? (
                                        <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Music className="text-gold-primary/30 w-12 h-12 stroke-[0.5]" />
                                    )}
                                </motion.div>
                                <div className="space-y-2 md:space-y-3 text-center sm:text-left pb-1 md:pb-2 flex-1">
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-gold-primary text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-bold"
                                    >
                                        {album.artist || "Traditional"}
                                    </motion.p>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="serif-title text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-white leading-[1.1] tracking-wide drop-shadow-lg"
                                    >
                                        {album.title}
                                    </motion.h2>
                                </div>
                            </div>
                        </div>

                        {/* Tracklist Area */}
                        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-6 md:py-8 pb-48 md:pb-32 relative z-10">
                            <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
                                <p className="text-white/80 md:text-md font-sans font-medium leading-[1.8] tracking-[0.02em] whitespace-pre-line border-l-2 border-gold-primary/40 pl-5 md:pl-6 text-sm italic">
                                    {album.description}
                                </p>

                                <div className="space-y-2 pt-4 md:pt-6 border-t border-gold-primary/10">
                                    {album.tracks.map((track, index) => (
                                        <motion.div
                                            key={track.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => onPlayTrack(index)}
                                            className="group flex items-center gap-6 py-4 px-4 hover:bg-white/5 rounded-xl transition-all duration-500 cursor-pointer border border-transparent hover:border-gold-primary/20"
                                        >
                                            <div className="w-8 flex justify-center items-center shrink-0">
                                                <span className="text-gold-primary/40 font-serif text-lg group-hover:hidden transition-all duration-300">{String(index + 1).padStart(2, '0')}</span>
                                                <Play className="hidden group-hover:block text-gold-primary fill-gold-primary transition-all duration-300 group-hover:scale-125" size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white/90 text-base md:text-lg group-hover:text-gold-light transition-all duration-300 tracking-wide truncate font-medium">
                                                    {track.title}
                                                </h4>
                                            </div>
                                        </motion.div>
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
