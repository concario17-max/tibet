import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Trash2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import prayersData from '../data/prayers.json';
import bookData from '../data/book.json';
import { flattenVerses } from '../utils/textUtils';

const NOTE_PREFIXES = {
    prayer: 'tibet-prayer-note-',
    book: 'tibet-book-note-',
};

const NOTE_META = {
    prayer: {
        label: 'Prayer',
        emptyHint: 'Save notes from the prayer reading view to see them here.',
    },
    book: {
        label: 'Text',
        emptyHint: 'Save notes from the text reading view to see them here.',
    },
};

const prayerVerseMap = new Map(
    prayersData.flatMap((chapter) => chapter.verses.map((verse) => [verse.id, verse])),
);

const bookVerseMap = new Map(
    flattenVerses(bookData).map((verse) => [verse.id, verse]),
);

const buildSavedNotes = () => {
    const notes = [];

    Object.entries(NOTE_PREFIXES).forEach(([type, prefix]) => {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(prefix))
            .sort((a, b) => a.localeCompare(b))
            .forEach((key) => {
                const id = key.replace(prefix, '');
                const content = localStorage.getItem(key);
                const verse = type === 'prayer' ? prayerVerseMap.get(id) : bookVerseMap.get(id);

                if (!content || !content.trim()) return;

                notes.push({
                    id,
                    type,
                    noteKey: key,
                    content,
                    title: verse?.chapterTitle || verse?.title || 'Untitled',
                });
            });
    });

    return notes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
};

const CommentariesModal = () => {
    const uiContext = useUI();
    const [savedNotes, setSavedNotes] = useState([]);
    const navigate = useNavigate();

    if (!uiContext) return null;

    const { isCommentariesOpen, setIsCommentariesOpen, setActiveVerse } = uiContext;

    useEffect(() => {
        if (!isCommentariesOpen) {
            document.body.style.overflow = 'unset';
            setSavedNotes([]);
            return () => {
                document.body.style.overflow = 'unset';
            };
        }

        document.body.style.overflow = 'hidden';
        setSavedNotes(buildSavedNotes());

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCommentariesOpen]);

    const emptyHint = useMemo(() => {
        return `${NOTE_META.prayer.emptyHint} ${NOTE_META.book.emptyHint}`;
    }, []);

    const handleJumpToNote = (note) => {
        if (note.type === 'prayer') {
            const targetVerse = prayerVerseMap.get(note.id);
            if (!targetVerse) return;

            setActiveVerse?.(targetVerse);
            setIsCommentariesOpen(false);
            navigate('/chapter');
            return;
        }

        const targetVerse = bookVerseMap.get(note.id);
        if (!targetVerse) return;

        localStorage.setItem('tibet_active_text_verse', JSON.stringify(targetVerse));
        setIsCommentariesOpen(false);
        navigate('/text');
    };

    const handleDeleteNote = (note) => {
        if (!window.confirm(`Delete saved reflection ${note.id}?`)) return;

        localStorage.removeItem(note.noteKey);
        setSavedNotes((prev) => prev.filter((entry) => entry.noteKey !== note.noteKey));
    };

    return (
        <AnimatePresence>
            {isCommentariesOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-charcoal-main/60 backdrop-blur-sm z-[100]"
                        onClick={() => setIsCommentariesOpen(false)}
                    />

                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-sand-primary w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col pointer-events-auto border border-gold-primary/20 overflow-hidden"
                        >
                            <div className="flex justify-between items-center px-5 py-4 sm:px-8 sm:py-6 border-b border-sand-tertiary bg-[#fdfaf6] shrink-0">
                                <h2 className="serif-title text-xl sm:text-2xl text-[#9A7B4F] font-medium tracking-wide">My Reflections</h2>
                                <button
                                    onClick={() => setIsCommentariesOpen(false)}
                                    className="p-1 rounded-full text-charcoal-muted hover:text-charcoal-main hover:bg-sand-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar bg-sand-secondary/30">
                                {savedNotes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-charcoal-muted/50 space-y-4 py-16 sm:py-20 text-center">
                                        <Edit3 className="w-12 h-12 sm:w-16 sm:h-16 opacity-20" />
                                        <p className="font-serif text-base sm:text-lg">No saved reflections yet.</p>
                                        <p className="text-xs sm:text-sm font-sans mx-4 max-w-md">{emptyHint}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 sm:gap-6">
                                        {savedNotes.map((note) => (
                                            <div
                                                key={note.noteKey}
                                                className="bg-white border text-charcoal-main border-sand-tertiary rounded-md p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col font-serif"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center items-start gap-3 sm:gap-4 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-sand-secondary relative">
                                                    <span className="bg-[#f2efe9] text-[#9A7B4F] text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm shrink-0">
                                                        [{NOTE_META[note.type].label}] {note.id}
                                                    </span>
                                                    <p className="text-[15px] leading-relaxed text-[#9A7B4F] flex-1 line-clamp-2">
                                                        {note.title}
                                                    </p>
                                                    <div className="absolute top-0 right-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                                                        <button
                                                            onClick={() => handleJumpToNote(note)}
                                                            className="text-[10px] font-bold uppercase tracking-widest text-[#9A7B4F] hover:text-charcoal-main transition-colors bg-gold-surface px-3 py-1.5 rounded-sm"
                                                        >
                                                            Jump To
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteNote(note)}
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
