import React, { useState, useEffect } from 'react';
import { Download, Save, Edit3, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

// 불변성과 기능적 분리 원칙 적용: LocalStorage 연동 Reflections 패널
const RightSidebar = ({ activeVerseId }) => {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const uiContext = useUI() || { isReflectionsOpen: true, setIsReflectionsOpen: () => { } };
    const { isReflectionsOpen, setIsReflectionsOpen } = uiContext;

    // activeVerseId를 기반으로 LocalStorage 키 생성
    const noteKey = `tibet-note-${activeVerseId}`;

    // 구절이 바뀔 때마다 메모 로드
    useEffect(() => {
        if (!activeVerseId) return;
        const savedNote = localStorage.getItem(noteKey);
        setNote(savedNote || '');
    }, [activeVerseId, noteKey]);

    const handleSave = () => {
        if (!activeVerseId) return;
        setIsSaving(true);
        localStorage.setItem(noteKey, note);
        // 저장 피드백을 위한 인위적 지연
        setTimeout(() => setIsSaving(false), 1000);
    };

    const handleExportCurrent = () => {
        if (!activeVerseId) return;
        const element = document.createElement("a");
        const file = new Blob([note], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Tibet_Reflection_${activeVerseId}.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    };

    const handleExportAll = () => {
        let allNotesText = `Tibet Prayers - All Reflections\n\n`;
        const noteKeys = Object.keys(localStorage).filter(key => key.startsWith('tibet-note-'));

        // 키 정렬 로직 (ID가 문자열이므로 문자열 비교 정렬)
        noteKeys.sort((a, b) => a.localeCompare(b));

        noteKeys.forEach(key => {
            const vId = key.replace('tibet-note-', '');
            const content = localStorage.getItem(key);
            if (content && content.trim()) {
                allNotesText += `--- Verse ${vId} ---\n${content}\n\n`;
            }
        });

        if (allNotesText === `Tibet Prayers - All Reflections\n\n`) {
            alert("No saved reflections found to export.");
            setShowExportMenu(false);
            return;
        }

        const element = document.createElement("a");
        const file = new Blob([allNotesText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Tibet_All_Reflections.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    };

    if (!activeVerseId) return null;

    return (
        <>
            {/* Mobile Backdrop */}
            {isReflectionsOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden transition-opacity duration-300"
                    onClick={() => setIsReflectionsOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 right-0 z-50 w-[90vw] sm:w-[400px] xl:w-80 bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border-l border-gold-primary/20 dark:border-dark-border/50 h-full xl:h-[calc(100vh-64px)] xl:sticky xl:top-16 transform transition-transform duration-300 xl:translate-x-0 ${isReflectionsOpen ? 'translate-x-0 overflow-hidden shadow-2xl xl:shadow-none' : 'translate-x-full'} flex flex-col font-inter`}>

                {/* Mobile Close Button */}
                <div className="xl:hidden absolute top-4 right-4 z-50">
                    <button onClick={() => setIsReflectionsOpen(false)} className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 relative flex flex-col h-full min-h-0">
                    <div className="flex items-center gap-2 mb-6 shrink-0 border-b border-gold-border/30 pb-4">
                        <Edit3 className="w-5 h-5 text-[#A68B5C] dark:text-gold-light" />
                        <h2 className="text-sm font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide">Reflections</h2>
                    </div>

                    <div className="mb-4 flex-1 flex flex-col min-h-0 space-y-2">
                        <div className="text-xs font-bold text-[#8FA0AD] tracking-wider uppercase">
                            Verse {activeVerseId}
                        </div>

                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="수트라 관점. 개인적 통찰 및 논리 압축 기록 요망."
                            className="flex-1 w-full p-5 rounded-2xl border border-gold-primary/20 dark:border-dark-border/60 bg-white/70 dark:bg-dark-bg/60 text-text-primary dark:text-dark-text-primary focus:outline-none focus:border-gold-primary/50 focus:ring-1 focus:ring-gold-primary/20 shadow-inner backdrop-blur-sm transition-all resize-none font-inter text-[14px] leading-relaxed custom-scrollbar placeholder:text-text-secondary/40 dark:placeholder:text-dark-text-secondary/40"
                        />
                    </div>

                    <div className="flex gap-3 mt-4 relative pt-2">
                        <div className="flex-1 relative">
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gold-primary/20 dark:border-dark-border/60 text-text-secondary dark:text-dark-text-secondary hover:bg-gold-surface/60 dark:hover:bg-dark-bg transition-all text-xs font-bold bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm shadow-sm tracking-wide"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Export
                            </button>

                            {showExportMenu && (
                                <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-[#111] border border-gold-border/50 dark:border-[#333] rounded-lg shadow-lg overflow-hidden z-20">
                                    <button
                                        onClick={handleExportCurrent}
                                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-text-primary dark:text-dark-text-primary hover:bg-gold-surface dark:hover:bg-[#222] transition-colors border-b border-gold-border/20 dark:border-[#333]"
                                    >
                                        Current Verse
                                    </button>
                                    <button
                                        onClick={handleExportAll}
                                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-text-primary dark:text-dark-text-primary hover:bg-gold-surface dark:hover:bg-[#222] transition-colors"
                                    >
                                        All Verses
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-primary hover:bg-gold-muted text-white transition-all text-xs font-bold shadow-md hover:shadow-lg hover:shadow-gold-primary/20 active:scale-95 disabled:opacity-70"
                        >
                            {isSaving ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default RightSidebar;
