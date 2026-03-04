import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUI } from '../context/UIContext';

const CompendiumModal = () => {
    const uiContext = useUI();
    if (!uiContext) return null;

    const { isCompendiumOpen, setIsCompendiumOpen } = uiContext;

    // Lock scroll when modal is open
    useEffect(() => {
        if (isCompendiumOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCompendiumOpen]);

    return (
        <AnimatePresence>
            {isCompendiumOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-charcoal-main/60 backdrop-blur-sm z-[100]"
                        onClick={() => setIsCompendiumOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-sand-primary w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col pointer-events-auto border border-gold-primary/20 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-5 py-4 sm:px-8 sm:py-6 border-b border-sand-tertiary bg-white/50 shrink-0">
                                <h2 className="serif-title text-2xl text-[#9A7B4F] font-medium tracking-wide">Compendium</h2>
                                <button
                                    onClick={() => setIsCompendiumOpen(false)}
                                    className="p-1 rounded-full text-charcoal-muted hover:text-charcoal-main hover:bg-sand-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 space-y-8 sm:space-y-10 text-charcoal-main leading-relaxed font-sans scroll-smooth custom-scrollbar text-[14px] sm:text-[15px]">

                                <div className="space-y-3 sm:space-y-4">
                                    <p className="font-medium">
                                        죽음은 멀리 있는 주제가 아니라, 우리가 살아가는 방식을 비추는 가장 선명한 거울일지 모릅니다.
                                    </p>
                                    <p>
                                        이 사이트는 <strong>『티벳 사자의 서』(바르도 쉐돌)</strong>를 "낯설고 어려운 신비서"가 아니라, 삶과 죽음을 잇는 안내서로 다시 읽고 배우기 위한 학습 공간입니다.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="serif-title text-xl text-[#9A7B4F] font-medium border-b border-sand-tertiary pb-2">왜 ‘티벳 사자의 서’인가요?</h3>
                                    <p>
                                        『티벳 사자의 서』는 죽음 이후부터 다시 태어나기 전까지의 과정, 즉 <strong>‘중간계(바르도)’</strong>를 다룹니다.
                                        그리고 그 여정에서 우리가 무엇을 보고, 어떻게 이해하며, 어떤 태도로 통과할 수 있는지를 차분히 안내합니다.
                                    </p>
                                    <p>
                                        이 가르침은 특정 문화의 전통을 넘어, 인간이라면 누구나 마주하는 질문—"나는 누구인가, 어떻게 살아야 하는가"—에 닿아 있습니다.
                                    </p>
                                </div>

                                <div className="bg-sand-secondary/50 rounded-lg p-5 sm:p-6 border-l-4 border-[#9A7B4F] space-y-3 sm:space-y-4">
                                    <h3 className="font-bold text-base sm:text-lg text-charcoal-main">이 사이트는 무엇을 돕나요?</h3>
                                    <p>목차는 단순해 보이지만, 핵심은 분명합니다.</p>
                                    <ul className="space-y-2 list-disc pl-5 text-[14px] sm:text-[15px]">
                                        <li>앞부분의 예비기도는 도움과 지지를 청하며 마음의 방향을 세우는 준비 과정이고,</li>
                                        <li>중심부의 중간계 안내는 ‘죽음 이후의 길’을 실제적으로 조망하게 해주며,</li>
                                        <li>마지막의 핵심 논설은 <strong>“있는 그대로 봄”</strong>이라는 해탈의 열쇠를 깊이 다룹니다.</li>
                                    </ul>
                                    <p className="pt-2 text-[15px] font-medium text-charcoal-main/80">
                                        이 사이트는 그 흐름을 따라, 어렵지 않게—그러나 얕지 않게 안내합니다.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="serif-title text-xl text-[#9A7B4F] font-medium border-b border-sand-tertiary pb-2">“아는 것”에서 “삶에 스며드는 것”으로</h3>
                                    <p>
                                        용어가 낯설고, 상징이 복잡해 보일 수 있습니다. 그래서 우리는 단순한 요약보다, <strong>이해 → 예시 → 내 삶의 적용</strong>으로 이어지는 학습을 지향합니다.
                                    </p>
                                    <p>
                                        책 속 가르침이 어느 순간, 일상 속 선택과 관계, 두려움과 애도, 그리고 마음의 훈련으로 자연스럽게 연결되도록 돕습니다.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="serif-title text-xl text-[#9A7B4F] font-medium border-b border-sand-tertiary pb-2">닫힌 책이 아니라, 열려야 할 책</h3>
                                    <p>
                                        『티벳 사자의 서』는 종종 "어려운 책, 닫힌 책"으로 남아왔습니다. 하지만 죽음과 삶을 다루는 안내서라면, 결국 더 많은 이들에게 열려야 합니다.
                                    </p>
                                    <p>
                                        이 사이트는 그 문을 조금 더 넓히기 위해—현대의 언어로 정리하고, 누구나 따라갈 수 있는 구조로 재구성합니다.
                                    </p>
                                </div>

                                <div className="space-y-4 pb-4">
                                    <h3 className="font-bold text-lg text-charcoal-main">이런 분들에게 추천합니다</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <span className="text-[#9A7B4F] mt-1 text-[10px]">♦</span>
                                            <span>『티벳 사자의 서』를 처음부터 제대로 읽고 싶어요</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-[#9A7B4F] mt-1 text-[10px]">♦</span>
                                            <span>“중간계/바르도”가 무엇인지 정리된 지도가 필요해요</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-[#9A7B4F] mt-1 text-[10px]">♦</span>
                                            <span>종교를 떠나, 죽음·상실·삶의 태도를 깊이 성찰하고 싶어요</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-[#9A7B4F] mt-1 text-[10px]">♦</span>
                                            <span>어렵지 않게, 하지만 핵심을 놓치지 않는 안내를 원해요</span>
                                        </li>
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
