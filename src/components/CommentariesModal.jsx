import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Trash2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import prayersData from '../data/prayers.json';

const CommentariesModal = () => {
    const uiContext = useUI();
    const [savedNotes, setSavedNotes] = useState([]);

    if (!uiContext) return null;

    const { isCommentariesOpen, setIsCommentariesOpen, setActiveVerse } = uiContext;

    // 모달이 열릴 때 LocalStorage에서 데이터 긁어오기
    useEffect(() => {
        if (isCommentariesOpen) {
            document.body.style.overflow = 'hidden';

            // 데이터 로드 로직
            const notes = [];
            const noteKeys = Object.keys(localStorage).filter(key => key.startsWith('tibet-note-'));

            noteKeys.sort((a, b) => a.localeCompare(b)); // 정렬 (예: 1.1, 1.2 ...)

            noteKeys.forEach(key => {
                const vId = key.replace('tibet-note-', '');
                const content = localStorage.getItem(key);

                // 해당 구절의 본문 데이터 및 타입 찾기
                let originalText = '';
                let typeLabel = '본문'; // 기본값 본문

                for (const prayer of prayersData) {
                    const found = prayer.verses.find(v => v.id === vId);
                    if (found) {
                        originalText = found.prayer || found.text || found.title || '';
                        // 예비기도(1, 2장)는 '기도문', 나머지는 '본문'으로 취급
                        if (prayer.id === 'prayer-1' || prayer.id === 'prayer-2') {
                            typeLabel = '기도문';
                        }
                        break;
                    }
                }

                if (content && content.trim()) {
                    notes.push({ id: vId, content, originalText, typeLabel });
                }
            });
            setSavedNotes(notes);
        } else {
            document.body.style.overflow = 'unset';
            setSavedNotes([]); // 닫힐 때 초기화
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCommentariesOpen]);

    // 특정 구절로 이동 (Chapter 페이지로 점프할 수 있도록)
    const handleJumpToVerse = (verseId) => {
        // 기도문 데이터 뒤져서 정확한 verse 객체 찾기
        let targetVerse = null;
        for (const prayer of prayersData) {
            const found = prayer.verses.find(v => v.id === verseId);
            if (found) {
                targetVerse = found;
                break;
            }
        }

        if (targetVerse && setActiveVerse) {
            setActiveVerse(targetVerse);
            setIsCommentariesOpen(false);

            // 만약 현재 위치가 /chapter 가 아니라면 이동시키는 로직은 여기서 생략
            // 현재 요구사항은 'Chapter 화면 상단 네비게이션' 혹은 전역에서 작동하는 것이므로
            if (window.location.pathname !== '/chapter') {
                window.location.href = '/chapter';
            }
        }
    };

    const handleDeleteNote = (verseId) => {
        if (window.confirm(`Verse ${verseId}의 기록을 삭제하시겠습니까?`)) {
            localStorage.removeItem(`tibet-note-${verseId}`);
            setSavedNotes(prev => prev.filter(note => note.id !== verseId));
        }
    };

    return (
        <AnimatePresence>
            {isCommentariesOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-charcoal-main/60 backdrop-blur-sm z-[100]"
                        onClick={() => setIsCommentariesOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-sand-primary w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col pointer-events-auto border border-gold-primary/20 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-8 py-6 border-b border-sand-tertiary bg-[#fdfaf6] shrink-0">
                                <h2 className="serif-title text-2xl text-[#9A7B4F] font-medium tracking-wide">My Reflections</h2>
                                <button
                                    onClick={() => setIsCommentariesOpen(false)}
                                    className="p-1 rounded-full text-charcoal-muted hover:text-charcoal-main hover:bg-sand-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-sand-secondary/30">
                                {savedNotes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-charcoal-muted/50 space-y-4 py-20">
                                        <Edit3 className="w-16 h-16 opacity-20" />
                                        <p className="font-serif text-lg">아직 작성된 개인 코멘터리(Reflections)가 없습니다.</p>
                                        <p className="text-sm font-sans">Chapter 페이지 우측 패널에서 구절에 대한 통찰을 기록해보세요.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        {savedNotes.map((note) => (
                                            <div
                                                key={note.id}
                                                className="bg-white border text-charcoal-main border-sand-tertiary rounded-md p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col font-serif"
                                            >
                                                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-sand-secondary relative">
                                                    <span className="bg-[#f2efe9] text-[#9A7B4F] text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm shrink-0">
                                                        [{note.typeLabel}] {note.id}
                                                    </span>
                                                    <p className="text-[15px] leading-relaxed text-[#9A7B4F] flex-1 line-clamp-2">
                                                        {note.originalText}
                                                    </p>
                                                    <div className="absolute top-0 right-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                                                        <button
                                                            onClick={() => handleJumpToVerse(note.id)}
                                                            className="text-[10px] font-bold uppercase tracking-widest text-[#9A7B4F] hover:text-charcoal-main transition-colors bg-gold-surface px-3 py-1.5 rounded-sm"
                                                        >
                                                            Jump To
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteNote(note.id)}
                                                            className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors bg-red-50 px-2 py-1.5 rounded-sm"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="font-sans text-[15px] leading-[1.8] text-charcoal-main whitespace-pre-wrap flex-1">
                                                    {note.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommentariesModal;
