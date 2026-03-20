import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BookMarked, Edit3, Trash2, X } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { NOTE_META } from '../utils/commentaryNotes';
import { loadCommentaryLibrary } from '../lib/commentaryLibrary';

const CommentariesModal = () => {
    const uiContext = useUI();
    const [savedNotes, setSavedNotes] = useState([]);
    const [prayerVerseMap, setPrayerVerseMap] = useState(() => new Map());
    const [bookVerseMap, setBookVerseMap] = useState(() => new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState('');
    const navigate = useNavigate();

    if (!uiContext) return null;

    const { isCommentariesOpen, setIsCommentariesOpen, setActiveVerse } = uiContext;

    useEffect(() => {
        if (!isCommentariesOpen) {
            document.body.style.overflow = 'unset';
            setSavedNotes([]);
            setIsLoading(false);
            setLoadError('');
            return () => {
                document.body.style.overflow = 'unset';
            };
        }

        let isMounted = true;

        const loadNotes = async () => {
            document.body.style.overflow = 'hidden';
            setIsLoading(true);
            setLoadError('');

            try {
                const library = await loadCommentaryLibrary();
                if (!isMounted) return;

                setPrayerVerseMap(library.prayerVerseMap);
                setBookVerseMap(library.bookVerseMap);
                setSavedNotes(library.savedNotes);
            } catch (error) {
                if (!isMounted) return;
                setLoadError('Unable to load your saved notes right now. Please try again.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadNotes();

        return () => {
            isMounted = false;
            document.body.style.overflow = 'unset';
        };
    }, [isCommentariesOpen]);

    const emptyHint = useMemo(
        () => `${NOTE_META.prayer.emptyHint} ${NOTE_META.book.emptyHint}`,
        [],
    );

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
        if (!window.confirm(`Delete saved note ${note.id}?`)) return;

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
                        className="modal-backdrop fixed inset-0 z-[100]"
                        onClick={() => setIsCommentariesOpen(false)}
                    />

                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 pointer-events-none sm:p-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="modal-shell flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] pointer-events-auto"
                        >
                            <div className="modal-header shrink-0 px-5 py-4 sm:px-8 sm:py-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <p className="modal-kicker">Personal Notes</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/35 text-gold-deep">
                                                <BookMarked className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h2 className="serif-title text-2xl font-medium tracking-[0.08em] text-[#9A7B4F]">Commentary Notes</h2>
                                                <p className="mt-1 text-sm text-charcoal-muted">
                                                    Notes from the text and prayer journeys, gathered in one place.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsCommentariesOpen(false)} className="modal-close rounded-full p-2">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="modal-body custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-8">
                                {isLoading ? (
                                    <div className="empty-state-card flex min-h-[320px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/75">
                                        <div className="h-14 w-14 rounded-full border border-gold-border/20 bg-gold-surface/30" />
                                        <p className="mt-5 font-serif text-lg text-charcoal-main">Collecting your saved notes</p>
                                        <p className="mt-2 max-w-sm text-sm leading-7">
                                            Notes from the reading panels are being gathered for you now.
                                        </p>
                                    </div>
                                ) : loadError ? (
                                    <div className="empty-state-card flex min-h-[320px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/70">
                                        <p className="mt-5 font-serif text-lg text-charcoal-main">Unable to Load Notes</p>
                                        <p className="mt-2 max-w-md text-sm leading-7">{loadError}</p>
                                    </div>
                                ) : savedNotes.length === 0 ? (
                                    <div className="empty-state-card flex min-h-[320px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/70">
                                        <Edit3 className="h-12 w-12 opacity-35 text-gold-primary/60" />
                                        <p className="mt-5 font-serif text-lg text-charcoal-main">No saved notes yet</p>
                                        <p className="mt-2 max-w-md text-sm leading-7">{emptyHint}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 sm:gap-5">
                                        {savedNotes.map((note) => (
                                            <div
                                                key={note.noteKey}
                                                className="rounded-[1.5rem] border border-gold-border/14 bg-white/70 p-5 shadow-[0_20px_45px_rgba(120,93,48,0.05)] transition-all duration-300 hover:shadow-[0_25px_55px_rgba(120,93,48,0.08)]"
                                            >
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="rounded-full bg-gold-surface/45 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#9A7B4F]">
                                                                {NOTE_META[note.type].label}
                                                            </span>
                                                            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal-muted/60">
                                                                {note.id}
                                                            </span>
                                                        </div>
                                                        <p className="mt-4 font-serif text-lg leading-snug text-[#9A7B4F]">{note.title}</p>
                                                        <p className="mt-4 whitespace-pre-wrap font-korean text-[15px] leading-[1.9] text-charcoal-main">
                                                            {note.content}
                                                        </p>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                                                        <button
                                                            onClick={() => handleJumpToNote(note)}
                                                            className="inline-flex items-center gap-2 rounded-full border border-gold-border/20 bg-gold-surface/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A7B4F] transition-colors hover:bg-gold-surface/55 hover:text-charcoal-main"
                                                        >
                                                            Open
                                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteNote(note)}
                                                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
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
