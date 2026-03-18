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

                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="modal-shell w-full max-w-3xl max-h-[90vh] rounded-[2rem] flex flex-col pointer-events-auto overflow-hidden"
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
                                                <h2 className="serif-title text-2xl text-[#9A7B4F] font-medium tracking-[0.08em]">Compendium</h2>
                                                <p className="mt-1 text-sm text-charcoal-muted">A quiet guide to the text, prayers, and chants gathered here.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsCompendiumOpen(false)}
                                        className="modal-close rounded-full p-2"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="modal-body overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 text-charcoal-main leading-relaxed font-sans scroll-smooth custom-scrollbar text-[14px] sm:text-[15px]">
                                <div className="grid gap-5 sm:gap-6">
                                    <div className="empty-state-card rounded-[1.6rem] p-5 sm:p-6">
                                        <p className="text-[15px] leading-[1.9] sm:text-[16px]">
                                            이 아카이브는 『티베트 사자의 서』를 중심으로 본문, 기도문, 챈트, 메모를 한 자리에서 이어 읽을 수 있도록 만든 정적 읽기 공간입니다.
                                            단순히 자료를 나열하기보다, 천천히 머물며 비교하고 기록하는 흐름에 맞춰 구성했습니다.
                                        </p>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="rounded-[1.6rem] border border-gold-border/14 bg-white/55 p-5 sm:p-6">
                                            <p className="modal-kicker">About The Text</p>
                                            <h3 className="mt-3 font-serif text-xl text-[#9A7B4F]">Bardo Thodol</h3>
                                            <p className="mt-3 leading-[1.9] text-charcoal-main/88">
                                                죽음과 중간계, 그리고 의식의 전환을 다루는 전통 텍스트를 보다 조용하고 집중된 화면에서 읽을 수 있도록 정리했습니다.
                                            </p>
                                        </div>

                                        <div className="rounded-[1.6rem] border border-gold-border/14 bg-white/55 p-5 sm:p-6">
                                            <p className="modal-kicker">How To Use</p>
                                            <h3 className="mt-3 font-serif text-xl text-[#9A7B4F]">Suggested Path</h3>
                                            <p className="mt-3 leading-[1.9] text-charcoal-main/88">
                                                `The Text`에서 본문을 읽고, `The Prayer`에서 관련 기도문을 이어 읽고, `The Chants`에서 소리의 분위기를 이어 들으면 가장 자연스럽습니다.
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
                                            <li>본문과 기도문을 오가며 맥락을 비교해 읽기</li>
                                            <li>영문과 한글 번역을 나란히 살펴보기</li>
                                            <li>오디오를 통해 낭송의 리듬 따라가기</li>
                                            <li>구절별 메모를 남기고 다시 찾아오기</li>
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
