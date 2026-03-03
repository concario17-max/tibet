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
                        className="fixed inset-0 bg-slate-900/90 backdrop-blur-lg z-40"
                        onClick={onClose}
                    />

                    {/* Sliding Panel */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 top-[5vh] md:top-[10vh] max-w-5xl mx-auto bg-background-light dark:bg-background-dark rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col border border-primary/10"
                    >
                        {/* Header Image Area */}
                        <div className="relative h-64 md:h-80 shrink-0 bg-slate-900 border-b border-champagne dark:border-slate-800">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-screen opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent"></div>

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center text-slate-100 hover:bg-primary hover:text-slate-900 transition-colors duration-300 z-10 border border-primary/20"
                            >
                                <X size={20} />
                            </button>

                            <div className="absolute bottom-8 left-8 md:left-12 flex items-end gap-6 max-w-3xl">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-slate-900 to-primary/10 shadow-lg border border-primary/20 flex items-center justify-center shrink-0">
                                    <Music className="text-primary/30 w-16 h-16 stroke-[0.5]" />
                                </div>
                                <div className="space-y-3 pb-2 text-shadow-sm">
                                    <p className="text-primary text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold">
                                        {album.artist}
                                    </p>
                                    <h2 className="serif-title text-4xl md:text-5xl text-slate-900 dark:text-slate-100 leading-tight">
                                        {album.title}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Tracklist Area */}
                        <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-10 pb-32">
                            <div className="max-w-3xl mx-auto space-y-8">
                                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-light leading-relaxed italic border-l border-primary/30 pl-6">
                                    {album.description}
                                </p>

                                <div className="space-y-2 pt-6">
                                    {album.tracks.map((track, index) => (
                                        <div
                                            key={track.id}
                                            onClick={() => onPlayTrack(index)}
                                            className="group flex items-center gap-4 p-4 rounded-lg hover:bg-champagne/50 dark:hover:bg-slate-800/30 border border-transparent hover:border-primary/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="w-8 text-center">
                                                <span className="text-slate-400 font-serif text-lg group-hover:hidden">{index + 1}</span>
                                                <Play className="hidden group-hover:inline-block text-primary fill-primary/30" size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-slate-800 dark:text-slate-200 font-medium group-hover:text-primary transition-colors tracking-wide">
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
