import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
                        className="fixed inset-0 bg-charcoal-main/60 backdrop-blur-sm z-[100]"
                        onClick={() => setIsCompendiumOpen(false)}
                    />

                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-sand-primary w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col pointer-events-auto border border-gold-primary/20 overflow-hidden"
                        >
                            <div className="flex justify-between items-center px-5 py-4 sm:px-8 sm:py-6 border-b border-sand-tertiary bg-white/50 shrink-0">
                                <h2 className="serif-title text-2xl text-[#9A7B4F] font-medium tracking-wide">Compendium</h2>
                                <button
                                    onClick={() => setIsCompendiumOpen(false)}
                                    className="p-1 rounded-full text-charcoal-muted hover:text-charcoal-main hover:bg-sand-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 space-y-8 sm:space-y-10 text-charcoal-main leading-relaxed font-sans scroll-smooth custom-scrollbar text-[14px] sm:text-[15px]">
                                <div className="space-y-3 sm:space-y-4">
                                    <p className="font-medium">
                                        이 프로젝트는 『티베트 사자의 서』와 관련 기도문, 찬트, 해설 자료를 한 자리에서 읽고 듣기 위한 정적 아카이브입니다.
                                    </p>
                                    <p>
                                        단순히 텍스트를 나열하는 것이 아니라, 본문과 기도문, 번역본, 음원, 개인 메모를 함께 두어 천천히 따라가며 읽을 수 있는 디지털 독서 공간을 지향합니다.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="serif-title text-xl text-[#9A7B4F] font-medium border-b border-sand-tertiary pb-2">Bardo Thodol이란?</h3>
                                    <p>
                                        흔히 『티베트 사자의 서』로 알려진 이 전승은 죽음과 죽음 이후의 중간 상태를 다루는 가르침으로 널리 소개되어 왔습니다.
                                    </p>
                                    <p>
                                        여기서는 공포나 신비화보다, 죽음과 의식, 전이, 인도, 기억, 기도라는 주제를 차분히 읽고 비교할 수 있도록 자료를 재구성했습니다.
                                    </p>
                                </div>

                                <div className="bg-sand-secondary/50 rounded-lg p-5 sm:p-6 border-l-4 border-[#9A7B4F] space-y-3 sm:space-y-4">
                                    <h3 className="font-bold text-base sm:text-lg text-charcoal-main">이 공간에서 할 수 있는 것</h3>
                                    <ul className="space-y-2 list-disc pl-5 text-[14px] sm:text-[15px]">
                                        <li>본문과 기도문을 장별로 읽기</li>
                                        <li>영문과 한글 번역본 비교하기</li>
                                        <li>일부 기도문의 발음과 음원 따라가기</li>
                                        <li>찬트 앨범을 이어서 감상하기</li>
                                        <li>구절마다 메모를 남기고 다시 찾아보기</li>
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="serif-title text-xl text-[#9A7B4F] font-medium border-b border-sand-tertiary pb-2">읽는 방법</h3>
                                    <p>
                                        먼저 `The Text`에서 본문 흐름을 따라가고, 필요할 때 `The Prayer`에서 관련 기도문과 발음을 확인하는 방식이 가장 자연스럽습니다.
                                    </p>
                                    <p>
                                        `The Chants`는 집중을 유지하거나 분위기를 전환할 때 유용하며, 메모 기능은 개인적인 해석이나 질문을 남기는 데 적합합니다.
                                    </p>
                                </div>

                                <div className="space-y-4 pb-4">
                                    <h3 className="font-bold text-lg text-charcoal-main">누구에게 적합한가</h3>
                                    <ul className="space-y-3">
                                        <li>『티베트 사자의 서』를 처음부터 차근히 읽고 싶은 사람</li>
                                        <li>본문, 번역, 기도문, 음원을 한 곳에서 보고 싶은 사람</li>
                                        <li>티베트 불교 의례와 독송 전통에 관심이 있는 사람</li>
                                        <li>개인 메모를 남기며 천천히 공부하고 싶은 사람</li>
                                    </ul>
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
