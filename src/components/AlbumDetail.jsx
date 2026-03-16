import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music, Play, X } from 'lucide-react';

const AlbumDetail = ({ album, isOpen, onClose, onPlayTrack }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && album ? (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="modal-backdrop fixed inset-0 z-[120]"
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-[121] flex items-end justify-center p-3 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: '10%', opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: '10%', opacity: 0, scale: 0.98 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="modal-shell pointer-events-auto flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem]"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="modal-header relative shrink-0 overflow-hidden px-5 py-5 sm:px-8 sm:py-7">
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-[0.08] mix-blend-overlay"
                                    style={{ backgroundImage: album.coverImage ? `url(${album.coverImage})` : 'none' }}
                                />

                                <div className="relative flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-end">
                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] border border-gold-border/18 bg-gradient-to-br from-charcoal-main to-gold-primary/10 shadow-[0_24px_50px_rgba(34,28,18,0.12)] sm:h-32 sm:w-32">
                                            {album.coverImage ? (
                                                <img src={album.coverImage} alt={album.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <Music className="h-12 w-12 text-gold-primary/30" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="modal-kicker">{album.artist || 'Traditional'}</p>
                                            <h2 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[0.96] text-charcoal-main sm:text-[2.8rem]">
                                                {album.title}
                                            </h2>
                                            <p className="mt-3 max-w-2xl text-sm leading-7 text-charcoal-muted">
                                                {album.description}
                                            </p>
                                        </div>
                                    </div>

                                    <button onClick={onClose} className="modal-close rounded-full p-2">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="modal-body flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 custom-scrollbar">
                                <div className="mx-auto max-w-3xl space-y-3">
                                    {album.tracks.map((track, index) => (
                                        <motion.button
                                            key={track.id}
                                            type="button"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            onClick={() => onPlayTrack(index)}
                                            className="group flex w-full items-center gap-4 rounded-[1.35rem] border border-gold-border/14 bg-white/70 px-4 py-4 text-left transition-all duration-300 hover:border-gold-primary/20 hover:bg-white"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-border/18 bg-gold-surface/35 text-gold-deep">
                                                <span className="font-serif text-lg group-hover:hidden">{String(index + 1).padStart(2, '0')}</span>
                                                <Play className="hidden h-4 w-4 fill-current group-hover:block" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-serif text-[1.1rem] leading-tight text-charcoal-main transition-colors group-hover:text-gold-deep">
                                                    {track.title}
                                                </p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            ) : null}
        </AnimatePresence>
    );
};

export default AlbumDetail;
