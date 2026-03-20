import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, Sparkles, X } from 'lucide-react';
import { useUI } from '../context/UIContext';

const CompendiumModal = () => {
    const uiContext = useUI();
    if (!uiContext) return null;

    const { isCompendiumOpen, setIsCompendiumOpen } = uiContext;

    useEffect(() => {
        document.body.style.overflow = isCompendiumOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCompendiumOpen]);

    return (
        <AnimatePresence>
            {isCompendiumOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="modal-backdrop fixed inset-0 z-[100]"
                        onClick={() => setIsCompendiumOpen(false)}
                    />

                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 pointer-events-none sm:p-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="modal-shell flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] pointer-events-auto"
                        >
                            <div className="modal-header shrink-0 px-5 py-4 sm:px-8 sm:py-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <p className="modal-kicker">Study Companion</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/35 text-gold-deep">
                                                <BookOpenText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h2 className="serif-title text-2xl font-medium tracking-[0.08em] text-[#9A7B4F]">Compendium</h2>
                                                <p className="mt-1 text-sm text-charcoal-muted">
                                                    A quiet guide to the text, prayers, and chants gathered here.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsCompendiumOpen(false)} className="modal-close rounded-full p-2">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="modal-body custom-scrollbar overflow-y-auto px-5 py-6 text-[14px] leading-relaxed text-charcoal-main sm:px-8 sm:py-8 sm:text-[15px]">
                                <div className="grid gap-5 sm:gap-6">
                                    <div className="empty-state-card rounded-[1.6rem] p-5 sm:p-6">
                                        <p className="text-[15px] leading-[1.9] sm:text-[16px]">
                                            This project gathers the main text, prayer sequences, chants, and personal notes into
                                            one reading-focused space. It is designed less as a reference dump and more as a
                                            slow, reflective study companion.
                                        </p>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="rounded-[1.6rem] border border-gold-border/14 bg-white/55 p-5 sm:p-6">
                                            <p className="modal-kicker">About The Text</p>
                                            <h3 className="mt-3 font-serif text-xl text-[#9A7B4F]">Bardo Thodol</h3>
                                            <p className="mt-3 leading-[1.9] text-charcoal-main/88">
                                                The reading pages present the text and prayers in a calmer, more navigable form,
                                                with room for comparison, notes, and repeated return.
                                            </p>
                                        </div>

                                        <div className="rounded-[1.6rem] border border-gold-border/14 bg-white/55 p-5 sm:p-6">
                                            <p className="modal-kicker">How To Use</p>
                                            <h3 className="mt-3 font-serif text-xl text-[#9A7B4F]">Suggested Path</h3>
                                            <p className="mt-3 leading-[1.9] text-charcoal-main/88">
                                                Read through The Text, continue into The Prayer, and use The Chants when you want
                                                to stay with the sound and atmosphere of the material.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-[1.7rem] border border-gold-border/16 bg-gradient-to-br from-white/75 to-sand-secondary/70 p-5 sm:p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-surface/35 text-gold-deep">
                                                <Sparkles className="h-4 w-4" />
                                            </div>
                                            <h3 className="font-serif text-xl text-charcoal-main">What This Space Supports</h3>
                                        </div>
                                        <ul className="mt-4 space-y-3 text-charcoal-main/88">
                                            <li>Reading the main text and prayers side by side with stable navigation.</li>
                                            <li>Comparing Tibetan, English, and Korean renderings where available.</li>
                                            <li>Listening to chant recordings while staying inside the same project space.</li>
                                            <li>Saving notes on individual passages and returning to them later.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CompendiumModal;
