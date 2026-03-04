import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

// Gita의 디자인 철학(Awwwards급)을 Tibet 프로젝트에 맞게 변환
const LeftSidebar = ({ prayers, onSelectVerse, activeVerseId }) => {
    // 만약 useUI가 App 최상단에 Provider로 안 감싸져 있다면 에러가 나므로, 
    // 실제 통합 전까지는 UIContext를 우선 임시로 써도 되지만, 에러 방지를 위해 optional chaining 처리.
    // 하지만 Zero Monolith & 강제 Immutability 원칙에 따라 UIContext는 외부에서 반드시 주입됨.
    const uiContext = useUI() || { isSidebarOpen: true, setIsSidebarOpen: () => { } };
    const { isSidebarOpen, setIsSidebarOpen } = uiContext;

    // 첫 번째 챕터를 기본으로 열어둠 (불변성)
    const [expandedChapter, setExpandedChapter] = useState(prayers?.[0]?.id || null);

    // 챕터 토글 핸들러 (재생성 방지)
    const toggleChapter = React.useCallback((chapterId) => {
        setExpandedChapter(prev => prev === chapterId ? null : chapterId);
    }, []);

    return (
        <>
            {/* 모바일 배경 (반투명 블러 처리) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 opacity-100"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border-r border-gold-primary/20 dark:border-dark-border/50 h-full lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : '-translate-x-full'} flex flex-col font-inter`}>

                {/* 모바일 닫기 버튼 및 헤더 */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gold-border/30 dark:border-[#333] shrink-0">
                    <span className="font-crimson font-bold text-lg text-text-primary dark:text-dark-text-primary">챕터 목록</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 상단: 챕터 목록 */}
                <div className="flex-none overflow-y-auto border-b border-gold-border/40 dark:border-[#222] custom-scrollbar max-h-[55%]">
                    <div className="p-4 bg-transparent sticky top-0 z-10 backdrop-blur-sm hidden lg:block">
                        <h2 className="text-[11px] font-bold font-inter tracking-[0.2em] uppercase text-text-primary/70 dark:text-dark-text-primary/60 pl-1">
                            장 (Chapter)
                        </h2>
                    </div>
                    <div className="py-2 px-3 space-y-1">
                        {prayers && prayers.map((prayer) => {
                            const isExpanded = expandedChapter === prayer.id;

                            return (
                                <button
                                    key={prayer.id}
                                    onClick={() => toggleChapter(prayer.id)}
                                    className={`w-full flex items-start justify-between gap-2 px-3 py-3 rounded-xl text-left transition-colors ${isExpanded
                                        ? 'bg-white/60 dark:bg-dark-bg/60 shadow-sm border border-gold-primary/20 text-[#1C2B36] dark:text-gold-light'
                                        : 'text-[#5B7282] dark:text-dark-text-secondary hover:bg-gold-surface/40 dark:hover:bg-dark-bg/40 border border-transparent'
                                        }`}
                                >
                                    <div className="flex-1 pr-2 flex flex-col gap-0.5">
                                        <span className={`text-[15px] leading-snug font-inter break-keep pl-1 ${isExpanded ? 'font-bold text-[#1C2B36]' : 'font-bold'}`}>
                                            {prayer.id.replace('prayer-', '')}. {prayer.chapterName}
                                        </span>
                                    </div>
                                    <span className={`shrink-0 mt-0.5 text-[#A68B5C] px-2 py-0.5 rounded text-xs font-bold ${isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                                        {prayer.verses.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 하단: 구절(Verse) 목록 */}
                <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar h-full">
                    <div className="py-2 px-3 space-y-0.5">
                        {expandedChapter ? (
                            prayers.find(p => p.id === expandedChapter)?.verses.map((verse) => {
                                const isActive = activeVerseId === verse.id;

                                return (
                                    <button
                                        key={verse.id}
                                        onClick={() => {
                                            if (onSelectVerse) onSelectVerse(verse);
                                            if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-start text-left gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                                            ? 'bg-white/60 border border-gold-primary/30 text-text-primary font-medium shadow-sm dark:bg-dark-bg/60 dark:border-gold-primary/20 dark:text-gold-light'
                                            : 'border border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary hover:bg-gold-surface/30 dark:hover:bg-dark-bg/40'
                                            }`}
                                    >
                                        <span className={`min-w-[40px] whitespace-nowrap font-bold text-xs mt-[3px] ${isActive ? 'text-gold-primary' : 'text-text-secondary/60 dark:text-dark-text-secondary/60'}`}>
                                            {verse.id}
                                        </span>
                                        <span className="truncate opacity-90 text-[13px] leading-relaxed font-inter">
                                            {verse.chapterTitle || verse.title}
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-text-secondary dark:text-dark-text-secondary text-sm">
                                챕터를 선택해주세요
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default React.memo(LeftSidebar, (prevProps, nextProps) => {
    return (
        prevProps.activeVerseId === nextProps.activeVerseId &&
        prevProps.prayers === nextProps.prayers
    );
});
