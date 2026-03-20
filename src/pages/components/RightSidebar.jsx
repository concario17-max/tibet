import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookMarked, Save, Trash2, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import SidebarLayout from '../../components/ui/SidebarLayout';
import NoteEditor from '../../components/Sidebar/NoteEditor';
import { buildSavedNotes, getNoteStorageKey, NOTE_META } from '../../utils/commentaryNotes';
import { loadCommentaryLibrary } from '../../lib/commentaryLibrary';

/**
 * @param {{
 *   activeVerseId?: string,
 *   storagePrefix?: 'book' | 'prayer'
 * }} props
 */
const RightSidebar = ({ activeVerseId, storagePrefix }) => {
    const [savedNotes, setSavedNotes] = useState([]);
    const [prayerVerseMap, setPrayerVerseMap] = useState(() => new Map());
    const [bookVerseMap, setBookVerseMap] = useState(() => new Map());
    const [note, setNote] = useState('');
    const [isLoadingCommentary, setIsLoadingCommentary] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const uiContext = useUI() || {
        isMobileCommentaryOpen: false,
        isDesktopCommentaryOpen: true,
        setActiveMobileRightPanel: () => {},
        setActiveVerse: () => {},
    };
    const { isMobileCommentaryOpen, isDesktopCommentaryOpen, setActiveMobileRightPanel, setActiveVerse } = uiContext;
    const isCommentaryOpen = isMobileCommentaryOpen || isDesktopCommentaryOpen;

    const noteType = storagePrefix === 'prayer' ? 'prayer' : storagePrefix === 'book' ? 'book' : null;
    const currentNoteKey = useMemo(
        () => (noteType && activeVerseId ? getNoteStorageKey(noteType, activeVerseId) : null),
        [activeVerseId, noteType],
    );
    const currentVerseMap = noteType === 'prayer' ? prayerVerseMap : bookVerseMap;
    const currentVerse = activeVerseId ? currentVerseMap.get(activeVerseId) : null;

    const refreshSavedNotes = useCallback(
        (nextPrayerVerseMap, nextBookVerseMap) => {
            setSavedNotes(
                buildSavedNotes({
                    prayerVerseMap: nextPrayerVerseMap,
                    bookVerseMap: nextBookVerseMap,
                    storage: localStorage,
                }),
            );
        },
        [],
    );

    useEffect(() => {
        if (!isCommentaryOpen) {
            setSavedNotes([]);
            setIsLoadingCommentary(false);
            setLoadError('');
            return;
        }

        let isMounted = true;

        const loadNotes = async () => {
            setIsLoadingCommentary(true);
            setLoadError('');

            try {
                const library = await loadCommentaryLibrary();
                if (!isMounted) return;

                setPrayerVerseMap(library.prayerVerseMap);
                setBookVerseMap(library.bookVerseMap);
                setSavedNotes(library.savedNotes);
            } catch (error) {
                if (!isMounted) return;
                setLoadError('Unable to load commentary notes right now.');
            } finally {
                if (isMounted) {
                    setIsLoadingCommentary(false);
                }
            }
        };

        loadNotes();

        return () => {
            isMounted = false;
        };
    }, [isCommentaryOpen]);

    useEffect(() => {
        if (!currentNoteKey) {
            setNote('');
            return;
        }

        setNote(localStorage.getItem(currentNoteKey) ?? '');
    }, [currentNoteKey]);

    const closeMobilePanel = () => setActiveMobileRightPanel?.(null);

    const handleJumpToNote = (noteItem) => {
        if (noteItem.type === 'prayer') {
            const targetVerse = prayerVerseMap.get(noteItem.id);
            if (!targetVerse) return;

            closeMobilePanel();
            setActiveVerse?.(targetVerse);
            navigate('/chapter');
            return;
        }

        const targetVerse = bookVerseMap.get(noteItem.id);
        if (!targetVerse) return;

        closeMobilePanel();
        localStorage.setItem('tibet_active_text_verse', JSON.stringify(targetVerse));
        navigate('/text');
    };

    const handleDeleteNote = (noteItem) => {
        if (!window.confirm(`Delete saved note ${noteItem.id}?`)) return;

        localStorage.removeItem(noteItem.noteKey);
        if (noteItem.noteKey === currentNoteKey) {
            setNote('');
        }
        refreshSavedNotes(prayerVerseMap, bookVerseMap);
    };

    const handleSaveCurrentNote = () => {
        if (!currentNoteKey) return;

        const nextContent = note.trim();
        setIsSaving(true);

        if (nextContent) {
            localStorage.setItem(currentNoteKey, nextContent);
            setNote(nextContent);
        } else {
            localStorage.removeItem(currentNoteKey);
            setNote('');
        }

        refreshSavedNotes(prayerVerseMap, bookVerseMap);
        window.setTimeout(() => setIsSaving(false), 250);
    };

    const hasCurrentNote = Boolean(currentNoteKey && localStorage.getItem(currentNoteKey)?.trim());
    const emptyHint = useMemo(
        () => 'Write a note for the current passage, then revisit saved notes from the text and prayer pages here.',
        [],
    );

    return (
        <SidebarLayout
            isOpen={isMobileCommentaryOpen}
            isDesktopOpen={isDesktopCommentaryOpen}
            onClose={closeMobilePanel}
            position="right"
            mobileWidthClass="w-[90vw] sm:w-[400px]"
            desktopClassName="xl:w-full"
        >
            <div className="flex h-full flex-col">
                <div className="absolute right-4 top-4 z-50 xl:hidden">
                    <button
                        onClick={closeMobilePanel}
                        className="rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface dark:text-dark-text-secondary dark:hover:bg-dark-surface"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative flex h-full min-h-0 flex-col p-6">
                    <div className="mb-6 flex shrink-0 items-center gap-3 border-b border-gold-border/30 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/35 text-gold-deep">
                            <BookMarked className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Commentary</h2>
                            <p className="mt-1 text-[11px] text-text-secondary/70 dark:text-dark-text-secondary/70">
                                Write on the current passage and browse your saved notes.
                            </p>
                        </div>
                    </div>

                    <div className="custom-scrollbar flex-1 min-h-0 space-y-6 overflow-y-auto pr-1">
                        <section className="rounded-[1.6rem] border border-gold-border/18 bg-white/72 p-5 shadow-[0_20px_45px_rgba(120,93,48,0.05)]">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-gold-surface/45 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#9A7B4F]">
                                    {noteType ? NOTE_META[noteType].label : 'Reading'}
                                </span>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal-muted/60">
                                    {activeVerseId || 'No passage selected'}
                                </span>
                            </div>

                            <p className="mt-4 font-serif text-lg leading-snug text-[#9A7B4F]">
                                {currentVerse?.chapterTitle || currentVerse?.title || 'Current passage'}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-charcoal-muted/75">
                                Save a short reflection, study note, or commentary for this passage.
                            </p>

                            <div className="mt-5">
                                <NoteEditor activeVerseId={activeVerseId || '-'} note={note} setNote={setNote} />
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={handleSaveCurrentNote}
                                    disabled={!currentNoteKey || isSaving}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gold-primary px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-gold-muted disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    {isSaving ? 'Saving...' : 'Save Note'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (!currentNoteKey || !hasCurrentNote) return;
                                        handleDeleteNote({
                                            id: activeVerseId || '',
                                            noteKey: currentNoteKey,
                                            type: noteType || 'book',
                                        });
                                    }}
                                    disabled={!currentNoteKey || !hasCurrentNote}
                                    className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-red-500 transition-colors hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </section>

                        <section className="flex min-h-0 flex-col">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-serif text-lg text-charcoal-main">Saved Notes</h3>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal-muted/60">
                                    {savedNotes.length}
                                </p>
                            </div>

                            {isLoadingCommentary ? (
                                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/75">
                                    <div className="h-14 w-14 rounded-full border border-gold-border/20 bg-gold-surface/30" />
                                    <p className="mt-5 font-serif text-lg text-charcoal-main">Loading commentary notes</p>
                                </div>
                            ) : loadError ? (
                                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/70">
                                    <p className="mt-5 font-serif text-lg text-charcoal-main">Unable to Load Notes</p>
                                    <p className="mt-2 max-w-md text-sm leading-7">{loadError}</p>
                                </div>
                            ) : savedNotes.length === 0 ? (
                                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/70">
                                    <BookMarked className="h-12 w-12 opacity-35 text-gold-primary/60" />
                                    <p className="mt-5 font-serif text-lg text-charcoal-main">No saved notes yet</p>
                                    <p className="mt-2 max-w-md text-sm leading-7">{emptyHint}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 sm:gap-5">
                                    {savedNotes.map((noteItem) => (
                                        <div
                                            key={noteItem.noteKey}
                                            className="rounded-[1.5rem] border border-gold-border/14 bg-white/70 p-5 shadow-[0_20px_45px_rgba(120,93,48,0.05)] transition-all duration-300 hover:shadow-[0_25px_55px_rgba(120,93,48,0.08)]"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-gold-surface/45 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#9A7B4F]">
                                                            {NOTE_META[noteItem.type].label}
                                                        </span>
                                                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal-muted/60">
                                                            {noteItem.id}
                                                        </span>
                                                    </div>
                                                    <p className="mt-4 font-serif text-lg leading-snug text-[#9A7B4F]">{noteItem.title}</p>
                                                    <p className="mt-4 whitespace-pre-wrap font-korean text-[15px] leading-[1.9] text-charcoal-main">
                                                        {noteItem.content}
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                                                    <button
                                                        onClick={() => handleJumpToNote(noteItem)}
                                                        className="inline-flex items-center gap-2 rounded-full border border-gold-border/20 bg-gold-surface/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A7B4F] transition-colors hover:bg-gold-surface/55 hover:text-charcoal-main"
                                                    >
                                                        Open
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteNote(noteItem)}
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
                        </section>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
};

export default React.memo(RightSidebar);
